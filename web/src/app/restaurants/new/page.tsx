'use client';

import { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useData } from '@/lib/store';
import type { Restaurant } from '@/lib/types';
import Image from "next/image";
import logo from "@/../public/MEDIA/logoAzul.png";
import defaultImage from "@/../public/MEDIA/default.jpg";

type Form = {
    image: string;         // dataURL base64 (o fallback URL si no suben imagen)
    name: string;
    address: string;
    description: string;
};

export default function NewRestaurantPage() {
    const router = useRouter();
    const { addRestaurant } = useData();

    const [form, setForm] = useState<Form>({
        image: '',
        name: '',
        address: '',
        description: '',
    });

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [savedId, setSavedId] = useState<number | null>(null);

    function onImageChange(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 10 * 1024 * 1024) {
            setError('La imagen es demasiado grande. El tamaño máximo permitido es 10 MB.');
            return;
        }
        const reader = new FileReader();
        reader.onload = () => setForm(prev => ({ ...prev, image: String(reader.result || '') }));
        reader.readAsDataURL(file);
    }

    function clearImage() {
        setForm(prev => ({ ...prev, image: '' }));
    }

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            console.log('[new] submit ->', form);

            const created = await addRestaurant({
                image: form.image || defaultImage.src,
                name: form.name,
                address: form.address,
                description: form.description,
                cuisine: 'Mediterranean',
                phone: '+34 600 000 000',
                openingHours: 'Mon-Sun 12–23',
            } as Partial<Restaurant>);

            console.log('[new] created ->', created);

            setSavedId(created.id);
        } catch (e: any) {
            setError(e?.message || 'Error creando restaurante');
            console.error('[new] error ->', e);
        } finally {
            setSaving(false);
        }
    }

    // ÉXITO
    if (savedId && !error) {
        return (
            <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
                <div className="text-center">
                    <div className="text-3xl text-blue-600 mb-4">✺</div>
                    <p className="text-sm text-blue-600 mb-4"><b>Restaurante guardado</b></p>
                    <button
                        className="btn rounded-2xl border border-gray-300 bg-white hover:bg-gray-50"
                        onClick={() => router.push(`/restaurants/${savedId}`)}
                    >
                        Ver restaurante
                    </button>
                    <div className="text-3xl text-blue-600 mt-4">✺</div>
                </div>
            </div>
        );
    }

    // ERROR
    if (error && !savedId) {
        return (
            <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
                <div className="text-center">
                    <div className="text-3xl text-blue-600 mb-4">✺</div>
                    <p className="text-sm text-gray-600 mb-4">{error}</p>
                    <button
                        className="btn rounded-2xl border border-gray-300 bg-white hover:bg-gray-50"
                        onClick={() => setError(null)}
                    >
                        Volver
                    </button>
                </div>
            </div>
        );
    }

    // FORMULARIO
    return (
        <div className="flex flex-col items-center gap-6">
            {/* Estrella arriba */}
            <Image src={logo} alt="estrella" className="w-10 h-10" />

            <div className="grid gap-6 md:grid-cols-2 items-start">
                <div>
                    <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden">
                        {!form.image ? (
                            <label className="absolute inset-0 flex items-center justify-center text-sm text-text-mute cursor-pointer">
                                Añadir imagen
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={onImageChange}
                                />
                            </label>
                        ) : (
                            <>
                                <img
                                    src={form.image}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={clearImage}
                                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border border-white text-white rounded-2xl px-4 py-1 bg-transparent hover:bg-white/20 transition"
                                >
                                    Eliminar
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Formulario */}
                <form onSubmit={submit} className="space-y-3">
                    <div>
                        <label className="label">Nombre del restaurante</label>
                        <input
                            maxLength={40}
                            className="input"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="label">Dirección del restaurante</label>
                        <input
                            minLength={10}
                            maxLength={40}
                            className="input"
                            value={form.address}
                            onChange={(e) => setForm({ ...form, address: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="label">Descripción del restaurante</label>
                        <textarea
                            maxLength={500}
                            className="input min-h-[100px]"
                            value={form.description}
                            onChange={(e) =>
                                setForm({ ...form, description: e.target.value })
                            }
                        />
                    </div>

                    <button className="btn btn-primary" disabled={saving} type="submit">
                        {saving ? "Guardando…" : "Guardar"}
                    </button>
                </form>
            </div>

            <Image src={logo} alt="estrella" className="w-10 h-10" />
        </div>
    );
}