'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { RecipesAPI } from '@/api-client/recipes'

const CATEGORIES = ['猪肉', '牛肉', '鸡肉', '海鲜', '蔬菜', '其他']

type IngredientRow = { name: string; amount: string; unit: string; isOptional: boolean }
type StepRow = { description: string }

export default function NewRecipePage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState('')
  const [ingredients, setIngredients] = useState<IngredientRow[]>([
    { name: '', amount: '', unit: '', isOptional: false }
  ])
  const [steps, setSteps] = useState<StepRow[]>([{ description: '' }])
  const [submitting, setSubmitting] = useState(false)

  function updateIngredient(i: number, field: keyof IngredientRow, value: string | boolean) {
    setIngredients(prev => prev.map((ing, idx) => idx === i ? { ...ing, [field]: value } : ing))
  }

  function updateStep(i: number, value: string) {
    setSteps(prev => prev.map((s, idx) => idx === i ? { description: value } : s))
  }

  async function handleSubmit() {
    if (!title.trim()) return alert('请填写菜谱名称')
    setSubmitting(true)
    await RecipesAPI.create({
      title: title.trim(),
      description: description.trim() || undefined,
      category: category || undefined,
      tags: tags.split(/[,，]/).map(t => t.trim()).filter(Boolean),
      ingredients: ingredients
        .filter(i => i.name.trim())
        .map(i => ({
          name: i.name.trim(),
          amount: i.amount.trim() || undefined,
          unit: i.unit.trim() || undefined,
          isOptional: i.isOptional,
        })),
      steps: steps
        .filter(s => s.description.trim())
        .map((s, i) => ({ stepNumber: i + 1, description: s.description.trim() })),
    })
    router.push('/')
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">← 返回</Link>
          <h1 className="text-base font-medium text-gray-900">新增菜谱</h1>
          <div className="w-10" />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-400">菜谱名称 *</label>
            <input value={title} onChange={e => setTitle(e.target.value)}
              placeholder="例：蒜香排骨"
              className="px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-orange-400 transition-colors" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-400">简介（可选）</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)}
              placeholder="简单描述这道菜…" rows={2}
              className="px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-orange-400 transition-colors resize-none" />
          </div>
          <div className="flex gap-3">
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-xs text-gray-400">分类</label>
              <select value={category} onChange={e => setCategory(e.target.value)}
                className="px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-orange-400 bg-white">
                <option value="">无</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-xs text-gray-400">标签（逗号分隔）</label>
              <input value={tags} onChange={e => setTags(e.target.value)}
                placeholder="例：快手, 下饭"
                className="px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-orange-400 transition-colors" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3">
          <h2 className="text-base font-medium text-gray-900">食材</h2>
          {ingredients.map((ing, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input value={ing.name} onChange={e => updateIngredient(i, 'name', e.target.value)}
                placeholder="食材名" className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-orange-400 transition-colors" />
              <input value={ing.amount} onChange={e => updateIngredient(i, 'amount', e.target.value)}
                placeholder="量" className="w-16 px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-orange-400 transition-colors" />
              <input value={ing.unit} onChange={e => updateIngredient(i, 'unit', e.target.value)}
                placeholder="单位" className="w-16 px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-orange-400 transition-colors" />
              <button onClick={() => updateIngredient(i, 'isOptional', !ing.isOptional)}
                className={`text-xs px-2.5 py-1.5 rounded-lg border transition-colors whitespace-nowrap ${ing.isOptional ? 'bg-gray-100 text-gray-400 border-gray-200' : 'bg-white text-gray-300 border-gray-200'}`}>
                {ing.isOptional ? '可选' : '必备'}
              </button>
              {ingredients.length > 1 && (
                <button onClick={() => setIngredients(prev => prev.filter((_, idx) => idx !== i))}
                  className="text-gray-300 hover:text-red-400 text-lg leading-none">×</button>
              )}
            </div>
          ))}
          <button onClick={() => setIngredients(prev => [...prev, { name: '', amount: '', unit: '', isOptional: false }])}
            className="text-sm text-orange-500 hover:text-orange-600 text-left">+ 添加食材</button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3">
          <h2 className="text-base font-medium text-gray-900">步骤</h2>
          {steps.map((step, i) => (
            <div key={i} className="flex gap-2 items-start">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-600 text-xs flex items-center justify-center font-medium mt-2">
                {i + 1}
              </span>
              <textarea value={step.description} onChange={e => updateStep(i, e.target.value)}
                placeholder={`第 ${i + 1} 步…`} rows={2}
                className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-orange-400 transition-colors resize-none" />
              {steps.length > 1 && (
                <button onClick={() => setSteps(prev => prev.filter((_, idx) => idx !== i))}
                  className="text-gray-300 hover:text-red-400 text-lg leading-none mt-2">×</button>
              )}
            </div>
          ))}
          <button onClick={() => setSteps(prev => [...prev, { description: '' }])}
            className="text-sm text-orange-500 hover:text-orange-600 text-left">+ 添加步骤</button>
        </div>

        <button onClick={handleSubmit} disabled={submitting}
          className="w-full py-3 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors disabled:opacity-50">
          {submitting ? '保存中…' : '保存菜谱'}
        </button>
      </div>
    </main>
  )
}