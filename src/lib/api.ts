let accessToken: string | null = null;
let refreshToken: string | null = null;
let loginPromise: Promise<void> | null = null;

const API_BASE = '';

async function ensureAuth(): Promise<string> {
  if (accessToken) return accessToken;

  if (typeof window !== 'undefined') {
    accessToken = sessionStorage.getItem('jk_access');
    refreshToken = sessionStorage.getItem('jk_refresh');
    if (accessToken) return accessToken;
  }

  if (!loginPromise) {
    loginPromise = doLogin();
  }
  await loginPromise;
  loginPromise = null;
  return accessToken!;
}

async function doLogin() {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@jerkaholics.com', password: 'password123' }),
  });
  if (!res.ok) throw new Error('Login failed');
  const data = await res.json();
  accessToken = data.accessToken;
  refreshToken = data.refreshToken;
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('jk_access', accessToken!);
    sessionStorage.setItem('jk_refresh', refreshToken!);
  }
}

async function tryRefresh(): Promise<boolean> {
  if (!refreshToken) return false;
  try {
    const res = await fetch(`${API_BASE}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    accessToken = data.accessToken;
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('jk_access', accessToken!);
    }
    return true;
  } catch {
    return false;
  }
}

export async function apiFetch<T = any>(path: string, options?: RequestInit): Promise<T> {
  let token = await ensureAuth();

  let res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    },
  });

  if (res.status === 401) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          ...options?.headers,
        },
      });
    } else {
      accessToken = null;
      refreshToken = null;
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('jk_access');
        sessionStorage.removeItem('jk_refresh');
      }
      token = await ensureAuth();
      res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          ...options?.headers,
        },
      });
    }
  }

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${await res.text()}`);
  }

  return res.json();
}
