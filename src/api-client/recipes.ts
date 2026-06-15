import type { Recipe, CreateRecipeInput } from '@/types'

const BASE = '/api'

export const RecipesAPI = {
  getAll: async (search?: string, category?: string): Promise<Recipe[]> => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (category) params.set('category', category)
    const query = params.toString() ? `?${params.toString()}` : ''
    const res = await fetch(`${BASE}/recipes${query}`)
    return res.json()
  },

  getById: async (id: string): Promise<Recipe | null> => {
    const res = await fetch(`${BASE}/recipes/${id}`)
    if (res.status === 404) return null
    return res.json()
  },

  create: async (data: CreateRecipeInput): Promise<Recipe> => {
    const res = await fetch(`${BASE}/recipes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return res.json()
  },

  delete: async (id: string): Promise<void> => {
    await fetch(`${BASE}/recipes/${id}`, { method: 'DELETE' })
  },
}