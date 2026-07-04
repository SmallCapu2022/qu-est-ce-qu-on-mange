import AddItemForm from '@/components/AddItemForm'
import FridgeList from '@/components/FridgeList'
import RecipeGenerator from '@/components/RecipeGenerator'
import AuthButton from '@/components/AuthButton'
import { auth } from '@/auth'
import { getFridgeItems } from '@/lib/actions'
import Link from 'next/link'

export default async function Home() {
  const session = await auth()
  const items = session?.user ? await getFridgeItems() : []

  return (
    <main className="max-w-2xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🧊 Mon frigo</h1>
        <AuthButton />
      </div>

      {!session?.user && (
        <p className="text-gray-500 mb-6">
          Connecte-toi avec Google pour gérer ton frigo et générer des recettes.
        </p>
      )}

      {session?.user && (
        <>
          <Link href="/recettes" className="text-blue-600 hover:underline text-sm block mb-4">
            Voir mes recettes sauvegardées →
          </Link>
          <AddItemForm />
          <FridgeList items={items} />
          <RecipeGenerator />
        </>
      )}
    </main>
  )
}