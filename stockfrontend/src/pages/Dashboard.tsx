import { useState, type ReactNode } from "react";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Activity,
  Brain,
  Target,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import CompanySelector from "../components/CompanySelector";
import { useStockData } from "../hooks/useStockData";

export default function Dashboard() {
  const [selectedCompany, setSelectedCompany] =
    useState<string>("RELIANCE");

  const {
    summary,
    comparison,
    analytics,
    loading,
    error,
  } = useStockData(selectedCompany);

  const isPositive = (summary?.price_change ?? 0) >= 0;

  const chartData = analytics
    .filter(
      (item) =>
        item.date &&
        item.close !== null &&
        item.close !== undefined
    )
    .map((item) => ({
      date: item.date,
      price: Number(item.close),
    }));

  const bestModel = comparison?.models.find(
    (model) => model.model === comparison.best_model
  );

  /* LOADING */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F4F2] p-6 flex items-center justify-center">
        <div className="bg-white rounded-2xl border border-[#E5DFDC] p-8 text-center">
          <div className="w-10 h-10 border-4 border-[#E8F3F0] border-t-[#1F7A63] rounded-full animate-spin mx-auto" />

          <p className="text-gray-600 mt-4">
            Loading {selectedCompany} data...
          </p>
        </div>
      </div>
    );
  }

  /* ERROR */
  if (error) {
    return (
      <div className="min-h-screen bg-[#F7F4F2] p-6">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-red-200 p-6">
          <h2 className="text-lg font-bold text-red-600">
            Unable to load stock data
          </h2>

          <p className="text-sm text-gray-600 mt-2">
            {error}
          </p>

          <p className="text-xs text-gray-500 mt-4">
            Make sure your FastAPI backend is running on
            port 8000.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F4F2] p-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>
          <h1 className="text-3xl font-bold text-[#081C2D]">
            Stock Market Dashboard
          </h1>

          <p className="text-sm text-[#7C858A] mt-1">
            Analyze historical prices and AI-based stock predictions
          </p>
        </div>

        <div className="w-full md:w-72">
          <CompanySelector
            selectedCompany={selectedCompany}
            onCompanyChange={setSelectedCompany}
          />
        </div>

      </div>

      {/* COMPANY SUMMARY */}
      <div className="bg-white rounded-2xl border border-[#E5DFDC] p-6 mb-6">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

          <div>
            <p className="text-sm text-[#9AA3A8]">
              Selected Company
            </p>

            <h2 className="text-2xl font-bold text-[#081C2D] mt-1">
              {selectedCompany}
            </h2>

            <p className="text-sm text-[#7C858A] mt-1">
              NSE • Historical Stock Analysis
            </p>
          </div>

          <div className="text-left md:text-right">

            <p className="text-sm text-[#9AA3A8]">
              Latest Price
            </p>

            <h2 className="text-3xl font-bold text-[#081C2D]">
              ₹{summary?.latest_close?.toFixed(2) ?? "--"}
            </h2>

            <div
              className={`flex items-center justify-start md:justify-end gap-1 mt-1 ${
                isPositive
                  ? "text-[#1F7A63]"
                  : "text-red-500"
              }`}
            >
              {isPositive ? (
                <TrendingUp size={17} />
              ) : (
                <TrendingDown size={17} />
              )}

              <span className="font-medium">
                {summary?.price_change !== undefined
                  ? `${
                      summary.price_change >= 0 ? "+" : ""
                    }${summary.price_change.toFixed(2)}`
                  : "--"}

                {" ("}

                {summary?.percentage_change !== undefined
                  ? `${
                      summary.percentage_change >= 0 ? "+" : ""
                    }${summary.percentage_change.toFixed(2)}%`
                  : "--"}

                {")"}
              </span>
            </div>

          </div>

        </div>

      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">

        <StatCard
          title="Current Price"
          value={
            summary
              ? `₹${summary.latest_close.toFixed(2)}`
              : "--"
          }
          icon={<Activity size={21} />}
        />

        <StatCard
          title="Daily Change"
          value={
            summary
              ? `${
                  summary.price_change >= 0 ? "+" : ""
                }${summary.price_change.toFixed(2)} (${
                  summary.percentage_change >= 0 ? "+" : ""
                }${summary.percentage_change.toFixed(2)}%)`
              : "--"
          }
          icon={
            isPositive ? (
              <TrendingUp size={21} />
            ) : (
              <TrendingDown size={21} />
            )
          }
          positive={isPositive}
        />

        <StatCard
          title="20-Day Moving Average"
          value={
            summary?.sma_20 !== null &&
            summary?.sma_20 !== undefined
              ? `₹${summary.sma_20.toFixed(2)}`
              : "--"
          }
          icon={<BarChart3 size={21} />}
        />

        <StatCard
          title="Best Model"
          value={comparison?.best_model ?? "--"}
          icon={<Target size={21} />}
          positive
        />

      </div>

      {/* CHART + PREDICTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* HISTORICAL PRICE GRAPH */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E5DFDC] p-6">

          <div className="flex items-center justify-between mb-6">

            <div>
              <h3 className="text-lg font-bold text-[#081C2D]">
                Historical Price
              </h3>

              <p className="text-sm text-[#9AA3A8]">
                Historical closing price movement
              </p>
            </div>

            <BarChart3
              size={22}
              className="text-[#1F7A63]"
            />

          </div>

          <div className="w-full h-[320px]">

            {chartData.length > 0 ? (
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <LineChart
                  data={chartData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 0,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#EAE5E2"
                  />

                  <XAxis
                    dataKey="date"
                    tick={{
                      fontSize: 11,
                      fill: "#9AA3A8",
                    }}
                    minTickGap={30}
                  />

                  <YAxis
                    tick={{
                      fontSize: 12,
                      fill: "#9AA3A8",
                    }}
                    domain={["auto", "auto"]}
                  />

                  <Tooltip
                    formatter={(value) => [
                      `₹${Number(value).toFixed(2)}`,
                      "Price",
                    ]}
                    contentStyle={{
                      borderRadius: "10px",
                      border: "1px solid #E5DFDC",
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#1F7A63"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                No historical data available
              </div>
            )}

          </div>

        </div>

        {/* AI PREDICTION */}
        <div className="bg-[#173B35] rounded-2xl p-6 text-white">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-white/60">
                AI Prediction
              </p>

              <h3 className="text-xl font-bold mt-1">
                Next Price
              </h3>
            </div>

            <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
              <Brain size={23} />
            </div>

          </div>

          <div className="mt-10">

            <p className="text-sm text-white/60">
              Predicted Stock Price
            </p>

            <h2 className="text-4xl font-bold mt-2">
              {bestModel
                ? `₹${bestModel.next_prediction.toFixed(2)}`
                : "--"}
            </h2>

            {comparison && (
              <div className="mt-4">

                <p className="text-sm text-white/60">
                  Best Model
                </p>

                <p className="text-lg font-semibold text-[#B8E6D8]">
                  {comparison.best_model}
                </p>

              </div>
            )}

          </div>

          <button
            type="button"
            className="w-full mt-8 bg-white text-[#173B35] rounded-xl py-3 font-semibold hover:bg-[#F2F2F2] transition"
            onClick={() => window.location.reload()}
          >
            Refresh Prediction
          </button>

        </div>

      </div>

      {/* MODEL COMPARISON */}
      <div className="bg-white rounded-2xl border border-[#E5DFDC] p-6 mt-6">

        <div className="mb-6">

          <h3 className="text-lg font-bold text-[#081C2D]">
            Model Comparison
          </h3>

          <p className="text-sm text-[#9AA3A8] mt-1">
            Compare prediction algorithms using MAE and RMSE
          </p>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {comparison?.models.map((model) => (
            <ModelCard
              key={model.model}
              name={model.model}
              rmse={model.rmse}
              mae={model.mae}
              prediction={model.next_prediction}
              best={
                model.model === comparison.best_model
              }
            />
          ))}

        </div>

      </div>

    </div>
  );
}

/* STAT CARD */

interface StatCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  positive?: boolean;
}

function StatCard({
  title,
  value,
  icon,
  positive,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#E5DFDC] p-5">

      <div className="flex items-center justify-between">

        <p className="text-sm text-[#9AA3A8]">
          {title}
        </p>

        <div className="w-10 h-10 rounded-xl bg-[#E8F3F0] flex items-center justify-center text-[#1F7A63]">
          {icon}
        </div>

      </div>

      <h3
        className={`text-xl font-bold mt-4 ${
          positive
            ? "text-[#1F7A63]"
            : "text-[#081C2D]"
        }`}
      >
        {value}
      </h3>

    </div>
  );
}

/* MODEL CARD */

interface ModelCardProps {
  name: string;
  mae: number;
  rmse: number;
  prediction: number;
  best?: boolean;
}

function ModelCard({
  name,
  mae,
  rmse,
  prediction,
  best,
}: ModelCardProps) {
  return (
    <div
      className={`rounded-xl p-5 border ${
        best
          ? "border-[#1F7A63] bg-[#F0F8F5]"
          : "border-[#E5DFDC] bg-white"
      }`}
    >

      <div className="flex items-center justify-between">

        <h4 className="font-semibold text-[#081C2D]">
          {name}
        </h4>

        {best && (
          <span className="text-xs font-semibold bg-[#1F7A63] text-white px-2 py-1 rounded-full">
            Best
          </span>
        )}

      </div>

      <div className="grid grid-cols-2 gap-4 mt-5">

        <div>
          <p className="text-xs text-[#9AA3A8]">
            MAE
          </p>

          <p className="text-lg font-bold text-[#1F7A63] mt-1">
            {mae.toFixed(2)}
          </p>
        </div>

        <div>
          <p className="text-xs text-[#9AA3A8]">
            RMSE
          </p>

          <p className="text-lg font-bold text-[#081C2D] mt-1">
            {rmse.toFixed(2)}
          </p>
        </div>

      </div>

      <div className="mt-4 pt-4 border-t border-[#E5DFDC]">

        <p className="text-xs text-[#9AA3A8]">
          Next Prediction
        </p>

        <p className="text-lg font-bold text-[#081C2D] mt-1">
          ₹{prediction.toFixed(2)}
        </p>

      </div>

    </div>
  );
}