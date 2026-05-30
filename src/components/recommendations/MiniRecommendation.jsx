export function MiniRecommendation({ item, onOpenCar }) {
  return (
    <button
      type="button"
      onClick={() => onOpenCar(item.car.id)}
      className="rounded-md border border-stone-200 bg-stone-50 p-3 text-left transition hover:-translate-y-0.5 hover:border-stone-300 hover:bg-white hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-stone-950">{item.car.name}</p>
          <p className="text-xs text-stone-500">{item.car.brand}</p>
        </div>
        <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-700">
          {item.score}
        </span>
      </div>
      <p className="mt-2 text-xs text-stone-600">{item.matchReasons?.[0] || 'Strong match'}</p>
    </button>
  )
}
