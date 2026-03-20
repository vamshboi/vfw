import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/useauth";

const API = "https://vfw-server.onrender.com/api";

const FIELD_TYPES = [
  { type: "text", label: "Text Input", icon: "📝" },
  { type: "number", label: "Number Input", icon: "🔢" },
  { type: "dropdown", label: "Dropdown Select", icon: "📋" },
  { type: "file", label: "File Upload", icon: "📎" },
];

function FieldEditor({ field, index, onChange, onRemove }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-black rounded-xl p-4 relative"
      style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.08)" }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-bold text-[#FACC15]/70 tracking-widest uppercase">
          Field {index + 1} — {FIELD_TYPES.find(f => f.type === field.type)?.label}
        </span>
        <button onClick={() => onRemove(index)}
          className="w-6 h-6 rounded-full bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center transition-colors">
          <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3">
            <path d="M4 4l8 8M12 4l-8 8" stroke="#f87171" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <input
          className="w-full bg-[#0d0d0d] border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/25 focus:outline-none focus:border-[#FACC15]/40 transition-all"
          placeholder="Field Label *"
          value={field.label}
          onChange={(e) => onChange(index, { ...field, label: e.target.value })}
        />

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={field.required}
              onChange={(e) => onChange(index, { ...field, required: e.target.checked })}
              className="w-3.5 h-3.5 accent-yellow-400"
            />
            <span className="text-white/50 text-xs">Required</span>
          </label>
        </div>

        {field.type === "dropdown" && (
          <div>
            <p className="text-white/30 text-[10px] font-bold tracking-widest uppercase mb-2">Options (comma separated)</p>
            <input
              className="w-full bg-[#0d0d0d] border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/25 focus:outline-none focus:border-[#FACC15]/40 transition-all"
              placeholder="Option 1, Option 2, Option 3"
              value={field.options?.join(", ") || ""}
              onChange={(e) => onChange(index, { ...field, options: e.target.value.split(",").map(o => o.trim()) })}
            />
          </div>
        )}

        {field.type === "file" && (
          <div>
            <p className="text-white/30 text-[10px] font-bold tracking-widest uppercase mb-2">Accepted File Types</p>
            <input
              className="w-full bg-[#0d0d0d] border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/25 focus:outline-none focus:border-[#FACC15]/40 transition-all"
              placeholder="e.g. image/*, .pdf"
              value={field.accept || ""}
              onChange={(e) => onChange(index, { ...field, accept: e.target.value })}
            />
          </div>
        )}

        {field.type === "number" && (
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              className="bg-[#0d0d0d] border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/25 focus:outline-none focus:border-[#FACC15]/40 transition-all"
              placeholder="Min value"
              value={field.min || ""}
              onChange={(e) => onChange(index, { ...field, min: e.target.value })}
            />
            <input
              type="number"
              className="bg-[#0d0d0d] border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/25 focus:outline-none focus:border-[#FACC15]/40 transition-all"
              placeholder="Max value"
              value={field.max || ""}
              onChange={(e) => onChange(index, { ...field, max: e.target.value })}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function EventFormBuilder({ eventId, onClose, onSaved }) {
  const { token } = useAuth();
  const [fields, setFields] = useState([]);
  const [amount, setAmount] = useState("");
  const [upiId, setUpiId] = useState("");
  const [upiQrImage, setUpiQrImage] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const addField = (type) => {
    setFields((prev) => [...prev, { type, label: "", required: false, options: [], accept: "" }]);
  };

  const updateField = (index, updated) => {
    setFields((prev) => prev.map((f, i) => i === index ? updated : f));
  };

  const removeField = (index) => {
    setFields((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (fields.length === 0) { alert("Add at least one field!"); return; }
    if (!amount) { alert("Enter travel fee amount!"); return; }
    if (!upiId) { alert("Enter your UPI ID!"); return; }

    setSaving(true);
    try {
      const res = await fetch(`${API}/eventforms`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ eventId, fields, amount: parseFloat(amount), upiId, upiQrImage }),
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => { onSaved?.(); onClose(); }, 1500);
      }
    } catch (err) {
      alert("Failed to save form");
    }
    setSaving(false);
  };

  const inputClass = "w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-[#FACC15]/50 transition-all duration-200";

  return (
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
        className="relative w-full max-w-2xl bg-[#0d0d0d] rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.08), 0 40px 100px rgba(0,0,0,0.8)" }}
      >
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FACC15] to-transparent" />

        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[#FACC15] text-[10px] font-bold tracking-widest uppercase mb-1">Admin</p>
              <h3 className="font-['Syne'] text-white text-xl font-extrabold">Create Registration Form</h3>
              <p className="text-white/40 text-xs mt-0.5">Build a custom form for volunteers to register</p>
            </div>
            <button onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
              <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                <path d="M4 4l8 8M12 4l-8 8" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {success ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-3 py-12">
              <div className="w-16 h-16 rounded-full bg-[#FACC15]/15 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
                  <path d="M5 12l5 5L20 7" stroke="#FACC15" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="font-['Syne'] text-white font-bold text-lg">Form Created!</p>
              <p className="text-white/40 text-sm">Volunteers can now register for this event</p>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-6">

              {/* Payment Section */}
              <div className="bg-black rounded-xl p-5" style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.07)" }}>
                <p className="text-[#FACC15] text-[10px] font-bold tracking-widest uppercase mb-4">Payment Details</p>
                <div className="flex flex-col gap-3">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-sm font-bold">₹</span>
                    <input
                      type="number"
                      className="w-full bg-[#0d0d0d] border border-white/10 rounded-xl pl-8 pr-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-[#FACC15]/50 transition-all"
                      placeholder="Travel fee amount *"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                  <input
                    className={inputClass}
                    placeholder="Your UPI ID * (e.g. name@upi)"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                  />
                  <input
                    className={inputClass}
                    placeholder="UPI QR Code Image URL (optional)"
                    value={upiQrImage}
                    onChange={(e) => setUpiQrImage(e.target.value)}
                  />
                  <p className="text-white/25 text-[10px]">
                    💡 Upload your QR code to any image host (like imgur.com) and paste the URL above
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-white/40 text-[10px] font-bold tracking-widest uppercase">Form Fields</p>
                  <span className="text-white/25 text-xs">{fields.length} fields added</span>
                </div>

                {/* Add field buttons */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {FIELD_TYPES.map((ft) => (
                    <button
                      key={ft.type}
                      onClick={() => addField(ft.type)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-[#FACC15]/40 hover:bg-[#FACC15]/5 text-white/60 hover:text-[#FACC15] text-xs font-medium transition-all duration-200"
                    >
                      <span>{ft.icon}</span>
                      + {ft.label}
                    </button>
                  ))}
                </div>

                {/* Field editors */}
                <AnimatePresence>
                  {fields.length === 0 ? (
                    <div className="text-center py-8 text-white/20 text-sm border border-dashed border-white/10 rounded-xl">
                      Click buttons above to add form fields
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {fields.map((field, i) => (
                        <FieldEditor
                          key={i}
                          field={field}
                          index={i}
                          onChange={updateField}
                          onRemove={removeField}
                        />
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* Save */}
              <div className="flex gap-3 pt-2">
                <button onClick={onClose}
                  className="flex-1 py-3 rounded-xl border border-white/10 text-white/50 text-sm font-medium hover:border-white/20 transition-all">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="flex-1 py-3 rounded-xl bg-[#FACC15] text-black font-['Syne'] font-bold text-sm hover:bg-yellow-300 transition-all disabled:opacity-60">
                  {saving ? "Saving..." : "Save Form →"}
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}