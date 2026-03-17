const express = require("express");
const Razorpay = require("razorpay");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(express.json());
app.use(cors());

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
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
    console.error(err);
    res.status(500).send("Error creating order");
  }
});

// Send confirmation email
app.post("/send-confirmation", async (req, res) => {
  const { name, email, phone, address, city, state, pincode, paymentId, items, total } = req.body;

  const itemRows = items.map(function(i) {
    return "<tr><td style='padding:8px;border-bottom:1px solid #222;color:#ccc;'>" + i.emoji + " " + i.name + "</td><td style='padding:8px;border-bottom:1px solid #222;color:#ccc;'>x" + i.qty + "</td><td style='padding:8px;border-bottom:1px solid #222;color:#ccc;'>Rs." + (i.price * i.qty).toLocaleString() + "</td></tr>";
  }).join("");

  const htmlContent = "<div style='font-family:sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#fff;padding:32px;border-radius:16px;'>"
    + "<div style='text-align:center;margin-bottom:24px;'>"
    + "<h1 style='color:#FACC15;font-size:24px;margin:0;'>Voice For Welfare</h1>"
    + "<p style='color:#666;font-size:12px;margin:4px 0;'>Tribal Mela - Handcrafted Marketplace</p>"
    + "</div>"
    + "<div style='background:#111;border-radius:12px;padding:24px;margin-bottom:20px;border:1px solid rgba(250,204,21,0.2);'>"
    + "<h2 style='color:#FACC15;font-size:18px;margin:0 0 8px;'>Order Confirmed!</h2>"
    + "<p style='color:#aaa;margin:0;'>Thank you <strong style='color:#fff;'>" + name + "</strong>! Your order has been placed successfully.</p>"
    + "</div>"
    + "<div style='background:#111;border-radius:12px;padding:24px;margin-bottom:20px;'>"
    + "<h3 style='color:#fff;font-size:14px;margin:0 0 16px;'>Order Details</h3>"
    + "<table style='width:100%;border-collapse:collapse;'>"
    + "<thead><tr>"
    + "<th style='text-align:left;padding:8px;border-bottom:1px solid #333;color:#FACC15;font-size:12px;'>Item</th>"
    + "<th style='text-align:left;padding:8px;border-bottom:1px solid #333;color:#FACC15;font-size:12px;'>Qty</th>"
    + "<th style='text-align:left;padding:8px;border-bottom:1px solid #333;color:#FACC15;font-size:12px;'>Price</th>"
    + "</tr></thead>"
    + "<tbody>" + itemRows + "</tbody>"
    + "</table>"
    + "<div style='border-top:1px solid #333;margin-top:12px;padding-top:12px;text-align:right;'>"
    + "<span style='color:#FACC15;font-size:18px;font-weight:bold;'>Total: Rs." + total.toLocaleString() + "</span>"
    + "</div></div>"
    + "<div style='background:#111;border-radius:12px;padding:24px;margin-bottom:20px;'>"
    + "<h3 style='color:#fff;font-size:14px;margin:0 0 12px;'>Delivery Address</h3>"
    + "<p style='color:#aaa;margin:0;line-height:1.6;'>" + address + "<br/>" + city + ", " + state + " - " + pincode + "<br/>Phone: " + phone + "</p>"
    + "</div>"
    + "<div style='background:rgba(250,204,21,0.1);border:1px solid rgba(250,204,21,0.3);border-radius:12px;padding:16px;margin-bottom:20px;'>"
    + "<p style='color:#FACC15;margin:0;font-size:13px;'>Your handcrafted items will be shipped within <strong>5-7 working days</strong>.</p>"
    + "</div>"
    + "<p style='color:#444;font-size:11px;text-align:center;'>Payment ID: " + paymentId + "</p>"
    + "<p style='color:#444;font-size:11px;text-align:center;'>2025 Voice For Welfare - 100% proceeds go to tribal artisans</p>"
    + "</div>";

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Tribal Mela Order is Confirmed! - Voice For Welfare",
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Confirmation email sent to " + email);
    res.json({ success: true });
  } catch (err) {
    console.error("Email error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(5000, function() {
  console.log("Server running on port 5000");
});