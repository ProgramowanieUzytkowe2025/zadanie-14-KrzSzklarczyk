import React from "react";

export default function ConfirmDialog({ open, title, message, confirmText = "Usuń", cancelText = "Anuluj", onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="modalOverlay" role="dialog" aria-modal="true">
      <div className="modal">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modalActions">
          <button className="btn" onClick={onCancel}>{cancelText}</button>
          <button className="btn danger" onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
}
