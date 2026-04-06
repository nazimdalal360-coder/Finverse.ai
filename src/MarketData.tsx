import { useEffect, useState } from "react";

function MarketData() {
  const [price, setPrice] = useState<string>("Loading...");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("https://query1.finance.yahoo.com/v8/finance/chart/^NSEI");
        const data = await res.json();
        const price = data.chart.result[0].meta.regularMarketPrice;
        setPrice(price.toString());
      } catch (err) {
        setPrice("Error");
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>NIFTY 50</h2>
      <h1>{price}</h1>
    </div>
  );
}

export default MarketData;