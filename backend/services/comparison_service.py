import pandas as pd

from services.prediction_service import train_linear_regression
from services.model_service import train_random_forest
from services.arima_service import train_arima


def compare_models(df: pd.DataFrame):

    linear_result = train_linear_regression(df)
    random_forest_result = train_random_forest(df)
    arima_result = train_arima(df)

    results = [
        {
            "model": "Linear Regression",
            "mae": linear_result["mae"],
            "rmse": linear_result["rmse"],
            "next_prediction": linear_result["next_prediction"]
        },
        {
            "model": "Random Forest",
            "mae": random_forest_result["mae"],
            "rmse": random_forest_result["rmse"],
            "next_prediction": random_forest_result["next_prediction"]
        },
        {
            "model": "ARIMA",
            "mae": arima_result["mae"],
            "rmse": arima_result["rmse"],
            "next_prediction": arima_result["next_prediction"]
        }
    ]

    # Lower RMSE is better
    best_model = min(
        results,
        key=lambda x: x["rmse"]
    )

    return {
        "models": results,
        "best_model": best_model["model"]
    }