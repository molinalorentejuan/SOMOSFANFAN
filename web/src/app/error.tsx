'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error para debugging
    console.error('Error capturado:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Algo salió mal
        </h2>
        <p className="text-gray-600 mb-6">
          {error.message || 'Ocurrió un error inesperado'}
        </p>
        <button
          onClick={() => reset()}
          className="w-full bg-pink-500 text-white font-bold py-3 rounded-lg hover:bg-pink-600 transition-colors"
        >
          Intentar de nuevo
        </button>
        <button
          onClick={() => window.location.href = '/'}
          className="w-full mt-3 bg-gray-200 text-gray-700 font-medium py-3 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
}

