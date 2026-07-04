'use client'

import { useActionState } from 'react'
import { updateUserPreferences } from '@/lib/actions'

type Preferences = {
  diet: string | null
  allergies: string[]
  householdSize: number | null
} | null

export default function PreferencesForm({ prefs }: { prefs: Preferences }) {
    const [state, formAction] = useActionState(updateUserPreferences, {
        success: false,
        message: '',
    })

    return (
        <form action={formAction} className="space-y-4">
            <div>
                <label className="block text-sm font-bold mb-1">Régime alimentaire</label>
                <select
                    name="diet"
                    defaultValue={prefs?.diet || ''}
                    className="border border-[#D3D1C7] rounded-lg px-3 py-2 w-full"
                >
                    <option value="">Aucun régime particulier</option>
                    <option value="vegetarien">Végétarien</option>
                    <option value="vegan">Végan</option>
                    <option value="sans_gluten">Sans gluten</option>
                    <option value="sans_lactose">Sans lactose</option>
                    <option value="halal">Halal</option>
                    <option value="casher">Casher</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-bold mb-1">
                    Allergies / aliments à exclure
                </label>
                <input
                    name="allergies"
                    type="text"
                    defaultValue={prefs?.allergies.join(', ') || ''}
                    placeholder="ex: arachides, fruits de mer, œufs"
                    className="border border-[#D3D1C7] rounded-lg px-3 py-2 w-full"
                />
                <p className="text-xs text-[#888780] mt-1">
                    Sépare chaque élément par une virgule
                </p>
            </div>

            <div>
                <label className="block text-sm font-bold mb-1">
                    Nombre de personnes au foyer
                </label>
                <input
                    name="householdSize"
                    type="number"
                    min="1"
                    defaultValue={prefs?.householdSize || 1}
                    className="border border-[#D3D1C7] rounded-lg px-3 py-2 w-24"
                />
            </div>

            <button
                type="submit"
                className="bg-basilic text-white font-bold px-4 py-2 rounded-lg hover:opacity-90"
            >
                Enregistrer
            </button>

            {state.message && (
                <p className={state.success ? 'text-basilic-dark' : 'text-framboise-dark'}>
                    {state.message}
                </p>
            )}
        </form>
    )
}