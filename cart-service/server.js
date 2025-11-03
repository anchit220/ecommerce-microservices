const express = require('express');
const client = require("prom-client");

const app = express();
app.use(express.json());

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();
let cart = [];

app.post('/add', (req, res) => {
  const item = req.body;
  cart.push(item);
  res.json({ message: 'Item added', cart });
});

app.get('/cart', (req, res) => res.json(cart));
app.get('/health', (req, res) => res.json({ ok: true }));

app.get("/metrics", async (req, res) => {
  try {
    res.set("Content-Type", client.register.contentType);
    res.end(await client.register.metrics());
  } catch (ex) {
    res.status(500).end(ex);
  }
});

app.listen(3003, () => console.log('Cart Service on 3003'));
