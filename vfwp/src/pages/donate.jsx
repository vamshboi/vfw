import { useState } from "react";

export default function Donate() {
  const [amount, setAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState("");
  const [isMonthly, setIsMonthly] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const predefinedAmounts = [100, 500, 1000, 2500];

  const handleDonate = async () => {
    if (!amount || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }
    if (!email.trim()) {
      alert("Please enter your email");
      return;
    }

    setLoading(true);

    try {
      // Step 1 — Create order from backend
      const res = await fetch("http://localhost:5000/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(amount) }),
      });

      const order = await res.json();

      // Step 2 — Open Razorpay checkout
      const options = {
        key: "rzp_test_xxxxxx", // 🔴 Replace with your Razorpay Key ID
        amount: order.amount,
        currency: order.currency,
        name: "Voice For Welfare",
        description: isMonthly ? "Monthly Donation" : "One-Time Donation",
        order_id: order.id,
        prefill: {
          name: name,
          email: email,
        },
        notes: {
          message: message,
        },
        theme: {
          color: "#FACC15",
        },
        handler: function (response) {
          // Save donation to database
          fetch(`${import.meta.env.VITE_API_URL}/donations`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: name,
              email: email,
              amount: Number(amount),
              method: "Razorpay",
              message: message,
              paymentId: response.razorpay_payment_id,
            }),
          });
          setSuccess(true);
          setLoading(false);
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        alert("Payment failed: " + response.error.description);
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  // ── Success Screen ──
  if (success) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-[#0d0d0d] p-10 rounded-2xl text-center"
          style={{ boxShadow: "0 0 0 1px rgba(250,204,21,0.15)" }}
        >
          <div className="w-20 h-20 rounded-full bg-[#FACC15]/15 flex items-center justify-center mx-auto mb-6">
            <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10">
              <path d="M5 12l5 5L20 7" stroke="#FACC15" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="font-['Syne'] text-white text-3xl font-extrabold mb-3">Thank You! 🙏</h2>
          <p className="text-white/50 text-sm leading-relaxed mb-2">
            Your donation of <span className="text-[#FACC15] font-bold">₹{amount}</span> has been received.
          </p>
          <p className="text-white/40 text-xs leading-relaxed mb-8">
            100% of your contribution goes directly to tribal communities and welfare initiatives.
          </p>
          <button
            onClick={() => {
              setSuccess(false);
              setAmount(500);
              setName("");
              setEmail("");
              setMessage("");
              setCustomAmount("");
            }}
            className="w-full py-3 rounded-xl bg-[#FACC15] text-black font-['Syne'] font-bold hover:bg-yellow-300 transition-all duration-200"
          >
            Donate Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-20">

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#FACC15]/30 bg-[#FACC15]/8 text-[#FACC15] text-xs font-semibold tracking-widest uppercase mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FACC15] animate-pulse" />
          Make a Difference
        </span>
        <h1
          className="font-['Syne'] text-4xl md:text-5xl font-extrabold mb-4"
          style={{
            backgroundImage: "linear-gradient(135deg,#ffffff,#FACC15)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Support Our Cause
        </h1>
        <p className="text-white/45 text-lg">
          Your contribution helps us uplift tribal communities and welfare of women and children.
        </p>
      </div>

      {/* Donation Card */}
      <div
        className="max-w-3xl mx-auto bg-[#0d0d0d] p-8 rounded-2xl relative"
        style={{ boxShadow: "0 0 0 1px rgba(250,204,21,0.12), 0 0 60px rgba(250,204,21,0.04)" }}
      >
        {/* Top accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FACC15] to-transparent rounded-t-2xl" />

        {/* Toggle */}
        <div className="flex justify-center mb-8">
          <div className="flex p-1 bg-black rounded-xl border border-white/10">
            <button
              onClick={() => setIsMonthly(false)}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                !isMonthly ? "bg-[#FACC15] text-black" : "text-white/40 hover:text-white/70"
              }`}
            >
              One-Time
            </button>
            <button
              onClick={() => setIsMonthly(true)}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                isMonthly ? "bg-[#FACC15] text-black" : "text-white/40 hover:text-white/70"
              }`}
            >
              Monthly
            </button>
          </div>
        </div>

        {/* Amount Selection */}
        <p className="text-white/40 text-xs font-bold tracking-widest uppercase mb-3">Select Amount</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {predefinedAmounts.map((amt) => (
            <button
              key={amt}
              onClick={() => {
                setAmount(amt);
                setCustomAmount("");
              }}
              className={`py-3 rounded-xl border font-['Syne'] font-bold text-sm transition-all duration-200 ${
                amount === amt && !customAmount
                  ? "bg-[#FACC15] text-black border-[#FACC15] shadow-lg shadow-[#FACC15]/20"
                  : "border-white/10 hover:border-[#FACC15]/50 text-white/70"
              }`}
            >
              ₹{amt}
            </button>
          ))}
        </div>

        {/* Custom Amount */}
        <div className="mb-6 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-sm font-bold">₹</span>
          <input
            type="number"
            placeholder="Enter custom amount"
            value={customAmount}
            onChange={(e) => {
              setCustomAmount(e.target.value);
              setAmount(e.target.value);
            }}
            className="w-full pl-8 pr-4 py-3 rounded-xl bg-black border border-white/10 focus:border-[#FACC15]/50 focus:ring-1 focus:ring-[#FACC15]/20 outline-none text-white text-sm transition-all duration-200"
          />
        </div>

        {/* Donor Info */}
        <p className="text-white/40 text-xs font-bold tracking-widest uppercase mb-3">Your Details</p>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Full Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-3 rounded-xl bg-black border border-white/10 focus:border-[#FACC15]/50 focus:ring-1 focus:ring-[#FACC15]/20 outline-none text-white text-sm transition-all duration-200"
          />
          <input
            type="email"
            placeholder="Email Address *"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded-xl bg-black border border-white/10 focus:border-[#FACC15]/50 focus:ring-1 focus:ring-[#FACC15]/20 outline-none text-white text-sm transition-all duration-200"
          />
        </div>

        {/* Message */}
        <textarea
          placeholder="Leave a message (optional)"
          rows="3"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-3 mb-6 rounded-xl bg-black border border-white/10 focus:border-[#FACC15]/50 focus:ring-1 focus:ring-[#FACC15]/20 outline-none text-white text-sm resize-none transition-all duration-200"
        />

        {/* Impact note */}
        <div className="flex items-start gap-3 p-4 bg-[#FACC15]/5 rounded-xl border border-[#FACC15]/15 mb-6">
          <span className="text-xl">🤝</span>
          <p className="text-white/50 text-xs leading-relaxed">
            Your donation of{" "}
            <span className="text-[#FACC15] font-bold">₹{amount || 0}</span>{" "}
            will directly support tribal families, children's education, and women empowerment programs.
          </p>
        </div>

        {/* Donate Button */}
        <button
          onClick={handleDonate}
          disabled={loading}
          className="w-full py-4 text-base font-['Syne'] font-bold rounded-xl bg-[#FACC15] text-black hover:bg-yellow-300 transition-all duration-200 shadow-lg shadow-[#FACC15]/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Processing...
            </>
          ) : (
            <>❤️ Donate ₹{amount || 0}{isMonthly ? "/month" : ""}</>
          )}
        </button>

        {/* Security note */}
        <p className="text-center text-white/25 text-xs mt-4">
          🔒 Secured by Razorpay · 100% goes to the cause · No middlemen
        </p>
      </div>

      {/* Footer Note */}
      <div className="text-center mt-8 text-white/30 text-sm">
        Voice For Welfare is committed to full transparency in fund utilization.
      </div>
    </div>
  );
}