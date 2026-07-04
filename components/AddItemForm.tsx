import { addFridgeItem } from '@/lib/actions'

const categories = [
  { value: 'fruit', label: '🍓 Fruit' },
  { value: 'legume', label: '🥕 Légume' },
  { value: 'viande', label: '🥩 Viande' },
  { value: 'poisson', label: '🐟 Poisson' },
  { value: 'epicerie', label: '🌾 Épicerie' },
  { value: 'laitier', label: '🧀 Produit laitier' },
  { value: 'boisson', label: '🥤 Boisson' },
  { value: 'autre', label: '📦 Autre' },
]

export default function AddItemForm() {
  return (
    <form
      action={addFridgeItem}
      className="bg-white border border-[#D3D1C7] rounded-xl p-4 flex flex-col sm:flex-row gap-2 mb-6"
    >
      <input
        name="name"
        placeholder="Nom (ex: courgette)"
        required
        className="border border-[#D3D1C7] rounded-lg px-3 py-2 flex-1"
      />
      <input
        name="quantity"
        placeholder="Quantité (ex: 500g, 1L)"
        className="border border-[#D3D1C7] rounded-lg px-3 py-2 sm:w-36"
      />
      <select
        name="category"
        defaultValue=""
        className="border border-[#D3D1C7] rounded-lg px-3 py-2 sm:w-44"
      >
        <option value="">Catégorie</option>
        {categories.map((cat) => (
          <option key={cat.value} value={cat.value}>
            {cat.label}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="bg-corail text-corail-dark font-bold px-4 py-2 rounded-lg hover:opacity-90"
      >
        Ajouter
      </button>
    </form>
  )
}