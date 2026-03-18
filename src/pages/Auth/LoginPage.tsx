import { useState } from 'react';
import { Truck, Eye, EyeOff, Lock, User, ArrowRight, Shield } from 'lucide-react';
import { AuthLayout } from '@/layouts/AuthLayout';
import { useAuth } from '@/services/hooks/useAuth';
import clsx from 'clsx';

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!username.trim()) e.username = 'Username is required';
    if (!password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    login({ username: username.trim(), password });
  };

  return (
    <AuthLayout>
      <div className="max-w-md mx-auto">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-bg mb-4 shadow-glow">
            <Truck size={28} className="text-white" />
          </div>
          <h1 className="gradient-text text-3xl font-bold tracking-tight mb-1">EZ METRIC</h1>
          <p className="text-gray-500 text-sm">EZ Truck Repair LLC — Analytics Dashboard</p>
        </div>

        {/* Card */}
        <div
          className="rounded-3xl p-8 shadow-2xl"
          style={{
            background: 'rgba(26, 29, 46, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <h2 className="text-white text-xl font-semibold mb-1">Welcome back</h2>
          <p className="text-gray-500 text-sm mb-7">Sign in to access your dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Username</label>
              <div className="relative">
                <User
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errors.username) setErrors((p) => ({ ...p, username: undefined }));
                  }}
                  placeholder="Enter your username"
                  className={clsx(
                    'w-full pl-10 pr-4 py-3 rounded-xl text-sm bg-white/5 border text-white placeholder-gray-600 outline-none transition-all',
                    errors.username
                      ? 'border-red-500/50 focus:border-red-500'
                      : 'border-white/8 focus:border-indigo-500/60 focus:bg-white/8'
                  )}
                  style={{ borderColor: errors.username ? undefined : 'rgba(255,255,255,0.08)' }}
                  autoComplete="username"
                  autoFocus
                />
              </div>
              {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Password</label>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((p) => ({ ...p, password: undefined }));
                  }}
                  placeholder="Enter your password"
                  className={clsx(
                    'w-full pl-10 pr-10 py-3 rounded-xl text-sm bg-white/5 border text-white placeholder-gray-600 outline-none transition-all',
                    errors.password
                      ? 'border-red-500/50 focus:border-red-500'
                      : 'border-white/8 focus:border-indigo-500/60 focus:bg-white/8'
                  )}
                  style={{ borderColor: errors.password ? undefined : 'rgba(255,255,255,0.08)' }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className={clsx(
                'w-full py-3 px-4 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all mt-6',
                isLoading
                  ? 'opacity-70 cursor-not-allowed'
                  : 'gradient-bg hover:opacity-90 hover:shadow-glow active:scale-[0.99]'
              )}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div
            className="mt-6 p-4 rounded-xl"
            style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Shield size={13} className="text-indigo-400" />
              <span className="text-xs font-medium text-indigo-400">Demo Credentials</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
              <div>
                <span className="text-gray-500">Admin:</span>{' '}
                <span className="font-mono text-gray-300">ash / admin123</span>
              </div>
              <div>
                <span className="text-gray-500">Manager:</span>{' '}
                <span className="font-mono text-gray-300">justin / manager123</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-xs mt-6">
          Powered by Cloud Biometry &bull; EZ Metric v1.0
        </p>
      </div>
    </AuthLayout>
  );
}
