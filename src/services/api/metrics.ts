import type {
  DashboardMetrics,
  HoursBarData,
  OvertimeLineData,
  PunchDonutData,
  ActivityEvent,
} from '@/types';

export async function apiGetDashboardMetrics(): Promise<DashboardMetrics> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return {
    totalEmployees: 32,
    activePunches: 0,
    missedPunches: 5,
    hoursThisWeek: 616.92,
    approachingOvertime: 3,
    devicesOnline: 1,
    punchedInCount: 18,
    punchedOutCount: 14,
  };
}

export async function apiGetHoursBarData(): Promise<HoursBarData[]> {
  await new Promise((resolve) => setTimeout(resolve, 700));
  return [
    { job: 'Mechanical Floor', hours: 312.5, regular: 280.0, overtime: 32.5 },
    { job: 'Office', hours: 128.0, regular: 120.0, overtime: 8.0 },
    { job: 'Parts Dept', hours: 96.25, regular: 88.0, overtime: 8.25 },
    { job: 'Management', hours: 80.17, regular: 80.17, overtime: 0 },
    { job: 'Diagnostics', hours: 0, regular: 0, overtime: 0 },
  ];
}

export async function apiGetOvertimeLineData(): Promise<OvertimeLineData[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const now = new Date('2026-03-18');
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - 13 + i);
    const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const hours = 35 + Math.random() * 15;
    const overtime = Math.max(0, hours - 40);
    return {
      date: label,
      hours: parseFloat(hours.toFixed(1)),
      overtime: parseFloat(overtime.toFixed(1)),
      threshold: 40,
    };
  });
}

export async function apiGetPunchDonutData(): Promise<PunchDonutData[]> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return [
    { name: 'Punched In', value: 18, color: '#10b981' },
    { name: 'Punched Out', value: 14, color: '#6366f1' },
  ];
}

export async function apiGetActivityFeed(): Promise<ActivityEvent[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [
    {
      id: 'act-001',
      employeeId: 'emp-003',
      employeeName: 'Garcia, Jesus',
      type: 'IN',
      message: 'Punched IN via biometric device',
      timestamp: new Date('2026-03-18T07:02:14').toISOString(),
      department: 'Mechanical Floor',
    },
    {
      id: 'act-002',
      employeeId: 'emp-005',
      employeeName: 'Lopez, Miguel',
      type: 'IN',
      message: 'Punched IN via biometric device',
      timestamp: new Date('2026-03-18T07:04:33').toISOString(),
      department: 'Mechanical Floor',
    },
    {
      id: 'act-003',
      employeeId: 'emp-006',
      employeeName: 'Retana, Jose',
      type: 'IN',
      message: 'Punched IN via biometric device',
      timestamp: new Date('2026-03-18T07:05:11').toISOString(),
      department: 'Mechanical Floor',
    },
    {
      id: 'act-004',
      employeeId: 'emp-004',
      employeeName: 'Grossi, Bernardo',
      type: 'IN',
      message: 'Punched IN via biometric device',
      timestamp: new Date('2026-03-18T07:08:44').toISOString(),
      department: 'Mechanical Floor',
    },
    {
      id: 'act-005',
      employeeId: 'emp-009',
      employeeName: 'TURDIMURODOV, Oybek',
      type: 'IN',
      message: 'Punched IN via biometric device',
      timestamp: new Date('2026-03-18T07:11:22').toISOString(),
      department: 'Mechanical Floor',
    },
    {
      id: 'act-006',
      employeeId: 'emp-008',
      employeeName: 'abdurahmanov, islomjon',
      type: 'OUT',
      message: 'Punched OUT — 8.5 hrs worked',
      timestamp: new Date('2026-03-18T15:42:07').toISOString(),
      department: 'Mechanical Floor',
    },
    {
      id: 'act-007',
      employeeId: 'emp-007',
      employeeName: 'Khatamov, Zafar',
      type: 'IN',
      message: 'Punched IN via app',
      timestamp: new Date('2026-03-18T08:01:55').toISOString(),
      department: 'Office',
    },
    {
      id: 'act-008',
      employeeId: 'emp-010',
      employeeName: 'Delgado, Josue',
      type: 'OUT',
      message: 'Punched OUT — 9.0 hrs worked (OT: 1.0 hr)',
      timestamp: new Date('2026-03-18T16:05:30').toISOString(),
      department: 'Mechanical Floor',
    },
    {
      id: 'act-009',
      employeeId: 'emp-002',
      employeeName: 'Naranjo, Justin',
      type: 'IN',
      message: 'Punched IN via biometric device',
      timestamp: new Date('2026-03-18T07:00:02').toISOString(),
      department: 'Mechanical Floor',
    },
    {
      id: 'act-010',
      employeeId: 'sys',
      employeeName: 'System',
      type: 'system',
      message: 'Biometric device B-001 came online',
      timestamp: new Date('2026-03-18T07:00:00').toISOString(),
    },
  ];
}
