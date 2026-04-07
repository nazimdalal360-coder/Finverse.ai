import React, { useEffect, useState } from "react";

function MarketData() {
  const [price, setPrice] = useState("Loading...");

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        "https://query1.finance.yahoo.com/v7/finance/quote?symbols=%5ENSEI"
      );
      const data = await res.json();
      const livePrice = data.quoteResponse.result[0].regularMarketPrice;
      setPrice(livePrice);
    };

    fetchData();
    setInterval(fetchData, 5000);
  }, []);

  return (
    <div>
      <h2>NIFTY 50 LIVE</h2>
      <h1>{price}</h1>
    </div>
  );
}

export default MarketData;