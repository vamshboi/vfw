import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/useauth";
import { Navigate } from "react-router-dom";

const API = "https://vfw-server.onrender.com/api";

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-[#0d0d0d] rounded-2xl p-5 overflow-hidden"
      style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.07)" }}
    >
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FACC15]/40 to-transparent" />
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${color}`}>{label}</span>
      </div>
      <p className="font-['Syne'] text-white text-3xl font-extrabold">{value}</p>
    </motion.div>
  );
}

// ── Section Header ────────────────────────────────────────────────────────────
function SectionHeader({ title, subtitle }) {
  return (
    <div className="mb-6">
      <h2 className="font-['Syne'] text-white text-xl font-extrabold">{title}</h2>
      {subtitle && <p className="text-white/40 text-xs mt-1">{subtitle}</p>}
    </div>
  );
}

// ── Volunteers Tab ────────────────────────────────────────────────────────────
function VolunteersTab({ token }) {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/admin/volunteers`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => { setVolunteers(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  const updateStatus = async (id, status) => {
    await fetch(`${API}/admin/volunteers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    setVolunteers((prev) => prev.map((v) => v.id === id ? { ...v, status } : v));
  };

  const statusColor = {
    Pending: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
    Approved: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
    Rejected: "bg-red-500/20 text-red-400 border border-red-500/30",
  };

  if (loading) return <div className="text-white/30 text-sm">Loading...</div>;

  return (
    <div>
      <SectionHeader title="Volunteer Applications" subtitle={`${volunteers.length} total applications`} />
      {volunteers.length === 0 ? (
        <div className="text-center py-20 text-white/25 text-sm">No volunteer applications yet</div>
      ) : (
        <div className="flex flex-col gap-4">
          {volunteers.map((v) => (
            <motion.div key={v.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="bg-[#0d0d0d] rounded-2xl p-5" style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.07)" }}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-full bg-[#FACC15] flex items-center justify-center text-black font-bold text-sm">
                      {v.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-['Syne'] text-white font-semibold text-sm">{v.name}</p>
                      <p className="text-white/40 text-[10px]">{v.email} · {v.phone}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2 mb-2">
                    {v.skills?.map((s) => (
                      <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-white/8 text-white/50 border border-white/10">{s}</span>
                    ))}
                  </div>
                  <p className="text-white/50 text-xs leading-relaxed max-w-lg">{v.reason}</p>
                  <p className="text-white/25 text-[10px] mt-1">{new Date(v.createdAt).toLocaleDateString("en-IN")}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${statusColor[v.status]}`}>{v.status}</span>
                  {v.status === "Pending" && (
                    <div className="flex gap-2">
                      <button onClick={() => updateStatus(v.id, "Approved")}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/30 transition-colors border border-emerald-500/30">
                        Approve
                      </button>
                      <button onClick={() => updateStatus(v.id, "Rejected")}
                        className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-500/30 transition-colors border border-red-500/30">
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Donations Tab ─────────────────────────────────────────────────────────────
function DonationsTab({ token }) {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/admin/donations`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => { setDonations(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  const total = donations.reduce((s, d) => s + (d.amount || 0), 0);

  if (loading) return <div className="text-white/30 text-sm">Loading...</div>;

  return (
    <div>
      <SectionHeader title="Donations Received" subtitle={`Total: ₹${total.toLocaleString()} from ${donations.length} donors`} />
      {donations.length === 0 ? (
        <div className="text-center py-20 text-white/25 text-sm">No donations yet</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/8">
                {["Donor", "Email", "Amount", "Payment ID", "Date"].map((h) => (
                  <th key={h} className="text-left py-3 px-4 text-white/30 text-[10px] font-bold tracking-widest uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {donations.map((d) => (
                <tr key={d.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="py-3 px-4 text-white text-sm font-medium">{d.name}</td>
                  <td className="py-3 px-4 text-white/50 text-xs">{d.email}</td>
                  <td className="py-3 px-4 text-[#FACC15] font-['Syne'] font-bold text-sm">₹{d.amount?.toLocaleString()}</td>
                  <td className="py-3 px-4 text-white/30 text-[10px] font-mono">{d.paymentId || "—"}</td>
                  <td className="py-3 px-4 text-white/40 text-xs">{new Date(d.createdAt).toLocaleDateString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Orders Tab ────────────────────────────────────────────────────────────────
function OrdersTab({ token }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    fetch(`${API}/admin/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => { setOrders(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  const total = orders.reduce((s, o) => s + (o.total || 0), 0);

  if (loading) return <div className="text-white/30 text-sm">Loading...</div>;

  return (
    <div>
      <SectionHeader title="Tribal Mela Orders" subtitle={`Total revenue: ₹${total.toLocaleString()} from ${orders.length} orders`} />
      {orders.length === 0 ? (
        <div className="text-center py-20 text-white/25 text-sm">No orders yet</div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((o) => (
            <motion.div key={o.id} className="bg-[#0d0d0d] rounded-2xl overflow-hidden"
              style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.07)" }}>
              <div className="p-5 flex items-center justify-between gap-4 flex-wrap cursor-pointer"
                onClick={() => setExpanded(expanded === o.id ? null : o.id)}>
                <div>
                  <p className="font-['Syne'] text-white font-semibold text-sm">{o.name}</p>
                  <p className="text-white/40 text-[10px]">{o.email} · {o.phone}</p>
                  <p className="text-white/30 text-[10px] mt-0.5">{o.address}, {o.city}, {o.state} — {o.pincode}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-['Syne'] text-[#FACC15] font-bold text-lg">₹{o.total?.toLocaleString()}</p>
                    <p className="text-white/25 text-[10px]">{new Date(o.createdAt).toLocaleDateString("en-IN")}</p>
                  </div>
                  <svg viewBox="0 0 16 16" fill="none" className={`w-4 h-4 text-white/30 transition-transform ${expanded === o.id ? "rotate-180" : ""}`}>
                    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
              <AnimatePresence>
                {expanded === o.id && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
                    className="overflow-hidden border-t border-white/8">
                    <div className="p-5">
                      <p className="text-white/30 text-[10px] font-bold tracking-widest uppercase mb-3">Items Ordered</p>
                      <div className="flex flex-col gap-2">
                        {(Array.isArray(o.items) ? o.items : []).map((item, i) => (
                          <div key={i} className="flex items-center justify-between text-xs">
                            <span className="text-white/60">{item.emoji} {item.name} × {item.qty}</span>
                            <span className="text-[#FACC15] font-bold">₹{(item.price * item.qty).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                      {o.paymentId && <p className="text-white/20 text-[10px] font-mono mt-3">Payment ID: {o.paymentId}</p>}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Users Tab ─────────────────────────────────────────────────────────────────
function UsersTab({ token }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => { setUsers(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  const updateRole = async (id, role) => {
    await fetch(`${API}/admin/users/${id}/role`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ role }),
    });
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, role } : u));
  };

  const roleColor = {
    USER: "bg-[#FACC15]/20 text-[#FACC15] border border-[#FACC15]/30",
    VOLUNTEER: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
    ADMIN: "bg-red-500/20 text-red-400 border border-red-500/30",
  };

  if (loading) return <div className="text-white/30 text-sm">Loading...</div>;

  return (
    <div>
      <SectionHeader title="User Management" subtitle={`${users.length} registered users`} />
      <div className="flex flex-col gap-3">
        {users.map((u) => (
          <motion.div key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-[#0d0d0d] rounded-2xl p-4 flex items-center justify-between gap-4 flex-wrap"
            style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.07)" }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#FACC15]/20 flex items-center justify-center text-[#FACC15] font-bold text-sm">
                {u.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-['Syne'] text-white font-semibold text-sm">{u.name}</p>
                <p className="text-white/40 text-[10px]">{u.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${roleColor[u.role]}`}>{u.role}</span>
              <select
                value={u.role}
                onChange={(e) => updateRole(u.id, e.target.value)}
                className="bg-[#111] border border-white/10 rounded-lg px-3 py-1.5 text-white/60 text-xs focus:outline-none focus:border-[#FACC15]/40 cursor-pointer"
              >
                <option value="USER">User</option>
                <option value="VOLUNTEER">Volunteer</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── Reports Tab ───────────────────────────────────────────────────────────────
function ReportsTab({ token }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", category: "Education", date: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`${API}/admin/reports`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => { setReports(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.date) {
      alert("Please fill all fields");
      return;
    }
    setSubmitting(true);
    const res = await fetch(`${API}/admin/reports`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setReports((prev) => [data, ...prev]);
    setForm({ title: "", description: "", category: "Education", date: "" });
    setShowForm(false);
    setSubmitting(false);
  };

  const inputClass = "w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-[#FACC15]/50 transition-all duration-200";
  const categories = ["Education", "Healthcare", "Women Empowerment", "Child Protection", "Tribal Art", "Community Welfare"];

  if (loading) return <div className="text-white/30 text-sm">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <SectionHeader title="Event Reports" subtitle={`${reports.length} reports published`} />
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#FACC15] text-black font-['Syne'] font-bold text-xs rounded-xl hover:bg-yellow-300 transition-all duration-200">
          <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
            <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          New Report
        </button>
      </div>

      {/* Create Report Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="bg-[#0d0d0d] rounded-2xl p-6 mb-6 relative" style={{ boxShadow: "0 0 0 1px rgba(250,204,21,0.15)" }}>
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FACC15] to-transparent rounded-t-2xl" />
            <h3 className="font-['Syne'] text-white font-bold text-base mb-4">Create New Report</h3>
            <div className="flex flex-col gap-4">
              <input className={inputClass} placeholder="Report Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <div className="grid grid-cols-2 gap-4">
                <select className={inputClass} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <input type="date" className={inputClass} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
              <textarea className={`${inputClass} resize-none`} rows={4} placeholder="Report Description *" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <div className="flex gap-3">
                <button onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-xl border border-white/10 text-white/50 text-sm font-medium hover:border-white/20 transition-all">Cancel</button>
                <button onClick={handleSubmit} disabled={submitting}
                  className="flex-1 py-3 rounded-xl bg-[#FACC15] text-black font-['Syne'] font-bold text-sm hover:bg-yellow-300 transition-all disabled:opacity-60">
                  {submitting ? "Publishing..." : "Publish Report"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reports List */}
      {reports.length === 0 ? (
        <div className="text-center py-20 text-white/25 text-sm">No reports yet — create your first one!</div>
      ) : (
        <div className="flex flex-col gap-4">
          {reports.map((r) => (
            <motion.div key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="bg-[#0d0d0d] rounded-2xl p-5" style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.07)" }}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#FACC15]/15 text-[#FACC15] border border-[#FACC15]/25">{r.category}</span>
                    <span className="text-white/25 text-[10px]">{new Date(r.date).toLocaleDateString("en-IN")}</span>
                  </div>
                  <h4 className="font-['Syne'] text-white font-bold text-sm mb-1">{r.title}</h4>
                  <p className="text-white/50 text-xs leading-relaxed max-w-2xl">{r.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Admin Panel ──────────────────────────────────────────────────────────
function RegistrationsTab({ token }) {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/admin/registrations`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => { setRegistrations(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  const updateStatus = async (id, status) => {
    await fetch(`${API}/admin/registrations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    setRegistrations((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
  };

  const statusColor = {
    Pending: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
    Approved: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
    Rejected: "bg-red-500/20 text-red-400 border border-red-500/30",
  };

  if (loading) return <div className="text-white/30 text-sm">Loading...</div>;

  return (
    <div>
      <SectionHeader title="Event Registrations" subtitle={`${registrations.length} total registrations`} />
      {registrations.length === 0 ? (
        <div className="text-center py-20 text-white/25 text-sm">No registrations yet</div>
      ) : (
        <div className="flex flex-col gap-4">
          {registrations.map((r) => (
            <motion.div key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="bg-[#0d0d0d] rounded-2xl p-5"
              style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.07)" }}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  {/* Event info */}
                  <p className="text-[#FACC15] text-[10px] font-bold tracking-widest uppercase mb-1">
                    {r.form?.event?.title || "Unknown Event"}
                  </p>
                  {/* Volunteer info */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-[#FACC15]/20 flex items-center justify-center text-[#FACC15] font-bold text-sm">
                      {r.user?.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div>
                      <p className="font-['Syne'] text-white font-semibold text-sm">{r.user?.name || "Unknown"}</p>
                      <p className="text-white/40 text-[10px]">{r.user?.email}</p>
                    </div>
                  </div>
                  {/* Ticket code */}
                  <p className="font-mono text-[#FACC15]/60 text-xs mb-2">🎟️ {r.ticketCode}</p>
                  {/* Responses */}
                  <div className="flex flex-col gap-1">
                    {Object.entries(r.responses || {}).map(([key, val]) => (
                      <p key={key} className="text-white/40 text-xs">
                        <span className="text-white/60 font-medium">{key}:</span> {val}
                      </p>
                    ))}
                  </div>
                  <p className="text-white/25 text-[10px] mt-2">
                    {new Date(r.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${statusColor[r.status]}`}>
                    {r.status}
                  </span>
                  {r.status === "Pending" && (
                    <div className="flex gap-2">
                      <button onClick={() => updateStatus(r.id, "Approved")}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/30 transition-colors border border-emerald-500/30">
                        Approve
                      </button>
                      <button onClick={() => updateStatus(r.id, "Rejected")}
                        className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-500/30 transition-colors border border-red-500/30">
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
function ProductsTab({ token }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "", artist: "", tribe: "", price: "", originalPrice: "",
    category: "Paintings", badge: "", emoji: "🎨", description: "", inStock: true,
  });
  const [submitting, setSubmitting] = useState(false);

  const CATEGORIES = ["Paintings", "Handicrafts", "Jewelry", "Artifacts"];
  const inputClass = "w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-[#FACC15]/50 transition-all duration-200";

  useEffect(() => {
    fetch(`${API}/products`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => { setProducts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  const handleCreate = async () => {
    if (!form.name || !form.artist || !form.price || !form.description) {
      alert("Please fill all required fields!");
      return;
    }
    setSubmitting(true);
    const res = await fetch(`${API}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setProducts((prev) => [data, ...prev]);
    setForm({ name: "", artist: "", tribe: "", price: "", originalPrice: "", category: "Paintings", badge: "", emoji: "🎨", description: "", inStock: true });
    setShowForm(false);
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    await fetch(`${API}/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleStock = async (id, inStock) => {
    await fetch(`${API}/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ inStock: !inStock }),
    });
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, inStock: !inStock } : p));
  };

  if (loading) return <div className="text-white/30 text-sm">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <SectionHeader title="Tribal Mela Products" subtitle={`${products.length} products listed`} />
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#FACC15] text-black font-['Syne'] font-bold text-xs rounded-xl hover:bg-yellow-300 transition-all duration-200">
          <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
            <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Add Product
        </button>
      </div>

      {/* Add Product Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="bg-[#0d0d0d] rounded-2xl p-6 mb-6 relative"
            style={{ boxShadow: "0 0 0 1px rgba(250,204,21,0.15)" }}>
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FACC15] to-transparent rounded-t-2xl" />
            <h3 className="font-['Syne'] text-white font-bold text-base mb-4">Add New Product</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <input className={inputClass} placeholder="Product Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input className={inputClass} placeholder="Artist Name *" value={form.artist} onChange={(e) => setForm({ ...form, artist: e.target.value })} />
              <input className={inputClass} placeholder="Tribe Name *" value={form.tribe} onChange={(e) => setForm({ ...form, tribe: e.target.value })} />
              <input className={inputClass} placeholder="Emoji Icon (e.g. 🎨)" value={form.emoji} onChange={(e) => setForm({ ...form, emoji: e.target.value })} />
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-sm">₹</span>
                <input type="number" className={`${inputClass} pl-8`} placeholder="Price *" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-sm">₹</span>
                <input type="number" className={`${inputClass} pl-8`} placeholder="Original Price (optional)" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} />
              </div>
              <select className={inputClass} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <input className={inputClass} placeholder="Badge (e.g. Bestseller)" value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} />
            </div>
            <textarea className={`${inputClass} resize-none mb-4`} rows={3} placeholder="Description *" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <div className="flex items-center gap-3 mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.inStock} onChange={(e) => setForm({ ...form, inStock: e.target.checked })} className="w-4 h-4 accent-yellow-400" />
                <span className="text-white/60 text-sm">In Stock</span>
              </label>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-xl border border-white/10 text-white/50 text-sm font-medium hover:border-white/20 transition-all">Cancel</button>
              <button onClick={handleCreate} disabled={submitting}
                className="flex-1 py-3 rounded-xl bg-[#FACC15] text-black font-['Syne'] font-bold text-sm hover:bg-yellow-300 transition-all disabled:opacity-60">
                {submitting ? "Adding..." : "Add Product"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products List */}
      {products.length === 0 ? (
        <div className="text-center py-20 text-white/25 text-sm">No products yet — add your first one!</div>
      ) : (
        <div className="flex flex-col gap-3">
          {products.map((p) => (
            <motion.div key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="bg-[#0d0d0d] rounded-2xl p-4 flex items-center justify-between gap-4 flex-wrap"
              style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.07)" }}>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{p.emoji}</span>
                <div>
                  <p className="font-['Syne'] text-white font-semibold text-sm">{p.name}</p>
                  <p className="text-white/40 text-xs">by {p.artist} · {p.tribe} Tribe</p>
                  <p className="text-[#FACC15] font-bold text-sm">₹{p.price?.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2.5 py-1 rounded-full border border-white/10 text-white/40">{p.category}</span>
                <button onClick={() => toggleStock(p.id, p.inStock)}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition-colors ${
                    p.inStock ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"
                  }`}>
                  {p.inStock ? "In Stock" : "Out of Stock"}
                </button>
                <button onClick={() => handleDelete(p.id)}
                  className="w-8 h-8 rounded-lg bg-red-500/15 hover:bg-red-500/25 flex items-center justify-center transition-colors">
                  <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
                    <path d="M4 4l8 8M12 4l-8 8" stroke="#f87171" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
export default function AdminPanel() {
  const { isAdmin, token, user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({ volunteers: 0, donations: 0, orders: 0, users: 0 });

  if (!isAdmin) return <Navigate to="/" />;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [vol, don, ord, usr] = await Promise.all([
          fetch(`${API}/admin/volunteers`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
          fetch(`${API}/admin/donations`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
          fetch(`${API}/admin/orders`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
          fetch(`${API}/admin/users`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
        ]);
        setStats({
          volunteers: Array.isArray(vol) ? vol.length : 0,
          donations: Array.isArray(don) ? don.reduce((s, d) => s + (d.amount || 0), 0) : 0,
          orders: Array.isArray(ord) ? ord.length : 0,
          users: Array.isArray(usr) ? usr.length : 0,
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, [token]);

  const tabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "volunteers", label: "Volunteers", icon: "🙋" },
    { id: "donations", label: "Donations", icon: "💰" },
    { id: "orders", label: "Orders", icon: "🛍️" },
    { id: "users", label: "Users", icon: "👥" },
    { id: "reports", label: "Reports", icon: "📄" },
    { id: "registrations", label: "Registrations", icon: "🎟️" },
    { id: "products", label: "Products", icon: "🛍️" },
  ];

  return (
    <div className="bg-black min-h-screen pt-24 pb-20">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-40 w-[500px] h-[500px] rounded-full bg-[#FACC15]/3 blur-[130px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-semibold tracking-widest uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            Admin Panel
          </span>
          <h1 className="font-['Syne'] text-white text-4xl font-extrabold">
            Welcome, {user?.name?.split(" ")[0]}! 👋
          </h1>
          <p className="text-white/40 text-sm mt-1">Manage your organization from one place</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 bg-[#0d0d0d] rounded-2xl border border-white/8 mb-8 flex-wrap">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                activeTab === tab.id ? "bg-[#FACC15] text-black" : "text-white/40 hover:text-white/70"
              }`}>
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Stats */}
        {activeTab === "overview" && (
          <div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard label="Volunteers" value={stats.volunteers} icon="🙋" color="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" />
              <StatCard label="Donations" value={`₹${stats.donations.toLocaleString()}`} icon="💰" color="bg-[#FACC15]/20 text-[#FACC15] border border-[#FACC15]/30" />
              <StatCard label="Orders" value={stats.orders} icon="🛍️" color="bg-blue-500/20 text-blue-400 border border-blue-500/30" />
              <StatCard label="Users" value={stats.users} icon="👥" color="bg-purple-500/20 text-purple-400 border border-purple-500/30" />
            </div>
            <div className="bg-[#0d0d0d] rounded-2xl p-8 text-center" style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.07)" }}>
              <p className="text-white/30 text-sm">Select a tab above to manage your organization data</p>
            </div>
          </div>
        )}

        {activeTab === "volunteers" && <VolunteersTab token={token} />}
        {activeTab === "donations" && <DonationsTab token={token} />}
        {activeTab === "orders" && <OrdersTab token={token} />}
        {activeTab === "users" && <UsersTab token={token} />}
        {activeTab === "reports" && <ReportsTab token={token} />}
        {activeTab === "registrations" && <RegistrationsTab token={token} />}
        {activeTab === "products" && <ProductsTab token={token} />}
      </div>
    </div>
  );
}