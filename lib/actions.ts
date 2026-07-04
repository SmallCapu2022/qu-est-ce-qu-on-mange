'use server'

import { PrismaClient } from '@/app/generated/prisma/client'
import { revalidatePath } from 'next/cache'
import { GoogleGenAI } from '@google/genai'

const prisma = new PrismaClient()

export async function addFridgeItem(formData: FormData) {
  const name = formData.get('name') as string
  const quantity = formData.get('quantity') as string
  const category = formData.get('category') as string

  if (!name) return

  await prisma.fridgeItem.create({
    data: { name, quantity: quantity || null, category: category || null },
  })

  revalidatePath('/')
}

export async function deleteFridgeItem(id: string) {
  await prisma.fridgeItem.delete({ where: { id } })
  revalidatePath('/')
}

///////////////////////////////////////////

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

export async function generateRecipes(strictMode: boolean) {
  // 1. Récupérer le frigo actuel
  const fridgeItems = await prisma.fridgeItem.findMany()

  if (fridgeItems.length === 0) {
    return { error: 'Ton frigo est vide, ajoute des ingrédients d\'abord.' }
  }

  // 2. Récupérer les ingrédients de saison pour le mois actuel
  const currentMonth = new Date().getMonth() + 1 // getMonth() commence à 0
  const seasonalItems = await prisma.seasonalIngredient.findMany({
    where: { months: { has: currentMonth } },
  })

  // 3. Construire le prompt
  const fridgeList = fridgeItems
    .map((item) => `${item.name}${item.quantity ? ` (${item.quantity})` : ''}`)
    .join(', ')

  const seasonalList = seasonalItems.map((item) => item.name).join(', ')

  const instructionMode = strictMode
    ? `Utilise UNIQUEMENT les ingrédients présents dans le frigo, plus des basiques de placard (sel, poivre, huile, épices courantes). N'ajoute AUCUN ingrédient supplémentaire, même de saison, si l'utilisateur ne l'a pas dans son frigo. Le champ "missingIngredients" doit rester vide ou quasi vide.`
    : `Propose des recettes qui utilisent en priorité les ingrédients du frigo, mais tu peux aussi suggérer d'ajouter quelques ingrédients de saison pour enrichir les recettes, même s'ils manquent dans le frigo. Liste clairement les ingrédients manquants dans "missingIngredients".`

  const prompt = `Tu es un assistant culinaire. Voici les ingrédients disponibles dans le frigo : ${fridgeList}.

Les ingrédients de saison ce mois-ci sont : ${seasonalList}.

${instructionMode}

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

  // 4. Appeler Gemini
  const response = await genAI.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  })

  const text = response.text

  if (!text) {
    return { error: 'Erreur lors de la génération.' }
  }

  try {
    // Gemini peut parfois entourer le JSON de ```json ... ``` malgré la consigne
    const cleaned = text.replace(/```json\n?|\n?```/g, '').trim()
    const parsed = JSON.parse(cleaned)
    return { recipes: parsed.recipes }
  } catch {
    return { error: 'Erreur de format dans la réponse IA.' }
  }
}

type RecipeInput = {
  title: string
  ingredients: string[]
  missingIngredients: string[]
  steps: string[]
}

export async function saveRecipe(recipe: RecipeInput) {
  await prisma.savedRecipe.create({
    data: {
      title: recipe.title,
      ingredients: recipe.ingredients,
      missingIngredients: recipe.missingIngredients,
      steps: recipe.steps,
    },
  })
  revalidatePath('/recettes')
}

export async function getSavedRecipes() {
  return prisma.savedRecipe.findMany({
    orderBy: { createdAt: 'desc' },
  })
}

export async function deleteSavedRecipe(id: string) {
  await prisma.savedRecipe.delete({ where: { id } })
  revalidatePath('/recettes')
}