import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/useauth";
import QRCode from "qrcode";

const API = "https://vfw-server.onrender.com/api";

// ── QR Ticket ─────────────────────────────────────────────────────────────────
function TicketModal({ ticket, event, onClose }) {
  const [qrDataUrl, setQrDataUrl] = useState("");

  useEffect(() => {
    QRCode.toDataURL(
      JSON.stringify({ ticketCode: ticket.ticketCode, event: event?.title, name: ticket.userName }),
      { width: 200, margin: 2, color: { dark: "#000000", light: "#FACC15" } }
    ).then(setQrDataUrl);
  }, [ticket]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-sm bg-[#0d0d0d] rounded-3xl overflow-hidden text-center"
        style={{ boxShadow: "0 0 0 1px rgba(250,204,21,0.2), 0 40px 100px rgba(0,0,0,0.8)" }}
      >
        {/* Top gold accent */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#FACC15] to-transparent" />

        {/* Ticket header */}
        <div className="bg-[#FACC15] px-6 py-5">
          <p className="font-['Syne'] text-black font-extrabold text-xs tracking-widest uppercase">Voice For Welfare</p>
          <h2 className="font-['Syne'] text-black font-extrabold text-xl mt-0.5">Event Ticket ✓</h2>
        </div>

        <div className="px-6 py-6">
          {/* Event info */}
          <div className="mb-5">
            <p className="text-white/30 text-[10px] font-bold tracking-widest uppercase mb-1">Event</p>
            <p className="font-['Syne'] text-white font-bold text-base">{event?.title}</p>
          </div>

          {/* QR Code */}
          {qrDataUrl && (
            <div className="flex justify-center mb-5">
              <div className="p-3 bg-[#FACC15] rounded-xl">
                <img src={qrDataUrl} alt="QR Ticket" className="w-40 h-40" />
              </div>
            </div>
          )}

          {/* Ticket code */}
          <div className="bg-black rounded-xl p-4 mb-5" style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.08)" }}>
            <p className="text-white/30 text-[10px] font-bold tracking-widest uppercase mb-1">Ticket Code</p>
            <p className="font-mono text-[#FACC15] font-extrabold text-2xl tracking-widest">{ticket.ticketCode}</p>
          </div>

          <div className="p-4 bg-[#FACC15]/5 rounded-xl border border-[#FACC15]/20 mb-5">
            <p className="text-white/50 text-xs leading-relaxed">
              🎉 Registration submitted! Your ticket is pending approval from admin. Show this QR at the event.
            </p>
          </div>

          <button onClick={onClose}
            className="w-full py-3 rounded-xl bg-[#FACC15] text-black font-['Syne'] font-bold text-sm hover:bg-yellow-300 transition-all">
            Done ✓
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Dynamic Field Renderer ────────────────────────────────────────────────────
function DynamicField({ field, value, onChange }) {
  const inputClass = "w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-[#FACC15]/50 transition-all duration-200";

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-white/60 text-xs font-semibold tracking-widest uppercase">
        {field.label} {field.required && <span className="text-red-400">*</span>}
      </label>

      {field.type === "text" && (
        <input className={inputClass} placeholder={`Enter ${field.label}`} value={value || ""} onChange={(e) => onChange(e.target.value)} />
      )}

      {field.type === "number" && (
        <input type="number" className={inputClass} placeholder={`Enter ${field.label}`}
          min={field.min} max={field.max} value={value || ""} onChange={(e) => onChange(e.target.value)} />
      )}

      {field.type === "dropdown" && (
        <select className={inputClass} value={value || ""} onChange={(e) => onChange(e.target.value)}>
          <option value="">Select {field.label}</option>
          {field.options?.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      )}

      {field.type === "file" && (
        <input type="file" accept={field.accept || "*"} className={`${inputClass} file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-[#FACC15]/20 file:text-[#FACC15] file:text-xs file:font-semibold`}
          onChange={(e) => onChange(e.target.files[0]?.name || "")} />
      )}
    </div>
  );
}

// ── Main Registration Form ────────────────────────────────────────────────────
export default function EventRegistrationForm({ event, onClose }) {
  const { token, user } = useAuth();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState({});
  const [paymentProof, setPaymentProof] = useState("");
  const [step, setStep] = useState(1); // 1: form, 2: payment, 3: ticket
  const [submitting, setSubmitting] = useState(false);
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    fetch(`${API}/eventforms/${event.id}`)
      .then((r) => r.json())
      .then((data) => { setForm(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [event.id]);

  const updateResponse = (label, value) => {
    setResponses((prev) => ({ ...prev, [label]: value }));
  };

  const validateStep1 = () => {
    if (!form?.fields) return true;
    for (const field of form.fields) {
      if (field.required && !responses[field.label]) {
        alert(`Please fill in: ${field.label}`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!paymentProof.trim()) { alert("Please enter your UPI transaction ID as payment proof!"); return; }
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/eventforms/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          formId: form.id,
          responses: { ...responses, paymentProof },
          paymentProof,
        }),
      });
      const data = await res.json();
      setTicket({ ...data, userName: user?.name });
      setStep(3);
    } catch (err) {
      alert("Submission failed. Try again.");
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
        <div className="text-white/40 text-sm">Loading form...</div>
      </div>
    );
  }

  if (!form) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="bg-[#0d0d0d] rounded-2xl p-8 text-center max-w-sm w-full"
          style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.08)" }}>
          <span className="text-4xl mb-4 block">📋</span>
          <h3 className="font-['Syne'] text-white font-bold text-lg mb-2">No Registration Form</h3>
          <p className="text-white/40 text-sm mb-5">Admin hasn't created a registration form for this event yet.</p>
          <button onClick={onClose} className="w-full py-3 rounded-xl bg-[#FACC15] text-black font-['Syne'] font-bold text-sm">Close</button>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 24 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-lg bg-[#0d0d0d] rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.08), 0 40px 100px rgba(0,0,0,0.8)" }}
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FACC15] to-transparent" />

          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-[#FACC15] text-[10px] font-bold tracking-widest uppercase mb-1">Event Registration</p>
                <h3 className="font-['Syne'] text-white text-lg font-extrabold line-clamp-1">{event.title}</h3>
              </div>
              <button onClick={onClose}
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors shrink-0">
                <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                  <path d="M4 4l8 8M12 4l-8 8" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-6 mt-4">
              {["Fill Form", "Pay", "Ticket"].map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                    step > i + 1 ? "bg-emerald-500 text-white" : step === i + 1 ? "bg-[#FACC15] text-black" : "bg-white/10 text-white/30"
                  }`}>
                    {step > i + 1 ? "✓" : i + 1}
                  </div>
                  <span className={`text-xs font-medium ${step === i + 1 ? "text-white" : "text-white/30"}`}>{s}</span>
                  {i < 2 && <div className={`flex-1 h-px w-8 ${step > i + 1 ? "bg-emerald-500" : "bg-white/10"}`} />}
                </div>
              ))}
            </div>

            {/* Step 1: Form Fields */}
            {step === 1 && (
              <div className="flex flex-col gap-4">
                {form.fields?.map((field, i) => (
                  <DynamicField key={i} field={field} value={responses[field.label]} onChange={(val) => updateResponse(field.label, val)} />
                ))}
                <button onClick={() => validateStep1() && setStep(2)}
                  className="w-full py-3.5 rounded-xl bg-[#FACC15] text-black font-['Syne'] font-bold text-sm hover:bg-yellow-300 transition-all mt-2">
                  Continue to Payment →
                </button>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="flex flex-col gap-5">
                {/* Amount */}
                <div className="bg-black rounded-xl p-5 text-center" style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.08)" }}>
                  <p className="text-white/30 text-[10px] font-bold tracking-widest uppercase mb-1">Travel Fee</p>
                  <p className="font-['Syne'] text-[#FACC15] text-4xl font-extrabold">₹{form.amount}</p>
                </div>

                {/* UPI QR */}
                <div className="bg-black rounded-xl p-5 flex flex-col items-center gap-3"
                  style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.08)" }}>
                  <p className="text-white/40 text-xs font-bold tracking-widest uppercase">Scan & Pay</p>
                  {form.upiQrImage ? (
                    <img src={form.upiQrImage} alt="UPI QR" className="w-48 h-48 rounded-xl object-contain bg-white p-2" />
                  ) : (
                    <div className="w-48 h-48 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-2">
                      <span className="text-4xl">📱</span>
                      <p className="text-white/30 text-xs text-center">QR not provided</p>
                    </div>
                  )}
                  <div className="text-center">
                    <p className="text-white/30 text-[10px] font-bold tracking-widest uppercase mb-1">UPI ID</p>
                    <p className="text-[#FACC15] font-mono font-bold text-sm">{form.upiId}</p>
                  </div>
                </div>

                {/* Payment proof */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-white/60 text-xs font-semibold tracking-widest uppercase">
                    UPI Transaction ID <span className="text-red-400">*</span>
                  </label>
                  <input
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-[#FACC15]/50 transition-all"
                    placeholder="Enter transaction ID after payment"
                    value={paymentProof}
                    onChange={(e) => setPaymentProof(e.target.value)}
                  />
                  <p className="text-white/25 text-[10px]">Enter the UPI transaction ID you received after paying</p>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)}
                    className="flex-1 py-3 rounded-xl border border-white/10 text-white/50 text-sm font-medium hover:border-white/20 transition-all">
                    ← Back
                  </button>
                  <button onClick={handleSubmit} disabled={submitting}
                    className="flex-1 py-3 rounded-xl bg-[#FACC15] text-black font-['Syne'] font-bold text-sm hover:bg-yellow-300 transition-all disabled:opacity-60">
                    {submitting ? "Submitting..." : "Submit & Get Ticket →"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Step 3: Ticket */}
      <AnimatePresence>
        {step === 3 && ticket && (
          <TicketModal ticket={ticket} event={event} onClose={() => { setStep(1); onClose(); }} />
        )}
      </AnimatePresence>
    </>
  );
}