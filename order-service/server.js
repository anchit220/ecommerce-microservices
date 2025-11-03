const express = require("express");
const axios = require("axios");
const client = require("prom-client");

const app = express();
app.use(express.json());

// Collect default metrics
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

// Set PAYMENT_URL via env or fallback
const PAYMENT_URL = process.env.PAYMENT_URL || "https://replace-me-with-lambda-or-openfaas";

// Create custom counter for number of orders
const orderCount = new client.Counter({
  name: "orders_total",
  help: "Total number of orders placed"
});

app.post("/order", async (req, res) => {
  const { amount } = req.body;
  try {
    const response = await axios.post(PAYMENT_URL, { amount });
    orderCount.inc(); // increment on success
    return res.json({ message: "Order placed", payment: response.data });
  } catch (err) {
    console.error("Payment error", err.message);
    res.status(500).json({ error: "Payment failed", details: err.message });
  }
});

app.get("/health", (req, res) => res.json({ ok: true }));

// Metrics endpoint
app.get("/metrics", async (req, res) => {
  try {
    res.set("Content-Type", client.register.contentType);
    res.end(await client.register.metrics());
  } catch (ex) {
    res.status(500).end(ex);
  }
});

app.listen(3004, () => console.log("Order Service running on port 3004"));
