import pandas as pd

from services.analytics_service import (
    calculate_sma,
    calculate_ema,
    calculate_rsi,
    calculate_macd
)


def get_stock_summary(df: pd.DataFrame):

    df = df.copy()

    if "close" not in df.columns:
        raise ValueError("Close column not found")

    df["close"] = pd.to_numeric(
        df["close"],
        errors="coerce"
    )

    df = df.dropna(
        subset=["close"]
    ).reset_index(drop=True)

    if len(df) < 2:
        raise ValueError("Not enough data")

    # Latest and previous prices
    latest_close = float(
        df["close"].iloc[-1]
    )

    previous_close = float(
        df["close"].iloc[-2]
    )

    price_change = (
        latest_close - previous_close
    )

    percentage_change = (
        price_change / previous_close
    ) * 100

    # Technical indicators
    analytics_df = calculate_sma(
        df.copy(),
        20
    )

    analytics_df = calculate_ema(
        analytics_df,
        9
    )

    analytics_df = calculate_rsi(
        analytics_df,
        14
    )

    analytics_df = calculate_macd(
        analytics_df
    )

    latest = analytics_df.iloc[-1]

    def get_value(column):
        if column not in analytics_df.columns:
            return None

        value = latest[column]

        if pd.isna(value):
            return None

        return float(value)

    return {
        "latest_close": latest_close,
        "previous_close": previous_close,
        "price_change": float(price_change),
        "percentage_change": float(percentage_change),

        "sma_20": get_value("SMA"),
        "ema_9": get_value("EMA"),
        "rsi_14": get_value("RSI"),
        "macd": get_value("MACD"),
        "macd_signal": get_value("MACD_Signal")
    }