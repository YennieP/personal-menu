import { NextRequest, NextResponse } from 'next/server'
import { RecipeService } from '@/lib/services/recipeService'

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams.get('search') ?? undefined
  const category = req.nextUrl.searchParams.get('category') ?? undefined
  const recipes = await RecipeService.getAll(search, category)
  return NextResponse.json(recipes)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const recipe = await RecipeService.create(body)
  return NextResponse.json(recipe, { status: 201 })
}