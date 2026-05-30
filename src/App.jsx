import { useEffect, useMemo, useState } from 'react'
import { CarDetailsDialog } from './components/cars/CarDetailsDialog'
import { CarGrid } from './components/cars/CarGrid'
import { Filters } from './components/filters/Filters'
import { Header } from './components/layout/Header'
import { RecommendationDialog } from './components/recommendations/RecommendationDialog'
import { RecommendationStrip } from './components/recommendations/RecommendationStrip'
import {
  DEFAULT_FILTERS,
  DEFAULT_PREFERENCES,
  FIRST_VISIT_KEY,
} from './config/app'
import { getCarDetails, getCars, getRecommendations } from './services/carsApi'

function App() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [cars, setCars] = useState([])
  const [carsMeta, setCarsMeta] = useState(null)
  const [carsStatus, setCarsStatus] = useState('loading')
  const [carsError, setCarsError] = useState('')
  const [selectedCar, setSelectedCar] = useState(null)
  const [detailsStatus, setDetailsStatus] = useState('idle')
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES)
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

      try {
        const data = await getCars(filters, controller.signal)
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
      const data = await getCarDetails(carId)
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

    try {
      const data = await getRecommendations(preferences)
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
      <Header onOpenRecommendations={() => setRecommendationOpen(true)} />

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
                onClick={() => setFilters(DEFAULT_FILTERS)}
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

export default App
