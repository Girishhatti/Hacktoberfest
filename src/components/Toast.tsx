import React from 'react';
import { ThemeMode } from '../types/exorcist';
import { Check, Info, AlertTriangle } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error';
  title: string;
  message?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
  mode: ThemeMode;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss, mode }) => {
  const isHalloween = mode === 'halloween';

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-3.5 rounded-xl border shadow-2xl pointer-events-auto flex items-start gap-3 backdrop-blur-md transition-all animate-in slide-in-from-bottom-3 ${
            toast.type === 'error'
              ? 'bg-rose-950/90 border-rose-700/80 text-rose-200'
              : isHalloween
              ? 'bg-[#180a2f]/95 border-purple-600/70 text-slate-100 shadow-[0_0_20px_rgba(168,85,247,0.3)]'
              : 'bg-[#0f172a]/95 border-slate-700 text-slate-100 shadow-xl'
          }`}
          onClick={() => onDismiss(toast.id)}
        >
          {toast.type === 'error' ? (
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          ) : (
            <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          )}

          <div className="flex-1 text-xs">
            <p className="font-semibold">{toast.title}</p>
            {toast.message && <p className="text-slate-400 mt-0.5">{toast.message}</p>}
          </div>
        </div>
      ))}
    </div>
  );
};
