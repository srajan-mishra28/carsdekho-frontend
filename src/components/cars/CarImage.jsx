import { useState } from 'react'

const IMAGE_FORMATS = ['jpg', 'png', 'webp', 'jpeg']

export function CarImage({ car }) {
  const [imageIndex, setImageIndex] = useState(0)
  const imageSrc =
    imageIndex < IMAGE_FORMATS.length
      ? `/car-images/${car.id}.${IMAGE_FORMATS[imageIndex]}`
      : ''

  return (
    <div className="relative h-36 overflow-hidden bg-[#eef3f3]">
      {imageSrc && (
        <img
          src={imageSrc}
          alt={`${car.brand} ${car.name}`}
          className="h-full w-full object-cover"
          onError={() => setImageIndex((current) => current + 1)}
        />
      )}
      {!imageSrc && (
        <div className="absolute inset-0 grid place-items-center">
          <div className="relative h-20 w-56 max-w-[82%] rounded-full bg-[#dfe8e6]">
            <div className="absolute left-10 top-2 h-14 w-28 rounded-t-[3rem] bg-[#b8c9c5]" />
            <div className="absolute bottom-1 left-7 h-8 w-8 rounded-full border-[7px] border-stone-800 bg-stone-500" />
            <div className="absolute bottom-1 right-7 h-8 w-8 rounded-full border-[7px] border-stone-800 bg-stone-500" />
          </div>
        </div>
      )}
      <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-stone-700">
        {car.bodyType}
      </span>
    </div>
  )
}
