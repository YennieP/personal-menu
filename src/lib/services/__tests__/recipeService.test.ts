import { describe, it, expect, vi } from 'vitest'
import { prisma } from '@/lib/db/prisma'
import { RecipeService } from '../recipeService'
import type { DeepMockProxy } from 'vitest-mock-extended'
import type { PrismaClient } from '@prisma/client'

vi.mock('@/lib/db/prisma')

const prismaMock = prisma as DeepMockProxy<PrismaClient>

describe('RecipeService', () => {
  describe('getAll', () => {
    it('返回所有菜谱', async () => {
      const mockRecipes = [
        { id: '1', title: '蒜香排骨', category: '猪肉', tags: [],
          description: null, coverImage: null, createdAt: new Date(),
          updatedAt: new Date(), ingredients: [], steps: [] },
      ]
      prismaMock.recipe.findMany.mockResolvedValue(mockRecipes as any)

      const result = await RecipeService.getAll()
      expect(result).toEqual(mockRecipes)
    })

    it('按关键词搜索', async () => {
      prismaMock.recipe.findMany.mockResolvedValue([])

      await RecipeService.getAll('排骨')

      expect(prismaMock.recipe.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            title: { contains: '排骨', mode: 'insensitive' },
          }),
        })
      )
    })
  })

  describe('getById', () => {
    it('按 id 返回对应菜谱', async () => {
      const mockRecipe = { id: '1', title: '蒜香排骨', ingredients: [], steps: [] }
      prismaMock.recipe.findUnique.mockResolvedValue(mockRecipe as any)

      const result = await RecipeService.getById('1')
      expect(result).toEqual(mockRecipe)
    })

    it('id 不存在时返回 null', async () => {
      prismaMock.recipe.findUnique.mockResolvedValue(null)

      const result = await RecipeService.getById('not-exist')
      expect(result).toBeNull()
    })
  })

  describe('create', () => {
    it('创建菜谱并包含食材和步骤', async () => {
      const input = {
        title: '番茄土豆炖牛肉',
        ingredients: [{ name: '牛肉', amount: '500', unit: 'g', isOptional: false }],
        steps: [{ stepNumber: 1, description: '牛肉焯水' }],
      }
      const mockCreated = { id: '2', tags: [], description: null,
        coverImage: null, category: null, createdAt: new Date(),
        updatedAt: new Date(), ...input }
      prismaMock.recipe.create.mockResolvedValue(mockCreated as any)

      const result = await RecipeService.create(input)
      expect(result.title).toBe('番茄土豆炖牛肉')
    })
  })

  describe('delete', () => {
    it('按 id 删除菜谱', async () => {
      const mockDeleted = { id: '1', title: '蒜香排骨', tags: [],
        description: null, coverImage: null, category: null,
        createdAt: new Date(), updatedAt: new Date() }
      prismaMock.recipe.delete.mockResolvedValue(mockDeleted as any)

      await RecipeService.delete('1')
      expect(prismaMock.recipe.delete).toHaveBeenCalledWith({ where: { id: '1' } })
    })
  })
})