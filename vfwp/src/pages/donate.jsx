import { useState } from "react";

export default function Donate() {
  const [amount, setAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState("");
  const [isMonthly, setIsMonthly] = useState(false);

  const predefinedAmounts = [100, 500, 1000, 2500];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white px-6 py-12">
      
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gradient-yellow mb-4">
          Support Our Cause
        </h1>
        <p className="text-gray-400 text-lg">
          Your contribution helps us uplift tribal communities and create real impact.
        </p>
      </div>

      {/* Donation Card */}
      <div className="max-w-3xl mx-auto bg-[#111] p-8 rounded-2xl card-border glow-yellow">
        
        {/* Toggle */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setIsMonthly(false)}
            className={`px-6 py-2 rounded-l-full border ${
              !isMonthly ? "bg-yellow-400 text-black" : "border-gray-600"
            }`}
          >
            One-Time
          </button>
          <button
            onClick={() => setIsMonthly(true)}
            className={`px-6 py-2 rounded-r-full border ${
              isMonthly ? "bg-yellow-400 text-black" : "border-gray-600"
            }`}
          >
            Monthly
          </button>
        </div>

        {/* Amount Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {predefinedAmounts.map((amt) => (
            <button
              key={amt}
              onClick={() => {
                setAmount(amt);
                setCustomAmount("");
              }}
              className={`py-3 rounded-xl border ${
                amount === amt
                  ? "bg-yellow-400 text-black"
                  : "border-gray-600 hover:border-yellow-400"
              }`}
            >
              ₹{amt}
            </button>
          ))}
        </div>

        {/* Custom Amount */}
        <div className="mb-6">
          <input
            type="number"
            placeholder="Enter custom amount"
            value={customAmount}
            onChange={(e) => {
              setCustomAmount(e.target.value);
              setAmount(e.target.value);
            }}
            className="w-full p-3 rounded-lg bg-black border border-gray-600 focus:border-yellow-400 outline-none"
          />
        </div>

        {/* Donor Info */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <input
            type="text"
            placeholder="Full Name"
            className="p-3 rounded-lg bg-black border border-gray-600 focus:border-yellow-400 outline-none"
          />
          <input
            type="email"
            placeholder="Email Address"
            className="p-3 rounded-lg bg-black border border-gray-600 focus:border-yellow-400 outline-none"
          />
        </div>

        {/* Message */}
        <textarea
          placeholder="Leave a message (optional)"
          rows="3"
          className="w-full p-3 mb-6 rounded-lg bg-black border border-gray-600 focus:border-yellow-400 outline-none"
        />

        {/* Donate Button */}
        <button className="w-full py-4 text-lg font-semibold rounded-xl bg-yellow-400 text-black hover:opacity-90 transition">
          Donate ₹{amount || 0} {isMonthly && "/month"}
        </button>
      </div>

      {/* Footer Note */}
      <div className="text-center mt-8 text-gray-500 text-sm">
        100% of your donation goes directly to supporting our initiatives.
      </div>
    </div>
  );
}