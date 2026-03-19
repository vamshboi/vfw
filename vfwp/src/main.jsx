import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { EventsProvider } from "./context/usevents";
import { AuthProvider } from "./context/useauth";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <EventsProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </EventsProvider>
  </React.StrictMode>
);