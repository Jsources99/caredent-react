import { createContext, useCallback, useContext, useRef, useState } from "react";

const ToastContext = createContext(() => {});

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ message: "", type: "ok", visible: false });
  const timer = useRef(null);

  const showToast = useCallback((message, type = "ok") => {
    clearTimeout(timer.current);
    setToast({ message, type, visible: true });
    timer.current = setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3200);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className={`toast toast--${toast.type}${toast.visible ? " is-visible" : ""}`}>{toast.message}</div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
