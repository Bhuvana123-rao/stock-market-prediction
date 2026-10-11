import pandas as pd


def calculate_sma(
    df: pd.DataFrame,
    period: int = 20
):
    df = df.copy()

    df["sma"] = (
        df["close"]
        .rolling(window=period)
        .mean()
    )

    return df


def calculate_ema(
    df: pd.DataFrame,
    period: int = 9
):
    df = df.copy()

    df["ema"] = (
        df["close"]
        .ewm(
            span=period,
            adjust=False
        )
        .mean()
    )

    return df


def calculate_rsi(
    df: pd.DataFrame,
    period: int = 14
):
    df = df.copy()

    delta = df["close"].diff()

    gain = delta.where(
        delta > 0,
        0
    )

    loss = -delta.where(
        delta < 0,
        0
    )

    average_gain = (
        gain
        .rolling(window=period)
        .mean()
    )

    average_loss = (
        loss
        .rolling(window=period)
        .mean()
    )

    rs = (
        average_gain /
        average_loss
    )

    df["rsi"] = (
        100 -
        (
            100 /
            (1 + rs)
        )
    )

    return df


def calculate_macd(
    df: pd.DataFrame
):
    df = df.copy()

    ema12 = (
        df["close"]
        .ewm(
            span=12,
            adjust=False
        )
        .mean()
    )

    ema26 = (
        df["close"]
        .ewm(
            span=26,
            adjust=False
        )
        .mean()
    )

    df["macd"] = ema12 - ema26

    df["signal"] = (
        df["macd"]
        .ewm(
            span=9,
            adjust=False
        )
        .mean()
    )

    return df