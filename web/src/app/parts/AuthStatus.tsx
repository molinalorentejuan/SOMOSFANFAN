'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/lib/store';
import clsx from 'clsx';
import { useRouter } from "next/navigation";

export function AuthStatus() {
    const { user, logout } = useAuth();
    const [open, setOpen] = useState(false);
    const popRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        function onDocClick(e: MouseEvent) {
            if (!popRef.current) return;
            if (!popRef.current.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener('click', onDocClick);
        return () => document.removeEventListener('click', onDocClick);
    }, []);

    if (!user) {
        return <Link className="btn" href="/admin/login">Admin</Link>;
    }

    return (
        <div className="relative" ref={popRef}>
            <button
                className="inline-flex items-center gap-1 rounded-2xl px-3 py-2 border border-card-border hover:bg-gray-50"
                onClick={() => setOpen(v => !v)}
                aria-haspopup="menu"
                aria-expanded={open}
            >
                <span className="text-sm">{user.username}</span>
                <span aria-hidden>▾</span>
            </button>

            <div
                className={clsx(
                    'absolute right-0 mt-2 w-48 rounded-2xl shadow-card overflow-hidden transition',
                    open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-1 pointer-events-none'
                )}
                role="menu"
                aria-label="User menu"
            >
                <div className="bg-brand text-white p-2">
                    <Link
                        href="/admin/leads"
                        className="block w-full text-left px-3 py-2 rounded-xl hover:bg-white/10"
                        role="menuitem"
                        onClick={() => setOpen(false)}
                    >
                        Ver Leads
                    </Link>

                    <button
                        className="mt-2 w-full bg-white text-black px-3 py-2 rounded-xl"
                        role="menuitem"
                        onClick={() => { setOpen(false); logout(); router.push("/");}}
                    >
                        Salir
                    </button>
                </div>
            </div>
        </div>
    );
}
