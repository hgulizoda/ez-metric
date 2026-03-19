import type { Employee, PaginatedResponse, EmployeeFilters } from '@/types';
import { MOCK_EMPLOYEES } from './data/employees';

export async function apiGetEmployees(
  filters?: Partial<EmployeeFilters>,
  page = 1,
  pageSize = 10
): Promise<PaginatedResponse<Employee>> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  let filtered = [...MOCK_EMPLOYEES];

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter(
      (e) =>
        e.fullName.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q)
    );
  }

  if (filters?.status && filters.status !== 'all') {
    filtered = filtered.filter((e) => e.status === filters.status);
  }

  if (filters?.department && filters.department !== 'all') {
    filtered = filtered.filter((e) => e.department === filters.department);
  }

  if (filters?.shift && filters.shift !== 'all') {
    filtered = filtered.filter((e) => e.shift === filters.shift);
  }

  if (filters?.role && filters.role !== 'all') {
    filtered = filtered.filter((e) => e.role === filters.role);
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const data = filtered.slice(start, start + pageSize);

  return { data, total, page, pageSize, totalPages };
}

export async function apiGetEmployee(id: string): Promise<Employee> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const emp = MOCK_EMPLOYEES.find((e) => e.id === id);
  if (!emp) throw new Error(`Employee ${id} not found`);
  return emp;
}
