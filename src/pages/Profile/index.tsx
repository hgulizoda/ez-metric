import { useState } from 'react';
import { Mail, Phone, Building, Shield, Key, Camera, Save, LogOut } from 'lucide-react';
import { useThemeStore } from '@/app/store/themeStore';
import { useAuth } from '@/services/hooks/useAuth';
import { notifications } from '@mantine/notifications';
import clsx from 'clsx';

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  const { isDark } = useThemeStore();
  return (
    <div className="flex items-center gap-3 py-3" style={{ borderBottom: `1px solid rgba(255,255,255,0.04)` }}>
      <div className={clsx('text-gray-500 flex-shrink-0')}>{icon}</div>
      <div className="flex-1 min-w-0">
        <div className={clsx('text-xs', isDark ? 'text-gray-500' : 'text-gray-400')}>{label}</div>
        <div className={clsx('text-sm font-medium mt-0.5', isDark ? 'text-gray-200' : 'text-gray-700')}>{value}</div>
      </div>
    </div>
  );
}

export default function Profile() {
  const { isDark } = useThemeStore();
  const { user, logout } = useAuth();

  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() ?? 'U';

  const handleSaveProfile = () => {
    notifications.show({
      title: 'Profile Updated',
      message: 'Your profile information has been saved.',
      color: 'green',
    });
  };

  const handleChangePassword = () => {
    if (!currentPassword) {
      notifications.show({ title: 'Error', message: 'Enter your current password.', color: 'red' });
      return;
    }
    if (newPassword.length < 8) {
      notifications.show({ title: 'Error', message: 'New password must be at least 8 characters.', color: 'red' });
      return;
    }
    if (newPassword !== confirmPassword) {
      notifications.show({ title: 'Error', message: 'Passwords do not match.', color: 'red' });
      return;
    }
    notifications.show({ title: 'Password Changed', message: 'Your password has been updated.', color: 'green' });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const cardStyle = {
    backgroundColor: isDark ? 'var(--bg-card)' : '#ffffff',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
  };

  const inputClass = clsx(
    'w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all',
    isDark
      ? 'bg-white/5 text-gray-200 border border-white/8 focus:border-indigo-500/50'
      : 'bg-gray-50 text-gray-800 border border-gray-200 focus:border-indigo-400'
  );

  const labelClass = clsx('block text-xs font-medium mb-1.5', isDark ? 'text-gray-400' : 'text-gray-500');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={clsx('text-2xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>My Profile</h1>
        <p className={clsx('text-sm mt-0.5', isDark ? 'text-gray-500' : 'text-gray-400')}>
          Manage your account settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Avatar card */}
        <div className="space-y-4">
          <div className="rounded-2xl p-6 flex flex-col items-center gap-4" style={cardStyle}>
            {/* Avatar */}
            <div className="relative group">
              <div className="w-24 h-24 rounded-full gradient-bg flex items-center justify-center text-white text-3xl font-bold shadow-glow">
                {initials}
              </div>
              <button
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                onClick={() => notifications.show({ title: 'Avatar Upload', message: 'Avatar upload coming soon.', color: 'blue' })}
              >
                <Camera size={14} />
              </button>
            </div>

            {/* Name + role */}
            <div className="text-center">
              <div className={clsx('text-lg font-bold', isDark ? 'text-white' : 'text-gray-900')}>{user?.name}</div>
              <div className="mt-1">
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                  style={
                    user?.role === 'admin'
                      ? { backgroundColor: 'rgba(99,102,241,0.15)', color: '#818cf8' }
                      : { backgroundColor: 'rgba(16,185,129,0.15)', color: '#34d399' }
                  }
                >
                  <Shield size={11} />
                  {user?.role === 'admin' ? 'Administrator' : 'Manager'}
                </span>
              </div>
            </div>

            <div className="w-full">
              <InfoRow icon={<Mail size={14} />} label="Email" value={user?.email ?? ''} />
              <InfoRow icon={<Building size={14} />} label="Department" value={user?.department ?? 'N/A'} />
              <InfoRow icon={<Phone size={14} />} label="Phone" value="(555) 100-0001" />
            </div>

            {/* Logout */}
            <button
              onClick={() => logout()}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 transition-colors mt-2"
              style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}
            >
              <LogOut size={15} />
              Sign Out
            </button>
          </div>

          {/* Activity summary */}
          <div className="rounded-2xl p-5" style={cardStyle}>
            <h3 className={clsx('text-sm font-semibold mb-4', isDark ? 'text-gray-200' : 'text-gray-700')}>
              This Week
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Hours Worked', value: '23.77h', color: '#6366f1' },
                { label: 'Days Present', value: '3 of 5', color: '#10b981' },
                { label: 'Overtime', value: '0h', color: '#f59e0b' },
              ].map((stat) => (
                <div key={stat.label} className="flex justify-between items-center">
                  <span className={clsx('text-xs', isDark ? 'text-gray-400' : 'text-gray-500')}>{stat.label}</span>
                  <span className="text-sm font-semibold" style={{ color: stat.color }}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Edit forms */}
        <div className="lg:col-span-2 space-y-5">
          {/* Edit profile */}
          <div className="rounded-2xl p-6" style={cardStyle}>
            <h3 className={clsx('text-sm font-semibold mb-5', isDark ? 'text-gray-200' : 'text-gray-700')}>
              Profile Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Username</label>
                <input
                  type="text"
                  value={user?.username ?? ''}
                  readOnly
                  className={clsx(inputClass, 'opacity-60 cursor-not-allowed')}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
            <div className="flex justify-end mt-5">
              <button
                onClick={handleSaveProfile}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold gradient-bg text-white hover:opacity-90 transition-opacity"
              >
                <Save size={15} />
                Save Profile
              </button>
            </div>
          </div>

          {/* Change password */}
          <div className="rounded-2xl p-6" style={cardStyle}>
            <div className="flex items-center gap-2 mb-5">
              <Key size={16} className="text-indigo-400" />
              <h3 className={clsx('text-sm font-semibold', isDark ? 'text-gray-200' : 'text-gray-700')}>
                Change Password
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
            {newPassword && (
              <div className="mt-3">
                <div className="flex gap-1.5">
                  {[
                    { check: newPassword.length >= 8, label: '8+ chars' },
                    { check: /[A-Z]/.test(newPassword), label: 'Uppercase' },
                    { check: /[0-9]/.test(newPassword), label: 'Number' },
                  ].map((rule) => (
                    <span
                      key={rule.label}
                      className={clsx(
                        'text-xs px-2 py-0.5 rounded-full',
                        rule.check
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : 'bg-gray-500/10 text-gray-500'
                      )}
                    >
                      {rule.label}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="flex justify-end mt-5">
              <button
                onClick={handleChangePassword}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold gradient-bg text-white hover:opacity-90 transition-opacity"
              >
                <Key size={15} />
                Update Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
