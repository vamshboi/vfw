import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useState } from "react";

import Navbar from "./components/navbar"
import AuthDialog from "./components/auth/authdialog";

import Home from "./pages/home"
import About from "./pages/about"
import Events from "./pages/events"

import Donate from "./pages/donate"
import TribalMela from "./pages/tribalmela"

import EventsPage from "./events/pages/eventspage";
import EventDetailPage from "./events/pages/eventdetailpage";
import AdminPanel from "./pages/adminpanel"
import MyEvents from "./pages/myevents"
import Profile from "./pages/profile"
import VolunteerPage from "./pages/volunteer"

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
        
        <Route path="/donate" element={<Donate />} />
        <Route path="/tribalmela" element={<TribalMela />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/volunteer-dashboard" element={<MyEvents />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/volunteer" element={<VolunteerPage />} />
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