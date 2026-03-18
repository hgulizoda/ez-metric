import { useState, type ReactNode } from 'react';
import { Sidebar } from '@/components/shared/Sidebar';
import { Topbar } from '@/components/shared/Topbar';
import { useThemeStore } from '@/app/store/themeStore';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { isDark } = useThemeStore();

  return (
    <div className={`flex h-screen overflow-hidden ${isDark ? 'dark' : ''}`}>
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main content area */}
      <div
        className="flex flex-col flex-1 overflow-hidden transition-all duration-300"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        {/* Topbar */}
        <Topbar onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="page-enter">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
