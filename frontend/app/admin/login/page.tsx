'use client';

import SectionCard from '@/components/ui/SectionCard';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setAuthToken } from '@/lib/auth';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('Starting login...', { username });

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const loginUrl = `${apiUrl}/api/admin/login`;

      console.log('Sending request to:', loginUrl);

      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username,
          password,
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Invalid credentials' }));
        console.error('Login error:', errorData);
        const errorMsg = errorData.detail || 'Login failed';
        // Provide more helpful error message
        if (errorMsg.includes('username')) {
          throw new Error('Username not found. Check your username and try again.');
        } else if (errorMsg.includes('password')) {
          throw new Error('Incorrect password. Please check your password and try again.');
        } else {
          throw new Error(errorMsg);
        }
      }

      const data = await response.json();
      console.log('Login successful, received token');

      // Store token using auth library (stores in both cookie and localStorage with expiry)
      setAuthToken(data.access_token, 30); // 30 minutes expiry
      console.log('Token stored with expiry');

      // Redirect to dashboard
      console.log('Redirecting to /admin/dashboard');
      router.push('/admin/dashboard');
    } catch (err: any) {
      console.error('Login failed:', err);
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-black">
      {/* Background animation layer */}
      <div className="absolute inset-0 opacity-30">
        {/* Simple gradient background instead - FloatingBoxes has no anchor prop */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />
      </div>

      <div className="w-full max-w-md px-6 relative z-10">
        <SectionCard className="w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-bold mb-2">Admin Login</h1>
            <p className="text-white/60 text-sm">Enter your credentials to access the dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError(''); // Clear error when typing
                }}
                placeholder="admin@gmail.com"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 transition-colors text-white placeholder:text-white/40"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(''); // Clear error when typing
                }}
                placeholder="Enter password"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 transition-colors text-white placeholder:text-white/40"
                required
              />
            </div>
            
            {/* Helper text for credentials */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-xs text-white/50">
              <p className="font-medium mb-1">Admin Credentials:</p>
              <p>Username: <span className="text-white/70">admin@gmail.com</span></p>
              <p>Password: <span className="text-white/70">cyberdrift</span></p>
            </div>

            {error && (
              <div className="text-red-400 text-sm text-center bg-red-500/10 py-2 rounded">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-white text-black rounded-lg font-bold hover:bg-white/90 transition-transform active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </SectionCard>
      </div>
    </div>
  );
}
