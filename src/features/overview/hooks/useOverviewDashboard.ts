import { useCallback, useEffect, useRef, useState } from 'react'

import { getDashboardOverview } from '../api/graphql/dashboardOverview.query'
import { overviewMockData } from '../mock/overview.mock'
import type { OverviewDashboardData } from '../types/overview.types'
import { mapDashboardOverviewSummary } from '../utils/overviewSummary.mapper'

interface UseOverviewDashboardResult {
  data: OverviewDashboardData | null
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export function useOverviewDashboard(): UseOverviewDashboardResult {
  const requestIdRef = useRef(0)
  const abortControllerRef = useRef<AbortController | null>(null)
  const [data, setData] = useState<OverviewDashboardData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadOverview = useCallback((abortController: AbortController, requestId: number) => {
    getDashboardOverview({ signal: abortController.signal })
      .then((summary) => {
        if (abortController.signal.aborted || requestId !== requestIdRef.current) {
          return
        }

        setData(mapDashboardOverviewSummary(summary, overviewMockData))
      })
      .catch((requestError: unknown) => {
        if (abortController.signal.aborted || requestId !== requestIdRef.current) {
          return
        }

        setData(null)
        setError(getErrorMessage(requestError))
      })
      .finally(() => {
        if (abortController.signal.aborted || requestId !== requestIdRef.current) {
          return
        }

        setIsLoading(false)
      })
  }, [])

  const startRequest = useCallback(() => {
    requestIdRef.current += 1
    const requestId = requestIdRef.current

    abortControllerRef.current?.abort()
    const abortController = new AbortController()
    abortControllerRef.current = abortController

    return { abortController, requestId }
  }, [])

  const refetch = useCallback(() => {
    const { abortController, requestId } = startRequest()

    setError(null)
    setIsLoading(true)

    loadOverview(abortController, requestId)
  }, [loadOverview, startRequest])

  useEffect(() => {
    const { abortController, requestId } = startRequest()
    loadOverview(abortController, requestId)

    return () => {
      abortControllerRef.current?.abort()
    }
  }, [loadOverview, startRequest])

  return { data, error, isLoading, refetch }
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return 'Unable to load dashboard overview. Please try again.'
}
