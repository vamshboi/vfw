import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/useauth";

const InputField = ({ label, type = "text", value, onChange, error, autoComplete }) => {
  const [focused, setFocused] = useState(false);
  const isFloating = focused || value.length > 0;

  return (
    <div className="relative mb-4">
      <div
        className={`relative rounded-xl overflow-hidden transition-all duration-300 ${
          error
            ? "ring-1 ring-red-500/60"
            : focused
            ? "ring-1 ring-yellow-400/80 shadow-[0_0_16px_rgba(250,204,21,0.15)]"
            : "ring-1 ring-white/8"
        }`}
        style={{ background: "rgba(255,255,255,0.04)" }}
      >
        <label
          className={`absolute left-4 transition-all duration-200 pointer-events-none font-medium tracking-wide ${
            isFloating
              ? "top-2 text-[10px] text-yellow-400/80"
              : "top-1/2 -translate-y-1/2 text-sm text-white/40"
          }`}
        >
          {label}
        </label>
        <input
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoComplete={autoComplete}
          className="w-full bg-transparent pt-6 pb-2 px-4 text-sm text-white outline-none"
          style={{ caretColor: "#FACC15" }}
        />
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1.5 text-xs text-red-400 pl-1"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default function RegisterForm({ onSwitchTab, onClose }) {
  const [fields, setFields] = useState({ name: "", email: "", password: "", phone: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { login } = useAuth();

  const set = (key) => (e) => setFields((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!fields.name.trim()) e.name = "Name is required";
    if (!fields.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) e.email = "Enter a valid email";
    if (!fields.password) e.password = "Password is required";
    else if (fields.password.length < 6) e.password = "Minimum 6 characters";
    if (fields.phone && !/^\+?[\d\s\-()]{7,15}$/.test(fields.phone))
      e.phone = "Enter a valid phone number";
    return e;
  };

  const handleSubmit = async () => {
  const e = validate();
  if (Object.keys(e).length) {
    setErrors(e);
    return;
  }

  setErrors({});
  setLoading(true);

  try {
    const res = await fetch(`${"https://vfw-server.onrender.com/api"}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: fields.name,
        email: fields.email,
        password: fields.password,
        phone: fields.phone || null,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setErrors({ email: data.message || "Registration failed" });
      setLoading(false);
      return;
    }

    // store token + user
    login(data.user, data.token);

    setLoading(false);
    setSuccess(true);

    setTimeout(() => {
      onClose?.();
      window.location.reload();
    }, 1200);

  } catch (err) {
    console.error(err);
    setErrors({ email: "Server error. Try again." });
    setLoading(false);
  }
};

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">Join the movement</h2>
        <p className="text-sm text-white/40 mt-1">Become a voice for those who need it most</p>
      </div>

      {/* Decorative mission badge */}
      <div
        className="flex items-center gap-2 mb-5 px-3 py-2 rounded-lg"
        style={{ background: "rgba(250,204,21,0.07)", border: "1px solid rgba(250,204,21,0.15)" }}
      >
        <svg className="w-4 h-4 text-yellow-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <p className="text-xs text-yellow-400/70 font-medium">Your impact begins the moment you register</p>
      </div>

      <InputField
        label="Full name"
        value={fields.name}
        onChange={set("name")}
        error={errors.name}
        autoComplete="name"
      />
      <InputField
        label="Email address"
        type="email"
        value={fields.email}
        onChange={set("email")}
        error={errors.email}
        autoComplete="email"
      />
      <InputField
        label="Password"
        type="password"
        value={fields.password}
        onChange={set("password")}
        error={errors.password}
        autoComplete="new-password"
      />
      <InputField
        label="Phone number (optional)"
        type="tel"
        value={fields.phone}
        onChange={set("phone")}
        error={errors.phone}
        autoComplete="tel"
      />

      <motion.button
        onClick={handleSubmit}
        disabled={loading || success}
        whileHover={{ scale: 1.015, boxShadow: "0 0 28px rgba(250,204,21,0.35)" }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-2 py-3.5 rounded-xl font-bold text-sm tracking-widest uppercase transition-all duration-300"
        style={{
          background: success ? "#16a34a" : "#FACC15",
          color: "#0A0A0A",
        }}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Creating account…
          </span>
        ) : success ? (
          <span className="flex items-center justify-center gap-2 text-white">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Welcome aboard!
          </span>
        ) : (
          "Create Account"
        )}
      </motion.button>

      <p className="mt-5 text-center text-sm text-white/40">
        Already a member?{" "}
        <button
          onClick={onSwitchTab}
          className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors underline-offset-2 hover:underline"
        >
          Sign in →
        </button>
      </p>
    </div>
  );
}