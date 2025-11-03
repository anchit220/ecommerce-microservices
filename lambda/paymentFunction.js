exports.handler = async (event) => {
  const body = JSON.parse(event.body || '{}');
  const success = Math.random() < 0.95;
  const response = {
    success,
    transactionId: success ? `tx_${Date.now()}` : null
  };
  return {
    statusCode: success ? 200 : 400,
    body: JSON.stringify(response)
  };
};
