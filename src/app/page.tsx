'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import RecipeCard from '@/components/RecipeCard'
import SearchBar from '@/components/SearchBar'
import CategoryFilter from '@/components/CategoryFilter'
import { RecipesAPI } from '@/api-client/recipes'
import type { Recipe } from '@/types'

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true)
      const data = await RecipesAPI.getAll(search || undefined, category || undefined)
      setRecipes(data)
      setLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [search, category])

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">我的菜谱</h1>
          <Link
            href="/recipes/new"
            className="text-sm px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
          >
            + 新增
          </Link>
        </div>
        <SearchBar value={search} onChange={setSearch} />
        <CategoryFilter selected={category} onChange={setCategory} />
        {loading ? (
          <p className="text-sm text-gray-400 text-center py-10">加载中…</p>
        ) : recipes.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-10">还没有菜谱，点右上角新增一个吧</p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {recipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}