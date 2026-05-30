function SliderInput({ label, value, min, max, step, suffix, onChange }) {
  return (
    <label className="block rounded-md border border-stone-200 bg-stone-50 p-3">
      <span className="flex items-center justify-between gap-3 text-xs font-semibold text-stone-600">
        {label}
        <span className="rounded-full bg-white px-2 py-1 text-stone-900 shadow-sm">
          {value}
          {suffix}
        </span>
      </span>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) => onChange(event.target.value)}
        className="mt-3 h-2 w-full cursor-pointer accent-[#e02b28]"
      />
    </label>
  )
}

export function SliderPair({
  label,
  minLabel,
  maxLabel,
  minValue,
  maxValue,
  min,
  max,
  step = 1,
  suffix = '',
  onMinChange,
  onMaxChange,
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-stone-800">{label}</label>
      <div className="mt-2 grid gap-2">
        <SliderInput
          label={minLabel}
          value={minValue}
          min={min}
          max={max}
          step={step}
          suffix={suffix}
          onChange={onMinChange}
        />
        <SliderInput
          label={maxLabel}
          value={maxValue}
          min={min}
          max={max}
          step={step}
          suffix={suffix}
          onChange={onMaxChange}
        />
      </div>
    </div>
  )
}
