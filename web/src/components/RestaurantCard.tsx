'use client';
import Image from 'next/image';
import Link from 'next/link';
import type { Restaurant } from '@/lib/types';
import clsx from 'clsx';
import { useData } from '@/lib/store';

export default function RestaurantCard({ r }: { r: Restaurant }) {
    const rounded = typeof r.avgRating === 'number' ? Math.round(r.avgRating) : null;
    const { selectedRestaurantId } = useData();
    const isActive = selectedRestaurantId === r.id;

    return (
        <Link
            href={`/restaurants/${r.id}`}
            className={clsx(
                'p-3 flex gap-3 transition min-h-[160px] rounded-2xl',
                !isActive && 'opacity-50 filter grayscale-[15%]'
            )}
        >
            {/* Imagen cuadrada */}
            <div className="relative h-32 w-32 rounded-2xl overflow-hidden shrink-0">
                <Image src={r.image} alt={r.name} fill className="object-cover" />
            </div>

            {/* Columna derecha */}
            <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                    <h3 className="text-lg font-semibold truncate">{r.name}</h3>
                    <p className="text-text-mute text-sm truncate">{r.address}</p>
                </div>

                {typeof r.avgRating === 'number' ? (
                    <div className="text-sm mt-2 flex items-center gap-1">
            <span className="inline-flex">
              {[1, 2, 3, 4, 5].map((n) => (
                  <span
                      key={n}
                      className={
                          rounded && n <= rounded ? 'text-blue-600' : 'text-gray-300'
                      }
                  >
                  ★
                </span>
              ))}
            </span>
                        <span className="text-text-mute">
              · {r.commentCount ?? 0} {r.commentCount === 1 ? 'comentario' : 'comentarios'}
            </span>
                    </div>
                ) : (
                    <div className="text-xs text-gray-500 mt-2">Sin puntuación</div>
                )}
            </div>
        </Link>
    );
}