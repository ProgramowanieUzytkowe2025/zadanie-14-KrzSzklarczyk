import React from "react";

export default function NaukowiecCard({ item, onEdit, onDelete }) {
  return (
    <div className="card">
      <div className="cardHeader">
        <div>
          <div className="title">{item.imie} {item.nazwisko}</div>
          <div className="badge">ID: {item.id}</div>
        </div>
        <div className="badge">{item.aktywny ? "aktywny" : "nieaktywny"}</div>
      </div>

      <div className="kv">
        <div className="k">Instytut:</div>
        <div className="v">{item.instytut}</div>

        <div className="k">Doświadczenie (lata):</div>
        <div className="v">{item.lata_doswiadczenia}</div>

        <div className="k">Aktywny:</div>
        <div className="v">{item.aktywny ? "tak" : "nie"}</div>
      </div>

      <div className="cardFooter">
        <button className="btn" onClick={() => onEdit(item.id)}>Edytuj</button>
        <button className="btn danger" onClick={() => onDelete(item)}>Usuń</button>
      </div>
    </div>
  );
}
