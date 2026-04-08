import { useEffect, useState } from "react";

export default function MarketData() {
  const [price, setPrice] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/.netlify/functions/getNifty");
        const data = await res.json();
        setPrice(data.price);
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
    setInterval(fetchData, 5000);
  }, []);

  return (
    <div>
      <h2>NIFTY LIVE</h2>
      <p>{price ? price : "Loading..."}</p>
    </div>
  );
}