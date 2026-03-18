import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Bell,
  Sun,
  Moon,
  Menu,
  Search,
  ChevronRight,
  Check,
  X,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { useThemeStore } from '@/app/store/themeStore';
import { useNotificationStore } from '@/app/store/notificationStore';
import { useAuth } from '@/services/hooks/useAuth';
import clsx from 'clsx';

interface TopbarProps {
  onMenuClick: () => void;
}

const ROUTE_LABELS: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/analytics': 'Analytics',
  '/employees': 'Employees',
  '/punches': 'Punch Records',
  '/reports': 'Reports',
  '/settings': 'Settings',
  '/profile': 'My Profile',
};

function NotificationIcon({ type }: { type: string }) {
  switch (type) {
    case 'success': return <CheckCircle size={14} className="text-green-400" />;
    case 'error': return <XCircle size={14} className="text-red-400" />;
    case 'warning': return <AlertTriangle size={14} className="text-yellow-400" />;
    default: return <Info size={14} className="text-blue-400" />;
  }
}

function timeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return 'just now';
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const location = useLocation();
  const { isDark, toggleTheme } = useThemeStore();
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } = useNotificationStore();
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  const currentLabel = ROUTE_LABELS[location.pathname] ?? 'Dashboard';
  const pathSegments = location.pathname.split('/').filter(Boolean);

  return (
    <header
      className="flex items-center justify-between px-6 py-3 relative z-40 flex-shrink-0"
      style={{
        backgroundColor: isDark ? '#1a1d2e' : '#ffffff',
        borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}`,
        minHeight: '60px',
      }}
    >
      {/* Left: Menu button + Breadcrumbs */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg hover:bg-white/5 transition-colors text-gray-400 hover:text-white lg:hidden"
        >
          <Menu size={18} />
        </button>

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5">
          <Link
            to="/dashboard"
            className={clsx(
              'text-sm transition-colors',
              isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-700'
            )}
          >
            Home
          </Link>
          {pathSegments.map((seg, idx) => (
            <span key={idx} className="flex items-center gap-1.5">
              <ChevronRight size={12} className="text-gray-600" />
              <span
                className={clsx(
                  'text-sm font-medium capitalize',
                  idx === pathSegments.length - 1
                    ? 'gradient-text'
                    : isDark ? 'text-gray-400' : 'text-gray-600'
                )}
              >
                {ROUTE_LABELS['/' + seg] ?? seg}
              </span>
            </span>
          ))}
        </nav>
      </div>

      {/* Right: Search, theme toggle, notifications, user */}
      <div className="flex items-center gap-2">
        {/* Search button */}
        <button
          className={clsx(
            'p-2 rounded-lg transition-colors',
            isDark
              ? 'text-gray-400 hover:text-white hover:bg-white/5'
              : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
          )}
        >
          <Search size={17} />
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className={clsx(
            'p-2 rounded-lg transition-colors',
            isDark
              ? 'text-gray-400 hover:text-yellow-400 hover:bg-white/5'
              : 'text-gray-500 hover:text-indigo-600 hover:bg-gray-100'
          )}
          title="Toggle theme"
        >
          {isDark ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={clsx(
              'relative p-2 rounded-lg transition-colors',
              isDark
                ? 'text-gray-400 hover:text-white hover:bg-white/5'
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
            )}
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notification dropdown */}
          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowNotifications(false)}
              />
              <div
                className="absolute right-0 top-full mt-2 w-80 rounded-2xl shadow-2xl z-50 overflow-hidden"
                style={{
                  backgroundColor: isDark ? '#1a1d2e' : '#ffffff',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                }}
              >
                <div className="flex items-center justify-between p-4 border-b border-white/5">
                  <h3 className={clsx('font-semibold text-sm', isDark ? 'text-white' : 'text-gray-900')}>
                    Notifications
                    {unreadCount > 0 && (
                      <span className="ml-2 px-1.5 py-0.5 bg-indigo-500/20 text-indigo-300 text-xs rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                      <Check size={12} /> Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-gray-500 text-sm">No notifications</div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={clsx(
                          'flex gap-3 p-3 border-b transition-colors cursor-pointer',
                          isDark ? 'border-white/5 hover:bg-white/5' : 'border-gray-100 hover:bg-gray-50',
                          !notif.read && (isDark ? 'bg-indigo-500/5' : 'bg-indigo-50/50')
                        )}
                        onClick={() => markAsRead(notif.id)}
                      >
                        <div className="mt-0.5 flex-shrink-0">
                          <NotificationIcon type={notif.type} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={clsx('text-xs font-semibold', isDark ? 'text-white' : 'text-gray-900')}>
                            {notif.title}
                          </div>
                          <div className={clsx('text-xs mt-0.5', isDark ? 'text-gray-400' : 'text-gray-500')}>
                            {notif.message}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">{timeAgo(notif.timestamp)}</div>
                        </div>
                        {!notif.read && (
                          <div className="w-2 h-2 bg-indigo-400 rounded-full mt-1 flex-shrink-0" />
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); removeNotification(notif.id); }}
                          className="text-gray-600 hover:text-gray-400 flex-shrink-0"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User chip */}
        <div
          className={clsx(
            'flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl cursor-pointer transition-colors',
            isDark ? 'hover:bg-white/5' : 'hover:bg-gray-100'
          )}
        >
          <div className="w-7 h-7 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-bold">
            {user?.name?.charAt(0).toUpperCase() ?? 'U'}
          </div>
          <span className={clsx('text-sm font-medium hidden md:block', isDark ? 'text-gray-300' : 'text-gray-700')}>
            {user?.name?.split(' ')[0]}
          </span>
        </div>
      </div>
    </header>
  );
}
