'use client'

const CATEGORIES = ['全部', '猪肉', '牛肉', '鸡肉', '海鲜', '蔬菜', '其他']

type Props = {
  selected: string
  onChange: (category: string) => void
}

export default function CategoryFilter({ selected, onChange }: Props) {
  return (
    <div className="flex gap-2 flex-wrap">
      {CATEGORIES.map(cat => (
        <button
          key={cat}
          onClick={() => onChange(cat === '全部' ? '' : cat)}
          className={`text-sm px-4 py-1.5 rounded-full border transition-colors ${
            (cat === '全部' && !selected) || selected === cat
              ? 'bg-orange-500 text-white border-orange-500'
              : 'bg-white text-gray-500 border-gray-200 hover:border-orange-300'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}