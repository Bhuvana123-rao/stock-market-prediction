import os
import pandas as pd


DATA_FOLDER = os.path.join(
    os.path.dirname(os.path.dirname(__file__)),
    "data"
)


def load_stock_data(symbol: str):

    file_path = os.path.join(
        DATA_FOLDER,
        f"{symbol.upper()}.csv"
    )

    if not os.path.exists(file_path):
        return None

    df = pd.read_csv(file_path)

    # Remove extra spaces from column names
    df.columns = df.columns.str.strip()

    # Convert column names to lowercase
    df.columns = df.columns.str.lower()

    # Rename columns for our application
    df = df.rename(columns={
        "prev close": "prev_close",
        "open": "open",
        "high": "high",
        "low": "low",
        "last": "last",
        "close": "close",
        "vwap": "vwap",
        "volume": "volume",
        "turnover": "turnover"
    })

    # Convert Date column
    if "date" in df.columns:
        df["date"] = pd.to_datetime(
            df["date"],
            errors="coerce"
        )

    # Convert numerical columns
    numeric_columns = [
        "prev_close",
        "open",
        "high",
        "low",
        "last",
        "close",
        "vwap",
        "volume",
        "turnover"
    ]

    for column in numeric_columns:
        if column in df.columns:
            df[column] = pd.to_numeric(
                df[column],
                errors="coerce"
            )

    # Remove rows where date or close is missing
    df = df.dropna(
        subset=["date", "close"]
    )

    # Sort oldest → newest
    df = df.sort_values("date")

    # Reset index
    df = df.reset_index(drop=True)

    return df