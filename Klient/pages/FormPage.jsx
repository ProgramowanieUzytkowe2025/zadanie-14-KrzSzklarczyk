import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApi } from "../state/api.jsx";
import { useToasts } from "../state/toasts.jsx";
import { createNaukowiec, getNaukowiec, updateNaukowiec } from "../api/naukowcyApi.js";

const empty = {
  imie: "",
  nazwisko: "",
  instytut: "",
  lata_doswiadczenia: 0,
  aktywny: true,
};

export default function FormPage({ mode }) {
  const navigate = useNavigate();
  const params = useParams();
  const { request, ApiError } = useApi();
  const toasts = useToasts();

  const isEdit = mode === "edit";
  const id = isEdit ? Number(params.id) : null;

  const [model, setModel] = useState(empty);
  const [formError, setFormError] = useState("");

  const title = useMemo(() => (isEdit ? `Edycja rekordu (ID: ${id})` : "Dodawanie nowego rekordu"), [isEdit, id]);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const data = await getNaukowiec(request, id);
        setModel({
          imie: data.imie ?? "",
          nazwisko: data.nazwisko ?? "",
          instytut: data.instytut ?? "",
          lata_doswiadczenia: Number(data.lata_doswiadczenia ?? 0),
          aktywny: Boolean(data.aktywny),
        });
      } catch (e) {
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, id]);

  const set = (key, value) => setModel((m) => ({ ...m, [key]: value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!model.imie.trim() || !model.nazwisko.trim() || !model.instytut.trim()) {
      setFormError("Uzupełnij pola: imię, nazwisko, instytut.");
      return;
    }
    if (!Number.isFinite(Number(model.lata_doswiadczenia))) {
      setFormError("Pole „lata doświadczenia” musi być liczbą.");
      return;
    }

    const payload = {
      imie: model.imie.trim(),
      nazwisko: model.nazwisko.trim(),
      instytut: model.instytut.trim(),
      lata_doswiadczenia: Number(model.lata_doswiadczenia),
      aktywny: Boolean(model.aktywny),
    };

    try {
      if (isEdit) {
        await updateNaukowiec(request, id, payload);
      } else {
        await createNaukowiec(request, payload);
      }
      toasts.push("success", "Poprawnie zapisano zmiany");
      navigate("/");
    } catch (e) {
      if (e instanceof ApiError) {
        setFormError(e.message || "Wystąpił błąd walidacji po stronie API.");
      } else {
        setFormError("Wystąpił błąd.");
      }
    }
  };

  return (
    <>
      <div className="topbar">
        <div className="brand">
          <div className="pageTitle">{title}</div>
          <div className="sub">
            Ten sam formularz obsługuje: dodawanie i edycję.
          </div>
        </div>

        <div className="actions">
          <button className="btn" onClick={() => navigate("/")}>Powrót</button>
        </div>
      </div>

      <form className="form" onSubmit={onSubmit}>
        <div className="formGrid">
          <div className="field">
            <label>Imię</label>
            <input value={model.imie} onChange={(e) => set("imie", e.target.value)} />
          </div>
          <div className="field">
            <label>Nazwisko</label>
            <input value={model.nazwisko} onChange={(e) => set("nazwisko", e.target.value)} />
          </div>

          <div className="field" style={{ gridColumn: "1 / -1" }}>
            <label>Instytut (pole tekstowe)</label>
            <input value={model.instytut} onChange={(e) => set("instytut", e.target.value)} />
          </div>

          <div className="field">
            <label>Lata doświadczenia (pole liczbowe)</label>
            <input
              type="number"
              value={model.lata_doswiadczenia}
              onChange={(e) => set("lata_doswiadczenia", e.target.value)}
            />
          </div>

          <div className="field">
            <label>Aktywny (pole boolowskie)</label>
            <select value={model.aktywny ? "true" : "false"} onChange={(e) => set("aktywny", e.target.value === "true")}>
              <option value="true">tak</option>
              <option value="false">nie</option>
            </select>
          </div>
        </div>

        <div className="formActions">
          <button type="button" className="btn" onClick={() => navigate("/")}>Anuluj</button>
          <button type="submit" className="btn primary">Zapisz</button>
        </div>

        {formError ? <div className="errorBox">{formError}</div> : null}
      </form>
    </>
  );
}
