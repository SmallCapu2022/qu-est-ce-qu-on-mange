'use client'

import { deleteFridgeItem } from '@/lib/actions'

type FridgeItem = {
  id: string
  name: string
  quantity: string | null
  category: string | null
}

export default function FridgeList({ items }: { items: FridgeItem[] }) {
  if (items.length === 0) {
    return <p className="text-gray-500">Ton frigo est vide pour l'instant.</p>
  }

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li
          key={item.id}
          className="flex justify-between items-center border rounded px-3 py-2"
        >
          <span>
            <strong>{item.name}</strong>
            {item.quantity && ` — ${item.quantity}`}
            {item.category && ` (${item.category})`}
          </span>
          <button
            onClick={() => deleteFridgeItem(item.id)}
            className="text-red-600 hover:underline text-sm"
          >
            Supprimer
          </button>
        </li>
      ))}
    </ul>
  )
}