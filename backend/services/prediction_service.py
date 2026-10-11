
import pandas as pd
import numpy as np

from sklearn.linear_model import LinearRegression
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


def train_linear_regression(
    df: pd.DataFrame,
    test_size: float = 0.2,
    prediction_days: int = 1
):
    df = prepare_data(df)

    if len(df) < 30:
        raise ValueError("Not enough historical data for prediction")

    if prediction_days not in [1, 7, 14, 30]:
        raise ValueError("Prediction period must be 1, 7, 14, or 30 days")

    # Create sequential day numbers
    df["day"] = np.arange(len(df))

    X = df[["day"]]
    y = df["close"]

    # 80% training, 20% testing
    split_index = int(len(df) * (1 - test_size))

    X_train = X.iloc[:split_index]
    X_test = X.iloc[split_index:]

    y_train = y.iloc[:split_index]
    y_test = y.iloc[split_index:]

    # Create and train model
    model = LinearRegression()
    model.fit(X_train, y_train)

    # Predict test data
    predictions = model.predict(X_test)

    # Evaluation
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

    # ---------------------------------------
    # Future predictions
    # ---------------------------------------

    future_days = np.arange(
        len(df),
        len(df) + prediction_days
    ).reshape(-1, 1)

    future_predictions = model.predict(future_days)

    # Generate future dates
    last_date = df["date"].iloc[-1]

    future_dates = pd.bdate_range(
        start=last_date + pd.Timedelta(days=1),
        periods=prediction_days
    )

    # Convert predictions to Python floats
    future_prediction_values = [
        float(value)
        for value in future_predictions
    ]

    future_date_strings = [
        date.strftime("%Y-%m-%d")
        for date in future_dates
    ]

    return {
        "model": "Linear Regression",

        # First future prediction
        "next_prediction": future_prediction_values[0],

        # All future predictions
        "future_predictions": future_prediction_values,

        "future_dates": future_date_strings,

        # Evaluation metrics
        "mae": float(mae),
        "rmse": float(rmse),

        # Historical test results
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
        ],

        "prediction_days": prediction_days
    }
