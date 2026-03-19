import type { Punch, PunchFilters, PaginatedResponse } from '@/types';

export const MOCK_PUNCHES: Punch[] = [
  // ── emp-002 Naranjo, Justin ─────────────────────────────────────────
  { id: 'clk-001', employeeId: 'emp-002', employeeName: 'Naranjo, Justin',  department: 'Mechanical Floor', type: 'IN',  timestamp: '2026-03-14T07:02:00Z', date: '03/14/2026', time: '7:02 AM', source: 'Device', isCorrected: false },
  { id: 'clk-002', employeeId: 'emp-002', employeeName: 'Naranjo, Justin',  department: 'Mechanical Floor', type: 'OUT', timestamp: '2026-03-14T15:30:00Z', date: '03/14/2026', time: '3:30 PM', source: 'Device', hoursWorked: 8.47,  isCorrected: false },
  { id: 'clk-003', employeeId: 'emp-002', employeeName: 'Naranjo, Justin',  department: 'Mechanical Floor', type: 'IN',  timestamp: '2026-03-16T07:01:00Z', date: '03/16/2026', time: '7:01 AM', source: 'Device', isCorrected: false },
  { id: 'clk-004', employeeId: 'emp-002', employeeName: 'Naranjo, Justin',  department: 'Mechanical Floor', type: 'OUT', timestamp: '2026-03-16T15:32:00Z', date: '03/16/2026', time: '3:32 PM', source: 'Device', hoursWorked: 8.52,  isCorrected: false },
  { id: 'clk-005', employeeId: 'emp-002', employeeName: 'Naranjo, Justin',  department: 'Mechanical Floor', type: 'IN',  timestamp: '2026-03-17T07:00:00Z', date: '03/17/2026', time: '7:00 AM', source: 'Device', isCorrected: false },
  { id: 'clk-006', employeeId: 'emp-002', employeeName: 'Naranjo, Justin',  department: 'Mechanical Floor', type: 'OUT', timestamp: '2026-03-17T15:00:00Z', date: '03/17/2026', time: '3:00 PM', source: 'Device', hoursWorked: 8.0,   isCorrected: false },
  { id: 'clk-007', employeeId: 'emp-002', employeeName: 'Naranjo, Justin',  department: 'Mechanical Floor', type: 'IN',  timestamp: '2026-03-18T07:00:02Z', date: '03/18/2026', time: '7:00 AM', source: 'Device', isCorrected: false },
  { id: 'clk-008', employeeId: 'emp-002', employeeName: 'Naranjo, Justin',  department: 'Mechanical Floor', type: 'OUT', timestamp: '2026-03-18T16:10:00Z', date: '03/18/2026', time: '4:10 PM', source: 'Device', hoursWorked: 9.17,  isOvertime: true, isCorrected: false },

  // ── emp-003 Garcia, Jesus ───────────────────────────────────────────
  { id: 'clk-009', employeeId: 'emp-003', employeeName: 'Garcia, Jesus',    department: 'Mechanical Floor', type: 'IN',  timestamp: '2026-03-14T07:00:00Z', date: '03/14/2026', time: '7:00 AM', source: 'Device', isCorrected: false },
  { id: 'clk-010', employeeId: 'emp-003', employeeName: 'Garcia, Jesus',    department: 'Mechanical Floor', type: 'OUT', timestamp: '2026-03-14T16:00:00Z', date: '03/14/2026', time: '4:00 PM', source: 'Device', hoursWorked: 9.0,   isOvertime: true, isCorrected: false },
  { id: 'clk-011', employeeId: 'emp-003', employeeName: 'Garcia, Jesus',    department: 'Mechanical Floor', type: 'IN',  timestamp: '2026-03-15T07:05:00Z', date: '03/15/2026', time: '7:05 AM', source: 'Device', isCorrected: false },
  { id: 'clk-012', employeeId: 'emp-003', employeeName: 'Garcia, Jesus',    department: 'Mechanical Floor', type: 'OUT', timestamp: '2026-03-15T15:45:00Z', date: '03/15/2026', time: '3:45 PM', source: 'Manual', hoursWorked: 8.67,  isCorrected: true },
  { id: 'clk-013', employeeId: 'emp-003', employeeName: 'Garcia, Jesus',    department: 'Mechanical Floor', type: 'IN',  timestamp: '2026-03-16T07:00:00Z', date: '03/16/2026', time: '7:00 AM', source: 'Device', isCorrected: false },
  { id: 'clk-014', employeeId: 'emp-003', employeeName: 'Garcia, Jesus',    department: 'Mechanical Floor', type: 'OUT', timestamp: '2026-03-16T16:00:00Z', date: '03/16/2026', time: '4:00 PM', source: 'Device', hoursWorked: 9.0,   isOvertime: true, isCorrected: false },
  { id: 'clk-015', employeeId: 'emp-003', employeeName: 'Garcia, Jesus',    department: 'Mechanical Floor', type: 'IN',  timestamp: '2026-03-17T07:03:00Z', date: '03/17/2026', time: '7:03 AM', source: 'Device', isCorrected: false },
  { id: 'clk-016', employeeId: 'emp-003', employeeName: 'Garcia, Jesus',    department: 'Mechanical Floor', type: 'OUT', timestamp: '2026-03-17T16:00:00Z', date: '03/17/2026', time: '4:00 PM', source: 'Device', hoursWorked: 8.95,  isCorrected: false },
  { id: 'clk-017', employeeId: 'emp-003', employeeName: 'Garcia, Jesus',    department: 'Mechanical Floor', type: 'IN',  timestamp: '2026-03-18T07:02:14Z', date: '03/18/2026', time: '7:02 AM', source: 'Device', isCorrected: false },
  { id: 'clk-018', employeeId: 'emp-003', employeeName: 'Garcia, Jesus',    department: 'Mechanical Floor', type: 'OUT', timestamp: '2026-03-18T16:05:00Z', date: '03/18/2026', time: '4:05 PM', source: 'Device', hoursWorked: 9.05,  isOvertime: true, isCorrected: false },

  // ── emp-007 Khatamov, Zafar ─────────────────────────────────────────
  { id: 'clk-019', employeeId: 'emp-007', employeeName: 'Khatamov, Zafar',  department: 'Office',           type: 'IN',  timestamp: '2026-03-14T08:00:00Z', date: '03/14/2026', time: '8:00 AM', source: 'App',    isCorrected: false },
  { id: 'clk-020', employeeId: 'emp-007', employeeName: 'Khatamov, Zafar',  department: 'Office',           type: 'OUT', timestamp: '2026-03-14T17:00:00Z', date: '03/14/2026', time: '5:00 PM', source: 'App',    hoursWorked: 9.0,   isOvertime: true, isCorrected: false },
  { id: 'clk-021', employeeId: 'emp-007', employeeName: 'Khatamov, Zafar',  department: 'Office',           type: 'IN',  timestamp: '2026-03-16T08:01:55Z', date: '03/16/2026', time: '8:01 AM', source: 'App',    isCorrected: false },
  { id: 'clk-022', employeeId: 'emp-007', employeeName: 'Khatamov, Zafar',  department: 'Office',           type: 'OUT', timestamp: '2026-03-16T17:05:00Z', date: '03/16/2026', time: '5:05 PM', source: 'App',    hoursWorked: 9.05,  isOvertime: true, isCorrected: false },
  { id: 'clk-023', employeeId: 'emp-007', employeeName: 'Khatamov, Zafar',  department: 'Office',           type: 'IN',  timestamp: '2026-03-17T08:15:00Z', date: '03/17/2026', time: '8:15 AM', source: 'Manual', isCorrected: true },
  { id: 'clk-024', employeeId: 'emp-007', employeeName: 'Khatamov, Zafar',  department: 'Office',           type: 'OUT', timestamp: '2026-03-17T17:00:00Z', date: '03/17/2026', time: '5:00 PM', source: 'App',    hoursWorked: 8.75,  isCorrected: false },
  { id: 'clk-025', employeeId: 'emp-007', employeeName: 'Khatamov, Zafar',  department: 'Office',           type: 'IN',  timestamp: '2026-03-18T08:01:55Z', date: '03/18/2026', time: '8:01 AM', source: 'App',    isCorrected: false },
  { id: 'clk-026', employeeId: 'emp-007', employeeName: 'Khatamov, Zafar',  department: 'Office',           type: 'OUT', timestamp: '2026-03-18T17:10:00Z', date: '03/18/2026', time: '5:10 PM', source: 'App',    hoursWorked: 9.13,  isOvertime: true, isCorrected: false },

  // ── emp-006 Retana, Jose ────────────────────────────────────────────
  { id: 'clk-027', employeeId: 'emp-006', employeeName: 'Retana, Jose',     department: 'Mechanical Floor', type: 'IN',  timestamp: '2026-03-14T07:05:00Z', date: '03/14/2026', time: '7:05 AM', source: 'Device', isCorrected: false },
  { id: 'clk-028', employeeId: 'emp-006', employeeName: 'Retana, Jose',     department: 'Mechanical Floor', type: 'OUT', timestamp: '2026-03-14T15:35:00Z', date: '03/14/2026', time: '3:35 PM', source: 'Device', hoursWorked: 8.5,   isCorrected: false },
  { id: 'clk-029', employeeId: 'emp-006', employeeName: 'Retana, Jose',     department: 'Mechanical Floor', type: 'IN',  timestamp: '2026-03-16T07:05:00Z', date: '03/16/2026', time: '7:05 AM', source: 'Device', isCorrected: false },
  { id: 'clk-030', employeeId: 'emp-006', employeeName: 'Retana, Jose',     department: 'Mechanical Floor', type: 'OUT', timestamp: '2026-03-16T15:40:00Z', date: '03/16/2026', time: '3:40 PM', source: 'Device', hoursWorked: 8.58,  isCorrected: false },
  { id: 'clk-031', employeeId: 'emp-006', employeeName: 'Retana, Jose',     department: 'Mechanical Floor', type: 'IN',  timestamp: '2026-03-17T07:10:00Z', date: '03/17/2026', time: '7:10 AM', source: 'Device', isCorrected: false },
  { id: 'clk-032', employeeId: 'emp-006', employeeName: 'Retana, Jose',     department: 'Mechanical Floor', type: 'OUT', timestamp: '2026-03-17T15:50:00Z', date: '03/17/2026', time: '3:50 PM', source: 'Manual', hoursWorked: 8.67,  isCorrected: true },
  { id: 'clk-033', employeeId: 'emp-006', employeeName: 'Retana, Jose',     department: 'Mechanical Floor', type: 'IN',  timestamp: '2026-03-18T07:05:11Z', date: '03/18/2026', time: '7:05 AM', source: 'Device', isCorrected: false },
  { id: 'clk-034', employeeId: 'emp-006', employeeName: 'Retana, Jose',     department: 'Mechanical Floor', type: 'OUT', timestamp: '2026-03-18T16:00:00Z', date: '03/18/2026', time: '4:00 PM', source: 'Device', hoursWorked: 8.92,  isCorrected: false },

  // ── emp-004 Grossi, Bernardo ────────────────────────────────────────
  { id: 'clk-035', employeeId: 'emp-004', employeeName: 'Grossi, Bernardo', department: 'Mechanical Floor', type: 'IN',  timestamp: '2026-03-14T07:03:00Z', date: '03/14/2026', time: '7:03 AM', source: 'Device', isCorrected: false },
  { id: 'clk-036', employeeId: 'emp-004', employeeName: 'Grossi, Bernardo', department: 'Mechanical Floor', type: 'OUT', timestamp: '2026-03-14T15:45:00Z', date: '03/14/2026', time: '3:45 PM', source: 'Device', hoursWorked: 8.7,   isCorrected: false },
  { id: 'clk-037', employeeId: 'emp-004', employeeName: 'Grossi, Bernardo', department: 'Mechanical Floor', type: 'IN',  timestamp: '2026-03-16T07:03:55Z', date: '03/16/2026', time: '7:03 AM', source: 'Device', isCorrected: false },
  { id: 'clk-038', employeeId: 'emp-004', employeeName: 'Grossi, Bernardo', department: 'Mechanical Floor', type: 'OUT', timestamp: '2026-03-16T16:00:12Z', date: '03/16/2026', time: '4:00 PM', source: 'Device', hoursWorked: 8.94,  isCorrected: false },
  { id: 'clk-039', employeeId: 'emp-004', employeeName: 'Grossi, Bernardo', department: 'Mechanical Floor', type: 'IN',  timestamp: '2026-03-17T07:08:00Z', date: '03/17/2026', time: '7:08 AM', source: 'Device', isCorrected: true },
  { id: 'clk-040', employeeId: 'emp-004', employeeName: 'Grossi, Bernardo', department: 'Mechanical Floor', type: 'OUT', timestamp: '2026-03-17T16:00:00Z', date: '03/17/2026', time: '4:00 PM', source: 'Device', hoursWorked: 8.87,  isCorrected: false },
  { id: 'clk-041', employeeId: 'emp-004', employeeName: 'Grossi, Bernardo', department: 'Mechanical Floor', type: 'IN',  timestamp: '2026-03-18T07:03:55Z', date: '03/18/2026', time: '7:03 AM', source: 'Device', isCorrected: false },
  { id: 'clk-042', employeeId: 'emp-004', employeeName: 'Grossi, Bernardo', department: 'Mechanical Floor', type: 'OUT', timestamp: '2026-03-18T16:00:12Z', date: '03/18/2026', time: '4:00 PM', source: 'Device', hoursWorked: 8.94,  isCorrected: false },

  // ── emp-012 Hernandez, Marco ────────────────────────────────────────
  { id: 'clk-043', employeeId: 'emp-012', employeeName: 'Hernandez, Marco', department: 'Parts',            type: 'IN',  timestamp: '2026-03-14T07:30:00Z', date: '03/14/2026', time: '7:30 AM', source: 'Device', isCorrected: false },
  { id: 'clk-044', employeeId: 'emp-012', employeeName: 'Hernandez, Marco', department: 'Parts',            type: 'OUT', timestamp: '2026-03-14T16:30:00Z', date: '03/14/2026', time: '4:30 PM', source: 'Device', hoursWorked: 9.0,   isOvertime: true, isCorrected: false },
  { id: 'clk-045', employeeId: 'emp-012', employeeName: 'Hernandez, Marco', department: 'Parts',            type: 'IN',  timestamp: '2026-03-16T07:30:00Z', date: '03/16/2026', time: '7:30 AM', source: 'Device', isCorrected: false },
  { id: 'clk-046', employeeId: 'emp-012', employeeName: 'Hernandez, Marco', department: 'Parts',            type: 'OUT', timestamp: '2026-03-16T16:00:00Z', date: '03/16/2026', time: '4:00 PM', source: 'Device', hoursWorked: 8.5,   isCorrected: false },
  { id: 'clk-047', employeeId: 'emp-012', employeeName: 'Hernandez, Marco', department: 'Parts',            type: 'IN',  timestamp: '2026-03-18T07:30:00Z', date: '03/18/2026', time: '7:30 AM', source: 'Device', isCorrected: false },
];

export async function apiGetPunches(
  filters?: Partial<PunchFilters>,
  page = 1,
  pageSize = 15
): Promise<PaginatedResponse<Punch>> {
  await new Promise((resolve) => setTimeout(resolve, 400));

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

  if (filters?.corrected !== undefined && filters.corrected !== 'all') {
    filtered = filtered.filter((p) => !!p.isCorrected === filters.corrected);
  }

  filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const data = filtered.slice(start, start + pageSize);

  return { data, total, page, pageSize, totalPages };
}
