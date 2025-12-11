'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import type { Restaurant, Comment } from '@/lib/types';
import { useAuth, useData } from '@/lib/store';
import Spinner from '@/components/Spinner';
import dynamic from 'next/dynamic';
const Map = dynamic(() => import('@/components/Map'), { ssr: false });

export default function RestaurantDetailPage() {
    const params = useParams();
    const id = Number(params?.id);
    const router = useRouter();
    const { user } = useAuth();
    const { deleteRestaurant, getComments, addComment, updateComment, deleteComment } = useData();

    const [r, setR] = useState<Restaurant | null>(null);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [posting, setPosting] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingText, setEditingText] = useState('');
    const [newRating, setNewRating] = useState(0);
    const [formError, setFormError] = useState<string | null>(null);

    const MAX_COMMENT_CHARS = 500; // límite razonable

    async function loadAll() {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/restaurants/${id}`);
            if (!res.ok) {
                // Si no existe → redirigir al home
                router.push("/");
                return;
            }

            const rest = await res.json();
            const list = await getComments(id);
            setR(rest);
            setComments(list);
        } catch (e) {
            console.error("Error cargando restaurante:", e);
            router.push("/");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        let mounted = true;
        (async () => {
            setLoading(true);
            try {
                await loadAll();
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, [id]);

    if (loading || !r) return <Spinner />;

    const canEdit = !!user && (r as any)?.ownerId === user.id;

    const rated = comments.filter((c) => typeof c.rating === 'number');
    const avgRating =
        rated.length > 0
            ? Math.round(
            (rated.reduce((sum, c) => sum + (c.rating || 0), 0) / rated.length) * 10
        ) / 10
            : null;

    async function handlePost(e: React.FormEvent) {
        e.preventDefault();
        const text = newComment.trim();
        if (!text) return;

        if (text.length > MAX_COMMENT_CHARS) {
            setFormError(`Máx ${MAX_COMMENT_CHARS} caracteres`);
            return;
        }
        setFormError(null);

        setPosting(true);
        try {
            const resp = await addComment(id, text, newRating);
            setComments(resp.comments);
            setNewComment('');
            setNewRating(0);
        } finally {
            setPosting(false);
        }
    }

    async function handleDeleteComment(cid: number) {
        await deleteComment(cid);
        const fresh = await getComments(id);
        setComments(fresh);
    }

    async function handleSaveEdit(e: React.FormEvent) {
        e.preventDefault();
        if (!editingId) return;
        const text = editingText.trim();
        if (!text) return;
        const updated = await updateComment(editingId, text);
        setComments((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        setEditingId(null);
        setEditingText('');
    }

    return (
        <div className="space-y-8">
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden">
                <Image src={r.image} alt={r.name} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                    <h1 className="text-white text-4xl md:text-5xl font-semibold leading-tight">
                        {r.name}
                    </h1>
                    <p className="text-white/85 text-sm md:text-base mt-2">{r.address}</p>

                    {avgRating !== null ? (
                        <div className="mt-3 flex items-center gap-2">
                            <div className="flex items-center gap-1 text-[16px]">
                                {[1, 2, 3, 4, 5].map((n) => (
                                    <span
                                        key={n}
                                        className={
                                            n <= Math.round(avgRating) ? 'text-blue-300' : 'text-white/40'
                                        }
                                    >
                  ★
                </span>
                                ))}
                            </div>
                            <span className="text-white/90 text-sm">({avgRating})</span>
                            <span className="text-white/60 text-sm">
              · {rated.length}{' '}
                                {rated.length === 1 ? 'valoración' : 'valoraciones'}
            </span>
                        </div>
                    ) : (
                        <div className="mt-3 text-white/80 text-sm">Sin puntuación</div>
                    )}
                </div>
            </div>

            {/* DESCRIPCIÓN + COMENTAR*/}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Izquierda: descripción */}
                <section className="md:col-span-2">
                    {r.description ? (
                        <p className="text-gray-700 text-base leading-relaxed whitespace-pre-wrap break-words break-all">{r.description}</p>
                    ) : (
                        <p className="text-gray-500 text-sm">Sin descripción.</p>
                    )}

                    <div className="mt-6 flex gap-2">
                        {canEdit ? (
                            <>
                                <Link className="btn" href={`/restaurants/${r.id}/edit`}>
                                    Editar restaurante
                                </Link>
                                <button
                                    className="btn btn-primary"
                                    onClick={async () => {
                                        await deleteRestaurant(r.id);
                                        router.push('/');
                                    }}
                                >
                                    Eliminar restaurante
                                </button>
                            </>
                        ) : (
                            <span className="text-sm text-gray-500">
              Solo el creador puede editar o eliminar este restaurante.
            </span>
                        )}
                    </div>
                </section>

                {/*comentar*/}
                <aside className="border border-black/80 rounded-xl p-4 shadow-sm h-fit">
                    <h4 className="text-base font-semibold mb-2">Comentar</h4>
                    {user ? (
                    <form onSubmit={handlePost}>
                        <div className="flex items-center gap-2 mb-2">
                            {[1, 2, 3, 4, 5].map((n) => (
                                <button
                                    key={n}
                                    type="button"
                                    onClick={() => setNewRating(n)}
                                    className={n <= newRating ? 'text-blue-600' : 'text-gray-300'}
                                >
                                    ★
                                </button>
                            ))}
                        </div>

                        {formError && <p className="text-red-600 text-sm mb-2">{formError}</p>}

                        <textarea
                            className="input min-h-[120px] whitespace-pre-wrap break-words"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Escribe tu comentario sobre el restaurante"
                            maxLength={MAX_COMMENT_CHARS}
                            required
                        />
                        <div className="mt-1 text-xs text-gray-500">
                            {newComment.length}/{MAX_COMMENT_CHARS}
                        </div>

                        <div className="mt-3 flex justify-start">
                            <button
                                className="rounded-full px-6 border border-black/80 bg-white text-gray-900 hover:bg-gray-50 shadow-sm"
                                disabled={
                                    posting ||
                                    newComment.trim().length === 0 ||
                                    newComment.length > MAX_COMMENT_CHARS
                                }
                            >
                                {posting ? 'Enviando…' : 'Enviar'}
                            </button>
                        </div>
                    </form> ) : <p className="text-sm text-gray-500">Debes iniciar sesión para comentar.</p>}
                </aside>
            </div>

            {/* LISTA DE COMENTARIOS */}
            <section>
                <h3 className="text-lg font-semibold mb-4">Comentarios</h3>
                {comments.length === 0 && (
                    <p className="text-sm text-gray-500">Aún no hay comentarios.</p>
                )}

                <div className="space-y-6">
                    {comments.map((c, idx) => (
                        <div
                            key={c.id}
                            className="relative grid grid-cols-[160px,1fr] gap-4 items-start pt-4"
                        >
                            <div className="font-bold text-gray-900 break-words">@{c.username}</div>

                            <div className="relative pr-14 max-w-full overflow-hidden">
                                {editingId !== c.id && (  <div className="absolute top-0 right-0 flex items-center gap-1 text-[18px]">
                                    {[1, 2, 3, 4, 5].map((n) => (
                                        <span
                                            key={n}
                                            className={n <= (c.rating || 0) ? 'text-blue-600' : 'text-gray-300'}
                                        >
                    ★
                  </span>
                                    ))}
                                </div> )}

                                {editingId === c.id ? (
                                    <form onSubmit={handleSaveEdit} className="mt-2 space-y-2">
                  <textarea
                      className="input min-h-[80px]"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                  />
                                        <div className="flex gap-2 justify-end">
                                            <button className="btn btn-primary" type="submit">
                                                Guardar
                                            </button>
                                            <button
                                                className="btn"
                                                type="button"
                                                onClick={() => {
                                                    setEditingId(null);
                                                    setEditingText('');
                                                }}
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <p className="mt-8 text-gray-800 leading-relaxed whitespace-pre-wrap break-words break-all">
                                        {c.text}
                                    </p>
                                )}

                                {user?.id === c.userId && editingId !== c.id && (
                                    <div className="mt-3 flex gap-2 justify-end">
                                        <button
                                            className="btn"
                                            onClick={() => {
                                                setEditingId(c.id);
                                                setEditingText(c.text);
                                            }}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => handleDeleteComment(c.id)}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                )}

                                <div className="text-xs text-gray-500 mt-1">
                                    {new Date(c.createdAt).toLocaleString()}
                                </div>
                            </div>

                            {idx < comments.length - 1 && (
                                <div className="col-span-2 h-[2px] bg-blue-600/70 my-6" />
                            )}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}