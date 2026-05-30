import { ReasonList } from './ReasonList'

export function RecommendationCard({ item, rank, onOpenCar }) {
  return (
    <article className="rounded-lg border border-stone-200 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
            Match #{rank}
          </p>
          <h4 className="mt-1 text-lg font-semibold text-stone-950">
            {item.car.brand} {item.car.name}
          </h4>
          <p className="mt-1 text-sm text-stone-500">
            Rs {item.car.prices}L | {item.car.mileage} km/l | {item.car.transmission}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onOpenCar(item.car.id)}
          className="rounded-md bg-stone-950 px-3 py-2 text-sm font-semibold text-white transition hover:bg-stone-800"
        >
          View car
        </button>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <ReasonList title="Reasons to buy" items={item.matchReasons} tone="good" />
        <ReasonList title="Tradeoffs" items={item.tradeoffs} tone="bad" />
      </div>
    </article>
  )
}
