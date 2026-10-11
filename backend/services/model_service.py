import pandas as pd
import numpy as np

from sklearn.ensemble import RandomForestRegressor
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


def train_random_forest(
    df: pd.DataFrame,
    test_size: float = 0.2,
    prediction_days: int = 1
):
    df = prepare_data(df)

    if len(df) < 30:
        raise ValueError("Not enough historical data for prediction")

    if prediction_days not in [1, 7, 14, 30]:
        raise ValueError(
            "Prediction period must be 1, 7, 14, or 30 days"
        )

    # -----------------------------
    # Create features
    # -----------------------------

    df["day"] = np.arange(len(df))

    df["day_of_week"] = df["date"].dt.dayofweek
    df["month"] = df["date"].dt.month
    df["year"] = df["date"].dt.year

    # Previous closing prices
    df["previous_close"] = df["close"].shift(1)
    df["previous_close_2"] = df["close"].shift(2)
    df["previous_close_3"] = df["close"].shift(3)

    # Remove rows created by lag features
    df = df.dropna().reset_index(drop=True)

    features = [
        "day",
        "day_of_week",
        "month",
        "year",
        "previous_close",
        "previous_close_2",
        "previous_close_3"
    ]

    X = df[features]
    y = df["close"]

    # -----------------------------
    # Time-series train/test split
    # -----------------------------

    split_index = int(len(df) * (1 - test_size))

    X_train = X.iloc[:split_index]
    X_test = X.iloc[split_index:]

    y_train = y.iloc[:split_index]
    y_test = y.iloc[split_index:]

    # -----------------------------
    # Train Random Forest
    # -----------------------------

    model = RandomForestRegressor(
        n_estimators=100,
        random_state=42,
        max_depth=10
    )

    model.fit(X_train, y_train)

    # -----------------------------
    # Test predictions
    # -----------------------------

    predictions = model.predict(X_test)

    mae = mean_absolute_error(
        y_test,
        predictions
    )

    rmse = np.sqrt(
        mean_squared_error(
            y_test,
            predictions
        )
    )

    # -----------------------------
    # Future predictions
    # -----------------------------

    future_predictions = []
    future_dates = []

    # Start with the latest available values
    current_close = float(df.iloc[-1]["close"])
    previous_close_2 = float(df.iloc[-1]["previous_close"])
    previous_close_3 = float(df.iloc[-1]["previous_close_2"])

    current_day_number = int(df.iloc[-1]["day"])
    last_date = df.iloc[-1]["date"]

    for i in range(prediction_days):

        future_day_number = current_day_number + 1

        # Use business days for future dates
        future_date = pd.bdate_range(
            start=last_date + pd.Timedelta(days=1),
            periods=1
        )[0]

        future_features = pd.DataFrame([{
            "day": future_day_number,
            "day_of_week": future_date.dayofweek,
            "month": future_date.month,
            "year": future_date.year,
            "previous_close": current_close,
            "previous_close_2": previous_close_2,
            "previous_close_3": previous_close_3
        }])

        prediction = model.predict(
            future_features
        )[0]

        prediction = float(prediction)

        future_predictions.append(prediction)

        future_dates.append(
            future_date.strftime("%Y-%m-%d")
        )

        # Move predicted value forward
        previous_close_3 = previous_close_2
        previous_close_2 = current_close
        current_close = prediction

        current_day_number = future_day_number
        last_date = future_date

    return {
        "model": "Random Forest",

        "next_prediction": future_predictions[0],

        "future_predictions": future_predictions,

        "future_dates": future_dates,

        "prediction_days": prediction_days,

        "mae": float(mae),

        "rmse": float(rmse),

        "actual": [
            float(value)
            for value in y_test.tolist()
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
