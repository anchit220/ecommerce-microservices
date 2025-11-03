const express = require('express');
const client = require('prom-client');
const app = express();
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

const products = [
  { id: 1, name: 'Coffee Mug', price: 200 },
  { id: 2, name: 'Espresso Beans', price: 500 }
];

app.get('/products', (req, res) => res.json(products));
app.get('/health', (req, res) => res.json({ ok: true }));
app.get('/metrics', async (req,res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

app.listen(3002, () => console.log('Product Service on 3002'));
