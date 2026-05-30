export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://recommendation-backend-alle.onrender.com'

export const FIRST_VISIT_KEY = 'carsdekho-recommendation-seen'

export const SEATS = [2, 4, 5, 7]

export const BODY_TYPES = ['Hatchback', 'Sedan', 'SUV', 'MPV']

export const DEFAULT_FILTERS = {
  minPrice: 4,
  maxPrice: 30,
  minMileage: 10,
  maxMileage: 30,
  seatingCapacity: '',
  transmission: '',
  minSafetyRating: '',
}

export const DEFAULT_PREFERENCES = {
  maxBudget: 12,
  minMileage: 18,
  minSafetyRating: 3,
  transmission: 'Automatic',
  bodyTypes: ['Hatchback', 'SUV'],
  seatingCapacity: 5,
}
