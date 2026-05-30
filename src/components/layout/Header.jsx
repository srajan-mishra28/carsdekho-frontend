import { Logo } from './Logo'

export function Header({ onOpenRecommendations }) {
  return (
    <header className="sticky top-0 z-20 border-b border-stone-200 bg-[#f7f7f4]/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Logo />
        <button
          type="button"
          onClick={onOpenRecommendations}
          className="rounded-md bg-[#e02b28] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#c62220] focus:outline-none focus:ring-2 focus:ring-[#e02b28] focus:ring-offset-2"
        >
          Find my car
        </button>
      </div>
    </header>
  )
}
