'use server'

import { revalidatePath } from 'next/cache'
import { GoogleGenAI } from '@google/genai'
import { auth } from '@/auth'

import { prisma } from '@/lib/prisma'

///////////////////////////////////////////
// FRIGO
///////////////////////////////////////////

export async function addFridgeItem(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return

  const name = formData.get('name') as string
  const quantity = formData.get('quantity') as string
  const category = formData.get('category') as string

  if (!name) return

  await prisma.fridgeItem.create({
    data: {
      name,
      quantity: quantity || null,
      category: category || null,
      userId: session.user.id,
    },
  })

  revalidatePath('/')
}

export async function deleteFridgeItem(id: string) {
  const session = await auth()
  if (!session?.user?.id) return

  await prisma.fridgeItem.deleteMany({
    where: { id, userId: session.user.id },
  })

  revalidatePath('/')
}

export async function getFridgeItems() {
  const session = await auth()
  if (!session?.user?.id) return []

  return prisma.fridgeItem.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })
}

///////////////////////////////////////////
// RECETTES SAUVEGARDÉES
///////////////////////////////////////////

type RecipeInput = {
  title: string
  ingredients: string[]
  missingIngredients: string[]
  steps: string[]
}

export async function saveRecipe(recipe: RecipeInput) {
  const session = await auth()
  if (!session?.user?.id) return

  await prisma.savedRecipe.create({
    data: {
      title: recipe.title,
      ingredients: recipe.ingredients,
      missingIngredients: recipe.missingIngredients,
      steps: recipe.steps,
      userId: session.user.id,
    },
  })
  revalidatePath('/recettes')
}

export async function getSavedRecipes() {
  const session = await auth()
  if (!session?.user?.id) return []

  return prisma.savedRecipe.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })
}

export async function deleteSavedRecipe(id: string) {
  const session = await auth()
  if (!session?.user?.id) return

  await prisma.savedRecipe.deleteMany({
    where: { id, userId: session.user.id },
  })
  revalidatePath('/recettes')
}

///////////////////////////////////////////
// GÉNÉRATION IA
///////////////////////////////////////////

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

export async function generateRecipes(strictMode: boolean) {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: 'Tu dois être connecté pour générer des recettes.' }
  }

  // 1. Récupérer le frigo de l'utilisateur connecté
  const fridgeItems = await prisma.fridgeItem.findMany({
    where: { userId: session.user.id },
  })

  if (fridgeItems.length === 0) {
    return { error: 'Ton frigo est vide, ajoute des ingrédients d\'abord.' }
  }

  // 2. Récupérer les ingrédients de saison pour le mois actuel
  const currentMonth = new Date().getMonth() + 1
  const seasonalItems = await prisma.seasonalIngredient.findMany({
    where: { months: { has: currentMonth } },
  })

  // 3. Récupérer les préférences utilisateur
  const preferences = await prisma.userPreferences.findUnique({
    where: { userId: session.user.id },
  })

  // 4. Construire le prompt
  const fridgeList = fridgeItems
    .map((item) => `${item.name}${item.quantity ? ` (${item.quantity})` : ''}`)
    .join(', ')

  const seasonalList = seasonalItems.map((item) => item.name).join(', ')

  const instructionMode = strictMode
    ? `Utilise UNIQUEMENT les ingrédients présents dans le frigo, plus des basiques de placard (sel, poivre, huile, épices courantes). N'ajoute AUCUN ingrédient supplémentaire, même de saison, si l'utilisateur ne l'a pas dans son frigo. Le champ "missingIngredients" doit rester vide ou quasi vide.`
    : `Propose des recettes qui utilisent en priorité les ingrédients du frigo, mais tu peux aussi suggérer d'ajouter quelques ingrédients de saison pour enrichir les recettes, même s'ils manquent dans le frigo. Liste clairement les ingrédients manquants dans "missingIngredients".`

  const dietText = preferences?.diet
    ? `L'utilisateur suit un régime : ${preferences.diet}. Les recettes DOIVENT être compatibles avec ce régime, sans exception.`
    : ''

  const allergiesText = preferences?.allergies && preferences.allergies.length > 0
    ? `L'utilisateur est allergique ou souhaite exclure : ${preferences.allergies.join(', ')}. N'inclus JAMAIS ces ingrédients dans les recettes, même en petite quantité.`
    : ''

  const servingsText = `Adapte les quantités des ingrédients pour ${preferences?.householdSize || 1} personne(s).`

  const prompt = `Tu es un assistant culinaire. Voici les ingrédients disponibles dans le frigo : ${fridgeList}.

Les ingrédients de saison ce mois-ci sont : ${seasonalList}.

${instructionMode}

${dietText}
${allergiesText}
${servingsText}

Propose 3 recettes. Pour chaque recette, donne :
- Un titre
- La liste des ingrédients nécessaires
- Les ingrédients manquants par rapport au frigo (peut être vide)
- Les étapes de préparation, numérotées

Réponds uniquement avec un JSON valide, sans texte avant ou après, au format suivant :
{
  "recipes": [
    {
      "title": "...",
      "ingredients": ["..."],
      "missingIngredients": ["..."],
      "steps": ["..."]
    }
  ]
}`

  // 5. Appeler Gemini
  const response = await genAI.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  })

  const text = response.text

  if (!text) {
    return { error: 'Erreur lors de la génération.' }
  }

  try {
    const cleaned = text.replace(/```json\n?|\n?```/g, '').trim()
    const parsed = JSON.parse(cleaned)
    return { recipes: parsed.recipes }
  } catch {
    return { error: 'Erreur de format dans la réponse IA.' }
  }
}
///////////////////////////////////////////
// PRÉFÉRENCES UTILISATEUR
///////////////////////////////////////////

export async function getUserPreferences() {
  const session = await auth()
  if (!session?.user?.id) return null

  return prisma.userPreferences.findUnique({
    where: { userId: session.user.id },
  })
}

// Logique métier partagée
async function savePreferencesData(userId: string, formData: FormData) {
  const diet = formData.get('diet') as string
  const allergiesRaw = formData.get('allergies') as string
  const householdSizeRaw = formData.get('householdSize') as string
  const allergies = allergiesRaw
    ? allergiesRaw.split(',').map((a) => a.trim()).filter(Boolean)
    : []
  const householdSize = householdSizeRaw ? parseInt(householdSizeRaw) : 1

  await prisma.userPreferences.upsert({
    where: { userId },
    update: { diet: diet || null, allergies, householdSize },
    create: { userId, diet: diet || null, allergies, householdSize },
  })
}

// Version pour la page Profil (avec état de confirmation, via useActionState)
type PreferencesState = {
  success: boolean
  message: string
}

export async function updateUserPreferences(
  prevState: PreferencesState,
  formData: FormData
): Promise<PreferencesState> {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, message: 'Non connecté.' }
  }

  await savePreferencesData(session.user.id, formData)
  revalidatePath('/profil')
  return { success: true, message: '✅ Préférences enregistrées !' }
}

// Version pour l'onboarding (formulaire classique, pas de useActionState)
export async function saveOnboardingPreferences(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return

  await savePreferencesData(session.user.id, formData)
  revalidatePath('/onboarding')
}

///////////////////////////////////////////
// LISTE DE COURSES
///////////////////////////////////////////
export async function getShoppingList(
  recipeId: string
): Promise<{ missing: string[] } | { error: string }> {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Non connecté.' }

  const recipe = await prisma.savedRecipe.findFirst({
    where: { id: recipeId, userId: session.user.id },
  })

  if (!recipe) return { error: 'Recette introuvable.' }

  const fridgeItems = await prisma.fridgeItem.findMany({
    where: { userId: session.user.id },
  })

  const fridgeNames = fridgeItems.map((item) => item.name.toLowerCase().trim())

  const missing = recipe.ingredients.filter((ingredient) => {
    return !fridgeNames.some((fridgeName) =>
      ingredient.toLowerCase().includes(fridgeName)
    )
  })

  return { missing }
}