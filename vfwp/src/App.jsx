import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useState } from "react";

import Navbar from "./components/navbar"
import AuthDialog from "./components/auth/authdialog";

import Home from "./pages/home"
import About from "./pages/about"
import Events from "./pages/events"
import Visitings from "./pages/visitings"
import Donate from "./pages/donate"

import EventsPage from "./events/pages/eventspage";
import EventDetailPage from "./events/pages/eventdetailpage";

function App() {

  // 🔐 auth dialog state
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState("login");

  const openLogin = () => {
    setAuthTab("login");
    setAuthOpen(true);
  };

  const openRegister = () => {
    setAuthTab("register");
    setAuthOpen(true);
  };

  return (
    <BrowserRouter>

      {/* pass triggers to navbar */}
      <Navbar
        onUserIconClick={openLogin}
        onJoinUsClick={openRegister}
      />

      <Routes>
        <Route path="/" element={<Home onJoinUs={openRegister} />} />
        <Route path="/about" element={<About />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
        <Route path="/visitings" element={<Visitings />} />
        <Route path="/donate" element={<Donate />} />
      </Routes>

      {/* global modal */}
      <AuthDialog
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        defaultTab={authTab}
      />

    </BrowserRouter>
  )
}

export default App