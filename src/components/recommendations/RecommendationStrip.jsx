import { MiniRecommendation } from './MiniRecommendation'

export function RecommendationStrip({
  status,
  message,
  recommendations,
  onOpenForm,
  onOpenCar,
}) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#e02b28]">Recommendation assistant</p>
          <h2 className="mt-1 text-xl font-semibold text-stone-950">
            Start with your needs, then inspect the shortlist.
          </h2>
        </div>
        <button
          type="button"
          onClick={onOpenForm}
          className="rounded-md border border-stone-300 bg-stone-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-800"
        >
          Update preferences
        </button>
      </div>

      {status === 'success' && recommendations.length > 0 && (
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {recommendations.map((item) => (
            <MiniRecommendation key={item.car.id} item={item} onOpenCar={onOpenCar} />
          ))}
        </div>
      )}

      {status === 'error' && (
        <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{message}</p>
      )}
    </section>
  )
}
