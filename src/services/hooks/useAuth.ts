import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { useAuthStore } from '@/app/store/authStore';
import { apiLogin, apiLogout } from '@/services/api';
import type { LoginCredentials } from '@/types';

export function useAuth() {
  const { user, token, isAuthenticated, login, logout, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => apiLogin(credentials),
    onSuccess: (data) => {
      login(data.user, data.token);
      notifications.show({
        title: 'Welcome back!',
        message: `Logged in as ${data.user.name}`,
        color: 'green',
      });
      navigate('/dashboard');
    },
    onError: (error: Error) => {
      notifications.show({
        title: 'Login Failed',
        message: error.message,
        color: 'red',
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => apiLogout(),
    onSuccess: () => {
      logout();
      navigate('/login');
      notifications.show({
        title: 'Logged out',
        message: 'You have been successfully logged out.',
        color: 'blue',
      });
    },
  });

  return {
    user,
    token,
    isAuthenticated,
    isLoading: loginMutation.isPending || isLoading,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    loginError: loginMutation.error,
  };
}
