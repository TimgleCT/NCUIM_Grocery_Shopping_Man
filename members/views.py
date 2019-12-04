# Create your views here.

from datetime import datetime
from django.shortcuts import render


def Index(request):
    return render(request, 'index.html', {
    
    })
def Login(request):
    return render(request, 'login.html', {
    
    })
def Registered(request):
    return render(request, 'registered.html', {
    
    })
def Product(request):
    return render(request, 'product.html', {
    
    })
