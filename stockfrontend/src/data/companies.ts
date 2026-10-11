export interface Company {
  symbol: string;
  name: string;
  exchange: string;
}

export const companies: Company[] = [
  {
    symbol: "RELIANCE",
    name: "Reliance Industries",
    exchange: "NSE",
  },
  {
    symbol: "TCS",
    name: "Tata Consultancy Services",
    exchange: "NSE",
  },
  {
    symbol: "INFY",
    name: "Infosys",
    exchange: "NSE",
  },
  {
    symbol: "HDFCBANK",
    name: "HDFC Bank",
    exchange: "NSE",
  },
  {
    symbol: "ICICIBANK",
    name: "ICICI Bank",
    exchange: "NSE",
  },
];