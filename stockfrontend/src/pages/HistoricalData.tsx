
import { useEffect, useState } from "react";
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
import {
  getHistoricalData,
  type HistoricalData as HistoricalStockData,
} from "../services/api";

export default function HistoricalData() {
  const [selectedCompany, setSelectedCompany] =
    useState("RELIANCE");

  const [data, setData] = useState<HistoricalStockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const result = await getHistoricalData(selectedCompany);

        setData(result.data);
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load historical data"
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [selectedCompany]);

  const chartData = data
    .filter(
      (item) =>
        item.date &&
        item.close !== null &&
        item.close !== undefined
    )
    .map((item) => ({
      date: item.date,
      close: Number(item.close),
    }));

  const displayedData = [...data].reverse().slice(0, 50);

  return (
    <div className="min-h-screen bg-[#F7F4F2] p-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>
          <h1 className="text-3xl font-bold text-[#081C2D]">
            Historical Data
          </h1>

          <p className="text-sm text-[#7C858A] mt-1">
            View historical stock prices and trading volume
          </p>
        </div>

        <div className="w-full md:w-72">
          <CompanySelector
            selectedCompany={selectedCompany}
            onCompanyChange={setSelectedCompany}
          />
        </div>

      </div>

      {/* LOADING */}
      {loading && (
        <div className="bg-white rounded-2xl border border-[#E5DFDC] p-10 text-center">
          <div className="w-10 h-10 border-4 border-[#E8F3F0] border-t-[#1F7A63] rounded-full animate-spin mx-auto" />

          <p className="text-gray-600 mt-4">
            Loading historical data...
          </p>
        </div>
      )}

      {/* ERROR */}
      {!loading && error && (
        <div className="bg-white rounded-2xl border border-red-200 p-6">
          <h2 className="font-bold text-red-600">
            Unable to load data
          </h2>

          <p className="text-sm text-gray-600 mt-2">
            {error}
          </p>
        </div>
      )}

      {/* DATA */}
      {!loading && !error && (
        <>
          {/* PRICE CHART */}
          <div className="bg-white rounded-2xl border border-[#E5DFDC] p-6 mb-6">

            <div className="mb-6">
              <h2 className="text-lg font-bold text-[#081C2D]">
                {selectedCompany} Closing Price
              </h2>

              <p className="text-sm text-[#9AA3A8] mt-1">
                Historical closing price movement
              </p>
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
                      minTickGap={35}
                    />

                    <YAxis
                      tick={{
                        fontSize: 11,
                        fill: "#9AA3A8",
                      }}
                      domain={["auto", "auto"]}
                    />

                    <Tooltip
                      formatter={(value) => [
                        `₹${Number(value).toFixed(2)}`,
                        "Close",
                      ]}
                    />

                    <Line
                      type="monotone"
                      dataKey="close"
                      stroke="#1F7A63"
                      strokeWidth={3}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  No chart data available
                </div>
              )}

            </div>
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-2xl border border-[#E5DFDC] overflow-hidden">

            <div className="p-6 border-b border-[#E5DFDC]">

              <h2 className="text-lg font-bold text-[#081C2D]">
                Historical Price Records
              </h2>

              <p className="text-sm text-[#9AA3A8] mt-1">
                Showing latest 50 records
              </p>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full text-sm">

                <thead className="bg-[#F7F4F2]">

                  <tr>
                    <th className="text-left px-6 py-4 font-semibold text-[#081C2D]">
                      Date
                    </th>

                    <th className="text-right px-6 py-4 font-semibold text-[#081C2D]">
                      Open
                    </th>

                    <th className="text-right px-6 py-4 font-semibold text-[#081C2D]">
                      High
                    </th>

                    <th className="text-right px-6 py-4 font-semibold text-[#081C2D]">
                      Low
                    </th>

                    <th className="text-right px-6 py-4 font-semibold text-[#081C2D]">
                      Close
                    </th>

                    <th className="text-right px-6 py-4 font-semibold text-[#081C2D]">
                      Volume
                    </th>
                  </tr>

                </thead>

                <tbody>

                  {displayedData.map((row, index) => (
                    <tr
                      key={`${row.date}-${index}`}
                      className="border-t border-[#E5DFDC] hover:bg-[#FAF8F7]"
                    >

                      <td className="px-6 py-4 text-[#081C2D]">
                        {row.date}
                      </td>

                      <td className="px-6 py-4 text-right">
                        {row.open !== null &&
                        row.open !== undefined
                          ? Number(row.open).toFixed(2)
                          : "--"}
                      </td>

                      <td className="px-6 py-4 text-right">
                        {row.high !== null &&
                        row.high !== undefined
                          ? Number(row.high).toFixed(2)
                          : "--"}
                      </td>

                      <td className="px-6 py-4 text-right">
                        {row.low !== null &&
                        row.low !== undefined
                          ? Number(row.low).toFixed(2)
                          : "--"}
                      </td>

                      <td className="px-6 py-4 text-right font-semibold text-[#1F7A63]">
                        {row.close !== null &&
                        row.close !== undefined
                          ? `₹${Number(row.close).toFixed(2)}`
                          : "--"}
                      </td>

                      <td className="px-6 py-4 text-right">
                        {row.volume !== null &&
                        row.volume !== undefined
                          ? Number(row.volume).toLocaleString()
                          : "--"}
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>

          </div>
        </>
      )}

    </div>
  );
}

