import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/useauth";
const InputField = ({ label, type = "text", value, onChange, error, autoComplete }) => {
  const [focused, setFocused] = useState(false);
  const isFloating = focused || value.length > 0;

  return (
    <div className="relative mb-5">
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

export default function LoginForm({ onSwitchTab, onClose }) {
  const [fields, setFields] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { login } = useAuth();
  const validate = () => {
    const e = {};
    if (!fields.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) e.email = "Enter a valid email";
    if (!fields.password) e.password = "Password is required";
    else if (fields.password.length < 6) e.password = "Minimum 6 characters";
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
    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: fields.email,
        password: fields.password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setErrors({ email: data.message || "Login failed" });
      setLoading(false);
      return;
    }

    // store token
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
      <div className="mb-7">
        <h2 className="text-2xl font-bold text-white tracking-tight">Welcome back</h2>
        <p className="text-sm text-white/40 mt-1">Sign in to continue your mission with VFW</p>
      </div>

      <InputField
        label="Email address"
        type="email"
        value={fields.email}
        onChange={(e) => setFields((f) => ({ ...f, email: e.target.value }))}
        error={errors.email}
        autoComplete="email"
      />
      <InputField
        label="Password"
        type="password"
        value={fields.password}
        onChange={(e) => setFields((f) => ({ ...f, password: e.target.value }))}
        error={errors.password}
        autoComplete="current-password"
      />

      <div className="flex justify-end mb-6">
        <button className="text-xs text-yellow-400/70 hover:text-yellow-400 transition-colors">
          Forgot password?
        </button>
      </div>

      <motion.button
        onClick={handleSubmit}
        disabled={loading || success}
        whileHover={{ scale: 1.015, boxShadow: "0 0 28px rgba(250,204,21,0.35)" }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3.5 rounded-xl font-bold text-sm tracking-widest uppercase transition-all duration-300 relative overflow-hidden"
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
            Signing in…
          </span>
        ) : success ? (
          <span className="flex items-center justify-center gap-2 text-white">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Signed in!
          </span>
        ) : (
          "Sign In"
        )}
      </motion.button>

      <p className="mt-5 text-center text-sm text-white/40">
        New to Voice For Welfare?{" "}
        <button
          onClick={onSwitchTab}
          className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors underline-offset-2 hover:underline"
        >
          Join us →
        </button>
      </p>
    </div>
  );
}