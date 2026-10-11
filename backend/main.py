
import math
import pandas as pd

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from services.model_service import train_random_forest
from services.arima_service import train_arima
from services.comparison_service import compare_models
from services.summary_service import get_stock_summary

from services.data_service import load_stock_data

from services.analytics_service import (
    calculate_sma,
    calculate_ema,
    calculate_rsi,
    calculate_macd
)

from services.prediction_service import (
    train_linear_regression
)


app = FastAPI(
    title="Stock Market Prediction API",
    description="Backend API for stock prediction and analysis",
    version="1.0.0"
)


# -----------------------------
# CORS
# -----------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------
# Helper: Clean JSON data
# -----------------------------

def clean_value(value):

    if pd.isna(value):
        return None

    if isinstance(value, float):
        if not math.isfinite(value):
            return None

    if hasattr(value, "item"):
        try:
            value = value.item()
        except Exception:
            pass

    return value


def dataframe_to_json(df):

    records = df.to_dict(orient="records")

    cleaned_records = []

    for record in records:

        cleaned_record = {}

        for key, value in record.items():
            cleaned_record[key] = clean_value(value)

        cleaned_records.append(cleaned_record)

    return cleaned_records


# -----------------------------
# Home
# -----------------------------

@app.get("/")
def home():

    return {
        "message": "Stock Market Prediction API is running"
    }


# -----------------------------
# Companies
# -----------------------------

@app.get("/api/companies")
def get_companies():

    return {
        "companies": [
            {
                "symbol": "RELIANCE",
                "name": "Reliance Industries"
            },
            {
                "symbol": "HDFCBANK",
                "name": "HDFC Bank"
            },
            {
                "symbol": "ICICIBANK",
                "name": "ICICI Bank"
            }
        ]
    }


# -----------------------------
# Historical Data
# -----------------------------

@app.get("/api/historical/{symbol}")
def get_historical_data(symbol: str):

    symbol = symbol.upper()

    df = load_stock_data(symbol)

    if df is None:
        return {
            "error": f"Data not found for {symbol}"
        }

    df = df.copy()

    if "date" in df.columns:

        df["date"] = pd.to_datetime(
            df["date"],
            errors="coerce"
        )

        df["date"] = df["date"].dt.strftime(
            "%Y-%m-%d"
        )

    df = df.replace(
        [float("inf"), float("-inf")],
        None
    )

    data = dataframe_to_json(df)

    return {
        "symbol": symbol,
        "data": data
    }


# -----------------------------
# Technical Analytics
# -----------------------------

@app.get("/api/analytics/{symbol}")
def get_analytics(
    symbol: str,
    period: int = 20
):

    symbol = symbol.upper()

    df = load_stock_data(symbol)

    if df is None:
        return {
            "error": f"Data not found for {symbol}"
        }

    df = df.copy()

    df = calculate_sma(
        df,
        period
    )

    df = calculate_ema(
        df,
        9
    )

    df = calculate_rsi(
        df,
        14
    )

    df = calculate_macd(
        df
    )

    numeric_columns = df.select_dtypes(
        include=["number"]
    ).columns

    df[numeric_columns] = df[
        numeric_columns
    ].round(2)

    if "date" in df.columns:

        df["date"] = pd.to_datetime(
            df["date"],
            errors="coerce"
        )

        df["date"] = df["date"].dt.strftime(
            "%Y-%m-%d"
        )

    df = df.replace(
        [float("inf"), float("-inf")],
        None
    )

    data = dataframe_to_json(df)

    return {
        "symbol": symbol,
        "period": period,
        "data": data
    }


# ============================================================
# PREDICTION ENDPOINTS
# ============================================================


# -----------------------------
# Linear Regression Prediction
# -----------------------------

@app.get("/api/prediction/{symbol}")
def get_prediction(
    symbol: str,
    days: int = 1
):

    symbol = symbol.upper()

    if days not in [1, 7, 14, 30]:

        return {
            "error": "Prediction period must be 1, 7, 14, or 30 days"
        }

    df = load_stock_data(symbol)

    if df is None:

        return {
            "error": f"Data not found for {symbol}"
        }

    try:

        result = train_linear_regression(
            df,
            prediction_days=days
        )

        return {
            "symbol": symbol,
            **result
        }

    except Exception as e:

        return {
            "error": str(e)
        }


# -----------------------------
# Random Forest Prediction
# -----------------------------

@app.get("/api/random-forest/{symbol}")
def get_random_forest_prediction(
    symbol: str,
    days: int = 1
):

    symbol = symbol.upper()

    if days not in [1, 7, 14, 30]:

        return {
            "error": "Prediction period must be 1, 7, 14, or 30 days"
        }

    df = load_stock_data(symbol)

    if df is None:

        return {
            "error": f"Data not found for {symbol}"
        }

    try:

        result = train_random_forest(
            df,
            prediction_days=days
        )

        return {
            "symbol": symbol,
            **result
        }

    except Exception as e:

        return {
            "error": str(e)
        }


# -----------------------------
# ARIMA Prediction
# -----------------------------

@app.get("/api/arima/{symbol}")
def get_arima_prediction(
    symbol: str,
    days: int = 1
):

    symbol = symbol.upper()

    if days not in [1, 7, 14, 30]:

        return {
            "error": "Prediction period must be 1, 7, 14, or 30 days"
        }

    df = load_stock_data(symbol)

    if df is None:

        return {
            "error": f"Data not found for {symbol}"
        }

    try:

        result = train_arima(
            df,
            prediction_days=days
        )

        return {
            "symbol": symbol,
            **result
        }

    except Exception as e:

        return {
            "error": str(e)
        }


# -----------------------------
# Model Comparison
# -----------------------------

@app.get("/api/model-comparison/{symbol}")
def get_model_comparison(symbol: str):

    symbol = symbol.upper()

    df = load_stock_data(symbol)

    if df is None:

        return {
            "error": f"Data not found for {symbol}"
        }

    try:

        result = compare_models(df)

        return {
            "symbol": symbol,
            **result
        }

    except Exception as e:

        return {
            "error": str(e)
        }


# -----------------------------
# Stock Summary
# -----------------------------

@app.get("/api/summary/{symbol}")
def get_summary(symbol: str):

    symbol = symbol.upper()

    df = load_stock_data(symbol)

    if df is None:

        return {
            "error": f"Data not found for {symbol}"
        }

    try:

        result = get_stock_summary(df)

        return {
            "symbol": symbol,
            **result
        }

    except Exception as e:

        return {
            "error": str(e)
        }
