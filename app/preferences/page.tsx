import { getUserPreferences, updateUserPreferences } from '@/lib/actions'

export default async function PreferencesPage() {
  const prefs = await getUserPreferences()

  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">⚙️ Mes préférences</h1>

      <form action={updateUserPreferences} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Régime alimentaire</label>
          <select
            name="diet"
            defaultValue={prefs?.diet || ''}
            className="border rounded px-3 py-2 w-full"
          >
            <option value="">Aucun régime particulier</option>
            <option value="vegetarien">Végétarien</option>
            <option value="vegan">Végan</option>
            <option value="sans_gluten">Sans gluten</option>
            <option value="sans_lactose">Sans lactose</option>
            <option value="halal">Halal</option>
            <option value="casher">Casher</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Allergies / aliments à exclure
          </label>
          <input
            name="allergies"
            type="text"
            defaultValue={prefs?.allergies.join(', ') || ''}
            placeholder="ex: arachides, fruits de mer, œufs"
            className="border rounded px-3 py-2 w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            Sépare chaque élément par une virgule
          </p>
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Enregistrer
        </button>
      </form>
    </main>
  )
}