import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, MarketAnalysis } from "../types";

const MODEL_NAME = "gemini-3.1-pro-preview";

export async function generateTradingAnalysis(
  symbol: string,
  userProfile: UserProfile,
  backtestMode: boolean = false
) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

  const prompt = `
    Act as an Elite AI Financial Analyst and Institutional Trading Expert.
    Analyze the following symbol: ${symbol}
    
    User Profile:
    - Style: ${userProfile.style}
    - Risk Profile: ${userProfile.risk}
    - Capital: ₹${userProfile.capital}
    - Experience: ${userProfile.experience}
    - Preferred Assets: ${userProfile.preferredAssets.join(', ')}
    - Max Drawdown: ${userProfile.maxDrawdown}%
    - Risk Per Trade: ${userProfile.riskPerTrade}%

    Perform a deep SMART MONEY CONCEPT (SMC) & PRICE ACTION analysis.
    
    REQUIRED OUTPUT STRUCTURE (JSON format):
    {
      "overview": "General market sentiment",
      "smc": {
        "orderBlocks": [{"low": 22100, "high": 22150, "label": "Bullish OB"}],
        "fvg": [{"low": 22200, "high": 22220, "label": "Bearish FVG"}],
        "liquidityZones": ["Equal Highs/Lows, Liquidity Sweeps"],
        "marketStructure": "Bullish/Bearish/Sideways",
        "trendShift": "BOS/CHoCH/None"
      },
      "institutionalData": {
        "fiiDii": "Summary of institutional flow",
        "oiBuildUp": "OI analysis",
        "pcr": 0.0
      },
      "tradeSetups": [
        {
          "type": "Intraday/Swing",
          "direction": "Buy/Sell",
          "entry": "Entry price",
          "sl": "Stop loss",
          "targets": ["T1", "T2"],
          "rr": "1:3",
          "probability": 85,
          "duration": "2-4 hours",
          "strength": "Strong",
          "logic": "Detailed SMC logic for this trade"
        }
      ],
      "recommendation": {
        "action": "BUY/SELL/HOLD",
        "priceRange": "Execution zone",
        "timeframe": "Expected duration"
      },
      "confidenceScore": 90,
      "finalBias": "Bullish/Bearish/Neutral"
    }

    Return ONLY the JSON object.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        temperature: 0.2,
        responseMimeType: "application/json",
      },
    });

    return JSON.parse(response.text || "{}") as MarketAnalysis;
  } catch (error) {
    console.error("Analysis generation failed:", error);
    throw error;
  }
}
