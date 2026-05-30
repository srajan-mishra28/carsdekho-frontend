import { Metric } from '../common'
import { CarImage } from './CarImage'

export function CarDetailsDialog({ car, status, onClose }) {
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
