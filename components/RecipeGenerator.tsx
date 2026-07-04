'use client'

import { useState } from 'react'
import { generateRecipes, saveRecipe } from '@/lib/actions'

type Recipe = {
  title: string
  ingredients: string[]
  missingIngredients: string[]
  steps: string[]
}

export default function RecipeGenerator() {
  const [loading, setLoading] = useState(false)
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [error, setError] = useState('')
  const [strictMode, setStrictMode] = useState(true)
  const [savedTitles, setSavedTitles] = useState<string[]>([])

  async function handleGenerate() {
    setLoading(true)
    setError('')
    const result = await generateRecipes(strictMode)
    setLoading(false)

    if (result.error) {
      setError(result.error)
      return
    }
    setRecipes(result.recipes || [])
    setSavedTitles([])
  }

  async function handleSave(recipe: Recipe) {
    await saveRecipe(recipe)
    setSavedTitles((prev) => [...prev, recipe.title])
  }

  return (
    <div className="mt-8">
      <div className="flex items-center gap-3 mb-3">
        <button
          onClick={() => setStrictMode(true)}
          className={`px-3 py-1.5 rounded text-sm ${
            strictMode ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          🧊 Uniquement mon frigo
        </button>
        <button
          onClick={() => setStrictMode(false)}
          className={`px-3 py-1.5 rounded text-sm ${
            !strictMode ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          🛒 Avec suggestions de saison
        </button>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 disabled:opacity-50"
      >
        {loading ? 'Génération en cours...' : '🍳 Génère-moi des recettes'}
      </button>

      {error && <p className="text-red-600 mt-2">{error}</p>}

      <div className="mt-4 space-y-4">
        {recipes.map((recipe, i) => {
          const isSaved = savedTitles.includes(recipe.title)
          return (
            <div key={i} className="border rounded p-4">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg">{recipe.title}</h3>
                <button
                  onClick={() => handleSave(recipe)}
                  disabled={isSaved}
                  className="text-sm text-blue-600 hover:underline disabled:text-gray-400 disabled:no-underline"
                >
                  {isSaved ? '✓ Sauvegardée' : '⭐ Sauvegarder'}
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Ingrédients : {recipe.ingredients.join(', ')}
              </p>
              {recipe.missingIngredients.length > 0 && (
                <p className="text-sm text-orange-600 mt-1">
                  Manque : {recipe.missingIngredients.join(', ')}
                </p>
              )}
              <ol className="list-decimal list-inside mt-2 space-y-1">
                {recipe.steps.map((step, j) => (
                  <li key={j}>{step}</li>
                ))}
              </ol>
            </div>
          )
        })}
      </div>
    </div>
  )
}