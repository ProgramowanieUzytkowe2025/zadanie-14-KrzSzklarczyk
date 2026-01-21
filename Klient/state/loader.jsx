import React, { createContext, useContext, useMemo, useState } from "react";

const LoaderContext = createContext(null);

export function LoaderProvider({ children }) {
  const [pending, setPending] = useState(0);

  const api = useMemo(() => ({
    pending,
    start: () => setPending((p) => p + 1),
    stop: () => setPending((p) => Math.max(0, p - 1)),
  }), [pending]);

  return <LoaderContext.Provider value={api}>{children}</LoaderContext.Provider>;
}

export function useLoader() {
  const ctx = useContext(LoaderContext);
  if (!ctx) throw new Error("useLoader must be used within LoaderProvider");
  return ctx;
}
