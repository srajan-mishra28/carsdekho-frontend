import { API_BASE_URL } from '../config/app'

export async function getCars(filters, signal) {
  const params = new URLSearchParams({ page: '0', size: '20' })

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== '' && value !== null && value !== undefined) {
      params.set(key, value)
    }
  })

  const response = await fetch(`${API_BASE_URL}/cars?${params.toString()}`, {
    signal,
  })

  if (!response.ok) {
    throw new Error('Could not load cars')
  }

  return response.json()
}

export async function getCarDetails(carId) {
  const response = await fetch(`${API_BASE_URL}/car?carId=${carId}`)

  if (!response.ok) {
    throw new Error('Could not load car details')
  }

  return response.json()
}

export async function getRecommendations(preferences) {
  const response = await fetch(`${API_BASE_URL}/recommendation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      maxBudget: Number(preferences.maxBudget),
      minMileage: Number(preferences.minMileage),
      minSafetyRating: Number(preferences.minSafetyRating),
      transmission: preferences.transmission || null,
      bodyTypes: preferences.bodyTypes,
      seatingCapacity: Number(preferences.seatingCapacity),
    }),
  })

  if (!response.ok) {
    throw new Error('Could not get recommendations')
  }

  return response.json()
}
