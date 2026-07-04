'use client'

import { deleteFridgeItem } from '@/lib/actions'

type FridgeItem = {
  id: string
  name: string
  quantity: string | null
  category: string | null
}

const categoryStyles: Record<string, { label: string; bg: string; text: string }> = {
  fruit: { label: '🍓 Fruit', bg: '#FAE7DE', text: '#4A1B0C' },
  legume: { label: '🥕 Légume', bg: '#EAF3E9', text: '#173404' },
  viande: { label: '🥩 Viande', bg: '#FAE7EE', text: '#4B1528' },
  poisson: { label: '🐟 Poisson', bg: '#E6F1FB', text: '#042C53' },
  epicerie: { label: '🌾 Épicerie', bg: '#FFF3DC', text: '#412402' },
  laitier: { label: '🧀 Produit laitier', bg: '#F1EFE8', text: '#2C2C2A' },
  boisson: { label: '🥤 Boisson', bg: '#E6F1FB', text: '#042C53' },
  autre: { label: '📦 Autre', bg: '#F1EFE8', text: '#2C2C2A' },
}

export default function FridgeList({ items }: { items: FridgeItem[] }) {
  if (items.length === 0) {
    return (
      <p className="text-[#5F5E5A] bg-white border border-[#D3D1C7] rounded-xl p-4 text-center">
        Ton frigo est vide pour l'instant.
      </p>
    )
  }

  return (
    <ul className="space-y-2">
      {items.map((item) => {
        const catStyle = item.category ? categoryStyles[item.category] : null
        return (
          <li
            key={item.id}
            className="flex justify-between items-center border border-[#D3D1C7] bg-white rounded-xl px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <span className="font-semibold">{item.name}</span>
              {item.quantity && (
                <span className="text-sm text-[#5F5E5A]">{item.quantity}</span>
              )}
              {catStyle && (
                <span
                  className="text-xs font-bold px-2 py-1 rounded-full"
                  style={{ backgroundColor: catStyle.bg, color: catStyle.text }}
                >
                  {catStyle.label}
                </span>
              )}
            </div>
            <button
              onClick={() => deleteFridgeItem(item.id)}
              className="text-framboise hover:underline text-sm font-bold"
            >
              Supprimer
            </button>
          </li>
        )
      })}
    </ul>
  )
}