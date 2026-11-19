import React, { useState } from 'react';
import { Download, RefreshCw, WifiOff, X } from 'lucide-react';
import { useOnlineStatus, usePWAInstall, useServiceWorkerUpdate } from '../hooks/usePWA';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) return null;

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 whitespace-nowrap shrink-0"
      >
        <Download className="h-4 w-4 shrink-0" />
        Instalar App
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-3.5 py-2 text-xs font-semibold text-amber-900 transition hover:bg-amber-100 dark:border-amber-700 dark:bg-amber-950/50 dark:text-amber-200 whitespace-nowrap shrink-0"
        >
          <Download className="h-4 w-4 shrink-0" />
          Instalar en iPhone
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-sm rounded-2xl border border-stone-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-display text-lg font-bold text-stone-900 dark:text-stone-100">
                  Instalar JAIRRESTAURA KIDS
                </h3>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  className="rounded-lg p-2 text-stone-500 hover:bg-stone-100 dark:hover:bg-slate-800"
                  aria-label="Cerrar"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <ol className="mt-3 space-y-2 text-sm text-stone-700 dark:text-stone-300">
                <li>1. Toca el botón <strong>Compartir</strong> en Safari.</li>
                <li>2. Desliza y elige <strong>Agregar a pantalla de inicio</strong>.</li>
                <li>3. Confirma con <strong>Agregar</strong> para jugar incluso sin internet.</li>
              </ol>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full min-h-[44px] rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
              >
                Entendido
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};

export const OfflineAndUpdateBanners: React.FC = () => {
  const isOnline = useOnlineStatus();
  const { needsUpdate, offlineReady, applyUpdate, dismissOfflineReady, dismissUpdate } =
    useServiceWorkerUpdate();

  return (
    <>
      {!isOnline && (
        <div
          role="status"
          className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg"
        >
          <WifiOff className="h-4 w-4 shrink-0" />
          <span>Modo sin conexión — Usando historias y juegos guardados</span>
        </div>
      )}

      {offlineReady && isOnline && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-xs font-semibold text-stone-800 shadow-lg dark:border-emerald-800 dark:bg-slate-900 dark:text-stone-100">
          <span>Modo sin conexión listo para usarse en cualquier lugar.</span>
          <button
            type="button"
            onClick={dismissOfflineReady}
            className="rounded-lg bg-emerald-600 px-2.5 py-1 text-white hover:bg-emerald-700"
          >
            Bien
          </button>
        </div>
      )}

      {needsUpdate && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-xl border border-sky-300 bg-white px-4 py-3 text-xs font-semibold text-stone-900 shadow-xl dark:border-sky-700 dark:bg-slate-900 dark:text-stone-100">
          <RefreshCw className="h-4 w-4 text-sky-600 shrink-0" />
          <span>Hay una nueva versión disponible de JAIRRESTAURA KIDS.</span>
          <button
            type="button"
            onClick={applyUpdate}
            className="rounded-lg bg-sky-600 px-3 py-1.5 text-white hover:bg-sky-700 whitespace-nowrap"
          >
            Actualizar
          </button>
          <button
            type="button"
            onClick={dismissUpdate}
            aria-label="Cerrar aviso"
            className="rounded-lg p-1 text-stone-500 hover:bg-stone-100 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </>
  );
};
