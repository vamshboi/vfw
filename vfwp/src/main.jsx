import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { EventsProvider } from "./context/usevents";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <EventsProvider>
      <App />
    </EventsProvider>
    
  </React.StrictMode>
);