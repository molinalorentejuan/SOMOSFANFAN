"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/store";
//import logo from "@/../public/MEDIA/logoBlanco.png";

export default function AuthPage() {
    const [mode, setMode] = useState<"login" | "register">("login");
    const [step, setStep] = useState<1 | 2>(1);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const router = useRouter();
    const { login, register } = useAuth();

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        try {
            if (mode === "login") {
                if (!email || !password) {
                    alert("Introduce email y contraseña.");
                    return;
                }
                await login(email, password);
            } else {
                if (step === 1) {
                    setStep(2);
                    return;
                }
                if (!username || !password) {
                    alert("Introduce usuario y contraseña.");
                    return;
                }
                await register(username, password, email);
            }
            router.replace("/");
        } catch (e: any) {
            alert(e.message || "Error de autenticación");
        }
    }

//<Image className="w-12 h-12" /> src={logo} alt="logo"
    return (
        <div className="grid md:grid-cols-2 gap-8 items-end">
            {/* Columna azul*/}
            <div className="bg-[#1E40FF] text-white px-8 py-6 rounded-[20px] flex flex-col shadow-xl">
                {/* Logo arriba */}
                <div className="text-3xl font-bold flex items-center mb-4">
                    <span className="tracking-tight">FANFAN</span>
                </div>

                {/* Formulario*/}
                <div className="mt-auto">
                    <form onSubmit={submit} className="space-y-3 w-full">
                        {mode === "login" ? (
                            <>
                                <label className="block text-sm">Email</label>
                                <input
                                    maxLength={30}
                                    type="email"
                                    className="w-full rounded-[20px] bg-white text-black px-4 py-3 outline-none focus:ring-2 focus:ring-white/70"
                                    placeholder="Escribe tu email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <label className="block text-sm">Contraseña</label>
                                <input
                                    maxLength={30}
                                    type="password"
                                    className="w-full rounded-[20px] bg-white text-black px-4 py-3 outline-none focus:ring-2 focus:ring-white/70"
                                    placeholder="Escribe tu contraseña"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </>
                        ) : step === 1 ? (
                            <>
                                <button
                                    type="button"
                                    className="rounded-2xl bg-white/20 text-white px-3 py-1 hover:bg-white/25"
                                    onClick={() => {
                                        setMode("login");
                                        setStep(1);
                                    }}
                                >
                                    ←
                                </button>
                                <label className="block text-sm">Email</label>
                                <input
                                    maxLength={30}
                                    type="email"
                                    className="w-full rounded-[20px] bg-white text-black px-4 py-3 outline-none focus:ring-2 focus:ring-white/70"
                                    placeholder="Añade tu email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <label className="block text-sm">Nombre de usuario</label>
                                <input
                                    maxLength={30}
                                    className="w-full rounded-[20px] bg-white text-black px-4 py-3 outline-none focus:ring-2 focus:ring-white/70"
                                    placeholder="Añade tu nombre"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    className="rounded-2xl bg-white/20 text-white px-3 py-1 hover:bg-white/25"
                                    onClick={() => setStep(1)}
                                >
                                    ←
                                </button>
                                <label className="block text-sm">Crea una contraseña nueva</label>
                                <input
                                    maxLength={30}
                                    type="password"
                                    className="w-full rounded-[20px] bg-white text-black px-4 py-3 outline-none focus:ring-2 focus:ring-white/70"
                                    placeholder="Añade una contraseña"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </>
                        )}

                        <button className="bg-white text-black rounded-2xl px-4 py-2 shadow-sm hover:bg-white/95">
                            {mode === "login"
                                ? "Siguiente"
                                : step === 1
                                    ? "Siguiente"
                                    : "Finalizar"}
                        </button>
                    </form>

                    <div className="text-sm mt-4 text-white/90">
                        {mode === "login" ? (
                            <>
                                ¿No tienes cuenta?{" "}
                                <button
                                    className="underline"
                                    onClick={() => {
                                        setMode("register");
                                        setStep(1);
                                    }}
                                >
                                    Regístrate
                                </button>
                            </>
                        ) : (
                            <>
                                ¿Ya tienes cuenta?{" "}
                                <button className="underline" onClick={() => setMode("login")}>
                                    Inicia sesión
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Columna para la imagen */}
            <div className="relative rounded-[20px] shadow-xl overflow-hidden min-h-[600px]">
                <Image
                    src={mode === "login" ? "/MEDIA/login1.png" : "/MEDIA/login1.png"}
                    alt="Restaurant"
                    fill
                    className="object-cover"
                    priority
                />
            </div>
        </div>
    );
}