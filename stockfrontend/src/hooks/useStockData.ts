import { useEffect, useState } from "react";
import {
  getStockSummary,
  getModelComparison,
  getAnalytics,
  type StockSummary,
  type ModelComparison,
  type AnalyticsData,
} from "../services/api";

export function useStockData(symbol: string) {
  const [summary, setSummary] = useState<StockSummary | null>(null);
  const [comparison, setComparison] =
    useState<ModelComparison | null>(null);
  const [analytics, setAnalytics] =
    useState<AnalyticsData[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStockData() {
      try {
        setLoading(true);
        setError("");

        const [
          summaryResult,
          comparisonResult,
          analyticsResult,
        ] = await Promise.all([
          getStockSummary(symbol),
          getModelComparison(symbol),
          getAnalytics(symbol),
        ]);

        setSummary(summaryResult);
        setComparison(comparisonResult);
        setAnalytics(analyticsResult.data);
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load stock data"
        );
      } finally {
        setLoading(false);
      }
    }

    if (symbol) {
      loadStockData();
    }
  }, [symbol]);

  return {
    summary,
    comparison,
    analytics,
    loading,
    error,
  };
}