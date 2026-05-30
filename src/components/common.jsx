export function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-stone-800">{label}</span>
      {children}
    </label>
  )
}

export function NumberInput({ label, value, onChange }) {
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

export function Metric({ label, value }) {
  return (
    <div className="rounded-md bg-stone-50 p-2">
      <p className="text-xs text-stone-500">{label}</p>
      <p className="mt-0.5 truncate text-sm font-semibold text-stone-900">{value}</p>
    </div>
  )
}
