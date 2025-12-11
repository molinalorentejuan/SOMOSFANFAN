"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/store";

export default function AuthPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const { login } = useAuth();

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        try {
            if (!email || !password) {
                alert("Introduce email y contraseña.");
                return;
            }
            await login(email, password);
            router.replace("/admin/leads");
        } catch (e: any) {
            alert(e.message || "Error de autenticación");
        }
    }

    return (
        <div className="grid md:grid-cols-2 gap-8 items-end">
            {/* Columna azul*/}
            <div className="bg-[#1E40FF] text-white px-8 py-6 rounded-[20px] flex flex-col shadow-xl">
                {/* Logo arriba */}
                <div className="text-3xl font-bold flex items-center mb-4">
                    <span className="tracking-tight">FANFAN</span>
                </div>
                <h1 className="text-4xl font-black mb-2">Admin Login</h1>
                <p className="text-blue-100 mb-8">
                    Acceso administrativo al sistema
                </p>
                <div className="mt-auto">
                    <Image
                        src="/MEDIA/login1.png"
                        alt="FanFan"
                        width={300}
                        height={200}
                        className="rounded-lg"
                    />
                </div>
            </div>

            {/* Columna blanca - Formulario */}
            <div className="bg-white px-8 py-6 rounded-[20px] shadow-xl">
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Usuario
                        </label>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            placeholder="admin"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#1E40FF] text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Iniciar sesión
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <a
                        href="/"
                        className="text-sm text-gray-500 hover:text-gray-700"
                    >
                        ← Volver al inicio
                    </a>
                </div>
            </div>
        </div>
    );
}
