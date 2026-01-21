import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../state/api.jsx";
import { useToasts } from "../state/toasts.jsx";
import { listNaukowcy, deleteNaukowiec } from "../api/naukowcyApi.js";
import NaukowiecCard from "../components/NaukowiecCard.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";

export default function ListPage() {
  const navigate = useNavigate();
  const { request } = useApi();
  const toasts = useToasts();

  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filterLabel = useMemo(() => {
    if (filter === "true") return "Tylko aktywni";
    if (filter === "false") return "Tylko nieaktywni";
    return "Wszyscy (true + false)";
  }, [filter]);

  const load = async () => {
    const data = await listNaukowcy(request, filter);
    setItems(data || []);
  };

useEffect(() => {
  load().catch((e) => {
    console.error("LIST LOAD ERROR:", e);
    toasts.push("error", "Wystąpił błąd");
  });
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [filter]);


  const onDelete = (item) => setDeleteTarget(item);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteNaukowiec(request, deleteTarget.id);
      toasts.push("success", "Poprawnie zapisano zmiany");
      setDeleteTarget(null);
      await load();
    } catch (e) {
      setDeleteTarget(null);
    }
  };

  return (
    <>
      <div className="topbar">
        <div className="brand">
          <div className="pageTitle">Lista naukowców</div>
          <div className="sub">Filtrowanie po polu boolowskim: {filterLabel}</div>
        </div>

        <div className="actions">
          <select className="select" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">Wszyscy (true + false)</option>
            <option value="true">Tylko aktywni (true)</option>
            <option value="false">Tylko nieaktywni (false)</option>
          </select>

          <button className="btn primary" onClick={() => navigate("/new")}>Dodaj</button>
          <button className="btn" onClick={() => load().catch(() => {})}>Odśwież</button>
        </div>
      </div>

      <div className="grid">
        {items.map((it) => (
          <NaukowiecCard
            key={it.id}
            item={it}
            onEdit={(id) => navigate(`/edit/${id}`)}
            onDelete={onDelete}
          />
        ))}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Potwierdź usunięcie"
        message={
          deleteTarget
            ? `Czy na pewno chcesz usunąć rekord: ${deleteTarget.imie} ${deleteTarget.nazwisko} (ID: ${deleteTarget.id})?`
            : ""
        }
        confirmText="Usuń"
        cancelText="Anuluj"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
