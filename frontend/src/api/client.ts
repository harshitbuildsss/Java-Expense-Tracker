import axios, { AxiosError } from 'axios'

// Never hardcode localhost here - the base URL always comes from Vite env config.
const baseURL = import.meta.env.VITE_API_BASE_URL

if (!baseURL) {
  // Fails loudly at startup rather than silently calling the wrong host.
  console.error(
    'VITE_API_BASE_URL is not set. Copy .env.example to .env and set it to your backend URL.'
  )
}

export const apiClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

/** A normalized, always-a-string error message for any API failure. */
export class ApiError extends Error {
  status?: number
  fieldErrors?: Record<string, string>

  constructor(message: string, status?: number, fieldErrors?: Record<string, string>) {
    super(message)
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

/**
 * Normalizes axios errors into ApiError so every caller can show a sensible
 * message regardless of whether the backend returned a plain string
 * (IllegalArgumentException / NoSuchElementException), a field-error map
 * (@Valid failures), or the request never reached the backend at all.
 */
export function toApiError(err: unknown): ApiError {
  if (axios.isAxiosError(err)) {
    const error = err as AxiosError
    if (!error.response) {
      return new ApiError(
        'Could not reach the server. Make sure the backend is running and reachable.'
      )
    }
    const { status, data } = error.response
    if (typeof data === 'string' && data.trim().length > 0) {
      return new ApiError(data, status)
    }
    if (data && typeof data === 'object') {
      // Field-error map from @Valid failures, e.g. { category: "Category is required" }
      const values = Object.values(data as Record<string, unknown>)
      if (values.every((v) => typeof v === 'string')) {
        const fieldErrors = data as Record<string, string>
        return new ApiError(Object.values(fieldErrors).join(' '), status, fieldErrors)
      }
    }
    return new ApiError(`Request failed (${status ?? 'unknown error'}).`, status)
  }
  return new ApiError('Something went wrong. Please try again.')
}
