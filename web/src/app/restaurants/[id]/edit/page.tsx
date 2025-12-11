'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useData } from '@/lib/store';
import type { Restaurant } from '@/lib/types';
import Spinner from '@/components/Spinner';

export default function EditRestaurantPage() {
    const params = useParams();
    const id = Number(params?.id);
    const router = useRouter();

    const { getRestaurant, updateRestaurant } = useData();

    const [r, setR] = useState<Restaurant | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Campos de formulario
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');
    const [cuisine, setCuisine] = useState('');
    const [image, setImage] = useState('');
    const [phone, setPhone] = useState('');
    const [openingHours, setOpeningHours] = useState('');
    const [lat, setLat] = useState<number | ''>('');
    const [lng, setLng] = useState<number | ''>('');

    function onImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setImage(reader.result as string);
        reader.readAsDataURL(file);
    }

    function clearImage() {
        setImage('');
    }

    async function load() {
        const rest = await getRestaurant(id);
        setR(rest);
        setName(rest.name ?? '');
        setAddress(rest.address ?? '');
        setDescription(rest.description ?? '');
        setCuisine(rest.cuisine ?? '');
        setImage(rest.image ?? '');
        setPhone(rest.phone ?? '');
        setOpeningHours(rest.openingHours ?? '');
        setLat(typeof rest.lat === 'number' ? rest.lat : '');
        setLng(typeof rest.lng === 'number' ? rest.lng : '');
    }

    useEffect(() => {
        let mounted = true;
        (async () => {
            setLoading(true);
            try {
                await load();
            } catch (e: any) {
                setError(e?.message || 'No se pudo cargar el restaurante.');
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, [id]);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setError(null);
        try {
            const payload: Partial<Restaurant> = {
                name,
                address,
                description,
                cuisine,
                image,
                phone,
                openingHours,
                lat: lat === '' ? undefined : Number(lat),
                lng: lng === '' ? undefined : Number(lng),
            };

            await updateRestaurant(id, payload);
            router.push(`/restaurants/${id}`);
        } catch (e: any) {
            setError(e?.message || 'No se pudo guardar.');
        } finally {
            setSaving(false);
        }
    }

    if (loading || !r) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">

            <form onSubmit={onSubmit} className="card p-5 space-y-4">

                <div>
                    <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden mt-1">
                        {!image ? (
                            <label className="absolute inset-0 flex items-center justify-center text-sm text-gray-500 cursor-pointer">
                                Añadir imagen
                                <input type="file" accept="image/*" className="hidden" onChange={onImageChange} />
                            </label>
                        ) : (
                            <>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={image} alt="Preview" className="w-full h-full object-cover" />
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="block">
                        <span className="text-sm text-gray-700">Nombre</span>
                        <input
                            maxLength={40}
                            className="input mt-1"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </label>

                    <label className="block">
                        <span className="text-sm text-gray-700">Cocina / Tipo</span>
                        <input
                            maxLength={40}
                            className="input mt-1"
                            value={cuisine}
                            onChange={(e) => setCuisine(e.target.value)}
                        />
                    </label>

                    <label className="block sm:col-span-2">
                        <span className="text-sm text-gray-700">Dirección</span>
                        <input
                            minLength={10}
                            maxLength={40}
                            className="input mt-1"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </label>

                    <label className="block sm:col-span-2">
                        <span className="text-sm text-gray-700">Descripción</span>
                        <textarea
                            maxLength={500}
                            className="input mt-1 min-h-[120px]"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </label>

                    <label className="block">
                        <span className="text-sm text-gray-700">Teléfono</span>
                        <input
                            maxLength={20}
                            className="input mt-1"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </label>

                    <label className="block">
                        <span className="text-sm text-gray-700">Horario</span>
                        <input
                            maxLength={40}
                            className="input mt-1"
                            value={openingHours}
                            onChange={(e) => setOpeningHours(e.target.value)}
                        />
                    </label>

                    <label className="block">
                        <span className="text-sm text-gray-700">Latitud</span>
                        <input
                            maxLength={20}
                            className="input mt-1"
                            type="number"
                            step="any"
                            value={lat}
                            onChange={(e) =>
                                setLat(e.target.value === '' ? '' : Number(e.target.value))
                            }
                        />
                    </label>

                    <label className="block">
                        <span className="text-sm text-gray-700">Longitud</span>
                        <input
                            className="input mt-1"
                            type="number"
                            step="any"
                            value={lng}
                            onChange={(e) =>
                                setLng(e.target.value === '' ? '' : Number(e.target.value))
                            }
                        />
                    </label>
                </div>

                <div className="flex gap-2">
                    <button className="btn btn-primary" disabled={saving} type="submit">
                        {saving ? 'Guardando…' : 'Guardar cambios'}
                    </button>
                    <button
                        className="btn"
                        type="button"
                        onClick={() => router.push(`/restaurants/${id}`)}
                    >
                        Cancelar
                    </button>

                </div>
                {error && <p className="text-red-600 text-sm">{error}</p>}
            </form>
        </div>
    );
}