import { auth, signIn, signOut } from '@/auth'

export default async function AuthButton() {
  const session = await auth()

  if (session?.user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm">Connecté : {session.user.email}</span>
        <form
          action={async () => {
            'use server'
            await signOut()
          }}
        >
          <button className="text-sm text-red-600 hover:underline">
            Se déconnecter
          </button>
        </form>
      </div>
    )
  }

  return (
    <form
      action={async () => {
        'use server'
        await signIn('google')
      }}
    >
      <button className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700">
        Se connecter avec Google
      </button>
    </form>
  )
}