import { getSavedRecipes, deleteSavedRecipe } from '@/lib/actions'

export default async function RecettesPage() {
  const recipes = await getSavedRecipes()

  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">⭐ Mes recettes sauvegardées</h1>

      {recipes.length === 0 && (
        <p className="text-gray-500">Aucune recette sauvegardée pour l'instant.</p>
      )}

      <div className="space-y-4">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="border rounded p-4">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-lg">{recipe.title}</h3>
              <form action={deleteSavedRecipe.bind(null, recipe.id)}>
                <button className="text-sm text-red-600 hover:underline">
                  Supprimer
                </button>
              </form>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Ingrédients : {recipe.ingredients.join(', ')}
            </p>
            <ol className="list-decimal list-inside mt-2 space-y-1">
              {recipe.steps.map((step, j) => (
                <li key={j}>{step}</li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </main>
  )
}