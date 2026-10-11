import pandas as pd
import numpy as np

from statsmodels.tsa.arima.model import ARIMA
from sklearn.metrics import mean_absolute_error, mean_squared_error


def prepare_data(df: pd.DataFrame):
    df = df.copy()

    if "date" not in df.columns:
        raise ValueError("Date column not found")

    if "close" not in df.columns:
        raise ValueError("Close column not found")

    df["date"] = pd.to_datetime(df["date"], errors="coerce")
    df["close"] = pd.to_numeric(df["close"], errors="coerce")

    df = df.dropna(subset=["date", "close"])
    df = df.sort_values("date")
    df = df.reset_index(drop=True)

    return df


def train_arima(
    df: pd.DataFrame,
    test_size: float = 0.2,
    prediction_days: int = 1
):
    df = prepare_data(df)

    if len(df) < 50:
        raise ValueError("Not enough historical data for ARIMA")

    if prediction_days not in [1, 7, 14, 30]:
        raise ValueError(
            "Prediction period must be 1, 7, 14, or 30 days"
        )

    prices = df["close"].values

    # -----------------------------
    # Train/Test Split
    # -----------------------------

    split_index = int(len(prices) * (1 - test_size))

    train = prices[:split_index]
    test = prices[split_index:]

    # -----------------------------
    # ARIMA Model
    # -----------------------------

    model = ARIMA(
        train,
        order=(5, 1, 0)
    )

    fitted_model = model.fit()

    # -----------------------------
    # Test Predictions
    # -----------------------------

    predictions = fitted_model.forecast(
        steps=len(test)
    )

    predictions = np.asarray(predictions)

    # -----------------------------
    # Evaluation
    # -----------------------------

    mae = mean_absolute_error(
        test,
        predictions
    )

    rmse = np.sqrt(
        mean_squared_error(
            test,
            predictions
        )
    )

    # -----------------------------
    # Train using complete data
    # -----------------------------

    final_model = ARIMA(
        prices,
        order=(5, 1, 0)
    )

    final_fitted_model = final_model.fit()

    # -----------------------------
    # Future Predictions
    # -----------------------------

    future_predictions = final_fitted_model.forecast(
        steps=prediction_days
    )

    future_predictions = np.asarray(
        future_predictions
    )

    # -----------------------------
    # Future Dates
    # -----------------------------

    last_date = df["date"].iloc[-1]

    future_dates = pd.bdate_range(
        start=last_date + pd.Timedelta(days=1),
        periods=prediction_days
    )

    future_prediction_values = [
        float(value)
        for value in future_predictions
    ]

    future_date_strings = [
        date.strftime("%Y-%m-%d")
        for date in future_dates
    ]

    return {
        "model": "ARIMA",

        "next_prediction": future_prediction_values[0],

        "future_predictions": future_prediction_values,

        "future_dates": future_date_strings,

        "prediction_days": prediction_days,

        "mae": float(mae),

        "rmse": float(rmse),

        "actual": [
            float(value)
            for value in test.tolist()
        ],

        "predicted": [
            float(value)
            for value in predictions.tolist()
        ],

        "dates": [
            date.strftime("%Y-%m-%d")
            for date in df["date"].iloc[split_index:]
        ]
    }
