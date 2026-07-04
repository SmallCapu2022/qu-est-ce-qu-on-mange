import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { saveOnboardingPreferences, addFridgeItem } from '@/lib/actions'

export default async function OnboardingPage() {
  const session = await auth()
  if (!session?.user) redirect('/')

  return (
    <main className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-semibold mb-2">Bienvenue {session.user.name} ! 👋</h1>
      <p className="text-[#5F5E5A] mb-6">
        Quelques infos pour personnaliser tes recettes.
      </p>

      <form action={saveOnboardingPreferences} className="space-y-4 mb-8">
        <div>
          <label className="block text-sm font-bold mb-1">Régime alimentaire</label>
          <select name="diet" className="border border-[#D3D1C7] rounded-lg px-3 py-2 w-full">
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
          <label className="block text-sm font-bold mb-1">
            Allergies / aliments à exclure
          </label>
          <input
            name="allergies"
            type="text"
            placeholder="ex: arachides, fruits de mer"
            className="border border-[#D3D1C7] rounded-lg px-3 py-2 w-full"
          />
        </div>

        <button
          type="submit"
          className="bg-basilic text-white font-bold px-4 py-2 rounded-lg hover:opacity-90"
        >
          Continuer →
        </button>
      </form>

      <div className="border-t border-[#D3D1C7] pt-6">
        <h2 className="font-semibold mb-3">Ajoute quelques ingrédients (optionnel)</h2>
        <form action={addFridgeItem} className="flex flex-col sm:flex-row gap-2">
          <input
            name="name"
            placeholder="Nom (ex: courgette)"
            className="border border-[#D3D1C7] rounded-lg px-3 py-2 flex-1"
          />
          <input
            name="quantity"
            placeholder="Quantité"
            className="border border-[#D3D1C7] rounded-lg px-3 py-2 sm:w-32"
          />
          <button className="bg-corail text-corail-dark font-bold px-4 py-2 rounded-lg hover:opacity-90">
            Ajouter
          </button>
        </form>
      </div>

      <a href="/frigo" className="block text-center mt-8 text-framboise hover:underline font-bold">
        Terminer et aller à mon frigo →
      </a>
    </main>
  )
}