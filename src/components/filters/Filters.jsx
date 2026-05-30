import { useState } from 'react'
import { SEATS } from '../../config/app'
import { Field } from '../common'
import { SliderPair } from './SliderPair'

export function Filters({ filters, updateFilter }) {
  return (
    <div className="space-y-5">
      <SliderPair
        label="Budget"
        minLabel="Min lakh"
        maxLabel="Max lakh"
        minValue={filters.minPrice}
        maxValue={filters.maxPrice}
        min={4}
        max={30}
        step={0.5}
        suffix="L"
        onMinChange={(value) => updateFilter('minPrice', value)}
        onMaxChange={(value) => updateFilter('maxPrice', value)}
      />

      <SliderPair
        label="Mileage"
        minLabel="Min km/l"
        maxLabel="Max km/l"
        minValue={filters.minMileage}
        maxValue={filters.maxMileage}
        min={10}
        max={30}
        step={0.5}
        suffix=" km/l"
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

      <SafetyRatingFilter
        value={filters.minSafetyRating}
        onChange={(rating) =>
          updateFilter('minSafetyRating', filters.minSafetyRating === rating ? '' : rating)
        }
      />
    </div>
  )
}

function SafetyRatingFilter({ value, onChange }) {
  const [hoveredRating, setHoveredRating] = useState(null)
  const previewRating = hoveredRating ?? Number(value)

  return (
    <div>
      <label className="text-sm font-semibold text-stone-800">Minimum safety rating</label>
      <div
        className="mt-2 flex rounded-md border border-stone-200 bg-stone-50 p-2"
        onMouseLeave={() => setHoveredRating(null)}
      >
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onMouseEnter={() => setHoveredRating(rating)}
            onFocus={() => setHoveredRating(rating)}
            onBlur={() => setHoveredRating(null)}
            onClick={() => onChange(rating)}
            className="grid h-10 flex-1 place-items-center rounded-md text-2xl leading-none transition hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#e02b28]/20"
            aria-label={`Set minimum safety rating to ${rating} stars`}
          >
            <span
              className={
                previewRating >= rating
                  ? 'text-yellow-400 drop-shadow-sm'
                  : 'text-white drop-shadow-[0_0_1px_rgba(0,0,0,0.7)]'
              }
            >
              {'\u2605'}
            </span>
          </button>
        ))}
      </div>
      <p className="mt-1 text-xs font-medium text-stone-500">
        {value ? `${value} stars and above` : 'Hover to preview, click to apply'}
      </p>
    </div>
  )
}
