import React, { createContext, useContext, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

type ToastVariant = "default" | "success" | "error" | "info" | "warning";

type Toast = {
  id: string;
  message: React.ReactNode;
  variant: ToastVariant;
  duration: number; // ms
};

type ToastInput = {
  message: React.ReactNode;
  variant?: ToastVariant;
  duration?: number;
};

type ToastApi = {
  toast: (input: ToastInput) => string;
  remove: (id: string) => void;
  clear: () => void;
};

const ToastContext = createContext<ToastApi | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef(new Map<string, number>());

  const remove = (id: string) => {
    const t = timers.current.get(id);
    if (t) window.clearTimeout(t);
    timers.current.delete(id);
    setToasts((prev) => prev.filter((x) => x.id !== id));
  };

  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current.clear();
    setToasts([]);
  };

  const toast = ({ message, variant = "default", duration = 3000 }: ToastInput) => {
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : String(Date.now() + Math.random());

    const next: Toast = { id, message, variant, duration };
    setToasts((prev) => [...prev, next]);

    const timeout = window.setTimeout(() => remove(id), duration);
    timers.current.set(id, timeout);

    return id;
  };

  const api = useMemo<ToastApi>(() => ({ toast, remove, clear }), []);

  return (
    <ToastContext.Provider value={api}>
      {children}

      {createPortal(
        <div className="toast-viewport" role="region" aria-label="Notifications">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`toast toast--${t.variant}`}
              role="status"
              aria-live="polite"
            >
              <div className="toast__message">{t.message}</div>
              <button className="toast__close" onClick={() => remove(t.id)} aria-label="Close">
                ❌
              </button>
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
