'use client';

import { useEffect, useState } from 'react';
import { Copy, LogOut, Store, UserPlus } from 'lucide-react';
import { createSeller, errorMessage, getSellers, updateSeller } from '@/lib/api';
import { AuthUser, Seller, SellerFormData } from '@/types/seller';

type Props = {
  user: AuthUser;
  onLogout: () => Promise<void>;
};

const emptyForm: SellerFormData = {
  name: '',
  email: '',
  password: '',
  whatsapp: '53',
  slug: '',
};

export default function SuperAdminDashboard({ user, onLogout }: Props) {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [form, setForm] = useState<SellerFormData>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSellers() {
      try {
        setSellers(await getSellers());
      } catch (caught) {
        setError(errorMessage(caught));
      } finally {
        setLoading(false);
      }
    }

    loadSellers();
  }, []);

  function catalogUrl(seller: Seller) {
    return `${window.location.origin}/tienda/${seller.slug}`;
  }

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const seller = await createSeller({ ...form, slug: form.slug || undefined });
      setSellers(current => [seller, ...current]);
      setForm(emptyForm);
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setSaving(false);
    }
  }

  async function toggleSeller(seller: Seller) {
    try {
      const updated = await updateSeller(seller.id, { active: !seller.active });
      setSellers(current => current.map(item => item.id === seller.id ? updated : item));
    } catch (caught) {
      setError(errorMessage(caught));
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-orange-50">
      <header className="bg-gray-900 text-white shadow-lg">
        <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-orange-400">Superadministrador</p>
            <h1 className="text-xl font-bold md:text-2xl">Gestión de vendedores</h1>
            <p className="mt-1 text-xs text-gray-400">{user.email}</p>
          </div>
          <button onClick={onLogout} className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 font-semibold"><LogOut className="h-4 w-4" /> Salir</button>
        </div>
      </header>

      <main className="container mx-auto grid gap-8 px-4 py-8 lg:grid-cols-[380px_1fr]">
        <section className="h-fit rounded-2xl bg-white p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <UserPlus className="h-7 w-7 text-orange-500" />
            <h2 className="text-xl font-bold text-gray-800">Agregar vendedor</h2>
          </div>
          <form onSubmit={handleCreate} className="mt-6 space-y-4">
            <Field label="Nombre del negocio" value={form.name} onChange={name => setForm({ ...form, name })} required />
            <Field label="Correo de acceso" type="email" value={form.email} onChange={email => setForm({ ...form, email })} required />
            <Field label="Contraseña temporal" type="password" value={form.password} onChange={password => setForm({ ...form, password })} minLength={8} required />
            <Field label="WhatsApp con código de país" value={form.whatsapp} onChange={whatsapp => setForm({ ...form, whatsapp })} placeholder="5354157794" required />
            <Field label="Nombre del enlace (opcional)" value={form.slug ?? ''} onChange={slug => setForm({ ...form, slug })} placeholder="ej: cocina-de-ana" />
            <p className="text-xs leading-5 text-gray-500">Si dejas el enlace vacío, Pintury generará uno único automáticamente.</p>
            <button disabled={saving} className="w-full rounded-lg bg-gradient-to-r from-orange-500 to-red-500 py-3 font-bold text-white disabled:opacity-60">{saving ? 'Creando...' : 'Crear vendedor'}</button>
          </form>
        </section>

        <section>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Vendedores</h2>
              <p className="text-sm text-gray-500">{sellers.length} cuenta{sellers.length === 1 ? '' : 's'} registrada{sellers.length === 1 ? '' : 's'}</p>
            </div>
          </div>
          {error && <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>}
          {loading ? <p className="py-16 text-center text-gray-500">Cargando vendedores...</p> : (
            <div className="grid gap-5 md:grid-cols-2">
              {sellers.map(seller => (
                <article key={seller.id} className="rounded-2xl bg-white p-6 shadow-lg">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="rounded-xl bg-orange-100 p-3"><Store className="h-6 w-6 text-orange-600" /></div>
                      <div className="min-w-0"><h3 className="truncate text-lg font-bold text-gray-800">{seller.name}</h3><p className="truncate text-sm text-gray-500">{seller.email}</p></div>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${seller.active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>{seller.active ? 'Activo' : 'Desactivado'}</span>
                  </div>
                  <div className="mt-5 rounded-lg bg-gray-100 p-3 text-sm text-gray-600">
                    <p>WhatsApp: +{seller.whatsapp}</p>
                    <p className="mt-1 truncate">/tienda/{seller.slug}</p>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button onClick={() => navigator.clipboard.writeText(catalogUrl(seller))} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-500 py-2 text-sm font-semibold text-white"><Copy className="h-4 w-4" /> Copiar URL</button>
                    <button onClick={() => toggleSeller(seller)} className={`flex-1 rounded-lg py-2 text-sm font-semibold text-white ${seller.active ? 'bg-gray-500' : 'bg-green-600'}`}>{seller.active ? 'Desactivar' : 'Activar'}</button>
                  </div>
                </article>
              ))}
            </div>
          )}
          {!loading && sellers.length === 0 && <div className="rounded-2xl border-2 border-dashed border-gray-300 py-20 text-center text-gray-500">Crea el primer vendedor para generar su catálogo.</div>}
        </section>
      </main>
    </div>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
};

function Field({ label, value, onChange, type = 'text', placeholder, required, minLength }: FieldProps) {
  return (
    <label className="block text-sm font-medium text-gray-700">
      {label}
      <input
        type={type}
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-blue-950 focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
      />
    </label>
  );
}
