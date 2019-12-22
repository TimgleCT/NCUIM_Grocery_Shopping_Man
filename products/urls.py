from django.urls import path
from products import views
app_name = 'products'

urlpatterns = [
    path('', views.select),
    path('save', views.save),
    path('trend', views.Trend),
    path('favorite', views.Favorites),
    path('shoppingchart', views.ShoppingChart),
    path('del',views.delete),
    path('addmp',views.ADD_Market_Product),
    path('addcp',views.save),
    path('add/<str:FavoriteJSON>',views.ADD_Favorite),
    path('<str:SelectMarketName>',views.Change_Product),
    ]