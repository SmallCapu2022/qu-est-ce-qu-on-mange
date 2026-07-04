import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const seasonalData = [
  { name: 'Fraise', months: [4, 5, 6, 7] },
  { name: 'Tomate', months: [6, 7, 8, 9] },
  { name: 'Courgette', months: [6, 7, 8, 9] },
  { name: 'Aubergine', months: [7, 8, 9] },
  { name: 'Poivron', months: [7, 8, 9, 10] },
  { name: 'Melon', months: [7, 8, 9] },
  { name: 'Pêche', months: [6, 7, 8, 9] },
  { name: 'Abricot', months: [6, 7, 8] },
  { name: 'Potiron', months: [9, 10, 11, 12] },
  { name: 'Champignon', months: [9, 10, 11] },
  { name: 'Raisin', months: [9, 10] },
  { name: 'Poire', months: [9, 10, 11, 12, 1] },
  { name: 'Pomme', months: [9, 10, 11, 12, 1, 2] },
  { name: 'Endive', months: [11, 12, 1, 2, 3] },
  { name: 'Poireau', months: [10, 11, 12, 1, 2, 3] },
  { name: 'Chou', months: [10, 11, 12, 1, 2, 3] },
  { name: 'Carotte', months: [1, 2, 3, 4, 10, 11, 12] },
  { name: 'Betterave', months: [6, 7, 8, 9, 10, 11] },
  { name: 'Radis', months: [3, 4, 5, 6, 9, 10] },
  { name: 'Épinard', months: [3, 4, 5, 10, 11] },
  { name: 'Salade', months: [4, 5, 6, 7, 8, 9] },
  { name: 'Asperge', months: [4, 5, 6] },
  { name: 'Petit pois', months: [5, 6] },
  { name: 'Haricot vert', months: [6, 7, 8, 9] },
  { name: 'Citrouille', months: [9, 10, 11] },
  { name: 'Clémentine', months: [11, 12, 1] },
  { name: 'Orange', months: [12, 1, 2, 3] },
  { name: 'Citron', months: [1, 2, 3, 11, 12] },
  { name: 'Kiwi', months: [11, 12, 1, 2, 3] },
  { name: 'Cerise', months: [5, 6, 7] },
]

async function main() {
  for (const item of seasonalData) {
    await prisma.seasonalIngredient.upsert({
      where: { name: item.name },
      update: { months: item.months },
      create: item,
    })
  }
  console.log(`✅ ${seasonalData.length} ingrédients de saison ajoutés.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })