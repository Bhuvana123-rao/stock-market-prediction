
import { useEffect, useMemo, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  Gauge,
  Zap,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
} from "recharts";

import CompanySelector from "../components/CompanySelector";

import {
  getAnalytics,
  type AnalyticsData,
} from "../services/api";

export default function TechnicalAnalytics() {
  const [selectedCompany, setSelectedCompany] =
    useState("RELIANCE");

  const [period, setPeriod] = useState("20");

  const [data, setData] = useState<AnalyticsData[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // --------------------------------
  // Load analytics data
  // --------------------------------

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        setError("");

        const result = await getAnalytics(
          selectedCompany
        );

        setData(result.data);
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load analytics data"
        );
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, [selectedCompany]);

  // --------------------------------
  // Recalculate SMA based on selected period
  // --------------------------------

  const analyticsData = useMemo(() => {
    const periodNumber = Number(period);

    return data.map((item, index) => {
      let sma: number | null = null;

      if (index >= periodNumber - 1) {
        const slice = data.slice(
          index - periodNumber + 1,
          index + 1
        );

        const validValues = slice
          .map((point) => point.close)
          .filter(
            (value): value is number =>
              typeof value === "number"
          );

        if (validValues.length === periodNumber) {
          sma =
            validValues.reduce(
              (sum, value) => sum + value,
              0
            ) / periodNumber;
        }
      }

      return {
        ...item,
        calculatedSMA:
          sma !== null
            ? Number(sma.toFixed(2))
            : null,
      };
    });
  }, [data, period]);

  // --------------------------------
  // Latest values
  // --------------------------------

  const latest =
    analyticsData[analyticsData.length - 1];

  const previous =
    analyticsData[analyticsData.length - 2];

  const latestClose =
    latest?.close ?? null;

  const previousClose =
    previous?.close ?? null;

  const priceChange =
    latestClose !== null &&
    previousClose !== null
      ? latestClose - previousClose
      : 0;

  const percentageChange =
    previousClose &&
    previousClose !== 0
      ? (priceChange / previousClose) * 100
      : 0;

  const latestSMA =
    latest?.calculatedSMA ?? null;

  const latestEMA =
    latest?.EMA ?? null;

  const latestRSI =
    latest?.RSI ?? null;

  const latestMACD =
    latest?.MACD ?? null;

  // --------------------------------
  // Summary calculations
  // --------------------------------

  const trend =
    latestClose !== null &&
    latestSMA !== null
      ? latestClose >= latestSMA
        ? "Bullish"
        : "Bearish"
      : "Neutral";

  const rsiStatus =
    latestRSI !== null &&
    latestRSI !== undefined
      ? latestRSI >= 70
        ? "Overbought"
        : latestRSI <= 30
        ? "Oversold"
        : "Neutral"
      : "Not available";

  const macdStatus =
    latestMACD !== null &&
    latestMACD !== undefined
      ? latestMACD >= 0
        ? "Positive"
        : "Negative"
      : "Not available";

  // --------------------------------
  // Loading
  // --------------------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F4F2] flex items-center justify-center">
        <div className="bg-white rounded-2xl border border-[#E5DFDC] px-8 py-6 text-center">
          <div className="w-10 h-10 border-4 border-[#E5DFDC] border-t-[#1F7A63] rounded-full animate-spin mx-auto mb-4" />

          <p className="text-sm font-medium text-[#081C2D]">
            Loading analytics...
          </p>
        </div>
      </div>
    );
  }

  // --------------------------------
  // Error
  // --------------------------------

  if (error) {
    return (
      <div className="min-h-screen bg-[#F7F4F2] flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl border border-red-200 px-8 py-6 text-center">
          <p className="text-red-500 font-medium">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F4F2] text-[#081C2D]">

      {/* =========================================
          HEADER
      ========================================= */}

      <div className="border-b border-[#E5DFDC] bg-white">

        <div className="max-w-7xl mx-auto px-6 py-5">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>
              <p className="text-sm text-[#7C858A] mb-1">
                Market Analysis
              </p>

              <h1 className="text-2xl font-bold">
                Technical Analytics
              </h1>

              <p className="text-sm text-[#7C858A] mt-1">
                Analyze price trends, moving averages and trading activity
              </p>
            </div>

            <div className="w-full md:w-72">
              <CompanySelector
                selectedCompany={selectedCompany}
                onCompanyChange={setSelectedCompany}
              />
            </div>

          </div>

        </div>

      </div>

      {/* =========================================
          MAIN CONTENT
      ========================================= */}

      <main className="max-w-7xl mx-auto px-6 py-7">

        {/* =========================================
            COMPANY SUMMARY
        ========================================= */}

        <div className="bg-white rounded-2xl border border-[#E5DFDC] p-6 mb-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>

              <p className="text-sm text-[#7C858A]">
                Technical Analysis
              </p>

              <h2 className="text-2xl font-bold mt-1">
                {selectedCompany}
              </h2>

              <p className="text-sm text-[#9AA3A8] mt-1">
                Based on historical market data
              </p>

            </div>

            <div className="text-left md:text-right">

              <p className="text-sm text-[#7C858A]">
                Latest Closing Price
              </p>

              <p className="text-3xl font-bold mt-1">
                {latestClose !== null
                  ? `₹${latestClose.toFixed(2)}`
                  : "N/A"}
              </p>

              <p
                className={`text-sm font-semibold mt-1 ${
                  priceChange >= 0
                    ? "text-[#1F7A63]"
                    : "text-red-500"
                }`}
              >
                {priceChange >= 0 ? "+" : ""}
                ₹{priceChange.toFixed(2)} (
                {percentageChange.toFixed(2)}%)
              </p>

            </div>

          </div>

        </div>

        {/* =========================================
            PRICE ANALYSIS
        ========================================= */}

        <div className="bg-white rounded-2xl border border-[#E5DFDC] p-6 mb-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">

            <div>

              <h2 className="text-lg font-bold">
                Price Analysis
              </h2>

              <p className="text-sm text-[#7C858A]">
                Historical closing price movement
              </p>

            </div>

          </div>

          <div className="h-[380px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <LineChart data={analyticsData}>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E5DFDC"
                />

                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                />

                <YAxis
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  domain={["auto", "auto"]}
                />

                <Tooltip />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="close"
                  name="Closing Price"
                  stroke="#081C2D"
                  strokeWidth={3}
                  dot={false}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* =========================================
            MOVING AVERAGE
        ========================================= */}

        <div className="bg-white rounded-2xl border border-[#E5DFDC] p-6 mb-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">

            <div>

              <h2 className="text-lg font-bold">
                Moving Average Analysis
              </h2>

              <p className="text-sm text-[#7C858A]">
                Closing price compared with SMA and EMA
              </p>

            </div>

            <select
              value={period}
              onChange={(e) =>
                setPeriod(e.target.value)
              }
              className="bg-white border border-[#E5DFDC] rounded-lg px-4 py-2.5 outline-none cursor-pointer text-sm font-medium"
            >
              <option value="5">
                5 Days SMA
              </option>

              <option value="10">
                10 Days SMA
              </option>

              <option value="20">
                20 Days SMA
              </option>
            </select>

          </div>

          <div className="h-[380px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <LineChart data={analyticsData}>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E5DFDC"
                />

                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                />

                <YAxis
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  domain={["auto", "auto"]}
                />

                <Tooltip />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="close"
                  name="Closing Price"
                  stroke="#081C2D"
                  strokeWidth={3}
                  dot={false}
                />

                <Line
                  type="monotone"
                  dataKey="calculatedSMA"
                  name={`SMA (${period})`}
                  stroke="#1F7A63"
                  strokeWidth={2}
                  dot={false}
                  connectNulls
                />

                <Line
                  type="monotone"
                  dataKey="EMA"
                  name="EMA (9)"
                  stroke="#C65D7B"
                  strokeWidth={2}
                  dot={false}
                  connectNulls
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* =========================================
            TRADING VOLUME
        ========================================= */}

        <div className="bg-white rounded-2xl border border-[#E5DFDC] p-6 mb-6">

          <div className="mb-5">

            <h2 className="text-lg font-bold">
              Trading Volume
            </h2>

            <p className="text-sm text-[#7C858A]">
              Historical trading activity
            </p>

          </div>

          <div className="h-[320px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart data={analyticsData}>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E5DFDC"
                />

                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                />

                <YAxis
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                />

                <Tooltip />

                <Bar
                  dataKey="volume"
                  name="Trading Volume"
                  fill="#1F7A63"
                  radius={[4, 4, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* =========================================
            TECHNICAL ANALYSIS SUMMARY
        ========================================= */}

        <div className="bg-white rounded-2xl border border-[#E5DFDC] p-6">

          <div className="mb-6">

            <h2 className="text-lg font-bold">
              Technical Analysis Summary
            </h2>

            <p className="text-sm text-[#7C858A] mt-1">
              Current interpretation of the selected company's technical indicators
            </p>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {/* Trend */}

            <div className="border border-[#E5DFDC] rounded-xl p-5">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-lg bg-[#E8F3F0] flex items-center justify-center">

                  {trend === "Bullish" ? (
                    <TrendingUp
                      size={20}
                      className="text-[#1F7A63]"
                    />
                  ) : (
                    <TrendingDown
                      size={20}
                      className="text-red-500"
                    />
                  )}

                </div>

                <div>

                  <p className="text-xs text-[#7C858A]">
                    Price Trend
                  </p>

                  <p
                    className={`font-semibold ${
                      trend === "Bullish"
                        ? "text-[#1F7A63]"
                        : trend === "Bearish"
                        ? "text-red-500"
                        : ""
                    }`}
                  >
                    {trend}
                  </p>

                </div>

              </div>

              <p className="text-sm text-[#7C858A] mt-4">

                The current price is{" "}

                {latestSMA !== null &&
                latestClose !== null &&
                latestClose >= latestSMA
                  ? "above"
                  : "below"}{" "}

                the {period}-day moving average.

              </p>

            </div>

            {/* Momentum */}

            <div className="border border-[#E5DFDC] rounded-xl p-5">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-lg bg-[#E8F3F0] flex items-center justify-center">

                  <Gauge
                    size={20}
                    className="text-[#1F7A63]"
                  />

                </div>

                <div>

                  <p className="text-xs text-[#7C858A]">
                    Momentum
                  </p>

                  <p className="font-semibold">
                    {rsiStatus}
                  </p>

                </div>

              </div>

              <p className="text-sm text-[#7C858A] mt-4">

                RSI (14) is{" "}

                {latestRSI !== null &&
                latestRSI !== undefined
                  ? latestRSI.toFixed(2)
                  : "not available"}.

              </p>

            </div>

            {/* MACD */}

            <div className="border border-[#E5DFDC] rounded-xl p-5">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-lg bg-[#E8F3F0] flex items-center justify-center">

                  <Zap
                    size={20}
                    className="text-[#1F7A63]"
                  />

                </div>

                <div>

                  <p className="text-xs text-[#7C858A]">
                    MACD
                  </p>

                  <p
                    className={`font-semibold ${
                      macdStatus === "Positive"
                        ? "text-[#1F7A63]"
                        : macdStatus === "Negative"
                        ? "text-red-500"
                        : ""
                    }`}
                  >
                    {macdStatus}
                  </p>

                </div>

              </div>

              <p className="text-sm text-[#7C858A] mt-4">

                MACD is currently{" "}

                {macdStatus === "Positive"
                  ? "indicating positive momentum."
                  : macdStatus === "Negative"
                  ? "indicating negative momentum."
                  : "not available."}

              </p>

            </div>

          </div>

          {/* Key Values */}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">

            <div className="bg-[#F7F4F2] rounded-xl p-4">

              <div className="flex items-center gap-2">

                <BarChart3
                  size={17}
                  className="text-[#1F7A63]"
                />

                <p className="text-xs text-[#7C858A]">
                  Closing Price
                </p>

              </div>

              <p className="font-bold mt-2">
                {latestClose !== null
                  ? `₹${latestClose.toFixed(2)}`
                  : "N/A"}
              </p>

            </div>

            <div className="bg-[#F7F4F2] rounded-xl p-4">

              <div className="flex items-center gap-2">

                <Activity
                  size={17}
                  className="text-[#1F7A63]"
                />

                <p className="text-xs text-[#7C858A]">
                  SMA ({period})
                </p>

              </div>

              <p className="font-bold mt-2">
                {latestSMA !== null
                  ? `₹${latestSMA.toFixed(2)}`
                  : "N/A"}
              </p>

            </div>

            <div className="bg-[#F7F4F2] rounded-xl p-4">

              <div className="flex items-center gap-2">

                <TrendingUp
                  size={17}
                  className="text-[#1F7A63]"
                />

                <p className="text-xs text-[#7C858A]">
                  EMA (9)
                </p>

              </div>

              <p className="font-bold mt-2">
                {latestEMA !== null &&
                latestEMA !== undefined
                  ? `₹${latestEMA.toFixed(2)}`
                  : "N/A"}
              </p>

            </div>

            <div className="bg-[#F7F4F2] rounded-xl p-4">

              <div className="flex items-center gap-2">

                <Activity
                  size={17}
                  className="text-[#1F7A63]"
                />

                <p className="text-xs text-[#7C858A]">
                  RSI (14)
                </p>

              </div>

              <p className="font-bold mt-2">
                {latestRSI !== null &&
                latestRSI !== undefined
                  ? latestRSI.toFixed(2)
                  : "N/A"}
              </p>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}