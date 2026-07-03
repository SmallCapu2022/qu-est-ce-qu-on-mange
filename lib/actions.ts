'use server'

import { PrismaClient } from '@/app/generated/prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export async function addFridgeItem(formData: FormData) {
  const name = formData.get('name') as string
  const quantity = formData.get('quantity') as string
  const category = formData.get('category') as string

  if (!name) return

  await prisma.fridgeItem.create({
    data: { name, quantity: quantity || null, category: category || null },
  })

  revalidatePath('/')
}

export async function deleteFridgeItem(id: string) {
  await prisma.fridgeItem.delete({ where: { id } })
  revalidatePath('/')
}