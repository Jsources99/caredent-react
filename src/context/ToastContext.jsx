import { createContext, useCallback, useContext, useRef, useState } from "react";

const ToastContext = createContext(null);

// Mensajes de confirmación o error que desaparecen solos.
export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timer = useRef(null);

  const showToast = useCallback((message, type = "ok") => {
    clearTimeout(timer.current);
    setToast({ message, type });
    timer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {toast && (
        <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 1080 }}>
          <div
            className={`toast show border-0 text-white ${toast.type === "danger" ? "toast-danger" : "toast-ok"}`}
            role="status"
            aria-live="polite"
          >
            <div className="toast-body">{toast.message}</div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast debe usarse dentro de <ToastProvider>");
  return ctx;
}
