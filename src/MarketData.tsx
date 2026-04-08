import { useEffect, useState } from "react";

export default function MarketData() {
  const [price, setPrice] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("https://api.allorigins.win/raw?url=https://query1.finance.yahoo.com/v8/finance/chart/%5ENSEI");
        const data = await res.json();

        const livePrice = data.chart.result[0].meta.regularMarketPrice;
        setPrice(livePrice);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div style={{color: "white", marginBottom: "10px"}}>
      <h2>NIFTY LIVE</h2>
      <p>{price ? price : "Loading..."}</p>
    </div>
  );
}