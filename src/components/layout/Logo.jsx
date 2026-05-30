export function Logo() {
  return (
    <div className="flex items-center gap-3" aria-label="CarsDekho">
      <div className="relative h-11 w-12 shrink-0 rounded-lg bg-[#e02b28] shadow-sm">
        <div className="absolute left-2.5 top-4 h-3 w-7 rounded-t-full bg-white" />
        <div className="absolute left-4 top-2 h-5 w-4 rounded-t-lg bg-white" />
        <div className="absolute bottom-2 left-2 h-3 w-3 rounded-full border-[3px] border-stone-950 bg-white" />
        <div className="absolute bottom-2 right-2 h-3 w-3 rounded-full border-[3px] border-stone-950 bg-white" />
      </div>
      <div className="leading-none">
        <p className="text-xl font-black tracking-normal text-stone-950">
          Cars<span className="text-[#e02b28]">Dekho</span>
        </p>
        <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-stone-500">
          Shortlist smarter
        </p>
      </div>
    </div>
  )
}
