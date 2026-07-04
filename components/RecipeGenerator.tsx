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
      <div className="mb-4">
        <p className="text-sm font-bold text-[#5F5E5A] mb-2">Mode de génération</p>
        <div className="inline-flex rounded-lg border border-[#D3D1C7] overflow-hidden">
          <button
            onClick={() => setStrictMode(true)}
            className={`px-4 py-2 text-sm font-bold transition-colors ${
              strictMode
                ? 'bg-basilic text-white'
                : 'bg-[#F1EFE8] text-[#888780] hover:bg-[#E5E2D8]'
            }`}
          >
            🧊 Uniquement mon frigo
          </button>
          <button
            onClick={() => setStrictMode(false)}
            className={`px-4 py-2 text-sm font-bold transition-colors border-l border-[#D3D1C7] ${
              !strictMode
                ? 'bg-basilic text-white'
                : 'bg-[#F1EFE8] text-[#888780] hover:bg-[#E5E2D8]'
            }`}
          >
            🛒 Avec suggestions de saison
          </button>
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="bg-corail text-corail-dark font-bold px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-50"
      >
        {loading ? 'Génération en cours...' : '🍳 Génère-moi des recettes'}
      </button>

      {error && <p className="text-framboise-dark mt-2">{error}</p>}

      <div className="mt-4 space-y-4">
        {recipes.map((recipe, i) => {
          const isSaved = savedTitles.includes(recipe.title)
          return (
            <div key={i} className="border border-[#D3D1C7] bg-white rounded-xl p-4">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg">{recipe.title}</h3>
                <button
                  onClick={() => handleSave(recipe)}
                  disabled={isSaved}
                  className="text-sm text-framboise hover:underline disabled:text-[#B4B2A9] disabled:no-underline font-bold"
                >
                  {isSaved ? '✓ Sauvegardée' : '⭐ Sauvegarder'}
                </button>
              </div>
              <p className="text-sm text-[#5F5E5A] mt-1">
                Ingrédients : {recipe.ingredients.join(', ')}
              </p>
              {recipe.missingIngredients.length > 0 && (
                <p className="text-sm text-miel-dark mt-1">
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