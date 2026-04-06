export type TradingStyle = 'Scalping' | 'Intraday' | 'Swing' | 'Positional';
export type RiskProfile = 'Low' | 'Medium' | 'High';
export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Expert';
export type AssetClass = 'Equities' | 'Options' | 'Futures' | 'Crypto' | 'Forex' | 'Commodities';

export interface UserProfile {
  style: TradingStyle;
  risk: RiskProfile;
  capital: number;
  experience: ExperienceLevel;
  preferredAssets: AssetClass[];
  maxDrawdown: number; // Percentage
  riskPerTrade: number; // Percentage
}

export interface TradeSetup {
  type: string;
  direction: 'Buy' | 'Sell';
  entry: string;
  sl: string;
  targets: string[];
  rr: string;
  probability: number;
  duration: string;
  strength: 'Weak' | 'Moderate' | 'Strong';
  logic: string;
}

export interface PriceRange {
  low: number;
  high: number;
  label?: string;
}

export interface SMCData {
  orderBlocks: PriceRange[];
  fvg: PriceRange[];
  liquidityZones: string[];
  marketStructure: 'Bullish' | 'Bearish' | 'Sideways';
  trendShift: 'BOS' | 'CHoCH' | 'None';
}

export interface MarketAnalysis {
  overview: string;
  indexAnalysis: string;
  sectorAnalysis: string;
  tradeSetups: TradeSetup[];
  smc: SMCData;
  institutionalData: {
    fiiDii: string;
    oiBuildUp: string;
    pcr: number;
  };
  aiInsights: string;
  finalBias: 'Bullish' | 'Bearish' | 'Neutral';
  confidenceScore: number;
  recommendation: {
    action: 'BUY' | 'SELL' | 'HOLD';
    priceRange: string;
    timeframe: string;
  };
}
