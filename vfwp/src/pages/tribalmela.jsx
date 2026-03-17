import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Mock Product Data ────────────────────────────────────────────────────────
const PRODUCTS = [
  { id: 1, name: "Warli Village Scene", artist: "Sushma Gavit", tribe: "Warli", price: 2800, originalPrice: 3500, category: "Paintings", badge: "Bestseller", emoji: "🖼️", description: "Hand-painted Warli art depicting village life, celebrations, and nature in traditional white on terracotta.", image: null, rating: 4.9, reviews: 42, inStock: true },
  { id: 2, name: "Dhokra Tribal Figurine", artist: "Ramesh Shil", tribe: "Bastar", price: 1850, originalPrice: null, category: "Handicrafts", badge: "Handcrafted", emoji: "🏺", description: "Lost-wax cast brass figurine using 5000-year-old Dhokra craft tradition from Chhattisgarh.", image: null, rating: 4.8, reviews: 28, inStock: true },
  { id: 3, name: "Gond Painting — Forest Spirit", artist: "Durgabai Vyam", tribe: "Gond", price: 4200, originalPrice: 5000, category: "Paintings", badge: "Award Winning", emoji: "🌿", description: "Vibrant Gond painting with intricate dot patterns depicting the forest deity and tribal folklore.", image: null, rating: 5.0, reviews: 67, inStock: true },
  { id: 4, name: "Tribal Silver Choker Set", artist: "Kamla Devi", tribe: "Lambadi", price: 1200, originalPrice: null, category: "Jewelry", badge: "New Arrival", emoji: "💍", description: "Handcrafted oxidized silver choker with traditional Lambadi mirror-work and thread embroidery.", image: null, rating: 4.7, reviews: 19, inStock: true },
  { id: 5, name: "Bamboo Weave Storage Basket", artist: "Suresh Majhi", tribe: "Santhali", price: 680, originalPrice: null, category: "Handicrafts", badge: null, emoji: "🧺", description: "Eco-friendly handwoven bamboo basket using techniques passed down through Santhali generations.", image: null, rating: 4.6, reviews: 35, inStock: true },
  { id: 6, name: "Pattachitra Story Scroll", artist: "Aparna Moharana", tribe: "Odisha", price: 3600, originalPrice: 4200, category: "Artifacts", badge: "Heritage Craft", emoji: "📜", description: "Traditional cloth-based scroll painting narrating Jagannath mythology in vivid natural pigments.", image: null, rating: 4.9, reviews: 53, inStock: false },
  { id: 7, name: "Madhubani Fish Painting", artist: "Meena Devi", tribe: "Mithila", price: 1900, originalPrice: null, category: "Paintings", badge: null, emoji: "🐟", description: "Auspicious fish motif in classic Madhubani style — a traditional wedding gift in Bihar.", image: null, rating: 4.8, reviews: 31, inStock: true },
  { id: 8, name: "Tribal Terracotta Horse", artist: "Mohan Kumbhar", tribe: "Kutch", price: 920, originalPrice: null, category: "Artifacts", badge: null, emoji: "🐴", description: "Hand-molded and kiln-fired terracotta horse — a sacred offering piece used in tribal rituals.", image: null, rating: 4.5, reviews: 14, inStock: true },
  { id: 9, name: "Beaded Tribal Bracelet", artist: "Radha Bai", tribe: "Bhil", price: 450, originalPrice: null, category: "Jewelry", badge: "Popular", emoji: "📿", description: "Handstrung colorful glass bead bracelet in traditional Bhil geometric patterns from Rajasthan.", image: null, rating: 4.7, reviews: 88, inStock: true },
];

const CATEGORIES = ["All", "Paintings", "Handicrafts", "Jewelry", "Artifacts"];
const CATEGORY_ICONS = { All: "✦", Paintings: "🖼️", Handicrafts: "🏺", Jewelry: "💍", Artifacts: "🪆" };
const BADGE_STYLES = {
  "Bestseller": "bg-[#FACC15] text-black",
  "Award Winning": "bg-gradient-to-r from-[#FACC15] to-amber-300 text-black",
  "New Arrival": "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
  "Handcrafted": "bg-white/10 text-white/70 border border-white/15",
  "Heritage Craft": "bg-purple-500/20 text-purple-300 border border-purple-500/25",
  "Popular": "bg-orange-500/20 text-orange-300 border border-orange-500/25",
};

// ─── Cart Hook ────────────────────────────────────────────────────────────────
function useCart() {
  const [cart, setCart] = useState([]);
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
  };
  const removeFromCart = (id) => setCart((prev) => prev.filter((i) => i.id !== id));
  const updateQty = (id, qty) => {
    if (qty < 1) { removeFromCart(id); return; }
    setCart((prev) => prev.map((i) => i.id === id ? { ...i, qty } : i));
  };
  const clearCart = () => setCart([]);
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);
  return { cart, addToCart, removeFromCart, updateQty, clearCart, total, count };
}

// ─── Stars ────────────────────────────────────────────────────────────────────
function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} viewBox="0 0 12 12" fill="none" className="w-3 h-3">
          <path d="M6 1l1.236 2.504L10 3.882l-2 1.95.472 2.75L6 7.25 3.528 8.582 4 5.832 2 3.882l2.764-.378L6 1z" fill={s <= Math.round(rating) ? "#FACC15" : "rgba(255,255,255,0.1)"} />
        </svg>
      ))}
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ product, index, onAddToCart, onQuickView }) {
  const [added, setAdded] = useState(false);
  const handleAdd = () => {
    if (!product.inStock) return;
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };
  const gradients = { Paintings: "from-amber-900/30 to-black", Handicrafts: "from-orange-900/20 to-black", Jewelry: "from-yellow-900/20 to-black", Artifacts: "from-purple-900/20 to-black" };
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, transition: { duration: 0.25, ease: "easeOut" } }}
      className="group relative bg-[#0d0d0d] rounded-2xl overflow-hidden flex flex-col"
      style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.07)" }}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl z-0" style={{ background: "radial-gradient(ellipse at 50% 0%,rgba(250,204,21,0.07) 0%,transparent 70%)" }} />
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FACC15]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
      <div className="relative w-full aspect-square overflow-hidden shrink-0">
        <div className={`w-full h-full bg-gradient-to-br ${gradients[product.category] || "from-[#1e1e1e] to-black"} flex items-center justify-center`}>
          <span className="text-7xl opacity-70 group-hover:scale-110 transition-transform duration-500 select-none">{product.emoji}</span>
        </div>
        <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-[#FACC15]/30 rounded-tl-sm pointer-events-none" />
        <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-[#FACC15]/30 rounded-tr-sm pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-[#FACC15]/30 rounded-bl-sm pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-[#FACC15]/30 rounded-br-sm pointer-events-none" />
        {product.badge && (
          <div className="absolute top-3 left-3 z-10">
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wider ${BADGE_STYLES[product.badge] || "bg-white/10 text-white/60"}`}>{product.badge}</span>
          </div>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
            <span className="text-white/60 text-xs font-semibold tracking-widest uppercase bg-black/50 px-3 py-1.5 rounded-full border border-white/15">Out of Stock</span>
          </div>
        )}
        <button onClick={() => onQuickView(product)} className="absolute bottom-3 right-3 z-10 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 w-8 h-8 rounded-full bg-black/70 hover:bg-black/90 flex items-center justify-center backdrop-blur-sm">
          <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 text-white"><circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" /><path d="M1.5 8C3 4.5 5.5 2.5 8 2.5s5 2 6.5 5.5C13 11.5 10.5 13.5 8 13.5S3 11.5 1.5 8z" stroke="currentColor" strokeWidth="1.5" /></svg>
        </button>
      </div>
      <div className="p-4 flex flex-col gap-2.5 flex-1 relative z-10">
        <div className="flex items-center justify-between">
          <span className="text-[#FACC15]/70 text-[10px] font-bold tracking-widest uppercase">{product.tribe} Tribe</span>
          <span className="text-white/25 text-[10px] border border-white/10 px-2 py-0.5 rounded-full">{product.category}</span>
        </div>
        <h3 className="font-['Syne'] text-white font-semibold text-sm leading-snug group-hover:text-[#FACC15] transition-colors duration-300 line-clamp-1">{product.name}</h3>
        <p className="text-white/35 text-[11px]">by {product.artist}</p>
        <div className="flex items-center gap-1.5"><Stars rating={product.rating} /><span className="text-white/30 text-[10px]">({product.reviews})</span></div>
        <p className="text-white/40 text-xs leading-relaxed line-clamp-2 flex-1">{product.description}</p>
        <div className="pt-2.5 border-t border-white/5 flex items-center justify-between gap-3 mt-1">
          <div className="flex flex-col">
            <span className="font-['Syne'] text-white font-bold text-base">₹{product.price.toLocaleString()}</span>
            {product.originalPrice && <span className="text-white/30 text-[10px] line-through">₹{product.originalPrice.toLocaleString()}</span>}
          </div>
          <motion.button whileTap={{ scale: 0.93 }} onClick={handleAdd} disabled={!product.inStock}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-['Syne'] font-bold transition-all duration-300 ${added ? "bg-emerald-500 text-white" : product.inStock ? "bg-[#FACC15] text-black hover:bg-yellow-300 shadow-lg shadow-[#FACC15]/20" : "bg-white/5 text-white/25 cursor-not-allowed"}`}>
            {added ? (<><svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5"><path d="M3 8l4 4 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>Added</>) : (<><svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5"><path d="M1 1h2l2.5 8h7l1.5-5H5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /><circle cx="7" cy="13" r="1" fill="currentColor" /><circle cx="12" cy="13" r="1" fill="currentColor" /></svg>Add</>)}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Delivery Form ────────────────────────────────────────────────────────────
function DeliveryForm({ cart, total, onBack, onSuccess }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "", state: "", pincode: "" });
  const [loading, setLoading] = useState(false);
  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const inputClass = "w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-[#FACC15]/50 focus:ring-1 focus:ring-[#FACC15]/20 transition-all duration-200";

  const handlePayment = async () => {
    const { name, email, phone, address, city, state, pincode } = form;
    if (!name || !email || !phone || !address || !city || !state || !pincode) {
      alert("Please fill in all delivery details");
      return;
    }
    if (phone.length < 10) { alert("Please enter a valid phone number"); return; }
    if (pincode.length !== 6) { alert("Please enter a valid 6-digit pincode"); return; }

    setLoading(true);
    try {
      const res = await fetch("https://vfw-server.onrender.com/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total }),
      });
      const order = await res.json();

      const options = {
        key: "rzp_test_SSFrbdbdcHZ2Si", // 🔴 Replace with your Razorpay Key ID
        amount: order.amount,
        currency: order.currency,
        name: "Voice For Welfare — Tribal Mela",
        description: `${cart.length} item(s) from Tribal Mela`,
        order_id: order.id,
        prefill: { name, email, contact: phone },
        notes: { address: `${address}, ${city}, ${state} - ${pincode}` },
        theme: { color: "#FACC15" },
       handler: function (response) {
  // Send confirmation email
  fetch("https://vfw-server.onrender.com/send-confirmation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: form.name,
      email: form.email,
      phone: form.phone,
      address: form.address,
      city: form.city,
      state: form.state,
      pincode: form.pincode,
      paymentId: response.razorpay_payment_id,
      items: cart,
      total: total,
    }),
  });
  setLoading(false);
  onSuccess({ ...form, paymentId: response.razorpay_payment_id });
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

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94, y: 24 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-2xl bg-[#0d0d0d] rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.08), 0 40px 100px rgba(0,0,0,0.8)" }}
      >
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FACC15] to-transparent" />

        <div className="p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button onClick={onBack} className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors duration-200">
              <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4"><path d="M10 3L5 8l5 5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <div>
              <p className="text-[#FACC15] text-[10px] font-bold tracking-widest uppercase mb-0.5">Checkout</p>
              <h3 className="font-['Syne'] text-white text-lg font-extrabold">Delivery Details</h3>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-black rounded-xl p-4 mb-6" style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.06)" }}>
            <p className="text-white/40 text-[10px] font-bold tracking-widest uppercase mb-3">Order Summary</p>
            <div className="flex flex-col gap-2 mb-3">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.emoji}</span>
                    <div>
                      <p className="text-white/70 text-xs font-medium line-clamp-1">{item.name}</p>
                      <p className="text-white/30 text-[10px]">x{item.qty}</p>
                    </div>
                  </div>
                  <span className="text-[#FACC15] text-xs font-bold shrink-0">₹{(item.price * item.qty).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-white/8 pt-3 flex items-center justify-between">
              <span className="text-white/50 text-sm">Total</span>
              <span className="font-['Syne'] text-white text-lg font-extrabold">₹{total.toLocaleString()}</span>
            </div>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-4">
            <p className="text-white/40 text-[10px] font-bold tracking-widest uppercase">Personal Details</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input className={inputClass} placeholder="Full Name *" value={form.name} onChange={(e) => set("name", e.target.value)} />
              <input className={inputClass} placeholder="Email Address *" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
            </div>
            <input className={inputClass} placeholder="Phone Number *" type="tel" maxLength={10} value={form.phone} onChange={(e) => set("phone", e.target.value)} />

            <p className="text-white/40 text-[10px] font-bold tracking-widest uppercase mt-2">Delivery Address</p>
            <textarea className={`${inputClass} resize-none`} rows={2} placeholder="House No, Street, Area *" value={form.address} onChange={(e) => set("address", e.target.value)} />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input className={inputClass} placeholder="City *" value={form.city} onChange={(e) => set("city", e.target.value)} />
              <input className={inputClass} placeholder="State *" value={form.state} onChange={(e) => set("state", e.target.value)} />
              <input className={inputClass} placeholder="Pincode *" maxLength={6} value={form.pincode} onChange={(e) => set("pincode", e.target.value)} />
            </div>

            {/* Artisan note */}
            <div className="flex items-start gap-3 p-4 bg-[#FACC15]/5 rounded-xl border border-[#FACC15]/15">
              <span className="text-xl">🎨</span>
              <p className="text-white/50 text-xs leading-relaxed">
                Your order directly supports the artisan who crafted it. Items are handmade and shipped within <strong className="text-white/70">5-7 working days</strong>.
              </p>
            </div>

            {/* Pay Button */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handlePayment}
              disabled={loading}
              className="w-full py-4 rounded-xl bg-[#FACC15] text-black font-['Syne'] font-bold text-sm hover:bg-yellow-300 transition-all duration-200 shadow-lg shadow-[#FACC15]/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <><svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>Processing...</>
              ) : (
                <>🔒 Pay ₹{total.toLocaleString()} Securely</>
              )}
            </motion.button>
            <p className="text-center text-white/25 text-xs">Secured by Razorpay · 100% goes to tribal artisans</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Order Success ────────────────────────────────────────────────────────────
function OrderSuccess({ orderDetails, onClose }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md bg-[#0d0d0d] rounded-2xl p-8 text-center"
        style={{ boxShadow: "0 0 0 1px rgba(250,204,21,0.15), 0 40px 100px rgba(0,0,0,0.8)" }}
      >
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FACC15] to-transparent rounded-t-2xl" />

        <div className="w-20 h-20 rounded-full bg-[#FACC15]/15 flex items-center justify-center mx-auto mb-5">
          <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10">
            <path d="M5 12l5 5L20 7" stroke="#FACC15" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h2 className="font-['Syne'] text-white text-2xl font-extrabold mb-2">Order Placed! 🎉</h2>
        <p className="text-white/50 text-sm mb-1">Thank you, <span className="text-white font-semibold">{orderDetails.name}</span>!</p>
        <p className="text-white/40 text-xs mb-6">Confirmation sent to <span className="text-[#FACC15]">{orderDetails.email}</span></p>

        <div className="bg-black rounded-xl p-4 mb-6 text-left" style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.06)" }}>
          <p className="text-white/30 text-[10px] font-bold tracking-widest uppercase mb-3">Delivery To</p>
          <p className="text-white/70 text-sm font-medium">{orderDetails.name}</p>
          <p className="text-white/40 text-xs mt-1">{orderDetails.address}, {orderDetails.city}</p>
          <p className="text-white/40 text-xs">{orderDetails.state} — {orderDetails.pincode}</p>
          <p className="text-white/40 text-xs mt-1">📞 {orderDetails.phone}</p>
        </div>

        <div className="flex items-center gap-2 p-3 bg-[#FACC15]/5 rounded-xl border border-[#FACC15]/15 mb-6">
          <span className="text-lg">📦</span>
          <p className="text-white/50 text-xs text-left leading-relaxed">Your handcrafted items will be shipped within <strong className="text-white/70">5-7 working days</strong>.</p>
        </div>

        <button onClick={onClose} className="w-full py-3 rounded-xl bg-[#FACC15] text-black font-['Syne'] font-bold text-sm hover:bg-yellow-300 transition-all duration-200">
          Continue Shopping →
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─── Cart Drawer ──────────────────────────────────────────────────────────────
function CartDrawer({ cart, total, count, onClose, onRemove, onUpdateQty, onCheckout }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative ml-auto w-full max-w-md h-full bg-[#0d0d0d] flex flex-col"
        style={{ boxShadow: "-4px 0 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)" }}
      >
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FACC15] to-transparent" />
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/8">
          <div>
            <p className="text-[#FACC15] text-[10px] font-bold tracking-widest uppercase mb-0.5">Your Cart</p>
            <h3 className="font-['Syne'] text-white text-lg font-extrabold">{count} {count === 1 ? "Item" : "Items"}</h3>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors duration-200">
            <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4"><path d="M4 4l8 8M12 4l-8 8" stroke="white" strokeWidth="1.8" strokeLinecap="round" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-20">
              <span className="text-5xl opacity-20">🛒</span>
              <p className="text-white/25 text-sm">Your cart is empty</p>
              <p className="text-white/15 text-xs text-center">Add some beautiful tribal art to get started</p>
            </div>
          ) : (
            cart.map((item) => (
              <motion.div key={item.id} layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-4 p-3 bg-black rounded-xl" style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.06)" }}>
                <div className="w-14 h-14 rounded-lg bg-[#0d0d0d] flex items-center justify-center shrink-0 text-2xl">{item.emoji}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-['Syne'] text-white text-xs font-semibold line-clamp-1">{item.name}</p>
                  <p className="text-white/40 text-[10px] mb-1.5">by {item.artist}</p>
                  <div className="flex items-center gap-2">
                    <button onClick={() => onUpdateQty(item.id, item.qty - 1)} className="w-5 h-5 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xs transition-colors">−</button>
                    <span className="text-white text-xs font-medium w-4 text-center">{item.qty}</span>
                    <button onClick={() => onUpdateQty(item.id, item.qty + 1)} className="w-5 h-5 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xs transition-colors">+</button>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className="font-['Syne'] text-[#FACC15] text-sm font-bold">₹{(item.price * item.qty).toLocaleString()}</span>
                  <button onClick={() => onRemove(item.id)} className="text-white/20 hover:text-red-400 transition-colors duration-200">
                    <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="px-6 py-5 border-t border-white/8 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-white/50 text-sm">Total</span>
              <span className="font-['Syne'] text-white text-xl font-extrabold">₹{total.toLocaleString()}</span>
            </div>
            <p className="text-white/25 text-[10px] text-center">100% proceeds go directly to tribal artisans</p>
            <button
              onClick={onCheckout}
              className="w-full py-3.5 rounded-xl bg-[#FACC15] text-black font-['Syne'] font-bold text-sm hover:bg-yellow-300 transition-all duration-200 shadow-lg shadow-[#FACC15]/25"
            >
              Proceed to Checkout →
            </button>
            <button onClick={onClose} className="w-full py-2.5 rounded-xl border border-white/10 text-white/40 hover:text-white/70 text-sm font-medium transition-all duration-200">
              Continue Shopping
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── Quick View Modal ─────────────────────────────────────────────────────────
function QuickViewModal({ product, onClose, onAddToCart }) {
  const [added, setAdded] = useState(false);
  const handleAdd = () => {
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => { setAdded(false); onClose(); }, 1200);
  };
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ opacity: 0, scale: 0.94, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94, y: 24 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} className="relative w-full max-w-2xl bg-[#0d0d0d] rounded-2xl overflow-hidden" style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.08), 0 40px 100px rgba(0,0,0,0.7)" }}>
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FACC15] to-transparent" />
        <button onClick={onClose} className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors duration-200">
          <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4"><path d="M4 4l8 8M12 4l-8 8" stroke="white" strokeWidth="1.8" strokeLinecap="round" /></svg>
        </button>
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div className="aspect-square sm:aspect-auto bg-gradient-to-br from-amber-900/30 to-black flex items-center justify-center">
            <span className="text-9xl opacity-80 select-none">{product.emoji}</span>
          </div>
          <div className="p-7 flex flex-col gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-[#FACC15]/70 text-[10px] font-bold tracking-widest uppercase">{product.tribe} Tribe</span>
                {product.badge && <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full tracking-wider ${BADGE_STYLES[product.badge] || "bg-white/10 text-white/60"}`}>{product.badge}</span>}
              </div>
              <h2 className="font-['Syne'] text-white text-2xl font-extrabold leading-tight mb-1">{product.name}</h2>
              <p className="text-white/40 text-sm">by {product.artist}</p>
            </div>
            <div className="flex items-center gap-2"><Stars rating={product.rating} /><span className="text-white/40 text-xs">{product.rating} ({product.reviews} reviews)</span></div>
            <p className="text-white/55 text-sm leading-relaxed">{product.description}</p>
            <div className="p-4 bg-black rounded-xl flex items-center justify-between" style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.06)" }}>
              <div>
                <p className="text-white/30 text-[10px] uppercase tracking-widest font-semibold mb-0.5">Price</p>
                <div className="flex items-baseline gap-2">
                  <span className="font-['Syne'] text-white text-2xl font-extrabold">₹{product.price.toLocaleString()}</span>
                  {product.originalPrice && <span className="text-white/30 text-sm line-through">₹{product.originalPrice.toLocaleString()}</span>}
                </div>
              </div>
              {product.originalPrice && <span className="text-emerald-400 text-xs font-bold bg-emerald-500/15 px-2.5 py-1 rounded-full">{Math.round((1 - product.price / product.originalPrice) * 100)}% off</span>}
            </div>
            <div className="p-3 bg-[#FACC15]/5 rounded-xl border border-[#FACC15]/15 flex items-start gap-2.5">
              <span className="text-base mt-0.5">🤝</span>
              <p className="text-white/50 text-xs leading-relaxed">Your purchase directly supports <strong className="text-white/70">{product.artist}</strong> and their family.</p>
            </div>
            <motion.button whileTap={{ scale: 0.96 }} onClick={handleAdd} disabled={!product.inStock}
              className={`w-full py-3.5 rounded-xl font-['Syne'] font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${added ? "bg-emerald-500 text-white" : product.inStock ? "bg-[#FACC15] text-black hover:bg-yellow-300 shadow-lg shadow-[#FACC15]/20" : "bg-white/5 text-white/25 cursor-not-allowed"}`}>
              {added ? "✓ Added to Cart!" : product.inStock ? "Add to Cart" : "Out of Stock"}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Impact Banner ────────────────────────────────────────────────────────────
function ImpactBanner() {
  const stats = [{ value: "200+", label: "Artisans Supported", icon: "👨‍🎨" }, { value: "₹12L+", label: "Artist Earnings", icon: "💰" }, { value: "15+", label: "Tribal Crafts", icon: "🏺" }, { value: "8", label: "States Covered", icon: "🗺️" }];
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative rounded-2xl overflow-hidden p-8 mb-12" style={{ background: "linear-gradient(135deg, rgba(250,204,21,0.08) 0%, rgba(250,204,21,0.02) 100%)", boxShadow: "0 0 0 1px rgba(250,204,21,0.15)" }}>
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FACC15]/60 to-transparent" />
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="text-center sm:text-left">
          <p className="text-[#FACC15] text-[10px] font-bold tracking-widest uppercase mb-1.5">Why Shop Here</p>
          <h3 className="font-['Syne'] text-white text-xl font-extrabold">Every Purchase Changes a Life</h3>
          <p className="text-white/40 text-sm mt-1">100% of proceeds go directly to tribal artisans — zero middlemen.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {stats.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="flex flex-col items-center gap-1 text-center">
              <span className="text-2xl mb-0.5">{s.icon}</span>
              <span className="font-['Syne'] text-[#FACC15] text-xl font-extrabold">{s.value}</span>
              <span className="text-white/35 text-[10px] text-center leading-snug">{s.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function TribalMela() {
  const { cart, addToCart, removeFromCart, updateQty, clearCart, total, count } = useCart();
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let result = PRODUCTS;
    if (activeCategory !== "All") result = result.filter((p) => p.category === activeCategory);
    if (search.trim()) result = result.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.artist.toLowerCase().includes(search.toLowerCase()) || p.tribe.toLowerCase().includes(search.toLowerCase()));
    if (sortBy === "price-asc") result = [...result].sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") result = [...result].sort((a, b) => b.price - a.price);
    else if (sortBy === "rating") result = [...result].sort((a, b) => b.rating - a.rating);
    return result;
  }, [activeCategory, sortBy, search]);

  const handleOrderSuccess = (details) => {
    setCheckoutOpen(false);
    setCartOpen(false);
    setOrderSuccess(details);
    clearCart();
  };

  return (
    <div className="bg-black min-h-screen">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-40 w-[500px] h-[500px] rounded-full bg-[#FACC15]/3 blur-[130px]" />
        <div className="absolute bottom-1/3 right-0 w-[400px] h-[400px] rounded-full bg-amber-600/4 blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.018]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>

      {/* Floating Cart Button */}
      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setCartOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-5 py-3 bg-[#FACC15] text-black font-['Syne'] font-bold text-sm rounded-2xl shadow-2xl shadow-[#FACC15]/30 hover:bg-yellow-300 transition-colors duration-200">
        <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M1 1h3l2.5 9.5h9l2-6H6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><circle cx="8.5" cy="16.5" r="1.5" fill="currentColor" /><circle cx="14.5" cy="16.5" r="1.5" fill="currentColor" /></svg>
        Cart
        {count > 0 && (
          <motion.span key={count} initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="bg-black text-[#FACC15] text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center">{count}</motion.span>
        )}
      </motion.button>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-28 pb-24">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="flex flex-col items-center text-center mb-14 gap-5">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#FACC15]/30 bg-[#FACC15]/8 text-[#FACC15] text-xs font-semibold tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FACC15] animate-pulse" />
            Tribal Mela — Online Marketplace
          </span>
          <h1 className="font-['Syne'] text-white text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight max-w-3xl">
            Buy Art,{" "}
            <span style={{ backgroundImage: "linear-gradient(135deg,#FACC15,#FDE68A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Change Lives</span>
          </h1>
          <p className="text-white/45 text-base max-w-xl leading-relaxed">Every handcrafted piece carries centuries of tribal wisdom. Your purchase directly empowers the artisan who made it.</p>
          <div className="relative w-full max-w-md mt-2">
            <svg viewBox="0 0 20 20" fill="none" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30"><circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.6" /><path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            <input type="text" placeholder="Search by art, artist, or tribe…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-[#0d0d0d] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-[#FACC15]/40 focus:ring-1 focus:ring-[#FACC15]/15 transition-all duration-200" />
            {search && <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"><svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg></button>}
          </div>
        </motion.div>

        <ImpactBanner />

        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.15 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-1.5 p-1 bg-[#0d0d0d] rounded-xl border border-white/8 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${activeCategory === cat ? "bg-[#FACC15] text-black" : "text-white/40 hover:text-white/70"}`}>
                <span>{CATEGORY_ICONS[cat]}</span>{cat}
                <span className="text-[10px] opacity-60">{cat === "All" ? PRODUCTS.length : PRODUCTS.filter(p => p.category === cat).length}</span>
              </button>
            ))}
          </div>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-[#0d0d0d] border border-white/10 rounded-xl px-4 py-2.5 text-white/60 text-xs font-semibold focus:outline-none focus:border-[#FACC15]/40 transition-all duration-200 cursor-pointer">
            <option value="featured">Featured</option>
            <option value="rating">Top Rated</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </motion.div>

        <div className="flex items-center gap-2 mb-6">
          <span className="text-white/25 text-xs">{filtered.length} {filtered.length === 1 ? "piece" : "pieces"} found</span>
          {(search || activeCategory !== "All") && <button onClick={() => { setSearch(""); setActiveCategory("All"); }} className="text-[#FACC15]/60 text-xs hover:text-[#FACC15] transition-colors">Clear filters ×</button>}
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((product, i) => <ProductCard key={product.id} product={product} index={i} onAddToCart={addToCart} onQuickView={setQuickViewProduct} />)}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-24 gap-4">
            <span className="text-5xl opacity-20">🔍</span>
            <p className="text-white/25 text-sm">No products found for "{search}"</p>
            <button onClick={() => { setSearch(""); setActiveCategory("All"); }} className="text-[#FACC15]/60 text-xs hover:text-[#FACC15] transition-colors">Browse all products →</button>
          </motion.div>
        )}

        {/* Bottom CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mt-20 rounded-2xl p-10 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(250,204,21,0.06), rgba(250,204,21,0.02))", boxShadow: "0 0 0 1px rgba(250,204,21,0.12)" }}>
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FACC15]/50 to-transparent" />
          <div className="text-center sm:text-left relative z-10">
            <p className="text-[#FACC15] text-[10px] font-bold tracking-widest uppercase mb-2">Are you a tribal artisan?</p>
            <h3 className="font-['Syne'] text-white text-2xl font-extrabold mb-1.5">Sell Your Art on Tribal Mela</h3>
            <p className="text-white/40 text-sm">We list your crafts for free and help you reach buyers across India and globally.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 relative z-10">
            <button className="px-6 py-3 rounded-xl bg-[#FACC15] text-black font-['Syne'] font-bold text-sm hover:bg-yellow-300 transition-all duration-200 shadow-lg shadow-[#FACC15]/20 whitespace-nowrap">Register as Artisan →</button>
            <button className="px-6 py-3 rounded-xl border border-white/10 text-white/60 font-medium text-sm hover:border-white/20 hover:text-white/80 transition-all duration-200 whitespace-nowrap">Learn More</button>
          </div>
        </motion.div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {cartOpen && <CartDrawer cart={cart} total={total} count={count} onClose={() => setCartOpen(false)} onRemove={removeFromCart} onUpdateQty={updateQty} onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }} />}
      </AnimatePresence>
      <AnimatePresence>
        {checkoutOpen && <DeliveryForm cart={cart} total={total} onBack={() => { setCheckoutOpen(false); setCartOpen(true); }} onSuccess={handleOrderSuccess} />}
      </AnimatePresence>
      <AnimatePresence>
        {orderSuccess && <OrderSuccess orderDetails={orderSuccess} onClose={() => setOrderSuccess(null)} />}
      </AnimatePresence>
      <AnimatePresence>
        {quickViewProduct && <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} onAddToCart={addToCart} />}
      </AnimatePresence>
    </div>
  );
}