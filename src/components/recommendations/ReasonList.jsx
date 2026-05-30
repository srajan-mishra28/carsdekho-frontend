export function ReasonList({ title, items = [], tone }) {
  const isGood = tone === 'good'

  return (
    <div className="rounded-md bg-stone-50 p-3">
      <p className="text-sm font-semibold text-stone-900">{title}</p>
      <ul className="mt-2 space-y-2">
        {(items.length ? items : ['No major tradeoffs found']).map((item) => (
          <li key={item} className="flex gap-2 text-sm text-stone-700">
            <span className={isGood ? 'font-bold text-emerald-600' : 'font-bold text-red-600'}>
              {isGood ? '\u2713' : '\u00d7'}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
