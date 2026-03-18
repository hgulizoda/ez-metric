import type { Punch, PunchFilters, PaginatedResponse } from '@/types';

const MOCK_PUNCHES: Punch[] = [
  // Pay period: 03/14/2026 - 03/20/2026
  { id: 'pch-001', employeeId: 'emp-002', employeeName: 'Naranjo, Justin', department: 'Mechanical Floor', type: 'IN', timestamp: '2026-03-18T07:00:02Z', date: '03/18/2026', time: '7:00 AM', source: 'Device', jobCode: 'MECH', deviceId: 'B-001' },
  { id: 'pch-002', employeeId: 'emp-003', employeeName: 'Garcia, Jesus', department: 'Mechanical Floor', type: 'IN', timestamp: '2026-03-18T07:02:14Z', date: '03/18/2026', time: '7:02 AM', source: 'Device', jobCode: 'MECH', deviceId: 'B-001' },
  { id: 'pch-003', employeeId: 'emp-004', employeeName: 'Grossi, Bernardo', department: 'Mechanical Floor', type: 'IN', timestamp: '2026-03-18T07:03:55Z', date: '03/18/2026', time: '7:03 AM', source: 'Device', jobCode: 'MECH', deviceId: 'B-001' },
  { id: 'pch-004', employeeId: 'emp-005', employeeName: 'Lopez, Miguel', department: 'Mechanical Floor', type: 'IN', timestamp: '2026-03-18T07:04:33Z', date: '03/18/2026', time: '7:04 AM', source: 'Device', jobCode: 'MECH', deviceId: 'B-001' },
  { id: 'pch-005', employeeId: 'emp-006', employeeName: 'Retana, Jose', department: 'Mechanical Floor', type: 'IN', timestamp: '2026-03-18T07:05:11Z', date: '03/18/2026', time: '7:05 AM', source: 'Device', jobCode: 'MECH', deviceId: 'B-001' },
  { id: 'pch-006', employeeId: 'emp-004', employeeName: 'Grossi, Bernardo', department: 'Mechanical Floor', type: 'OUT', timestamp: '2026-03-18T16:00:12Z', date: '03/18/2026', time: '4:00 PM', source: 'Device', jobCode: 'MECH', hoursWorked: 8.94, deviceId: 'B-001' },
  { id: 'pch-007', employeeId: 'emp-008', employeeName: 'abdurahmanov, islomjon', department: 'Mechanical Floor', type: 'OUT', timestamp: '2026-03-18T15:42:07Z', date: '03/18/2026', time: '3:42 PM', source: 'Device', jobCode: 'MECH', hoursWorked: 8.5, deviceId: 'B-001' },
  { id: 'pch-008', employeeId: 'emp-010', employeeName: 'Delgado, Josue', department: 'Mechanical Floor', type: 'OUT', timestamp: '2026-03-18T16:05:30Z', date: '03/18/2026', time: '4:05 PM', source: 'Device', jobCode: 'MECH', hoursWorked: 9.0, isOvertime: true, deviceId: 'B-001' },
  // Monday 03/16
  { id: 'pch-009', employeeId: 'emp-002', employeeName: 'Naranjo, Justin', department: 'Mechanical Floor', type: 'IN', timestamp: '2026-03-16T07:01:00Z', date: '03/16/2026', time: '7:01 AM', source: 'Device', jobCode: 'MECH', deviceId: 'B-001' },
  { id: 'pch-010', employeeId: 'emp-002', employeeName: 'Naranjo, Justin', department: 'Mechanical Floor', type: 'OUT', timestamp: '2026-03-16T15:32:00Z', date: '03/16/2026', time: '3:32 PM', source: 'Device', jobCode: 'MECH', hoursWorked: 8.52, deviceId: 'B-001' },
  { id: 'pch-011', employeeId: 'emp-003', employeeName: 'Garcia, Jesus', department: 'Mechanical Floor', type: 'IN', timestamp: '2026-03-16T07:00:00Z', date: '03/16/2026', time: '7:00 AM', source: 'Device', jobCode: 'MECH', deviceId: 'B-001' },
  { id: 'pch-012', employeeId: 'emp-003', employeeName: 'Garcia, Jesus', department: 'Mechanical Floor', type: 'OUT', timestamp: '2026-03-16T16:00:00Z', date: '03/16/2026', time: '4:00 PM', source: 'Device', jobCode: 'MECH', hoursWorked: 9.0, isOvertime: true, deviceId: 'B-001' },
  // Tuesday 03/17
  { id: 'pch-013', employeeId: 'emp-002', employeeName: 'Naranjo, Justin', department: 'Mechanical Floor', type: 'IN', timestamp: '2026-03-17T07:00:00Z', date: '03/17/2026', time: '7:00 AM', source: 'Device', jobCode: 'MECH', deviceId: 'B-001' },
  { id: 'pch-014', employeeId: 'emp-002', employeeName: 'Naranjo, Justin', department: 'Mechanical Floor', type: 'OUT', timestamp: '2026-03-17T15:00:00Z', date: '03/17/2026', time: '3:00 PM', source: 'Device', jobCode: 'MECH', hoursWorked: 8.0, deviceId: 'B-001' },
  { id: 'pch-015', employeeId: 'emp-007', employeeName: 'Khatamov, Zafar', department: 'Office', type: 'IN', timestamp: '2026-03-18T08:01:55Z', date: '03/18/2026', time: '8:01 AM', source: 'App', jobCode: 'OFFICE', deviceId: '' },
  { id: 'pch-016', employeeId: 'emp-009', employeeName: 'TURDIMURODOV, Oybek', department: 'Mechanical Floor', type: 'IN', timestamp: '2026-03-18T07:11:22Z', date: '03/18/2026', time: '7:11 AM', source: 'Device', jobCode: 'MECH', deviceId: 'B-001' },
  { id: 'pch-017', employeeId: 'emp-012', employeeName: 'Hernandez, Marco', department: 'Parts', type: 'IN', timestamp: '2026-03-18T07:30:00Z', date: '03/18/2026', time: '7:30 AM', source: 'Device', jobCode: 'PARTS', deviceId: 'B-001' },
  { id: 'pch-018', employeeId: 'emp-013', employeeName: 'Torres, David', department: 'Mechanical Floor', type: 'IN', timestamp: '2026-03-18T07:02:44Z', date: '03/18/2026', time: '7:02 AM', source: 'Device', jobCode: 'MECH', deviceId: 'B-001' },
  { id: 'pch-019', employeeId: 'emp-015', employeeName: 'Flores, Ramon', department: 'Mechanical Floor', type: 'IN', timestamp: '2026-03-18T07:15:00Z', date: '03/18/2026', time: '7:15 AM', source: 'Device', jobCode: 'MECH', deviceId: 'B-001' },
  { id: 'pch-020', employeeId: 'emp-016', employeeName: 'Jimenez, Pedro', department: 'Office', type: 'IN', timestamp: '2026-03-18T08:00:00Z', date: '03/18/2026', time: '8:00 AM', source: 'Device', jobCode: 'OFFICE', deviceId: 'B-001' },
];

export async function apiGetPunches(
  filters?: Partial<PunchFilters>,
  page = 1,
  pageSize = 15
): Promise<PaginatedResponse<Punch>> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  let filtered = [...MOCK_PUNCHES];

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.employeeName.toLowerCase().includes(q) ||
        p.department.toLowerCase().includes(q) ||
        p.date.includes(q)
    );
  }

  if (filters?.type && filters.type !== 'all') {
    filtered = filtered.filter((p) => p.type === filters.type);
  }

  if (filters?.department && filters.department !== 'all') {
    filtered = filtered.filter((p) => p.department === filters.department);
  }

  if (filters?.employeeId) {
    filtered = filtered.filter((p) => p.employeeId === filters.employeeId);
  }

  // Sort by timestamp desc
  filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const data = filtered.slice(start, start + pageSize);

  return { data, total, page, pageSize, totalPages };
}
