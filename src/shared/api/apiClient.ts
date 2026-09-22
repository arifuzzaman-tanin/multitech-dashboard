import { appConfig } from '@/app/config/appConfig'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface ApiRequestOptions {
  body?: unknown
  headers?: HeadersInit
  isAuthRequest?: boolean
  method?: HttpMethod
  retryOnUnauthorized?: boolean
  signal?: AbortSignal
}

interface ApiAuthHandlers {
  getAccessToken: () => string | null
  onUnauthorized: () => Promise<string | null>
}

export interface ApiErrorDetails {
  message: string
  status: number
  fieldErrors?: Record<string, string>
}

export class ApiError extends Error {
  status: number
  fieldErrors?: Record<string, string>

  constructor(details: ApiErrorDetails) {
    super(details.message)
    this.name = 'ApiError'
    this.status = details.status
    this.fieldErrors = details.fieldErrors
  }
}

let authHandlers: ApiAuthHandlers | null = null

export function configureApiAuth(handlers: ApiAuthHandlers | null) {
  authHandlers = handlers
}

export async function apiRequest<TResponse>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<TResponse> {
  return sendRequest<TResponse>(path, options, false)
}

async function sendRequest<TResponse>(
  path: string,
  options: ApiRequestOptions,
  hasRetried: boolean,
): Promise<TResponse> {
  const headers = new Headers(options.headers)
  const token = authHandlers?.getAccessToken()

  if (options.body !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  if (!options.isAuthRequest && token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(toApiUrl(path), {
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    credentials: options.isAuthRequest ? 'include' : 'same-origin',
    headers,
    method: options.method ?? 'GET',
    signal: options.signal,
  })

  if (
    response.status === 401
    && !options.isAuthRequest
    && options.retryOnUnauthorized !== false
    && !hasRetried
    && authHandlers
  ) {
    const refreshedToken = await authHandlers.onUnauthorized()

    if (refreshedToken) {
      return sendRequest<TResponse>(path, options, true)
    }
  }

  if (!response.ok) {
    throw await parseApiError(response)
  }

  if (response.status === 204) {
    return undefined as TResponse
  }

  return response.json() as Promise<TResponse>
}

function toApiUrl(path: string) {
  if (!appConfig.apiBaseUrl) {
    return path
  }

  return `${appConfig.apiBaseUrl.replace(/\/$/, '')}${path}`
}

async function parseApiError(response: Response): Promise<ApiError> {
  const fallbackMessage = getFallbackMessage(response.status)

  try {
    const payload = await response.json() as unknown
    const details = extractErrorDetails(payload)

    return new ApiError({
      fieldErrors: details.fieldErrors,
      message: details.message || fallbackMessage,
      status: response.status,
    })
  } catch {
    return new ApiError({ message: fallbackMessage, status: response.status })
  }
}

function extractErrorDetails(payload: unknown): Omit<ApiErrorDetails, 'status'> {
  if (!isRecord(payload)) {
    return { message: '' }
  }

  const fieldErrors = extractFieldErrors(payload.errors)
  const message = getString(payload.detail)
    ?? getString(payload.title)
    ?? getString(payload.message)
    ?? ''

  return { fieldErrors, message }
}

function extractFieldErrors(errors: unknown): Record<string, string> | undefined {
  if (!isRecord(errors)) {
    return undefined
  }

  const fieldErrors: Record<string, string> = {}

  Object.entries(errors).forEach(([key, value]) => {
    if (Array.isArray(value) && typeof value[0] === 'string') {
      fieldErrors[toCamelCase(key)] = value[0]
    } else if (typeof value === 'string') {
      fieldErrors[toCamelCase(key)] = value
    }
  })

  return Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined
}

function getFallbackMessage(status: number) {
  if (status === 400) return 'Review the highlighted fields and try again.'
  if (status === 401) return 'Your session has expired. Sign in again.'
  if (status === 409) return 'An account with these details already exists.'
  if (status === 429) return 'Too many attempts. Please wait and try again.'

  return 'Something went wrong. Please try again.'
}

function getString(value: unknown) {
  return typeof value === 'string' ? value : undefined
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function toCamelCase(value: string) {
  return value.charAt(0).toLowerCase() + value.slice(1)
}
