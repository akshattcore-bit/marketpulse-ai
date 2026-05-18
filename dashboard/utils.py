import yfinance as yf

def get_stock_data(ticker):
    stock = yf.Ticker(ticker)

    hist = stock.history(period="1mo")

    latest_price = round(hist['Close'].iloc[-1], 2)

    return {
        "ticker": ticker,
        "price": latest_price
    }