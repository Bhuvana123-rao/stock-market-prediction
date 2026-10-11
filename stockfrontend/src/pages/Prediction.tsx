import { useEffect, useState, type ReactNode } from "react";
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Target,
  Activity,
  BarChart3,
  CalendarDays,
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
} from "recharts";

import CompanySelector from "../components/CompanySelector";

import {
  getPrediction,
  getRandomForestPrediction,
  getArimaPrediction,
  getModelComparison,
  type PredictionResult,
  type ModelComparison,
} from "../services/api";

export default function Prediction() {
  const [selectedCompany, setSelectedCompany] =
    useState("RELIANCE");

  const [selectedModel, setSelectedModel] =
    useState("ARIMA");

  const [predictionPeriod, setPredictionPeriod] =
    useState("1");

  const [prediction, setPrediction] =
    useState<PredictionResult | null>(null);

  const [comparison, setComparison] =
    useState<ModelComparison | null>(null);

  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");

  /* --------------------------------
     LOAD MODEL COMPARISON
  -------------------------------- */

  useEffect(() => {
    async function loadComparison() {
      try {
        setLoading(true);
        setError("");

        const result =
          await getModelComparison(selectedCompany);

        setComparison(result);

        const defaultModel =
          result.models.find(
            (model) => model.model === selectedModel
          ) ?? result.models[0];

        if (defaultModel) {
          setSelectedModel(defaultModel.model);
        }
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load prediction data"
        );
      } finally {
        setLoading(false);
      }
    }

    loadComparison();
  }, [selectedCompany]);

  /* --------------------------------
     RUN SELECTED MODEL
  -------------------------------- */

  const runPrediction = async () => {
    try {
      setRunning(true);
      setError("");

      const days = Number(predictionPeriod);

      let result: PredictionResult;

      if (selectedModel === "Linear Regression") {
        result = await getPrediction(
          selectedCompany,
          days
        );
      } else if (selectedModel === "Random Forest") {
        result = await getRandomForestPrediction(
          selectedCompany,
          days
        );
      } else {
        result = await getArimaPrediction(
          selectedCompany,
          days
        );
      }

      setPrediction(result);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to run prediction"
      );
    } finally {
      setRunning(false);
    }
  };

  /* --------------------------------
     RUN WHEN SETTINGS CHANGE
  -------------------------------- */

  useEffect(() => {
    if (!loading) {
      runPrediction();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedCompany,
    selectedModel,
    predictionPeriod,
    loading,
  ]);

  /* --------------------------------
     HISTORICAL CHART DATA
  -------------------------------- */

  const chartData =
    prediction?.dates?.map((date, index) => ({
      date,
      actual: prediction.actual?.[index],
      predicted: prediction.predicted?.[index],
    })) ?? [];

  /* --------------------------------
     FUTURE PREDICTION DATA
  -------------------------------- */

  const futureChartData =
    prediction?.future_dates?.map(
      (date, index) => ({
        date,
        predicted:
          prediction.future_predictions?.[index],
      })
    ) ?? [];

  /* --------------------------------
     SELECTED MODEL RESULT
  -------------------------------- */

  const selectedResult =
    comparison?.models.find(
      (model) => model.model === selectedModel
    );

  /* --------------------------------
     PREDICTED PRICE
  -------------------------------- */

  const predictedPrice =
    prediction?.future_predictions?.[0] ??
    prediction?.next_prediction ??
    selectedResult?.next_prediction ??
    null;

  /* --------------------------------
     LATEST ACTUAL PRICE
  -------------------------------- */

  const latestActual =
    prediction?.actual?.[
      prediction.actual.length - 1
    ];

  /* --------------------------------
     TREND
  -------------------------------- */

  const trendIsPositive =
    predictedPrice !== null &&
    latestActual !== undefined
      ? predictedPrice >= latestActual
      : true;

  /* --------------------------------
     LOADING
  -------------------------------- */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F4F2] p-6 flex items-center justify-center">
        <div className="bg-white rounded-2xl border border-[#E5DFDC] p-8 text-center">

          <div className="w-10 h-10 border-4 border-[#E8F3F0] border-t-[#1F7A63] rounded-full animate-spin mx-auto" />

          <p className="text-gray-600 mt-4">
            Loading {selectedCompany} prediction models...
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
            Stock Prediction
          </h1>

          <p className="text-sm text-[#7C858A] mt-1">
            Predict stock prices using machine learning models
          </p>
        </div>

        <div className="w-full md:w-72">

          <CompanySelector
            selectedCompany={selectedCompany}
            onCompanyChange={setSelectedCompany}
          />

        </div>

      </div>

      {/* ERROR */}

      {error && (
        <div className="bg-white rounded-2xl border border-red-200 p-5 mb-6">

          <h3 className="font-semibold text-red-600">
            Prediction Error
          </h3>

          <p className="text-sm text-gray-600 mt-1">
            {error}
          </p>

        </div>
      )}

      {/* SETTINGS */}

      <div className="bg-white rounded-2xl border border-[#E5DFDC] p-6 mb-6">

        <div className="flex items-center gap-3 mb-6">

          <div className="w-10 h-10 rounded-xl bg-[#E8F3F0] flex items-center justify-center">

            <Brain
              size={21}
              className="text-[#1F7A63]"
            />

          </div>

          <div>

            <h2 className="text-lg font-bold text-[#081C2D]">
              Prediction Settings
            </h2>

            <p className="text-sm text-[#9AA3A8]">
              Select a prediction model and forecast period
            </p>

          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* MODEL */}

          <div>

            <label className="block text-sm font-medium text-[#081C2D] mb-2">
              Prediction Model
            </label>

            <select
              value={selectedModel}
              onChange={(e) =>
                setSelectedModel(e.target.value)
              }
              className="w-full border border-[#E5DFDC] rounded-xl px-4 py-3 bg-white outline-none focus:border-[#1F7A63]"
            >

              <option value="Linear Regression">
                Linear Regression
              </option>

              <option value="ARIMA">
                ARIMA
              </option>

              <option value="Random Forest">
                Random Forest
              </option>

            </select>

          </div>

          {/* PERIOD */}

          <div>

            <label className="block text-sm font-medium text-[#081C2D] mb-2">
              Prediction Period
            </label>

            <div className="relative">

              <CalendarDays
                size={18}
                className="absolute left-3 top-3.5 text-[#9AA3A8]"
              />

              <select
                value={predictionPeriod}
                onChange={(e) =>
                  setPredictionPeriod(e.target.value)
                }
                className="w-full border border-[#E5DFDC] rounded-xl pl-10 pr-4 py-3 bg-white outline-none focus:border-[#1F7A63]"
              >

                <option value="1">
                  Next 1 Day
                </option>

                <option value="7">
                  Next 7 Days
                </option>

                <option value="14">
                  Next 14 Days
                </option>

                <option value="30">
                  Next 30 Days
                </option>

              </select>

            </div>

          </div>

          {/* RUN BUTTON */}

          <div className="flex items-end">

            <button
              type="button"
              onClick={runPrediction}
              disabled={running}
              className="w-full bg-[#1F7A63] hover:bg-[#176451] disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl py-3 font-semibold flex items-center justify-center gap-2 transition"
            >

              <Brain size={19} />

              {running
                ? "Running..."
                : "Run Prediction"}

            </button>

          </div>

        </div>

      </div>

      {/* SELECTED PERIOD INFO */}

      <div className="bg-[#E8F3F0] border border-[#CDE5DD] rounded-xl px-5 py-3 mb-6">

        <p className="text-sm text-[#176451]">

          <span className="font-semibold">
            Forecast:
          </span>{" "}

          {predictionPeriod === "1"
            ? "Next 1 trading day"
            : `Next ${predictionPeriod} trading days`}

          {" • "}

          <span className="font-semibold">
            Model:
          </span>{" "}

          {selectedModel}

        </p>

      </div>

      {/* RESULT CARDS */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">

        {/* PREDICTED PRICE */}

        <div className="bg-[#173B35] rounded-2xl p-6 text-white">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-white/60">
                Predicted Price
              </p>

              <h2 className="text-3xl font-bold mt-2">

                {predictedPrice !== null
                  ? `₹${predictedPrice.toFixed(2)}`
                  : "--"}

              </h2>

            </div>

            <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">

              {trendIsPositive ? (
                <TrendingUp size={22} />
              ) : (
                <TrendingDown size={22} />
              )}

            </div>

          </div>

          <p className="text-sm text-[#B8E6D8] mt-4">

            {predictionPeriod === "1"
              ? "Next predicted closing price"
              : `First predicted closing price in next ${predictionPeriod} trading days`}

          </p>

        </div>

        {/* MAE */}

        <ResultCard
          title="Model MAE"
          value={
            prediction
              ? prediction.mae.toFixed(2)
              : selectedResult
                ? selectedResult.mae.toFixed(2)
                : "--"
          }
          description={`${selectedModel} Mean Absolute Error`}
          icon={<Target size={22} />}
        />

        {/* RMSE */}

        <ResultCard
          title="Model RMSE"
          value={
            prediction
              ? prediction.rmse.toFixed(2)
              : selectedResult
                ? selectedResult.rmse.toFixed(2)
                : "--"
          }
          description={`${selectedModel} Root Mean Square Error`}
          icon={<Activity size={22} />}
        />

      </div>

      {/* FUTURE PREDICTIONS */}

      {futureChartData.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#E5DFDC] p-6 mb-6">

          <div className="flex items-center justify-between mb-6">

            <div>

              <h2 className="text-lg font-bold text-[#081C2D]">
                Future Price Forecast
              </h2>

              <p className="text-sm text-[#9AA3A8] mt-1">

                {selectedModel} forecast for the next{" "}
                {predictionPeriod} trading days

              </p>

            </div>

            <CalendarDays
              size={22}
              className="text-[#1F7A63]"
            />

          </div>

          <div className="w-full h-[350px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <LineChart
                data={futureChartData}
                margin={{
                  top: 10,
                  right: 20,
                  left: 5,
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
                  formatter={(value) =>
                    `₹${Number(value).toFixed(2)}`
                  }
                  contentStyle={{
                    borderRadius: "10px",
                    border: "1px solid #E5DFDC",
                  }}
                />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="predicted"
                  name="Forecast Price"
                  stroke="#1F7A63"
                  strokeWidth={3}
                  dot={false}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </div>
      )}

      {/* ACTUAL VS PREDICTED */}

      <div className="bg-white rounded-2xl border border-[#E5DFDC] p-6 mb-6">

        <div className="flex items-center justify-between mb-6">

          <div>

            <h2 className="text-lg font-bold text-[#081C2D]">
              Actual vs Predicted Price
            </h2>

            <p className="text-sm text-[#9AA3A8] mt-1">
              {selectedModel} validation results
            </p>

          </div>

          <BarChart3
            size={22}
            className="text-[#1F7A63]"
          />

        </div>

        <div className="w-full h-[350px]">

          {chartData.length > 0 ? (

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <LineChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 20,
                  left: 5,
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
                  formatter={(value, name) => [
                    `₹${Number(value).toFixed(2)}`,
                    name === "actual"
                      ? "Actual Price"
                      : "Predicted Price",
                  ]}
                  contentStyle={{
                    borderRadius: "10px",
                    border: "1px solid #E5DFDC",
                  }}
                />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="actual"
                  name="Actual Price"
                  stroke="#081C2D"
                  strokeWidth={2.5}
                  dot={false}
                />

                <Line
                  type="monotone"
                  dataKey="predicted"
                  name="Predicted Price"
                  stroke="#1F7A63"
                  strokeWidth={3}
                  dot={false}
                  strokeDasharray="6 4"
                />

              </LineChart>

            </ResponsiveContainer>

          ) : (

            <div className="h-full flex items-center justify-center text-gray-500">
              No prediction data available
            </div>

          )}

        </div>

      </div>

      {/* MODEL PERFORMANCE */}

      <div className="bg-white rounded-2xl border border-[#E5DFDC] p-6">

        <div className="mb-6">

          <h2 className="text-lg font-bold text-[#081C2D]">
            Prediction Model Performance
          </h2>

          <p className="text-sm text-[#9AA3A8] mt-1">
            Compare Linear Regression, Random Forest and ARIMA
          </p>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead>

              <tr className="border-b border-[#E5DFDC]">

                <th className="text-left py-4 px-3 text-[#7C858A] font-medium">
                  Model
                </th>

                <th className="text-left py-4 px-3 text-[#7C858A] font-medium">
                  MAE
                </th>

                <th className="text-left py-4 px-3 text-[#7C858A] font-medium">
                  RMSE
                </th>

                <th className="text-left py-4 px-3 text-[#7C858A] font-medium">
                  Next Prediction
                </th>

              </tr>

            </thead>

            <tbody>

              {comparison?.models.map((model) => (

                <tr
                  key={model.model}
                  className={`border-b border-[#F0ECEA] last:border-0 ${
                    model.model === selectedModel
                      ? "bg-[#F0F8F5]"
                      : ""
                  }`}
                >

                  <td className="py-4 px-3 font-semibold text-[#081C2D]">

                    <div className="flex items-center gap-2">

                      {model.model}

                      {model.model ===
                        comparison.best_model && (

                        <span className="text-xs bg-[#1F7A63] text-white px-2 py-1 rounded-full">
                          Best
                        </span>

                      )}

                    </div>

                  </td>

                  <td className="py-4 px-3 text-[#081C2D]">
                    {model.mae.toFixed(2)}
                  </td>

                  <td className="py-4 px-3 text-[#081C2D]">
                    {model.rmse.toFixed(2)}
                  </td>

                  <td className="py-4 px-3 font-semibold text-[#1F7A63]">
                    ₹{model.next_prediction.toFixed(2)}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

/* --------------------------------
   RESULT CARD
-------------------------------- */

interface ResultCardProps {
  title: string;
  value: string;
  description: string;
  icon: ReactNode;
  positive?: boolean;
}

function ResultCard({
  title,
  value,
  description,
  icon,
  positive = false,
}: ResultCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#E5DFDC] p-6">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-[#9AA3A8]">
            {title}
          </p>

          <h2
            className={`text-3xl font-bold mt-2 ${
              positive
                ? "text-[#1F7A63]"
                : "text-[#081C2D]"
            }`}
          >
            {value}
          </h2>

        </div>

        <div className="w-11 h-11 rounded-xl bg-[#E8F3F0] flex items-center justify-center text-[#1F7A63]">

          {icon}

        </div>

      </div>

      <p className="text-xs text-[#9AA3A8] mt-4">
        {description}
      </p>

    </div>
  );
}
