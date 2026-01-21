import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./styles.css";
import { LoaderProvider } from "./state/loader.jsx";
import { ToastProvider } from "./state/toasts.jsx";
import { ApiProvider } from "./state/api.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <LoaderProvider>
        <ToastProvider>
          <ApiProvider>
            <App />
          </ApiProvider>
        </ToastProvider>
      </LoaderProvider>
    </BrowserRouter>
  </React.StrictMode>
);
