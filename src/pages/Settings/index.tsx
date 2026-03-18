import { useState } from 'react';
import { Building, Clock, CreditCard, Leaf, Shield, Bell, Save } from 'lucide-react';
import { useThemeStore } from '@/app/store/themeStore';
import { notifications } from '@mantine/notifications';
import clsx from 'clsx';

const TABS = [
  { id: 'general', label: 'General', icon: <Building size={15} /> },
  { id: 'datetime', label: 'Date & Time', icon: <Clock size={15} /> },
  { id: 'payroll', label: 'Pay Policy', icon: <CreditCard size={15} /> },
  { id: 'pto', label: 'PTO Codes', icon: <Leaf size={15} /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell size={15} /> },
  { id: 'security', label: 'Security', icon: <Shield size={15} /> },
] as const;

type TabId = (typeof TABS)[number]['id'];

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  hint?: string;
}

function InputField({ label, value, onChange, type = 'text', hint }: InputFieldProps) {
  const { isDark } = useThemeStore();
  return (
    <div>
      <label className={clsx('block text-xs font-medium mb-1.5', isDark ? 'text-gray-400' : 'text-gray-500')}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={clsx(
          'w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all',
          isDark
            ? 'bg-white/5 text-gray-200 border border-white/8 focus:border-indigo-500/50'
            : 'bg-gray-50 text-gray-800 border border-gray-200 focus:border-indigo-400'
        )}
      />
      {hint && <p className={clsx('text-xs mt-1', isDark ? 'text-gray-600' : 'text-gray-400')}>{hint}</p>}
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  hint?: string;
}

function SelectField({ label, value, onChange, options, hint }: SelectFieldProps) {
  const { isDark } = useThemeStore();
  return (
    <div>
      <label className={clsx('block text-xs font-medium mb-1.5', isDark ? 'text-gray-400' : 'text-gray-500')}>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={clsx(
          'w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all',
          isDark
            ? 'bg-white/5 text-gray-200 border border-white/8'
            : 'bg-gray-50 text-gray-800 border border-gray-200'
        )}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {hint && <p className={clsx('text-xs mt-1', isDark ? 'text-gray-600' : 'text-gray-400')}>{hint}</p>}
    </div>
  );
}

interface ToggleFieldProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

function ToggleField({ label, description, checked, onChange }: ToggleFieldProps) {
  const { isDark } = useThemeStore();
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div>
        <div className={clsx('text-sm font-medium', isDark ? 'text-gray-200' : 'text-gray-700')}>{label}</div>
        {description && <div className={clsx('text-xs mt-0.5', isDark ? 'text-gray-500' : 'text-gray-400')}>{description}</div>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={clsx(
          'relative w-10 h-6 rounded-full transition-colors flex-shrink-0',
          checked ? 'bg-indigo-500' : isDark ? 'bg-white/10' : 'bg-gray-200'
        )}
      >
        <span
          className={clsx(
            'absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform',
            checked ? 'left-5' : 'left-1'
          )}
        />
      </button>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  const { isDark } = useThemeStore();
  return (
    <h3 className={clsx('text-sm font-semibold mb-4', isDark ? 'text-gray-200' : 'text-gray-700')}>
      {children}
    </h3>
  );
}

function Divider() {
  const { isDark } = useThemeStore();
  return <div className="my-5" style={{ height: 1, backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }} />;
}

export default function Settings() {
  const { isDark } = useThemeStore();
  const [activeTab, setActiveTab] = useState<TabId>('general');

  // General settings state
  const [companyName, setCompanyName] = useState('EZ Truck Repair LLC');
  const [companyId, setCompanyId] = useState('43732061d');
  const [maxDailyHours, setMaxDailyHours] = useState('24');
  const [showPayRates, setShowPayRates] = useState(true);

  // Date/time state
  const [timezone, setTimezone] = useState('Eastern Time (UTC-05:00)');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [timeFormat, setTimeFormat] = useState('12h');

  // Pay policy state
  const [overtimeAfter, setOvertimeAfter] = useState('40');
  const [payPeriod, setPayPeriod] = useState('weekly');

  // PTO state
  const [ptoVacation, setPtoVacation] = useState(true);
  const [ptoHoliday, setPtoHoliday] = useState(true);
  const [ptoSick, setPtoSick] = useState(true);

  // Notification state
  const [emailMissed, setEmailMissed] = useState(true);
  const [emailOvertime, setEmailOvertime] = useState(true);
  const [emailPeriodEnd, setEmailPeriodEnd] = useState(false);

  // Security state
  const [autoLogout, setAutoLogout] = useState('30');
  const [requirePin, setRequirePin] = useState(false);
  const [allowAppPunch, setAllowAppPunch] = useState(true);

  const handleSave = () => {
    notifications.show({
      title: 'Settings Saved',
      message: 'Your settings have been updated successfully.',
      color: 'green',
    });
  };

  const renderGeneral = () => (
    <div className="space-y-5">
      <SectionTitle>Company Information</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label="Company Name" value={companyName} onChange={setCompanyName} />
        <InputField label="Company ID" value={companyId} onChange={setCompanyId} hint="Assigned by Cloud Biometry. Read-only." />
      </div>
      <Divider />
      <SectionTitle>Work Hours</SectionTitle>
      <div className="max-w-xs">
        <InputField
          label="Max Daily Work Hours"
          value={maxDailyHours}
          onChange={setMaxDailyHours}
          type="number"
          hint="Amount of time from IN to when OUT punch is considered missed."
        />
      </div>
      <Divider />
      <SectionTitle>Display</SectionTitle>
      <div style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
        <ToggleField
          label="Show Pay Rates"
          description="Display hourly pay rates in reports and summaries."
          checked={showPayRates}
          onChange={setShowPayRates}
        />
      </div>
    </div>
  );

  const renderDateTime = () => (
    <div className="space-y-5">
      <SectionTitle>Time Zone & Formats</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField
          label="Timezone"
          value={timezone}
          onChange={setTimezone}
          options={[
            { value: 'Eastern Time (UTC-05:00)', label: 'Eastern Time (UTC-05:00)' },
            { value: 'Central Time (UTC-06:00)', label: 'Central Time (UTC-06:00)' },
            { value: 'Mountain Time (UTC-07:00)', label: 'Mountain Time (UTC-07:00)' },
            { value: 'Pacific Time (UTC-08:00)', label: 'Pacific Time (UTC-08:00)' },
          ]}
        />
        <SelectField
          label="Date Format"
          value={dateFormat}
          onChange={setDateFormat}
          options={[
            { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
            { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
            { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
          ]}
        />
        <SelectField
          label="Time Format"
          value={timeFormat}
          onChange={setTimeFormat}
          options={[
            { value: '12h', label: '12-hour (AM/PM)' },
            { value: '24h', label: '24-hour' },
          ]}
        />
      </div>
    </div>
  );

  const renderPayroll = () => (
    <div className="space-y-5">
      <SectionTitle>Pay Policy — PP1</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          label="Overtime After (hours/week)"
          value={overtimeAfter}
          onChange={setOvertimeAfter}
          type="number"
        />
        <SelectField
          label="Pay Period Type"
          value={payPeriod}
          onChange={setPayPeriod}
          options={[
            { value: 'weekly', label: 'Weekly' },
            { value: 'biweekly', label: 'Bi-weekly' },
            { value: 'monthly', label: 'Monthly' },
          ]}
        />
      </div>
    </div>
  );

  const renderPTO = () => (
    <div className="space-y-4">
      <SectionTitle>PTO Codes</SectionTitle>
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}
      >
        {[
          { label: 'Vacation', value: ptoVacation, set: setPtoVacation, color: '#6366f1' },
          { label: 'Holiday', value: ptoHoliday, set: setPtoHoliday, color: '#10b981' },
          { label: 'Sick', value: ptoSick, set: setPtoSick, color: '#f59e0b' },
        ].map((item, i) => (
          <div
            key={item.label}
            className="flex items-center justify-between px-4 py-3"
            style={{ borderTop: i > 0 ? `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}` : undefined }}
          >
            <div className="flex items-center gap-3">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className={clsx('text-sm', isDark ? 'text-gray-200' : 'text-gray-700')}>{item.label}</span>
            </div>
            <ToggleField label="" checked={item.value} onChange={item.set} />
          </div>
        ))}
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-2">
      <SectionTitle>Email Alerts</SectionTitle>
      <div style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
        <ToggleField
          label="Missed Punches"
          description="Email when employees have missing IN or OUT punches."
          checked={emailMissed}
          onChange={setEmailMissed}
        />
        <ToggleField
          label="Approaching Overtime"
          description="Notify when employees exceed 38 hours in a pay period."
          checked={emailOvertime}
          onChange={setEmailOvertime}
        />
        <ToggleField
          label="Pay Period End Reminder"
          description="Remind managers to review timesheets before period closes."
          checked={emailPeriodEnd}
          onChange={setEmailPeriodEnd}
        />
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-5">
      <SectionTitle>Access & Authentication</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField
          label="Auto-logout After"
          value={autoLogout}
          onChange={setAutoLogout}
          options={[
            { value: '15', label: '15 minutes' },
            { value: '30', label: '30 minutes' },
            { value: '60', label: '1 hour' },
            { value: '0', label: 'Never' },
          ]}
        />
      </div>
      <Divider />
      <SectionTitle>Device Security</SectionTitle>
      <div style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
        <ToggleField
          label="Require PIN for Punch"
          description="Employees must enter PIN in addition to biometric verification."
          checked={requirePin}
          onChange={setRequirePin}
        />
        <ToggleField
          label="Allow App Punch"
          description="Allow employees to punch via mobile app (GPS required)."
          checked={allowAppPunch}
          onChange={setAllowAppPunch}
        />
      </div>
    </div>
  );

  const CONTENT: Record<TabId, React.ReactNode> = {
    general: renderGeneral(),
    datetime: renderDateTime(),
    payroll: renderPayroll(),
    pto: renderPTO(),
    notifications: renderNotifications(),
    security: renderSecurity(),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={clsx('text-2xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>Settings</h1>
        <p className={clsx('text-sm mt-0.5', isDark ? 'text-gray-500' : 'text-gray-400')}>
          Manage company settings and preferences
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Sidebar tabs */}
        <div
          className="lg:w-52 flex-shrink-0 rounded-2xl p-2 h-fit"
          style={{
            backgroundColor: isDark ? 'var(--bg-card)' : '#ffffff',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
          }}
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-0.5',
                activeTab === tab.id
                  ? 'gradient-bg text-white'
                  : isDark
                  ? 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content panel */}
        <div
          className="flex-1 rounded-2xl p-6"
          style={{
            backgroundColor: isDark ? 'var(--bg-card)' : '#ffffff',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
          }}
        >
          {CONTENT[activeTab]}

          {/* Save button */}
          <div className="flex justify-end mt-6 pt-5" style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold gradient-bg text-white hover:opacity-90 transition-opacity shadow-glow"
            >
              <Save size={15} />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
