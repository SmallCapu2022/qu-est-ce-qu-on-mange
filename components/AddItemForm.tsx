import { addFridgeItem } from '@/lib/actions'

export default function AddItemForm() {
  return (
    <form action={addFridgeItem} className="flex gap-2 mb-6">
      <input
        name="name"
        placeholder="Nom (ex: courgette)"
        required
        className="border rounded px-3 py-2 flex-1"
      />
      <input
        name="quantity"
        placeholder="Quantité (ex: 500g, 1L)"
        className="border rounded px-3 py-2 w-40"
      />
      <input
        name="category"
        placeholder="Catégorie (ex: légume)"
        className="border rounded px-3 py-2 w-40"
      />
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Ajouter
      </button>
    </form>
  )
}