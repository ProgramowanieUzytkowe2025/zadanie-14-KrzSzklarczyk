import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import ListPage from "./pages/ListPage.jsx";
import FormPage from "./pages/FormPage.jsx";
import LoaderOverlay from "./components/LoaderOverlay.jsx";
import ToastHost from "./components/ToastHost.jsx";

export default function App() {
  return (
    <>
      <LoaderOverlay />
      <ToastHost />

      <div className="container">
        <div className="topbar">
          <div className="brand">
            <h1><Link to="/">Naukowcy</Link></h1>
            <div className="sub">ReactJS + FastAPI (Lab 8)</div>
          </div>
        </div>

        <Routes>
          <Route path="/" element={<ListPage />} />
          <Route path="/new" element={<FormPage mode="create" />} />
          <Route path="/edit/:id" element={<FormPage mode="edit" />} />
        </Routes>
      </div>
    </>
  );
}
