from django.contrib import admin
from products.models import CurrentPrice

# Register your models here.
class CurrentPrice_display(admin.ModelAdmin):
    list_display = ['Date', 'ProductId', 'ProductName', 'MarketId', 'MarketName', 'AveragePrice']


admin.site.register(CurrentPrice, CurrentPrice_display)