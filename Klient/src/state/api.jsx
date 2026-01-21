import React, { createContext, useContext, useMemo } from "react";
import { useLoader } from "./loader.jsx";
import { useToasts } from "./toasts.jsx";

const ApiContext = createContext(null);

class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function getBaseUrl() {
  return (import.meta.env.VITE_API_BASE_URL || "http://localhost:8000").replace(/\/$/, "");
}

async function safeReadJson(response) {
  const text = await response.text();
  if (!text) return null;
  try { return JSON.parse(text); } catch { return null; }
}

export function ApiProvider({ children }) {
  const loader = useLoader();
  const toasts = useToasts();

  const api = useMemo(() => {
    const request = async (path, options = {}) => {
      loader.start();
      try {
        const res = await fetch(getBaseUrl() + path, {
          headers: { "Content-Type": "application/json", ...(options.headers || {}) },
          ...options,
        });

        if (!res.ok) {
          const body = await safeReadJson(res);
          const msg = body?.detail
            ? (Array.isArray(body.detail) ? body.detail.map(x => x?.msg || String(x)).join(", ") : String(body.detail))
            : `HTTP ${res.status}`;

          toasts.push("error", "Wystąpił błąd");
          throw new ApiError(res.status, msg);
        }

        if (res.status === 204) return null;

        const body = await safeReadJson(res);
        return body;
      } finally {
        loader.stop();
      }
    };

    return { request, ApiError };
  }, [loader, toasts]);

  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
}

export function useApi() {
  const ctx = useContext(ApiContext);
  if (!ctx) throw new Error("useApi must be used within ApiProvider");
  return ctx;
}
