import { useEffect, useMemo, useState } from 'react'

const API_BASE = 'https://recommendation-backend-alle.onrender.com'
const SEATS = [2, 3, 5, 7]
const BODY_TYPES = ['Hatchback', 'Sedan', 'SUV', 'MUV']
const FIRST_VISIT_KEY = 'carsdekho-recommendation-seen'

const defaultFilters = {
  minPrice: 4,
  maxPrice: 30,
  minMileage: 10,
  maxMileage: 30,
  seatingCapacity: '',
  transmission: '',
  minSafetyRating: '',
}

const defaultPreferences = {
  maxBudget: 12,
  minMileage: 18,
  minSafetyRating: 3,
  transmission: 'Automatic',
  bodyTypes: ['Hatchback', 'SUV'],
  seatingCapacity: 5,
}

function App() {
  const [filters, setFilters] = useState(defaultFilters)
  const [cars, setCars] = useState([])
  const [carsMeta, setCarsMeta] = useState(null)
  const [carsStatus, setCarsStatus] = useState('loading')
  const [carsError, setCarsError] = useState('')
  const [selectedCar, setSelectedCar] = useState(null)
  const [detailsStatus, setDetailsStatus] = useState('idle')
  const [preferences, setPreferences] = useState(defaultPreferences)
  const [recommendations, setRecommendations] = useState([])
  const [recommendationStatus, setRecommendationStatus] = useState('idle')
  const [recommendationMessage, setRecommendationMessage] = useState('')
  const [recommendationOpen, setRecommendationOpen] = useState(
    () => !localStorage.getItem(FIRST_VISIT_KEY),
  )

  useEffect(() => {
    if (recommendationOpen) {
      localStorage.setItem(FIRST_VISIT_KEY, 'true')
    }
  }, [recommendationOpen])

  useEffect(() => {
    const controller = new AbortController()

    async function fetchCars() {
      setCarsStatus('loading')
      setCarsError('')

      const params = new URLSearchParams({ page: '0', size: '20' })
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          params.set(key, value)
        }
      })

      try {
        const response = await fetch(`${API_BASE}/cars?${params.toString()}`, {
          signal: controller.signal,
        })
        if (!response.ok) throw new Error('Could not load cars')
        const data = await response.json()
        setCars(Array.isArray(data.cars) ? data.cars : [])
        setCarsMeta(data)
        setCarsStatus('success')
      } catch (error) {
        if (error.name !== 'AbortError') {
          setCarsError('The garage is taking a moment to respond. Try again.')
          setCarsStatus('error')
        }
      }
    }

    fetchCars()
    return () => controller.abort()
  }, [filters])

  const topRecommendations = useMemo(
    () => recommendations.slice(0, 3),
    [recommendations],
  )

  function updateFilter(key, value) {
    setFilters((current) => ({ ...current, [key]: value }))
  }

  function updatePreference(key, value) {
    setPreferences((current) => ({ ...current, [key]: value }))
  }

  function toggleBodyType(bodyType) {
    setPreferences((current) => {
      const exists = current.bodyTypes.includes(bodyType)
      return {
        ...current,
        bodyTypes: exists
          ? current.bodyTypes.filter((item) => item !== bodyType)
          : [...current.bodyTypes, bodyType],
      }
    })
  }

  async function openCarDetails(carId) {
    setDetailsStatus('loading')
    setSelectedCar(null)

    try {
      const response = await fetch(`${API_BASE}/car?carId=${carId}`)
      if (!response.ok) throw new Error('Could not load car details')
      const data = await response.json()
      setSelectedCar(data)
      setDetailsStatus('success')
    } catch {
      setDetailsStatus('error')
    }
  }

  async function submitRecommendations(event) {
    event.preventDefault()
    setRecommendationStatus('loading')
    setRecommendationMessage('')

    const body = {
      maxBudget: Number(preferences.maxBudget),
      minMileage: Number(preferences.minMileage),
      minSafetyRating: Number(preferences.minSafetyRating),
      transmission: preferences.transmission || null,
      bodyTypes: preferences.bodyTypes,
      seatingCapacity: Number(preferences.seatingCapacity),
    }

    try {
      const response = await fetch(`${API_BASE}/recommendation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!response.ok) throw new Error('Could not get recommendations')
      const data = await response.json()
      setRecommendations(Array.isArray(data.recommendations) ? data.recommendations : [])
      setRecommendationMessage(data.message || 'Here are your strongest matches.')
      setRecommendationStatus('success')
    } catch {
      setRecommendationMessage('Recommendations are unavailable right now. Please try again.')
      setRecommendationStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f7f4]">
      <header className="sticky top-0 z-20 border-b border-stone-200 bg-[#f7f7f4]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Logo />
          <button
            type="button"
            onClick={() => setRecommendationOpen(true)}
            className="rounded-md bg-[#e02b28] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#c62220] focus:outline-none focus:ring-2 focus:ring-[#e02b28] focus:ring-offset-2"
          >
            Find my car
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="grid gap-5 lg:grid-cols-[360px_1fr]">
          <aside className="h-fit rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#e02b28]">
                Smart filters
              </p>
              <h1 className="mt-2 text-2xl font-semibold text-stone-950">
                Compare cars without the noise
              </h1>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                Tune the basics and shortlist cars that fit your budget, safety, space, and daily drive.
              </p>
            </div>
            <Filters filters={filters} updateFilter={updateFilter} />
          </aside>

          <section className="min-w-0">
            <RecommendationStrip
              status={recommendationStatus}
              message={recommendationMessage}
              recommendations={topRecommendations}
              onOpenForm={() => setRecommendationOpen(true)}
              onOpenCar={openCarDetails}
            />

            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-medium text-stone-500">
                  {carsMeta?.totalCars ?? cars.length} cars available
                </p>
                <h2 className="text-2xl font-semibold text-stone-950">Browse inventory</h2>
              </div>
              <button
                type="button"
                onClick={() => setFilters(defaultFilters)}
                className="w-fit rounded-md border border-stone-300 bg-white px-3 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-400 hover:bg-stone-50"
              >
                Reset filters
              </button>
            </div>

            <CarGrid
              cars={cars}
              status={carsStatus}
              error={carsError}
              onOpenCar={openCarDetails}
            />
          </section>
        </section>
      </main>

      {recommendationOpen && (
        <RecommendationDialog
          preferences={preferences}
          status={recommendationStatus}
          message={recommendationMessage}
          recommendations={topRecommendations}
          updatePreference={updatePreference}
          toggleBodyType={toggleBodyType}
          onSubmit={submitRecommendations}
          onClose={() => setRecommendationOpen(false)}
          onOpenCar={openCarDetails}
        />
      )}

      {(detailsStatus === 'loading' || detailsStatus === 'error' || selectedCar) && (
        <CarDetailsDialog
          car={selectedCar}
          status={detailsStatus}
          onClose={() => {
            setSelectedCar(null)
            setDetailsStatus('idle')
          }}
        />
      )}
    </div>
  )
}

function Logo() {
  return (
    <img src="/carsdekho-logo.svg" alt="CarsDekho" className="h-11 w-auto" />
  )
}

function Filters({ filters, updateFilter }) {
  return (
    <div className="space-y-5">
      <RangePair
        label="Budget"
        minLabel="Min lakh"
        maxLabel="Max lakh"
        minValue={filters.minPrice}
        maxValue={filters.maxPrice}
        onMinChange={(value) => updateFilter('minPrice', value)}
        onMaxChange={(value) => updateFilter('maxPrice', value)}
      />

      <RangePair
        label="Mileage"
        minLabel="Min km/l"
        maxLabel="Max km/l"
        minValue={filters.minMileage}
        maxValue={filters.maxMileage}
        onMinChange={(value) => updateFilter('minMileage', value)}
        onMaxChange={(value) => updateFilter('maxMileage', value)}
      />

      <div>
        <label className="text-sm font-semibold text-stone-800">Seating capacity</label>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {SEATS.map((seat) => (
            <button
              key={seat}
              type="button"
              onClick={() =>
                updateFilter('seatingCapacity', filters.seatingCapacity === seat ? '' : seat)
              }
              className={`h-10 rounded-md border text-sm font-semibold transition ${
                filters.seatingCapacity === seat
                  ? 'border-[#e02b28] bg-[#fff1f1] text-[#b91c1c]'
                  : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
              }`}
            >
              {seat}
            </button>
          ))}
        </div>
      </div>

      <Field label="Transmission">
        <select
          value={filters.transmission}
          onChange={(event) => updateFilter('transmission', event.target.value)}
          className="h-11 w-full rounded-md border border-stone-300 bg-white px-3 text-sm outline-none transition focus:border-[#e02b28] focus:ring-2 focus:ring-[#e02b28]/20"
        >
          <option value="">Any transmission</option>
          <option value="Automatic">Automatic</option>
          <option value="Manual">Manual</option>
        </select>
      </Field>

      <div>
        <label className="text-sm font-semibold text-stone-800">Minimum safety rating</label>
        <div className="mt-2 grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() =>
                updateFilter('minSafetyRating', filters.minSafetyRating === rating ? '' : rating)
              }
              className={`h-10 rounded-md border text-sm font-semibold transition ${
                filters.minSafetyRating === rating
                  ? 'border-[#e02b28] bg-[#fff1f1] text-[#b91c1c]'
                  : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
              }`}
            >
              {rating}*
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function RangePair({ label, minLabel, maxLabel, minValue, maxValue, onMinChange, onMaxChange }) {
  return (
    <div>
      <label className="text-sm font-semibold text-stone-800">{label}</label>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <NumberInput label={minLabel} value={minValue} onChange={onMinChange} />
        <NumberInput label={maxLabel} value={maxValue} onChange={onMaxChange} />
      </div>
    </div>
  )
}

function NumberInput({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-stone-500">{label}</span>
      <input
        type="number"
        value={value}
        min="0"
        step="0.5"
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-md border border-stone-300 bg-white px-3 text-sm outline-none transition focus:border-[#e02b28] focus:ring-2 focus:ring-[#e02b28]/20"
      />
    </label>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-stone-800">{label}</span>
      {children}
    </label>
  )
}

function RecommendationStrip({ status, message, recommendations, onOpenForm, onOpenCar }) {
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

function MiniRecommendation({ item, onOpenCar }) {
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

function CarGrid({ cars, status, error, onOpenCar }) {
  if (status === 'loading') {
    return (
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-72 animate-pulse rounded-lg bg-white shadow-sm" />
        ))}
      </div>
    )
  }

  if (status === 'error') {
    return <p className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</p>
  }

  if (!cars.length) {
    return (
      <div className="mt-4 rounded-lg border border-dashed border-stone-300 bg-white p-8 text-center">
        <p className="text-lg font-semibold text-stone-950">No cars match these filters.</p>
        <p className="mt-1 text-sm text-stone-500">Loosen the budget, mileage, or safety rating.</p>
      </div>
    )
  }

  return (
    <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cars.map((car) => (
        <CarCard key={car.id} car={car} onOpenCar={onOpenCar} />
      ))}
    </div>
  )
}

function CarCard({ car, onOpenCar }) {
  return (
    <button
      type="button"
      onClick={() => onOpenCar(car.id)}
      className="group overflow-hidden rounded-lg border border-stone-200 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:border-stone-300 hover:shadow-md"
    >
      <CarImage car={car} />
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
              {car.brand}
            </p>
            <h3 className="mt-1 text-lg font-semibold text-stone-950">{car.name}</h3>
          </div>
          <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-bold text-stone-700">
            {car.safetyRating}*
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <Metric label="Price" value={`Rs ${car.prices}L`} />
          <Metric label="Mileage" value={`${car.mileage} km/l`} />
          <Metric label="Gearbox" value={car.transmission} />
          <Metric label="Seats" value={car.seatingCapacity} />
        </div>
      </div>
    </button>
  )
}

function CarImage({ car }) {
  const [imageIndex, setImageIndex] = useState(0)
  const imageFormats = ['jpg', 'png', 'webp', 'jpeg']
  const imageSrc =
    imageIndex < imageFormats.length ? `/car-images/${car.id}.${imageFormats[imageIndex]}` : ''

  return (
    <div className="relative h-36 overflow-hidden bg-[#eef3f3]">
      {imageSrc && (
        <img
          src={imageSrc}
          alt={`${car.brand} ${car.name}`}
          className="h-full w-full object-cover"
          onError={() => setImageIndex((current) => current + 1)}
        />
      )}
      {!imageSrc && (
        <div className="absolute inset-0 grid place-items-center">
          <div className="relative h-20 w-56 max-w-[82%] rounded-full bg-[#dfe8e6]">
            <div className="absolute left-10 top-2 h-14 w-28 rounded-t-[3rem] bg-[#b8c9c5]" />
            <div className="absolute bottom-1 left-7 h-8 w-8 rounded-full border-[7px] border-stone-800 bg-stone-500" />
            <div className="absolute bottom-1 right-7 h-8 w-8 rounded-full border-[7px] border-stone-800 bg-stone-500" />
          </div>
        </div>
      )}
      <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-stone-700">
        {car.bodyType}
      </span>
    </div>
  )
}

function Metric({ label, value }) {
  return (
    <div className="rounded-md bg-stone-50 p-2">
      <p className="text-xs text-stone-500">{label}</p>
      <p className="mt-0.5 truncate text-sm font-semibold text-stone-900">{value}</p>
    </div>
  )
}

function RecommendationDialog({
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

function RecommendationCard({ item, rank, onOpenCar }) {
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

function ReasonList({ title, items = [], tone }) {
  const isGood = tone === 'good'
  return (
    <div className="rounded-md bg-stone-50 p-3">
      <p className="text-sm font-semibold text-stone-900">{title}</p>
      <ul className="mt-2 space-y-2">
        {(items.length ? items : ['No major tradeoffs found']).map((item) => (
          <li key={item} className="flex gap-2 text-sm text-stone-700">
            <span className={isGood ? 'font-bold text-emerald-600' : 'font-bold text-red-600'}>
              {isGood ? '✓' : '×'}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function CarDetailsDialog({ car, status, onClose }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-stone-950/45 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
          <h2 className="text-xl font-semibold text-stone-950">Car details</h2>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-md border border-stone-300 text-xl leading-none text-stone-700 transition hover:bg-stone-50"
            aria-label="Close car details"
          >
            x
          </button>
        </div>

        {status === 'loading' && <div className="h-80 animate-pulse bg-stone-100" />}
        {status === 'error' && (
          <p className="m-5 rounded-md bg-red-50 p-4 text-sm text-red-700">
            Could not load this car. Please try another one.
          </p>
        )}
        {car && (
          <div>
            <CarImage car={car} />
            <div className="p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#e02b28]">
                {car.brand}
              </p>
              <h3 className="mt-1 text-3xl font-semibold text-stone-950">{car.name}</h3>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Metric label="Price" value={`Rs ${car.prices}L`} />
                <Metric label="Mileage" value={`${car.mileage} km/l`} />
                <Metric label="Safety" value={`${car.safetyRating} stars`} />
                <Metric label="Power" value={`${car.enginePower} bhp`} />
                <Metric label="Body" value={car.bodyType} />
                <Metric label="Transmission" value={car.transmission} />
                <Metric label="Seats" value={car.seatingCapacity} />
                <Metric label="Car ID" value={car.id} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
