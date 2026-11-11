import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export default function ConnectivityBanner() {
  const isOnline = useOnlineStatus();

  return (
    <div
      role="status"
      aria-live="polite"
      className={`w-full py-1.5 px-4 text-xs font-medium flex items-center justify-center gap-2 transition-colors ${
        isOnline
          ? 'bg-emerald-50 text-emerald-800 border-b border-emerald-100'
          : 'bg-amber-100 text-amber-900 border-b border-amber-200'
      }`}
    >
      {isOnline ? (
        <>
          <Wifi className="w-3.5 h-3.5 text-emerald-600" />
          <span>Modo en línea &bull; Conectado</span>
        </>
      ) : (
        <>
          <WifiOff className="w-3.5 h-3.5 text-amber-700" />
          <span>Modo sin conexión &bull; Guardando cambios localmente</span>
        </>
      )}
    </div>
  );
}
