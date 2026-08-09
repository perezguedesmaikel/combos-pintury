import { Combo, ComboFormData } from '@/types/combo';

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080/api/v1')
  .replace(/\/$/, '');
const TOKEN_KEY = 'pintury_admin_token';

type ApiEnvelope<T> = { data: T };

type LoginResponse = {
  token: string;
  token_type: 'Bearer';
  expires_in: number;
  admin: { email: string };
};

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly errors?: Record<string, string[]>,
  ) {
    super(message);
  }
}

function getToken(): string | null {
  return typeof window === 'undefined' ? null : sessionStorage.getItem(TOKEN_KEY);
}

export function hasAdminToken(): boolean {
  return getToken() !== null;
}

export function clearAdminToken(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(TOKEN_KEY);
  }
}

async function request<T>(path: string, init: RequestInit = {}, authenticated = false): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set('Accept', 'application/json');

  if (!(init.body instanceof FormData) && init.body !== undefined) {
    headers.set('Content-Type', 'application/json');
  }

  if (authenticated) {
    const token = getToken();

    if (!token) {
      throw new ApiError('Tu sesión administrativa ha terminado.', 401);
    }

    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
    cache: 'no-store',
  });
  const payload = response.status === 204
    ? null
    : await response.json().catch(() => null) as { message?: string; errors?: Record<string, string[]> } | null;

  if (!response.ok) {
    if (response.status === 401) {
      clearAdminToken();
    }

    throw new ApiError(
      payload?.message ?? 'No se pudo completar la solicitud.',
      response.status,
      payload?.errors,
    );
  }

  return payload as T;
}

function toFormData(values: ComboFormData): FormData {
  const data = new FormData();
  data.set('name', values.name);
  data.set('description', values.description);
  data.set('price', String(values.price));
  data.set('currency', values.currency);
  data.set('category', values.category);
  data.set('available', values.available ? '1' : '0');

  if (values.image) {
    data.set('image', values.image);
  }

  return data;
}

export async function getPublicCombos(): Promise<Combo[]> {
  return (await request<ApiEnvelope<Combo[]>>('/combos')).data;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await request<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  sessionStorage.setItem(TOKEN_KEY, response.token);

  return response;
}

export async function verifyAdminSession(): Promise<void> {
  await request<ApiEnvelope<{ email: string }>>('/auth/me', {}, true);
}

export async function logout(): Promise<void> {
  try {
    if (hasAdminToken()) {
      await request<void>('/auth/logout', { method: 'POST' }, true);
    }
  } catch {
    // El cierre local debe funcionar incluso si Cloud Run no responde.
  } finally {
    clearAdminToken();
  }
}

export async function getAdminCombos(): Promise<Combo[]> {
  return (await request<ApiEnvelope<Combo[]>>('/admin/combos', {}, true)).data;
}

export async function getAdminCombo(id: string): Promise<Combo> {
  return (await request<ApiEnvelope<Combo>>(`/admin/combos/${id}`, {}, true)).data;
}

export async function createCombo(values: ComboFormData): Promise<Combo> {
  return (await request<ApiEnvelope<Combo>>('/admin/combos', {
    method: 'POST',
    body: toFormData(values),
  }, true)).data;
}

export async function updateCombo(id: string, values: ComboFormData): Promise<Combo> {
  const data = toFormData(values);
  data.set('_method', 'PATCH');

  return (await request<ApiEnvelope<Combo>>(`/admin/combos/${id}`, {
    method: 'POST',
    body: data,
  }, true)).data;
}

export async function deleteCombo(id: string): Promise<void> {
  await request<void>(`/admin/combos/${id}`, { method: 'DELETE' }, true);
}

export function errorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    const validationMessage = error.errors ? Object.values(error.errors).flat()[0] : null;

    return validationMessage ?? error.message;
  }

  return 'No se pudo conectar con el servicio. Inténtalo nuevamente.';
}
