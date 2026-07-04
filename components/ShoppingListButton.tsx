'use client'

import { useState } from 'react'
import { getShoppingList } from '@/lib/actions'

export default function ShoppingListButton({ recipeId }: { recipeId: string }) {
  const [missing, setMissing] = useState<string[] | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleCheck() {
    setLoading(true)
    const result = await getShoppingList(recipeId)
    setLoading(false)

    if ('missing' in result) {
      setMissing(result.missing)
    }
  }

  return (
    <div className="mt-2">
      <button
        onClick={handleCheck}
        disabled={loading}
        className="text-sm text-framboise hover:underline disabled:opacity-50 font-bold"
      >
        {loading ? 'Vérification...' : '🛒 Voir ce qu\'il me manque'}
      </button>

      {missing !== null && (
        <div className="mt-2 text-sm">
          {missing.length === 0 ? (
            <p className="text-basilic-dark">
              Tu as tout ce qu'il faut dans ton frigo ! 🎉
            </p>
          ) : (
            <div>
              <p className="text-[#5F5E5A] mb-1">À acheter :</p>
              <ul className="list-disc list-inside text-miel-dark">
                {missing.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}