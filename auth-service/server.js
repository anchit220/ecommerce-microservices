const express = require("express");
const client = require("prom-client");

const app = express();
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

// Define your normal routes
app.get("/health", (req, res) => res.send("OK"));

// Expose metrics for Prometheus
app.get("/metrics", async (req, res) => {
  try {
    res.set("Content-Type", client.register.contentType);
    res.end(await client.register.metrics());
  } catch (ex) {
    res.status(500).end(ex);
  }
});

app.listen(3001, () => console.log("Auth service running on port 3001"));
