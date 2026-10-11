
const API_BASE_URL = "http://127.0.0.1:8000";

export interface Company {
  symbol: string;
  name: string;
}

export interface HistoricalData {
  date: string;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  volume?: number;
  [key: string]: string | number | null | undefined;
}

export interface AnalyticsData extends HistoricalData {
  SMA?: number | null;
  EMA?: number | null;
  RSI?: number | null;
  MACD?: number | null;
  MACD_Signal?: number | null;
}

export interface PredictionResult {
  symbol: string;
  model: string;

  // First future prediction
  next_prediction: number;

  // Multiple future predictions
  future_predictions?: number[];
  future_dates?: string[];
  prediction_days?: number;

  // Model evaluation
  mae: number;
  rmse: number;

  // Historical validation results
  actual: number[];
  predicted: number[];
  dates: string[];
}

export interface ModelComparison {
  symbol: string;

  models: {
    model: string;
    mae: number;
    rmse: number;
    next_prediction: number;
  }[];

  best_model: string;
}

export interface StockSummary {
  symbol: string;
  latest_close: number;
  previous_close: number;
  price_change: number;
  percentage_change: number;
  sma_20: number | null;
  ema_9: number | null;
  rsi_14: number | null;
  macd: number | null;
  macd_signal: number | null;
}


// ----------------------------------
// Generic API Fetch
// ----------------------------------

async function fetchAPI<T>(
  endpoint: string
): Promise<T> {

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`
  );

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status}`
    );
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return data;
}


// ----------------------------------
// Companies
// ----------------------------------

export async function getCompanies() {

  return fetchAPI<{
    companies: Company[];
  }>(
    "/api/companies"
  );
}


// ----------------------------------
// Historical Data
// ----------------------------------

export async function getHistoricalData(
  symbol: string
) {

  return fetchAPI<{
    symbol: string;
    data: HistoricalData[];
  }>(
    `/api/historical/${symbol}`
  );
}


// ----------------------------------
// Technical Analytics
// ----------------------------------

export async function getAnalytics(
  symbol: string
) {

  return fetchAPI<{
    symbol: string;
    period: number;
    data: AnalyticsData[];
  }>(
    `/api/analytics/${symbol}`
  );
}


// ----------------------------------
// Linear Regression Prediction
// ----------------------------------

export async function getPrediction(
  symbol: string,
  days: number = 1
) {

  return fetchAPI<PredictionResult>(
    `/api/prediction/${symbol}?days=${days}`
  );
}


// ----------------------------------
// Random Forest Prediction
// ----------------------------------

export async function getRandomForestPrediction(
  symbol: string,
  days: number = 1
) {

  return fetchAPI<PredictionResult>(
    `/api/random-forest/${symbol}?days=${days}`
  );
}


// ----------------------------------
// ARIMA Prediction
// ----------------------------------

export async function getArimaPrediction(
  symbol: string,
  days: number = 1
) {

  return fetchAPI<PredictionResult>(
    `/api/arima/${symbol}?days=${days}`
  );
}


// ----------------------------------
// Model Comparison
// ----------------------------------

export async function getModelComparison(
  symbol: string
) {

  return fetchAPI<ModelComparison>(
    `/api/model-comparison/${symbol}`
  );
}


// ----------------------------------
// Stock Summary
// ----------------------------------

export async function getStockSummary(
  symbol: string
) {

  return fetchAPI<StockSummary>(
    `/api/summary/${symbol}`
  );
}
