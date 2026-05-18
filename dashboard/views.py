from django.shortcuts import render
from .utils import get_stock_data

def home(request):

    apple = get_stock_data("AAPL")
    tesla = get_stock_data("TSLA")
    nvidia = get_stock_data("NVDA")

    context = {
        "apple": apple,
        "tesla": tesla,
        "nvidia": nvidia,
    }

    return render(request, 'index.html', context)