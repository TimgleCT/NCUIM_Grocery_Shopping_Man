from django.urls import path
from products import views
app_name = 'products'

urlpatterns = [
    path('', views.select),
    path('save', views.save),
    path('trend', views.Trend),
    path('favorite', views.Favorite),
    path('shoppingchart', views.ShoppingChart),
    ]