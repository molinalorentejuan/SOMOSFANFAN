'use client';
import { useEffect, useState } from 'react';
import { useAuth, useData } from '@/lib/store';
import type { Comment, Restaurant } from '@/lib/types';
import Link from 'next/link';

export default function AccountPage() {
    const { user } = useAuth();
    const { getUserComments, getUserRestaurants } = useData();

    const [comments, setComments] = useState<Comment[]>([]);
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) return;
        (async () => {
            setLoading(true);
            try {
                const cs = await getUserComments(user.id);
                setComments(cs);
                const rs = await getUserRestaurants(user.id);
                setRestaurants(rs);
            } catch (e: any) {
                console.error(e);
                setError(e?.message || 'No se pudo cargar la cuenta');
            } finally {
                setLoading(false);
            }
        })();
    }, [user, getUserComments, getUserRestaurants]);

    if (!user) {
        return (
            <div className="card p-6">
                <h1 className="text-2xl font-semibold">Mi cuenta</h1>
                <p className="mt-2 text-sm text-gray-600">Debes iniciar sesión para ver tu cuenta.</p>
            </div>
        );
    }

    if (loading) {
        return <div className="card p-6">Cargando…</div>;
    }

    if (error) {
        return <div className="card p-6 text-red-600">{error}</div>;
    }

    return (
        <div className="card p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Mi cuenta</h1>
                <p className="text-sm opacity-70 mt-2">Información de usuario y actividad.</p>
            </div>

            <section>
                <h2 className="text-lg font-semibold">Datos del usuario</h2>
                <p><strong>Usuario:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email || 'No definido'}</p>
            </section>

            <section>
                <h2 className="text-lg font-semibold">Mis restaurantes</h2>
                {restaurants.length === 0 ? (
                    <p className="text-sm text-gray-500">No has creado restaurantes.</p>
                ) : (
                    <ul className="list-disc ml-5 space-y-1">
                        {restaurants.map(r => (
                            <li key={r.id}>
                                <Link className="underline" href={`/restaurants/${r.id}`}>
                                    {r.name}
                                </Link>{' '}
                                — {r.address}
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
}