import { getUserPreferences } from '@/lib/actions'
import PreferencesForm from '@/components/PreferencesForm'

export default async function ProfilePage() {
  const prefs = await getUserPreferences()

  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-semibold mb-6">⚙️ Mes préférences</h1>
      <PreferencesForm prefs={prefs} />
    </main>
  )
}