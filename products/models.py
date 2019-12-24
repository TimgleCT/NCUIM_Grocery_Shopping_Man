from django.db import models
from members.models import Member


# Create your models here.
class CurrentPrice(models.Model):
    Date = models.CharField(max_length=15, blank=True)
    ProductId = models.CharField(max_length=15)
    ProductName = models.CharField(max_length=15)
    MarketId = models.CharField(max_length=15)
    MarketName = models.CharField(max_length=15)
    AveragePrice = models.FloatField()
    DateId = models.ForeignKey('Date', on_delete=models.CASCADE,null=True)
    MPId = models.ForeignKey('MarketProduct', on_delete=models.CASCADE,null=True)


class Product(models.Model):
    ProductNum = models.CharField(max_length=15)
    ProductName = models.CharField(max_length=15)
    market_pro = models.ManyToManyField('Market', through='MarketProduct', related_name='market_product')


class Market(models.Model):
    MarketNum = models.CharField(max_length=15)
    MarketName = models.CharField(max_length=15)


class MarketProduct(models.Model):
    ProductId = models.ForeignKey('Product', on_delete=models.CASCADE)
    MarketId = models.ForeignKey('Market', on_delete=models.CASCADE)
    fav = models.ManyToManyField('members.Member', through='Favorite', related_name='favorite_pro')
    price = models.ManyToManyField('Date', through='CurrentPrice', related_name='price_pro')


class Favorite(models.Model):
    id = models.AutoField(primary_key=True)
    MemberId = models.ForeignKey('members.Member', on_delete=models.CASCADE)
    MPId = models.ForeignKey('MarketProduct', on_delete=models.CASCADE)


class Date(models.Model):
    id = models.AutoField(primary_key=True)
    Date = models.CharField(max_length=15)
