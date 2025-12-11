'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/store';
import { api } from '@/lib/api';

interface Lead {
    id: string;
    nombre: string;
    email: string;
    telefono: string;
    mensaje: string;
    tipo: string;
    codigo?: string | null;
    descuento?: string | null;
    fecha: string;
}

export default function LeadsAdminPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Redirigir si no está logueado
        if (!user) {
            router.push('/admin/login');
            return;
        }

        fetchLeads();
    }, [user, router]);

    async function fetchLeads() {
        try {
            setLoading(true);
            const data = await api<{ leads: Lead[]; total: number }>('/fanfan/leads');
            // Asegurar que leads sea un array
            setLeads(Array.isArray(data?.leads) ? data.leads : []);
        } catch (err: any) {
            setError(err.message || 'Error cargando leads');
            if (err.status === 401) {
                router.push('/admin/login');
            }
        } finally {
            setLoading(false);
        }
    }

    const handleLogout = () => {
        logout();
        router.push('/admin/login');
    };

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-black text-gray-800">
                                Leads Admin
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                {leads.length} leads totales
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600">
                                {user.email}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                            >
                                Cerrar sesión
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                        <p className="mt-4 text-gray-500">Cargando leads...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                ) : leads.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No hay leads aún</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {Array.isArray(leads) && leads.map((lead) => (
                            <div
                                key={lead.id}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800">
                                            {lead.nombre}
                                        </h3>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {lead.email}
                                        </p>
                                        {lead.telefono && (
                                            <p className="text-sm text-gray-600">
                                                📞 {lead.telefono}
                                            </p>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <span className="inline-block px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-bold">
                                            {lead.tipo}
                                        </span>
                                        {lead.descuento && (
                                            <span className="block mt-2 text-xs text-green-600 font-medium">
                                                {lead.descuento} OFF
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {lead.mensaje && (
                                    <div className="mb-4">
                                        <p className="text-gray-700 text-sm whitespace-pre-wrap">
                                            {lead.mensaje}
                                        </p>
                                    </div>
                                )}

                                <div className="flex justify-between items-center text-xs text-gray-500 border-t pt-4">
                                    <div>
                                        {lead.codigo && (
                                            <span className="bg-gray-100 px-2 py-1 rounded">
                                                Código: {lead.codigo}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        {new Date(lead.fecha).toLocaleString('es-ES', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}


