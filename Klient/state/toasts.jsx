import React, { createContext, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const api = useMemo(() => ({
    toasts,
    push: (type, message) => {
      const id = uid();
      setToasts((prev) => [...prev, { id, type, message }]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    },
    remove: (id) => setToasts((prev) => prev.filter((t) => t.id !== id)),
    clear: () => setToasts([]),
  }), [toasts]);

  return <ToastContext.Provider value={api}>{children}</ToastContext.Provider>;
}

export function useToasts() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToasts must be used within ToastProvider");
  return ctx;
}
