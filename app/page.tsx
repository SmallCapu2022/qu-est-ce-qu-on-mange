import { PrismaClient } from '@/app/generated/prisma/client'
import AddItemForm from '@/components/AddItemForm'
import FridgeList from '@/components/FridgeList'
import RecipeGenerator from '@/components/RecipeGenerator'

import Link from 'next/link'

const prisma = new PrismaClient()

export default async function Home() {
  const items = await prisma.fridgeItem.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">🧊 Mon frigo</h1>
      <Link href="/recettes" className="text-blue-600 hover:underline text-sm">
        Voir mes recettes sauvegardées →
      </Link>
      <AddItemForm />
      <FridgeList items={items} />
      <RecipeGenerator />
    </main>
  )
}