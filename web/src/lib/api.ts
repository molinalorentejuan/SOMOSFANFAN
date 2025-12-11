export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

function ensureAbsolute(path: string) {
    return path.startsWith('/') ? path : '/' + path;
}

export async function api<T>(path: string, opts: RequestInit = {}): Promise<T> {
    if (!API_URL) throw new Error('Falta NEXT_PUBLIC_API_URL');

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const headers = new Headers(opts.headers || {});
    if (opts.body && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }
    if (token) headers.set('Authorization', `Bearer ${token}`);

    const url = `${API_URL}${ensureAbsolute(path)}`;

    console.log('[api] ->', opts.method || 'GET', url);

    try {
        const res = await fetch(url, { ...opts, headers, cache: 'no-store' });

        let payload: any = null;
        const text = await res.text();
        try {
            payload = text ? JSON.parse(text) : null;
        } catch {
            payload = text || null;
        }

        if (!res.ok) {
            let msg = `${res.status} ${res.statusText}`;
            if (payload) {
                if (typeof payload.error === 'string') {
                    msg = payload.error;
                } else if (payload.error?.message) {
                    msg = payload.error.message;
                } else if (payload.message) {
                    msg = payload.message;
                }
            }
            //TOKEN MALO O EXPIRADO
            if (res.status === 401 && typeof window !== 'undefined') {
                localStorage.removeItem('token');
                window.location.href = '/auth';
            }

            const err = new Error(msg) as any;
            err.status = res.status;
            err.payload = payload;
            throw err;
        }

        return payload as T;
    } catch (error: any) {
        // Manejo seguro de errores para evitar problemas con filter
        if (error instanceof Error) {
            throw error;
        }
        // Si el error no es una instancia de Error, crear uno nuevo
        const err = new Error(error?.message || 'Error desconocido') as any;
        if (error?.status) err.status = error.status;
        if (error?.payload) err.payload = error.payload;
        throw err;
    }
}
