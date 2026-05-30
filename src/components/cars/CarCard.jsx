import { Metric } from '../common'
import { CarImage } from './CarImage'

export function CarCard({ car, onOpenCar }) {
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
