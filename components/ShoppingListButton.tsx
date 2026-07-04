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
        className="text-sm text-purple-600 hover:underline disabled:opacity-50"
      >
        {loading ? 'Vérification...' : '🛒 Voir ce qu\'il me manque'}
      </button>

      {missing !== null && (
        <div className="mt-2 text-sm">
          {missing.length === 0 ? (
            <p className="text-green-600">
              Tu as tout ce qu'il faut dans ton frigo ! 🎉
            </p>
          ) : (
            <div>
              <p className="text-gray-600 mb-1">À acheter :</p>
              <ul className="list-disc list-inside text-orange-600">
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