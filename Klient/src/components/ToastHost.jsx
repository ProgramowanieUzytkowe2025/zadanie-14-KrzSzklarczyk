import React from "react";
import { useToasts } from "../state/toasts.jsx";

export default function ToastHost() {
  const { toasts } = useToasts();
  if (!toasts.length) return null;

  return (
    <div className="toastHost" aria-live="polite" aria-atomic="true">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type}`}>
          <div className="icon" />
          <div className="txt">{t.message}</div>
        </div>
      ))}
    </div>
  );
}
