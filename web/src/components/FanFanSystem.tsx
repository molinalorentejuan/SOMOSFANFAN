'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

type Seccion = 'home' | 'miembro' | 'flow' | 'factory';
type SubSeccion = 'form' | 'grabar' | 'alquiler' | 'proyecto' | 'participar' | null;
type PlanId = 'fan' | 'full' | 'fantastic' | null;

interface FormData {
  nombre: string;
  email: string;
  telefono: string;
  mensaje: string;
  tipo: string;
}

interface Plan {
  id: PlanId;
  nombre: string;
  precio: number;
  destacado?: boolean;
  beneficios: string[];
}

const FanFanSystem = () => {
  const [seccion, setSeccion] = useState<Seccion>('home');
  const [subSeccion, setSubSeccion] = useState<SubSeccion>(null);
  const [codigoDescuento, setCodigoDescuento] = useState('');
  const [descuentoAplicado, setDescuentoAplicado] = useState(false);
  const [errorCodigo, setErrorCodigo] = useState(false);
  const [intentos, setIntentos] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: '',
    tipo: '',
  });
  const [enviado, setEnviado] = useState(false);
  const [planAbierto, setPlanAbierto] = useState<PlanId>(null);

  const DESCUENTO = '25%';

  // Códigos válidos: FLOW01 a FLOW30
  const esCodigoValido = (codigo: string): boolean => {
    const match = codigo.toUpperCase().match(/^FLOW(\d{1,2})$/);
    if (!match) return false;
    const num = parseInt(match[1]);
    return num >= 1 && num <= 30;
  };

  const frasesError = [
    'ese código no vibra 💅',
    'try again bb',
    '¿seguro que estuviste?',
    'nope',
    'otra frequency...',
  ];

  const verificarCodigo = () => {
    if (esCodigoValido(codigoDescuento)) {
      setDescuentoAplicado(true);
      setErrorCodigo(false);
      setTimeout(() => setSeccion('miembro'), 800);
    } else {
      setErrorCodigo(true);
      setIntentos((prev) => prev + 1);
    }
  };

  const guardarSolicitud = async (tipo: string) => {
    const data = {
      ...formData,
      tipo,
      codigo: descuentoAplicado ? codigoDescuento.toUpperCase() : null,
      descuento: descuentoAplicado ? DESCUENTO : null,
      id: `FF-${Date.now()}`,
      fecha: new Date().toISOString(),
    };
    try {
      // Intentar guardar en el backend usando la API existente
      try {
        await api('/fanfan/leads', {
          method: 'POST',
          body: JSON.stringify(data),
        });
        console.log('Lead guardado en backend:', data);
      } catch (apiError) {
        // Si falla el backend, guardar en localStorage como fallback
        console.warn('Backend no disponible, guardando en localStorage:', apiError);
        if (typeof window !== 'undefined') {
          const leadsStr = localStorage.getItem('fanfan-leads');
          const leads = leadsStr ? JSON.parse(leadsStr) : [];
          leads.push(data);
          localStorage.setItem('fanfan-leads', JSON.stringify(leads));
          console.log('Lead guardado en localStorage:', data);
        }
      }
    } catch (e) {
      console.error('Error guardando lead:', e);
    }
    setEnviado(true);
    setTimeout(() => {
      setEnviado(false);
      setSubSeccion(null);
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        mensaje: '',
        tipo: '',
      });
    }, 3000);
  };

  const calcularPrecio = (precio: number): string =>
    descuentoAplicado ? (precio * 0.75).toFixed(0) : precio.toString();

  const planes: Plan[] = [
    {
      id: 'fan',
      nombre: 'FAN',
      precio: 9,
      beneficios: [
        'Acceso prioritario a eventos',
        'Newsletter exclusiva',
        '10% dto en servicios',
        'Comunidad privada',
      ],
    },
    {
      id: 'full',
      nombre: 'FULL FAN',
      precio: 29,
      destacado: true,
      beneficios: [
        'Todo lo de FAN +',
        '2 eventos gratis al mes',
        '20% dto en servicios',
        'Acceso a FICTIO FRAMES',
        '1h grabación gratis/mes',
      ],
    },
    {
      id: 'fantastic',
      nombre: 'FANTASTIC',
      precio: 99,
      beneficios: [
        'Todo lo de FULL FAN +',
        'Eventos ilimitados',
        '50% dto en servicios',
        'Residencia prioritaria',
        'Mentoría 1:1 mensual',
      ],
    },
  ];

  if (enviado) {
    return (
      <div className="min-h-screen bg-pink-500 flex items-center justify-center text-white text-center px-4">
        <div>
          <div className="text-6xl mb-6">💖</div>
          <h2 className="text-3xl font-black mb-2">te escribimos pronto</h2>
          {descuentoAplicado && (
            <p className="text-lime-300 font-bold">{DESCUENTO} off aplicado</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-500 text-white">
      {/* Nav */}
      <header className="sticky top-0 bg-pink-600/90 backdrop-blur-sm z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => {
              setSeccion('home');
              setSubSeccion(null);
            }}
            className="text-xl font-black"
          >
            FAN FAN
          </button>
          <nav className="flex gap-1 text-xs font-bold">
            {(['home', 'miembro', 'flow', 'factory'] as Seccion[]).map((s) => (
              <button
                key={s}
                onClick={() => {
                  setSeccion(s);
                  setSubSeccion(null);
                }}
                className={`px-3 py-2 rounded-full ${
                  seccion === s
                    ? 'bg-lime-400 text-pink-600'
                    : 'text-pink-200'
                }`}
              >
                {s === 'home' ? '✨' : s.toUpperCase()}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-12">
        {/* HOME */}
        {seccion === 'home' && !descuentoAplicado && (
          <div className="text-center space-y-8">
            <div className="py-6">
              <h1 className="text-6xl font-black leading-none">
                FAN<br />FAN
              </h1>
            </div>

            <div className="bg-pink-600/50 border-2 border-pink-300 rounded-3xl p-8">
              <p className="text-lime-300 text-xs font-bold tracking-widest mb-2">
                🎫 CÓDIGO SECRETO
              </p>
              <h2 className="text-2xl font-black mb-6">
                ¿estuviste en la party?
              </h2>

              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="tu código"
                  value={codigoDescuento}
                  onChange={(e) => {
                    setCodigoDescuento(e.target.value.toUpperCase());
                    setErrorCodigo(false);
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && verificarCodigo()}
                  className="flex-1 px-4 py-4 bg-white/10 border-2 border-pink-300 rounded-full text-center text-lg font-bold tracking-widest placeholder:text-pink-300 focus:border-lime-400 outline-none"
                />
                <button
                  onClick={verificarCodigo}
                  className="px-5 py-4 bg-lime-400 text-pink-600 font-black rounded-full"
                >
                  GO
                </button>
              </div>

              {errorCodigo && (
                <p className="text-lime-300 text-sm">
                  {frasesError[intentos % frasesError.length]}
                </p>
              )}

              <p className="text-pink-300 text-xs mt-4">
                {DESCUENTO} off en tu membresía
              </p>
            </div>

            <button
              onClick={() => setSeccion('miembro')}
              className="text-pink-300 text-sm underline"
            >
              no tengo código →
            </button>
          </div>
        )}

        {seccion === 'home' && descuentoAplicado && (
          <div className="text-center py-16 space-y-4">
            <div className="text-7xl">🎉</div>
            <h2 className="text-3xl font-black">{DESCUENTO} OFF</h2>
            <p className="text-pink-200">desbloqueado</p>
          </div>
        )}

        {/* MIEMBRO */}
        {seccion === 'miembro' && !subSeccion && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-black">¿quieres ser fan?</h2>
              {descuentoAplicado && (
                <span className="inline-block mt-2 px-3 py-1 bg-lime-400 text-pink-600 text-xs font-bold rounded-full">
                  {DESCUENTO} OFF
                </span>
              )}
            </div>

            {planes.map((p) => (
              <div
                key={p.id}
                className={`rounded-2xl overflow-hidden ${
                  p.destacado
                    ? 'bg-lime-400 text-pink-600'
                    : 'bg-pink-600/50 border-2 border-pink-400'
                }`}
              >
                <button
                  onClick={() =>
                    setPlanAbierto(planAbierto === p.id ? null : p.id)
                  }
                  className="w-full p-5 text-left"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-black">{p.nombre}</h3>
                    <div className="text-right">
                      <div className="text-2xl font-black">
                        {calcularPrecio(p.precio)}€
                      </div>
                      {descuentoAplicado && (
                        <div className="text-sm line-through opacity-50">
                          {p.precio}€
                        </div>
                      )}
                      <div className="text-xs opacity-70">/mes</div>
                    </div>
                  </div>
                  <p
                    className={`text-xs mt-2 ${
                      p.destacado ? 'text-pink-600/70' : 'text-pink-300'
                    }`}
                  >
                    {planAbierto === p.id ? '▲ ocultar' : '▼ ver qué incluye'}
                  </p>
                </button>

                {planAbierto === p.id && (
                  <div
                    className={`px-5 pb-5 ${
                      p.destacado
                        ? 'border-t border-pink-600/20'
                        : 'border-t border-pink-400/30'
                    }`}
                  >
                    <ul className="py-3 space-y-2 text-sm">
                      {p.beneficios.map((b, i) => (
                        <li key={i}>✓ {b}</li>
                      ))}
                    </ul>
                    <button
                      onClick={() => {
                        setSubSeccion('form');
                        setFormData({ ...formData, tipo: p.nombre });
                      }}
                      className={`w-full py-3 font-black rounded-full ${
                        p.destacado
                          ? 'bg-pink-600 text-white'
                          : 'bg-lime-400 text-pink-600'
                      }`}
                    >
                      ELEGIR {p.nombre} →
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {seccion === 'miembro' && subSeccion === 'form' && (
          <div>
            <button
              onClick={() => setSubSeccion(null)}
              className="text-pink-300 text-sm mb-6"
            >
              ← volver
            </button>
            <h2 className="text-2xl font-black mb-1">
              hazte {formData.tipo}
            </h2>
            {descuentoAplicado && (
              <p className="text-lime-300 text-sm mb-4">
                {DESCUENTO} off aplicado
              </p>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                guardarSolicitud(`Membresía ${formData.tipo}`);
              }}
              className="space-y-4"
            >
              <input
                required
                placeholder="nombre *"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                className="w-full px-4 py-3 bg-pink-600/50 border-2 border-pink-400 rounded-xl outline-none focus:border-lime-400 placeholder:text-pink-300"
              />
              <input
                type="email"
                required
                placeholder="email *"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 bg-pink-600/50 border-2 border-pink-400 rounded-xl outline-none focus:border-lime-400 placeholder:text-pink-300"
              />
              <input
                placeholder="teléfono"
                value={formData.telefono}
                onChange={(e) =>
                  setFormData({ ...formData, telefono: e.target.value })
                }
                className="w-full px-4 py-3 bg-pink-600/50 border-2 border-pink-400 rounded-xl outline-none focus:border-lime-400 placeholder:text-pink-300"
              />
              <button className="w-full py-4 bg-lime-400 text-pink-600 font-black rounded-full">
                UNIRME →
              </button>
            </form>
          </div>
        )}

        {/* FLOW - 4 SECCIONES */}
        {seccion === 'flow' && !subSeccion && (
          <div className="space-y-4">
            <h2 className="text-3xl font-black text-center mb-6">
              ¿qué necesitas?
            </h2>

            {/* 1. ACTIVA TU FRECUENCIA */}
            <button
              onClick={() => setSubSeccion('grabar')}
              className="w-full p-5 bg-pink-600/50 border-2 border-pink-400 rounded-2xl text-left hover:border-lime-400 transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">🎙️</span>
                <div>
                  <h3 className="font-black text-lg">activa tu frecuencia</h3>
                  <p className="text-pink-200 text-sm">
                    graba en nuestro estudio
                  </p>
                </div>
              </div>
            </button>

            {/* 2. ALQUILA MATERIAL */}
            <button
              onClick={() => setSubSeccion('alquiler')}
              className="w-full p-5 bg-pink-600/50 border-2 border-pink-400 rounded-2xl text-left hover:border-lime-400 transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">📦</span>
                <div>
                  <h3 className="font-black text-lg">alquila material</h3>
                  <p className="text-pink-200 text-sm">
                    equipos, luces, sonido...
                  </p>
                </div>
              </div>
            </button>

            {/* 3. TIENES UN PROYECTO */}
            <button
              onClick={() => setSubSeccion('proyecto')}
              className="w-full p-5 bg-pink-600/50 border-2 border-pink-400 rounded-2xl text-left hover:border-lime-400 transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">💡</span>
                <div>
                  <h3 className="font-black text-lg">¿tienes un proyecto?</h3>
                  <p className="text-pink-200 text-sm">cuéntanoslo</p>
                </div>
              </div>
            </button>

            {/* 4. QUIERES PARTICIPAR */}
            <button
              onClick={() => setSubSeccion('participar')}
              className="w-full p-5 bg-pink-600/50 border-2 border-pink-400 rounded-2xl text-left hover:border-lime-400 transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">🙋</span>
                <div>
                  <h3 className="font-black text-lg">¿quieres participar?</h3>
                  <p className="text-pink-200 text-sm">en próximos eventos</p>
                </div>
              </div>
            </button>
          </div>
        )}

        {/* FLOW - FORMS */}
        {seccion === 'flow' && subSeccion === 'grabar' && (
          <div>
            <button
              onClick={() => setSubSeccion(null)}
              className="text-pink-300 text-sm mb-6"
            >
              ← volver
            </button>
            <h2 className="text-2xl font-black mb-2">
              🎙️ activa tu frecuencia
            </h2>
            <p className="text-pink-200 text-sm mb-6">
              reserva sesión de grabación
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                guardarSolicitud('Grabar - Activa tu frecuencia');
              }}
              className="space-y-4"
            >
              <input
                required
                placeholder="nombre *"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                className="w-full px-4 py-3 bg-pink-600/50 border-2 border-pink-400 rounded-xl outline-none focus:border-lime-400 placeholder:text-pink-300"
              />
              <input
                type="email"
                required
                placeholder="email *"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 bg-pink-600/50 border-2 border-pink-400 rounded-xl outline-none focus:border-lime-400 placeholder:text-pink-300"
              />
              <input
                placeholder="teléfono"
                value={formData.telefono}
                onChange={(e) =>
                  setFormData({ ...formData, telefono: e.target.value })
                }
                className="w-full px-4 py-3 bg-pink-600/50 border-2 border-pink-400 rounded-xl outline-none focus:border-lime-400 placeholder:text-pink-300"
              />
              <textarea
                rows={3}
                placeholder="¿qué quieres grabar?"
                value={formData.mensaje}
                onChange={(e) =>
                  setFormData({ ...formData, mensaje: e.target.value })
                }
                className="w-full px-4 py-3 bg-pink-600/50 border-2 border-pink-400 rounded-xl outline-none focus:border-lime-400 placeholder:text-pink-300 resize-none"
              />
              <button className="w-full py-4 bg-lime-400 text-pink-600 font-black rounded-full">
                ENVIAR →
              </button>
            </form>
          </div>
        )}

        {seccion === 'flow' && subSeccion === 'alquiler' && (
          <div>
            <button
              onClick={() => setSubSeccion(null)}
              className="text-pink-300 text-sm mb-6"
            >
              ← volver
            </button>
            <h2 className="text-2xl font-black mb-2">📦 alquila material</h2>
            <p className="text-pink-200 text-sm mb-6">
              equipos, luces, sonido, espacio...
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                guardarSolicitud('Alquiler Material');
              }}
              className="space-y-4"
            >
              <input
                required
                placeholder="nombre *"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                className="w-full px-4 py-3 bg-pink-600/50 border-2 border-pink-400 rounded-xl outline-none focus:border-lime-400 placeholder:text-pink-300"
              />
              <input
                type="email"
                required
                placeholder="email *"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 bg-pink-600/50 border-2 border-pink-400 rounded-xl outline-none focus:border-lime-400 placeholder:text-pink-300"
              />
              <input
                placeholder="teléfono"
                value={formData.telefono}
                onChange={(e) =>
                  setFormData({ ...formData, telefono: e.target.value })
                }
                className="w-full px-4 py-3 bg-pink-600/50 border-2 border-pink-400 rounded-xl outline-none focus:border-lime-400 placeholder:text-pink-300"
              />
              <textarea
                rows={3}
                required
                placeholder="¿qué material necesitas? ¿para cuándo?"
                value={formData.mensaje}
                onChange={(e) =>
                  setFormData({ ...formData, mensaje: e.target.value })
                }
                className="w-full px-4 py-3 bg-pink-600/50 border-2 border-pink-400 rounded-xl outline-none focus:border-lime-400 placeholder:text-pink-300 resize-none"
              />
              <button className="w-full py-4 bg-lime-400 text-pink-600 font-black rounded-full">
                ENVIAR →
              </button>
            </form>
          </div>
        )}

        {seccion === 'flow' && subSeccion === 'proyecto' && (
          <div>
            <button
              onClick={() => setSubSeccion(null)}
              className="text-pink-300 text-sm mb-6"
            >
              ← volver
            </button>
            <h2 className="text-2xl font-black mb-2">
              💡 cuéntanos tu proyecto
            </h2>
            <p className="text-pink-200 text-sm mb-6">
              queremos conocer lo que haces
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                guardarSolicitud('Proyecto - Base de datos');
              }}
              className="space-y-4"
            >
              <input
                required
                placeholder="nombre *"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                className="w-full px-4 py-3 bg-pink-600/50 border-2 border-pink-400 rounded-xl outline-none focus:border-lime-400 placeholder:text-pink-300"
              />
              <input
                type="email"
                required
                placeholder="email *"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 bg-pink-600/50 border-2 border-pink-400 rounded-xl outline-none focus:border-lime-400 placeholder:text-pink-300"
              />
              <input
                placeholder="instagram / web"
                value={formData.telefono}
                onChange={(e) =>
                  setFormData({ ...formData, telefono: e.target.value })
                }
                className="w-full px-4 py-3 bg-pink-600/50 border-2 border-pink-400 rounded-xl outline-none focus:border-lime-400 placeholder:text-pink-300"
              />
              <textarea
                rows={4}
                required
                placeholder="¿qué haces? ¿qué proyecto tienes? cuéntanos todo *"
                value={formData.mensaje}
                onChange={(e) =>
                  setFormData({ ...formData, mensaje: e.target.value })
                }
                className="w-full px-4 py-3 bg-pink-600/50 border-2 border-pink-400 rounded-xl outline-none focus:border-lime-400 placeholder:text-pink-300 resize-none"
              />
              <button className="w-full py-4 bg-lime-400 text-pink-600 font-black rounded-full">
                ENVIAR →
              </button>
            </form>
          </div>
        )}

        {seccion === 'flow' && subSeccion === 'participar' && (
          <div>
            <button
              onClick={() => setSubSeccion(null)}
              className="text-pink-300 text-sm mb-6"
            >
              ← volver
            </button>
            <h2 className="text-2xl font-black mb-2">🙋 quiero participar</h2>
            <p className="text-pink-200 text-sm mb-6">
              únete a próximos eventos
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                guardarSolicitud('Participar - Eventos');
              }}
              className="space-y-4"
            >
              <input
                required
                placeholder="nombre *"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                className="w-full px-4 py-3 bg-pink-600/50 border-2 border-pink-400 rounded-xl outline-none focus:border-lime-400 placeholder:text-pink-300"
              />
              <input
                type="email"
                required
                placeholder="email *"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 bg-pink-600/50 border-2 border-pink-400 rounded-xl outline-none focus:border-lime-400 placeholder:text-pink-300"
              />
              <input
                placeholder="instagram"
                value={formData.telefono}
                onChange={(e) =>
                  setFormData({ ...formData, telefono: e.target.value })
                }
                className="w-full px-4 py-3 bg-pink-600/50 border-2 border-pink-400 rounded-xl outline-none focus:border-lime-400 placeholder:text-pink-300"
              />
              <textarea
                rows={3}
                placeholder="¿cómo te gustaría participar? dj, performance, visual, staff..."
                value={formData.mensaje}
                onChange={(e) =>
                  setFormData({ ...formData, mensaje: e.target.value })
                }
                className="w-full px-4 py-3 bg-pink-600/50 border-2 border-pink-400 rounded-xl outline-none focus:border-lime-400 placeholder:text-pink-300 resize-none"
              />
              <button className="w-full py-4 bg-lime-400 text-pink-600 font-black rounded-full">
                ENVIAR →
              </button>
            </form>
          </div>
        )}

        {/* FACTORY */}
        {seccion === 'factory' && !subSeccion && (
          <div className="space-y-6">
            <h2 className="text-3xl font-black">¿tienes un proyecto?</h2>
            <p className="text-pink-200">branding · video · moda · artistas</p>

            <button
              onClick={() => setSubSeccion('form')}
              className="w-full py-4 bg-lime-400 text-pink-600 font-black rounded-full"
            >
              CUÉNTANOS →
            </button>
          </div>
        )}

        {seccion === 'factory' && subSeccion === 'form' && (
          <div>
            <button
              onClick={() => setSubSeccion(null)}
              className="text-pink-300 text-sm mb-6"
            >
              ← volver
            </button>
            <h2 className="text-2xl font-black mb-6">tu proyecto</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                guardarSolicitud('Proyecto Factory');
              }}
              className="space-y-4"
            >
              <input
                required
                placeholder="nombre *"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                className="w-full px-4 py-3 bg-pink-600/50 border-2 border-pink-400 rounded-xl outline-none focus:border-lime-400 placeholder:text-pink-300"
              />
              <input
                type="email"
                required
                placeholder="email *"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 bg-pink-600/50 border-2 border-pink-400 rounded-xl outline-none focus:border-lime-400 placeholder:text-pink-300"
              />
              <textarea
                rows={4}
                required
                placeholder="cuéntanos tu idea *"
                value={formData.mensaje}
                onChange={(e) =>
                  setFormData({ ...formData, mensaje: e.target.value })
                }
                className="w-full px-4 py-3 bg-pink-600/50 border-2 border-pink-400 rounded-xl outline-none focus:border-lime-400 placeholder:text-pink-300 resize-none"
              />
              <button className="w-full py-4 bg-lime-400 text-pink-600 font-black rounded-full">
                ENVIAR →
              </button>
            </form>
          </div>
        )}
      </main>

      <footer className="py-6 text-center">
        <p className="text-pink-300 text-xs">@somos_fanfan</p>
      </footer>
    </div>
  );
};

export default FanFanSystem;

