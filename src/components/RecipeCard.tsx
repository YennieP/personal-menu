import Link from 'next/link'
import type { Recipe } from '@/types'

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Link href={`/recipes/${recipe.id}`}>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-3 cursor-pointer">
        {recipe.coverImage && (
          <img
            src={recipe.coverImage}
            alt={recipe.title}
            className="w-full h-40 object-cover rounded-xl"
          />
        )}
        <div className="flex flex-col gap-1">
          <h2 className="text-base font-medium text-gray-900">{recipe.title}</h2>
          {recipe.description && (
            <p className="text-sm text-gray-400 line-clamp-2">{recipe.description}</p>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5 mt-auto">
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
    </Link>
  )
}