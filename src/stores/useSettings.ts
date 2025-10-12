/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/lib/utils"
import { create } from "zustand"

type SettingsMap = Record<string, any>

interface SettingsState {
  settings: SettingsMap
  loaded: boolean
  fetchSettings: (referenceId?: number | string) => Promise<void>
  saveSettings: (data: FormData | Record<string, any>) => Promise<void>
}

export const useSettings = create<SettingsState>((set, get) => ({
  settings: {},
  loaded: false,

  fetchSettings: async (referenceId) => {
    const params = referenceId ? { reference_id: referenceId } : {}
    const res = await api("/admin/settings", params, "GET") // public endpoint for initial load
    set({ settings: res.data || {}, loaded: true })
  },

  saveSettings: async (payload) => {
    let body: any = payload

    // Convert plain object into FormData
    if (!(payload instanceof FormData)) {
      const fd = new FormData()
      Object.entries(payload).forEach(([k, v]) => {
        if (v !== undefined && v !== null) {
          fd.append(k, v as any)
        }
      })
      body = fd
    }

    // Post to admin endpoint (requires admin auth)
    await api("/admin/settings", body, "POST")

    // Refresh local cache after save
    const referenceId = (payload as any)?.reference_id
    await get().fetchSettings(referenceId)
  },
}))
