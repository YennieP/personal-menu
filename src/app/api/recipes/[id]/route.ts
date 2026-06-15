import { NextRequest, NextResponse } from 'next/server'
import { RecipeService } from '@/lib/services/recipeService'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const recipe = await RecipeService.getById(id)
  if (!recipe) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(recipe)
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await RecipeService.delete(id)
  return new NextResponse(null, { status: 204 })
}