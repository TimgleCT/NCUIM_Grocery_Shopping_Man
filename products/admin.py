from django.contrib import admin
from products.models import *


# Register your models here.
class CurrentPrice_display(admin.ModelAdmin):
    list_display = ['Date', 'ProductId', 'ProductName', 'MarketId', 'MarketName', 'AveragePrice']


class Fav_display(admin.ModelAdmin):
    list_display = ['id', 'MemberId_id', 'MPId_id']


class Product_display(admin.ModelAdmin):
    list_display = ['id', 'ProductNum', 'ProductName']


class Market_display(admin.ModelAdmin):
    list_display = ['id', 'MarketNum', 'MarketName']


class MarketProduct_display(admin.ModelAdmin):
    list_display = ['id', 'MarketId_id', 'ProductId_id']


class Date_display(admin.ModelAdmin):
    list_display = ['id', 'Date']


admin.site.register(CurrentPrice, CurrentPrice_display)
admin.site.register(Favorite, Fav_display)
admin.site.register(Product, Product_display)
admin.site.register(Market, Market_display)
admin.site.register(MarketProduct, MarketProduct_display)
admin.site.register(Date, Date_display)
