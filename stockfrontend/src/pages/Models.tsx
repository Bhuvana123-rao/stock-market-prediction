import { useEffect, useState } from "react";
import { BarChart3, Brain } from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import CompanySelector from "../components/CompanySelector";

import {
  getModelComparison,
  type ModelComparison,
} from "../services/api";

export default function Models() {
  const [selectedCompany, setSelectedCompany] =
    useState("RELIANCE");

  const [comparison, setComparison] =
    useState<ModelComparison | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadModels() {
      try {
        setLoading(true);
        setError("");

        const result =
          await getModelComparison(selectedCompany);

        setComparison(result);
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load model comparison"
        );
      } finally {
        setLoading(false);
      }
    }

    loadModels();
  }, [selectedCompany]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F4F2] flex items-center justify-center">
        <div className="bg-white rounded-2xl border border-[#E5DFDC] px-8 py-6 text-center">
          <div className="w-10 h-10 border-4 border-[#E5DFDC] border-t-[#1F7A63] rounded-full animate-spin mx-auto mb-4" />

          <p className="text-sm font-medium text-[#081C2D]">
            Loading model comparison...
          </p>
        </div>
      </div>
    );
  }

  if (error || !comparison) {
    return (
      <div className="min-h-screen bg-[#F7F4F2] flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl border border-red-200 px-8 py-6 text-center">
          <p className="text-red-500 font-medium">
            {error || "No model comparison data available"}
          </p>
        </div>
      </div>
    );
  }

  const results = comparison.models;

  const chartData = results.map((item) => ({
    model: item.model,
    mae: Number(item.mae.toFixed(2)),
    rmse: Number(item.rmse.toFixed(2)),
  }));

  const bestModel = comparison.best_model;

  return (
    <div className="min-h-screen bg-[#F7F4F2] text-[#081C2D]">

      {/* HEADER */}

      <div className="bg-white border-b border-[#E5DFDC]">
        <div className="max-w-7xl mx-auto px-6 py-5">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>
              <p className="text-sm text-[#7C858A] mb-1">
                Machine Learning
              </p>

              <h1 className="text-2xl font-bold">
                Model Comparison
              </h1>

              <p className="text-sm text-[#7C858A] mt-1">
                Compare prediction model performance
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

      {/* MAIN */}

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* COMPANY TITLE */}

        <div className="mb-6">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-lg bg-[#E8F3F0] flex items-center justify-center">

              <Brain
                size={21}
                className="text-[#1F7A63]"
              />

            </div>

            <div>

              <h2 className="text-xl font-bold">
                {selectedCompany} Model Performance
              </h2>

              <p className="text-sm text-[#7C858A]">
                Evaluation metrics calculated from historical stock data
              </p>

            </div>

          </div>

        </div>

        {/* BEST MODEL */}

        <div className="bg-white rounded-2xl border border-[#E5DFDC] p-6 mb-7">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>
              <p className="text-sm text-[#7C858A]">
                Best Performing Model
              </p>

              <h2 className="text-2xl font-bold mt-1 text-[#1F7A63]">
                {bestModel}
              </h2>

              <p className="text-sm text-[#7C858A] mt-1">
                Selected based on the lowest RMSE
              </p>
            </div>

            <div className="bg-[#E8F3F0] rounded-xl px-5 py-4">

              <p className="text-xs text-[#7C858A]">
                Models Compared
              </p>

              <p className="text-2xl font-bold text-[#081C2D]">
                {results.length}
              </p>

            </div>

          </div>

        </div>

        {/* COMPARISON TABLE */}

        <div className="bg-white rounded-2xl border border-[#E5DFDC] overflow-hidden mb-7">

          <div className="p-6 border-b border-[#E5DFDC]">

            <div className="flex items-center gap-3">

              <BarChart3
                size={20}
                className="text-[#1F7A63]"
              />

              <div>

                <h2 className="text-lg font-bold">
                  Model Comparison Table
                </h2>

                <p className="text-sm text-[#7C858A] mt-1">
                  Lower MAE and RMSE indicate lower prediction error
                </p>

              </div>

            </div>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="bg-[#F7F4F2] border-b border-[#E5DFDC]">

                  <th className="text-left px-6 py-4 text-sm font-semibold">
                    Model
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold">
                    MAE
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold">
                    RMSE
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold">
                    Next Prediction
                  </th>

                </tr>

              </thead>

              <tbody>

                {results.map((item, index) => {

                  const isBest =
                    item.model === bestModel;

                  return (
                    <tr
                      key={item.model}
                      className={`border-b border-[#E5DFDC] last:border-0 ${
                        isBest
                          ? "bg-[#F3FAF7]"
                          : "bg-white"
                      }`}
                    >

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-3">

                          <span className="text-xs text-[#9AA3A8] w-5">
                            0{index + 1}
                          </span>

                          <span className="font-semibold">
                            {item.model}
                          </span>

                          {isBest && (
                            <span className="text-xs font-semibold text-[#1F7A63] bg-[#E8F3F0] px-2 py-1 rounded-full">
                              Best
                            </span>
                          )}

                        </div>

                      </td>

                      <td className="px-6 py-5 text-sm">
                        {item.mae.toFixed(2)}
                      </td>

                      <td className="px-6 py-5 text-sm">
                        {item.rmse.toFixed(2)}
                      </td>

                      <td className="px-6 py-5 text-sm font-medium">
                        ₹{item.next_prediction.toFixed(2)}
                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>

        </div>

        {/* ERROR COMPARISON GRAPH */}

        <div className="bg-white rounded-2xl border border-[#E5DFDC] p-6">

          <div className="mb-6">

            <h2 className="text-lg font-bold">
              Model Error Comparison
            </h2>

            <p className="text-sm text-[#7C858A] mt-1">
              Comparison of MAE and RMSE for {selectedCompany}
            </p>

          </div>

          <div className="h-[380px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 20,
                  left: 10,
                  bottom: 10,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E5DFDC"
                />

                <XAxis
                  dataKey="model"
                  tick={{
                    fontSize: 11,
                  }}
                  tickLine={false}
                />

                <YAxis
                  tick={{
                    fontSize: 11,
                  }}
                  tickLine={false}
                  domain={["auto", "auto"]}
                />

                <Tooltip />

                <Bar
                  dataKey="mae"
                  name="MAE"
                  fill="#1F7A63"
                  radius={[7, 7, 0, 0]}
                />

                <Bar
                  dataKey="rmse"
                  name="RMSE"
                  fill="#C65D7B"
                  radius={[7, 7, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* NOTE */}

        <p className="text-xs text-[#9AA3A8] text-center mt-6">
          Model performance is calculated using the selected company's
          historical stock dataset. Lower MAE and RMSE indicate better
          prediction performance.
        </p>

      </main>

    </div>
  );
}