'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  clearAdminToken,
  errorMessage,
  hasAdminToken,
  login,
  logout,
  verifyAdminSession,
} from '@/lib/api';
import { AuthUser } from '@/types/seller';
import SellerDashboard from '@/components/admin/SellerDashboard';
import SuperAdminDashboard from '@/components/admin/SuperAdminDashboard';

export default function AdminPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function restoreSession() {
      if (!hasAdminToken()) {
        setLoading(false);
        return;
      }

      try {
        setUser(await verifyAdminSession());
      } catch (caught) {
        clearAdminToken();
        setError(errorMessage(caught));
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, []);

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await login(email, password);
      setUser(response.user);
      setPassword('');
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await logout();
    setUser(null);
    setError(null);
  }

  if (loading && !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl"
        >
          <h1 className="text-2xl font-bold text-gray-800">Panel Administrativo</h1>
          <p className="mt-2 text-gray-500">Acceso para el superadministrador y los vendedores.</p>
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">Correo</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={event => setEmail(event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-blue-950 focus:ring-2 focus:ring-orange-500"
                autoComplete="username"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">Contraseña</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={event => setPassword(event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-blue-950 focus:ring-2 focus:ring-orange-500"
                placeholder="Ingresa tu contraseña"
                autoComplete="current-password"
                required
              />
            </div>
            {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gradient-to-r from-orange-500 to-red-500 py-3 font-bold text-white disabled:opacity-60"
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return user.role === 'super_admin'
    ? <SuperAdminDashboard user={user} onLogout={handleLogout} />
    : <SellerDashboard user={user} onLogout={handleLogout} />;
}
