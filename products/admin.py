from django.contrib import admin
from products.models import *
from django.contrib.auth.models import User,Group

# Register your models here.
class CurrentPrice_display(admin.ModelAdmin):
    list_display = ['id','DateId','MPId','Date', 'ProductId', 'ProductName', 'MarketId', 'MarketName', 'AveragePrice']


class Fav_display(admin.ModelAdmin):
    list_display = ['id', 'MemberId', 'MPId']


class Product_display(admin.ModelAdmin):
    list_display = ['id', 'ProductNum', 'ProductName']


class Market_display(admin.ModelAdmin):
    list_display = ['id', 'MarketNum', 'MarketName']


class MarketProduct_display(admin.ModelAdmin):
    list_display = ['id', 'MarketId', 'ProductId']


class Date_display(admin.ModelAdmin):
    list_display = ['id', 'Date']

admin.site.unregister(User)
admin.site.unregister(Group)

admin.site.register(CurrentPrice, CurrentPrice_display)
admin.site.register(Favorite, Fav_display)
admin.site.register(Product, Product_display)
admin.site.register(Market, Market_display)
admin.site.register(MarketProduct, MarketProduct_display)
admin.site.register(Date, Date_display)
