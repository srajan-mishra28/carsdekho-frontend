import { CarCard } from './CarCard'

export function CarGrid({ cars, status, error, onOpenCar }) {
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
