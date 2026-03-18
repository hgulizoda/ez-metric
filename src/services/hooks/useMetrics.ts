import { useQuery } from '@tanstack/react-query';
import {
  apiGetDashboardMetrics,
  apiGetHoursBarData,
  apiGetOvertimeLineData,
  apiGetPunchDonutData,
  apiGetActivityFeed,
} from '@/services/api';

export function useDashboardMetrics() {
  return useQuery({
    queryKey: ['dashboard', 'metrics'],
    queryFn: apiGetDashboardMetrics,
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });
}

export function useHoursBarData() {
  return useQuery({
    queryKey: ['charts', 'hoursBar'],
    queryFn: apiGetHoursBarData,
    staleTime: 60 * 1000,
  });
}

export function useOvertimeLineData() {
  return useQuery({
    queryKey: ['charts', 'overtimeLine'],
    queryFn: apiGetOvertimeLineData,
    staleTime: 60 * 1000,
  });
}

export function usePunchDonutData() {
  return useQuery({
    queryKey: ['charts', 'punchDonut'],
    queryFn: apiGetPunchDonutData,
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });
}

export function useActivityFeed() {
  return useQuery({
    queryKey: ['activity', 'feed'],
    queryFn: apiGetActivityFeed,
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });
}
