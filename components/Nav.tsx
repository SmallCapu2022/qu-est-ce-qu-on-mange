import Link from 'next/link'
import { auth, signOut } from '@/auth'

export default async function Nav() {
  const session = await auth()

  if (!session?.user) return null

  return (
    <nav className="border-b border-[#D3D1C7] bg-white px-6 py-3 flex justify-between items-center">
      <div className="flex gap-6 items-center">
        <Link href="/frigo" className="font-semibold text-lg text-[#2C2C2A]">
          🧊 Qu'est-ce qu'on mange
        </Link>
        <Link href="/frigo" className="text-sm font-bold text-framboise hover:underline">
          Frigo
        </Link>
        <Link href="/recettes" className="text-sm font-bold text-framboise hover:underline">
          Recettes
        </Link>
        <Link href="/profil" className="text-sm font-bold text-framboise hover:underline">
          Profil
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-[#5F5E5A]">{session.user.email}</span>
        <form
          action={async () => {
            'use server'
            await signOut()
          }}
        >
          <button className="text-sm text-[#5F5E5A] hover:underline">
            Se déconnecter
          </button>
        </form>
      </div>
    </nav>
  )
}