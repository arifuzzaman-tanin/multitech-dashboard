import { overviewMockData } from '../mock/overview.mock'
import type { OverviewDashboardData } from '../types/overview.types'

interface UseOverviewDashboardResult {
  data: OverviewDashboardData | null
  isLoading: boolean
  error: string | null
}

export function useOverviewDashboard(): UseOverviewDashboardResult {
  return {
    data: overviewMockData,
    error: null,
    isLoading: false,
  }
}
