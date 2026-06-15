import { prisma } from '@/lib/db/prisma'

export type CreateRecipeInput = {
  title: string
  description?: string
  category?: string
  tags?: string[]
  coverImage?: string
  ingredients: {
    name: string
    amount?: string
    unit?: string
    isOptional?: boolean
  }[]
  steps: {
    stepNumber: number
    description: string
  }[]
}

export const RecipeService = {
  getAll: async (search?: string, category?: string) => {
    return prisma.recipe.findMany({
      where: {
        ...(search && { title: { contains: search, mode: 'insensitive' } }),
        ...(category && { category }),
      },
      include: {
        ingredients: true,
        steps: { orderBy: { stepNumber: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
    })
  },

  getById: async (id: string) => {
    return prisma.recipe.findUnique({
      where: { id },
      include: {
        ingredients: true,
        steps: { orderBy: { stepNumber: 'asc' } },
      },
    })
  },

  create: async (data: CreateRecipeInput) => {
    const { ingredients, steps, ...recipeData } = data
    return prisma.recipe.create({
      data: {
        ...recipeData,
        ingredients: { create: ingredients },
        steps: { create: steps },
      },
      include: {
        ingredients: true,
        steps: { orderBy: { stepNumber: 'asc' } },
      },
    })
  },

  delete: async (id: string) => {
    return prisma.recipe.delete({ where: { id } })
  },
}