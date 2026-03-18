import { notifications } from '@mantine/notifications';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

type NotifType = 'success' | 'error' | 'warning' | 'info';

interface ShowNotifOptions {
  title: string;
  message: string;
  type?: NotifType;
}

const TYPE_COLORS: Record<NotifType, string> = {
  success: 'green',
  error: 'red',
  warning: 'orange',
  info: 'blue',
};

const TYPE_ICONS: Record<NotifType, React.ReactNode> = {
  success: <CheckCircle size={16} />,
  error: <XCircle size={16} />,
  warning: <AlertTriangle size={16} />,
  info: <Info size={16} />,
};

export function showNotification({ title, message, type = 'info' }: ShowNotifOptions) {
  notifications.show({
    title,
    message,
    color: TYPE_COLORS[type],
    icon: TYPE_ICONS[type],
    autoClose: 4000,
  });
}

export function showSuccess(title: string, message: string) {
  showNotification({ title, message, type: 'success' });
}

export function showError(title: string, message: string) {
  showNotification({ title, message, type: 'error' });
}

export function showWarning(title: string, message: string) {
  showNotification({ title, message, type: 'warning' });
}

export function showInfo(title: string, message: string) {
  showNotification({ title, message, type: 'info' });
}
