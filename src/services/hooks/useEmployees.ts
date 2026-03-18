import { useQuery } from '@tanstack/react-query';
import { apiGetEmployees, apiGetEmployee } from '@/services/api';
import type { EmployeeFilters } from '@/types';

export function useEmployees(
  filters?: Partial<EmployeeFilters>,
  page = 1,
  pageSize = 10
) {
  return useQuery({
    queryKey: ['employees', filters, page, pageSize],
    queryFn: () => apiGetEmployees(filters, page, pageSize),
    staleTime: 30 * 1000,
  });
}

export function useEmployee(id: string) {
  return useQuery({
    queryKey: ['employees', id],
    queryFn: () => apiGetEmployee(id),
    enabled: !!id,
    staleTime: 60 * 1000,
  });
}
