'use strict'

module.exports = async (event, context) => {
  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const success = Math.random() < 0.95;
    return context
      .status(success ? 200 : 400)
      .succeed({ success, transactionId: success ? `tx_${Date.now()}` : null });
  } catch (e) {
    return context.status(500).succeed({ error: e.message });
  }
}
