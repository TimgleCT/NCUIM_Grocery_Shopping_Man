from django.urls import path
from products import views
app_name = 'products'

urlpatterns = [
    path('', views.select),
    path('save', views.save),
    path('trend', views.Trend),
    path('favorite', views.Favorite),
    path('shoppingchart', views.ShoppingChart),
    path('del',views.delete),
    path('addmp',views.ADD_Market_Product),
    path('addcp',views.save),
    path('<str:FavoriteJSON>',views.ADD_Favorite)
    ]