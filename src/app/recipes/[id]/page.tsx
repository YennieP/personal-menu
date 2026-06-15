'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { RecipesAPI } from '@/api-client/recipes'
import type { Recipe } from '@/types'

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    RecipesAPI.getById(id).then(data => {
      setRecipe(data)
      setLoading(false)
    })
  }, [id])

  async function handleDelete() {
    if (!confirm('确定删除这个菜谱吗？')) return
    await RecipesAPI.delete(id)
    router.push('/')
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400 text-sm">加载中…</div>
  )
  if (!recipe) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400 text-sm">找不到这个菜谱</div>
  )

  const coreIngredients = recipe.ingredients.filter(i => !i.isOptional)
  const optionalIngredients = recipe.ingredients.filter(i => i.isOptional)

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">← 返回</Link>
          <button onClick={handleDelete} className="text-sm text-red-400 hover:text-red-600 transition-colors">
            删除
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-gray-900">{recipe.title}</h1>
          {recipe.description && <p className="text-sm text-gray-500">{recipe.description}</p>}
          <div className="flex flex-wrap gap-1.5 mt-1">
            {recipe.category && (
              <span className="text-xs px-2.5 py-1 bg-orange-50 text-orange-600 rounded-full font-medium">
                {recipe.category}
              </span>
            )}
            {recipe.tags.map(tag => (
              <span key={tag} className="text-xs px-2.5 py-1 bg-gray-100 text-gray-500 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {recipe.ingredients.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-4">
            <h2 className="text-base font-medium text-gray-900">食材</h2>
            {coreIngredients.length > 0 && (
              <div className="flex flex-col gap-2">
                {coreIngredients.map(ing => (
                  <div key={ing.id} className="flex justify-between text-sm">
                    <span className="text-gray-700">{ing.name}</span>
                    <span className="text-gray-400">{[ing.amount, ing.unit].filter(Boolean).join(' ')}</span>
                  </div>
                ))}
              </div>
            )}
            {optionalIngredients.length > 0 && (
              <div className="flex flex-col gap-2 pt-2 border-t border-gray-50">
                <p className="text-xs text-gray-300">可选食材</p>
                {optionalIngredients.map(ing => (
                  <div key={ing.id} className="flex justify-between text-sm">
                    <span className="text-gray-400">{ing.name}</span>
                    <span className="text-gray-300">{[ing.amount, ing.unit].filter(Boolean).join(' ')}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {recipe.steps.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-4">
            <h2 className="text-base font-medium text-gray-900">步骤</h2>
            <div className="flex flex-col gap-4">
              {recipe.steps.map(step => (
                <div key={step.id} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-600 text-xs flex items-center justify-center font-medium">
                    {step.stepNumber}
                  </span>
                  <p className="text-sm text-gray-700 leading-relaxed pt-0.5">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}