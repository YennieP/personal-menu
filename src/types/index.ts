export type Ingredient = {
  id: string
  name: string
  amount: string | null
  unit: string | null
  isOptional: boolean
  recipeId: string
}

export type Step = {
  id: string
  stepNumber: number
  description: string
  recipeId: string
}

export type Recipe = {
  id: string
  title: string
  description: string | null
  category: string | null
  tags: string[]
  coverImage: string | null
  createdAt: string
  updatedAt: string
  ingredients: Ingredient[]
  steps: Step[]
}

export type CreateRecipeInput = {
  title: string
  description?: string
  category?: string
  tags?: string[]
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