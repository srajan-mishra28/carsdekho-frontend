import { BODY_TYPES, SEATS } from '../../config/app'
import { Field, NumberInput } from '../common'
import { RecommendationCard } from './RecommendationCard'

export function RecommendationDialog({
  preferences,
  status,
  message,
  recommendations,
  updatePreference,
  toggleBodyType,
  onSubmit,
  onClose,
  onOpenCar,
}) {
  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-stone-950/40 px-4 py-6 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-lg bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-stone-200 bg-white px-5 py-4">
          <div>
            <p className="text-sm font-semibold text-[#e02b28]">A quick helper</p>
            <h2 className="text-xl font-semibold text-stone-950">Tell us what matters most.</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-md border border-stone-300 text-xl leading-none text-stone-700 transition hover:bg-stone-50"
            aria-label="Close recommendations"
          >
            x
          </button>
        </div>

        <div className="grid gap-5 p-5 lg:grid-cols-[360px_1fr]">
          <form onSubmit={onSubmit} className="space-y-4">
            <p className="rounded-md bg-stone-50 p-3 text-sm leading-6 text-stone-600">
              No car jargon test here. Give us your non-negotiables and we will show the three cars most worth your time.
            </p>
            <NumberInput
              label="Maximum budget in lakh"
              value={preferences.maxBudget}
              onChange={(value) => updatePreference('maxBudget', value)}
            />
            <NumberInput
              label="Minimum mileage"
              value={preferences.minMileage}
              onChange={(value) => updatePreference('minMileage', value)}
            />
            <NumberInput
              label="Minimum safety rating"
              value={preferences.minSafetyRating}
              onChange={(value) => updatePreference('minSafetyRating', value)}
            />
            <Field label="Transmission">
              <select
                value={preferences.transmission}
                onChange={(event) => updatePreference('transmission', event.target.value)}
                className="h-11 w-full rounded-md border border-stone-300 bg-white px-3 text-sm outline-none transition focus:border-[#e02b28] focus:ring-2 focus:ring-[#e02b28]/20"
              >
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </Field>
            <Field label="Seating capacity">
              <select
                value={preferences.seatingCapacity}
                onChange={(event) => updatePreference('seatingCapacity', event.target.value)}
                className="h-11 w-full rounded-md border border-stone-300 bg-white px-3 text-sm outline-none transition focus:border-[#e02b28] focus:ring-2 focus:ring-[#e02b28]/20"
              >
                {SEATS.map((seat) => (
                  <option key={seat} value={seat}>
                    {seat} seats
                  </option>
                ))}
              </select>
            </Field>
            <div>
              <p className="text-sm font-semibold text-stone-800">Body type</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {BODY_TYPES.map((bodyType) => (
                  <label
                    key={bodyType}
                    className="flex h-10 items-center gap-2 rounded-md border border-stone-200 px-3 text-sm font-medium text-stone-700"
                  >
                    <input
                      type="checkbox"
                      checked={preferences.bodyTypes.includes(bodyType)}
                      onChange={() => toggleBodyType(bodyType)}
                      className="h-4 w-4 accent-[#e02b28]"
                    />
                    {bodyType}
                  </label>
                ))}
              </div>
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="h-11 w-full rounded-md bg-[#e02b28] px-4 text-sm font-semibold text-white transition hover:bg-[#c62220] disabled:cursor-wait disabled:bg-stone-400"
            >
              {status === 'loading' ? 'Building shortlist...' : 'Get my top 3'}
            </button>
          </form>

          <div>
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-stone-950">Your shortlist</h3>
              <p className="text-sm text-stone-500">
                {message || 'Recommendations will appear here after you submit preferences.'}
              </p>
            </div>

            {status === 'loading' && (
              <div className="grid gap-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="h-32 animate-pulse rounded-lg bg-stone-100" />
                ))}
              </div>
            )}

            {status === 'error' && (
              <p className="rounded-md bg-red-50 p-4 text-sm text-red-700">{message}</p>
            )}

            {status !== 'loading' && recommendations.length === 0 && status !== 'error' && (
              <div className="rounded-lg border border-dashed border-stone-300 p-8 text-center">
                <p className="font-semibold text-stone-950">Ready when you are.</p>
                <p className="mt-1 text-sm text-stone-500">The results include reasons to buy and tradeoffs.</p>
              </div>
            )}

            <div className="space-y-3">
              {recommendations.map((item, index) => (
                <RecommendationCard
                  key={item.car.id}
                  item={item}
                  rank={index + 1}
                  onOpenCar={onOpenCar}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
