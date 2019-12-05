from django.db import models

# Create your models here.
class CurrentPrice(models.Model):
    Date = models.CharField(max_length=15,blank=True)
    ProductId = models.CharField(max_length=15)
    ProductName = models.CharField(max_length=15)
    MarketId = models.CharField(max_length=15)
    MarketName = models.CharField(max_length=15)
    AveragePrice = models.FloatField()

