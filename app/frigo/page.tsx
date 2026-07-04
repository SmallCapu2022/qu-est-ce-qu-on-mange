import AddItemForm from '@/components/AddItemForm'
import FridgeList from '@/components/FridgeList'
import RecipeGenerator from '@/components/RecipeGenerator'
import { auth } from '@/auth'
import { getFridgeItems } from '@/lib/actions'

export default async function FrigoPage() {
  const session = await auth()
  const items = session?.user ? await getFridgeItems() : []

  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-semibold mb-6">🧊 Mon frigo</h1>

      {!session?.user && (
        <p className="text-[#5F5E5A]">
          Connecte-toi pour gérer ton frigo et générer des recettes.
        </p>
      )}

      {session?.user && (
        <>
          <AddItemForm />
          <FridgeList items={items} />
          <RecipeGenerator />
        </>
      )}
    </main>
  )
}