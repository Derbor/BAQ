import React from 'react';

export default function Tailscale() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 flex flex-col items-center py-12 px-4">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Ejemplo con <span className="text-orange-500">Tailscale</span>
      </h1>
      {/* ...existing style structure... */}
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
        <div className="p-6">
          <p className="text-gray-600">
            Aquí podrías integrar Tailscale o mostrar su estado.
          </p>
        </div>
      </div>
    </div>
  );
}
