const express = require("express");
const Razorpay = require("razorpay");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(express.json());
app.use(cors());

const razorpay = new Razorpay({
  key_id: process.env.rzp_test_SSFrbdbdcHZ2Si,
  key_secret: process.env.0ADRAsFRnza06RHLphQ76hG7,
});

// Email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,  // your gmail
    pass: process.env.EMAIL_PASS,  // app password
  },
});

// Create Razorpay order
app.post("/create-order", async (req, res) => {
  const { amount } = req.body;
  try {
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    });
    res.json(order);
  } catch (err) {
    res.status(500).send("Error creating order");
  }
});

// Send confirmation email
app.post("/send-confirmation", async (req, res) => {
  const { name, email, phone, address, city, state, pincode, paymentId, items, total } = req.body;

  const itemsList = items.map(i => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #222;">${i.emoji} ${i.name}</td>
      <td style="padding:8px;border-bottom:1px solid #222;">x${i.qty}</td>
      <td style="padding:8px;border-bottom:1px solid #222;">₹${(i.price * i.qty).toLocaleString()}</td>
    </tr>
  `).join("");

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "🎨 Your Tribal Mela Order is Confirmed! — Voice For Welfare",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#fff;padding:32px;border-radius:16px;">
        <div style="text-align:center;margin-bottom:24px;">
          <h1 style="color:#FACC15;font-size:24px;margin:0;">Voice For Welfare</h1>
          <p style="color:#666;font-size:12px;margin:4px 0;">Tribal Mela — Handcrafted Marketplace</p>
        </div>

        <div style="background:#111;border-radius:12px;padding:24px;margin-bottom:20px;border:1px solid #FACC1530;">
          <h2 style="color:#FACC15;font-size:18px;margin:0 0 8px;">Order Confirmed! 🎉</h2>
          <p style="color:#aaa;margin:0;">Thank you <strong style="color:#fff;">${name}</strong>! Your order has been placed successfully.</p>
        </div>

        <div style="background:#111;border-radius:12px;padding:24px;margin-bottom:20px;">
          <h3 style="color:#fff;font-size:14px;margin:0 0 16px;">Order Details</h3>
          <table style="width:100%;border-collapse:collapse;">
            <thead>
              <tr style="color:#FACC15;font-size:12px;">
                <th style="text-align:left;padding:8px;border-bottom:1px solid #333;">Item</th>
                <th style="text-align:left;padding:8px;border-bottom:1px solid #333;">Qty</th>
                <th style="text-align:left;padding:8px;border-bottom:1px solid #333;">Price</th>
              </tr>
            </thead>
            <tbody style="color:#ccc;font-size:13px;">
              ${itemsList}
            </tbody>
          </table>
          <div style="border-top:1px solid #333;margin-top:12px;padding-top:12px;text-align:right;">
            <span style="color:#FACC15;font-size:18px;font-weight:bold;">Total: ₹${total.toLocaleString()}</span>
          </div>
        </div>

        <div style="background:#111;border-radius:12px;padding:24px;margin-bottom:20px;">
          <h3 style="color:#fff;font-size:14px;margin:0 0 12px;">Delivery Address</h3>
          <p style="color:#aaa;margin:0;line-height:1.6;">${address}<br/>${city}, ${state} — ${pincode}<br/>📞 ${phone}</p>
        </div>

        <div style="background:#FACC1510;border:1px solid #FACC1530;border-radius:12px;padding:16px;margin-bottom:20px;">
          <p style="color:#FACC15;margin:0;font-size:13px;">📦 Your handcrafted items will be shipped within <strong>5-7 working days</strong>.</p>
        </div>

        <p style="color:#444;font-size:11px;text-align:center;">Payment ID: ${paymentId}</p>
        <p style="color:#444;font-size:11px;text-align:center;">© 2025 Voice For Welfare · 100% proceeds go to tribal artisans</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
```

**Step 3 — Create a Gmail App Password:**
1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Click **Security**
3. Enable **2-Step Verification** (if not already)
4. Search for **App Passwords**
5. Create one for **Mail** → copy the 16-digit password

**Step 4 — Add to Render environment variables:**
```
EMAIL_USER = your@gmail.com
EMAIL_PASS = your16digitapppassword