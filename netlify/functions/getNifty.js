exports.handler = async function () {
  try {
    const res = await fetch("https://query1.finance.yahoo.com/v8/finance/chart/%5ENSEI");
    const data = await res.json();

    const price = data.chart.result[0].meta.regularMarketPrice;

    return {
      statusCode: 200,
      body: JSON.stringify({ price }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed" }),
    };
  }
};