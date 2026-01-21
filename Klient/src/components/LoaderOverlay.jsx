import React from "react";
import { useLoader } from "../state/loader.jsx";

export default function LoaderOverlay() {
  const { pending } = useLoader();
  if (pending <= 0) return null;

  return (
    <div className="loaderOverlay" role="alert" aria-live="assertive">
      <div className="loaderBox">wczytywanie…</div>
    </div>
  );
}
