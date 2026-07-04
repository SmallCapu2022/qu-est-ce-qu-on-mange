import { auth, signIn } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export default async function HomePage() {
  const session = await auth()

  if (session?.user?.id) {
    const prefs = await prisma.userPreferences.findUnique({
      where: { userId: session.user.id },
    })
    redirect(prefs ? '/frigo' : '/onboarding')
  }

  return (
    <main className="max-w-xl mx-auto p-8 text-center mt-16">
      <h1 className="text-4xl font-semibold mb-4">🧊 Qu'est-ce qu'on mange ?</h1>
      <p className="text-[#5F5E5A] mb-8">
        Dis-nous ce qu'il y a dans ton frigo, et on te propose des recettes
        adaptées à tes goûts, ton régime, et la saison.
      </p>
      <form
        action={async () => {
          'use server'
          await signIn('google')
        }}
      >
        <button className="bg-corail text-corail-dark font-bold px-6 py-3 rounded-lg text-lg hover:opacity-90">
          Se connecter avec Google
        </button>
      </form>
    </main>
  )
}