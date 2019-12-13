from django.core.checks import messages
from django.shortcuts import render
from django.http import HttpResponse
from products.models import *
import requests
import datetime

# Create your views here.



def Trend(request):
    return render(request, 'trend.html', {
    
    })

def Favorite(request):
    return render(request, 'favorite.html', {
    
    })

def ShoppingChart(request):
    return render(request, 'shoppingchart.html', {
    
    })


def save(request):
    curdate = datetime.datetime.now().strftime("%m.%d")
    url = "http://data.coa.gov.tw/Service/OpenData/FromM/FarmTransData.aspx"
    data = requests.get(url).json()
    for item in data:
        date = item['交易日期']
        pid = item['作物代號']
        pname = item['作物名稱']
        mid = item['市場代號']
        if '市場' in item['市場名稱'] or curdate not in item['交易日期']:
            pass
        else:
            Date.objects.get_or_create(Date=item['交易日期'])
            day = Date.objects.get(Date=item['交易日期'])
            pro = Product.objects.get(ProductNum=item['作物代號'])
            market = Market.objects.get(MarketName=item['市場名稱'])
            mp = MarketProduct.objects.get(MarketId=str(market.id), ProductId=str(pro.id))
            print(type(day))
            mname = item['市場名稱']
            avg = item['平均價']
            save_data, created = CurrentPrice.objects.get_or_create(
                Day=day,
                MPId=mp,
                Date=date,
                ProductId=pid,
                ProductName=pname,
                MarketId=mid,
                MarketName=mname,
                AveragePrice=avg
            )
            print(save_data.Date,save_data.MarketName,save_data.ProductName,save_data.AveragePrice,created)
            # save.save()

    return HttpResponse("save")


def select(request):
    default_area = '台北二'
    if request.method == "GET":
        area = list(CurrentPrice.objects.filter(MarketName=default_area).values())
        print(area)
        return render(request,"products.html",{'area':area,'smallarea':area})
    elif 'condition' in request.POST['btn']:#待改
        if request.POST['market'] != '-' and request.POST['selection'] == '-':#待改
            default_area = request.POST['market']#待改
            area = CurrentPrice.objects.filter(mname=default_area)
            return render(request, "products.html", {'area': area,'smallarea':area})
        elif request.POST['market'] == '-' and request.POST['selection'] == '-':
            area = CurrentPrice.objects.filter(mname=default_area)
            return render(request, "products.html", {'area': area,'smallarea':area})
        else :
            select_area = request.POST['market']
            select_pro = request.POST['selection']
            select_all = CurrentPrice.objects.filter(pname=select_pro, mname=select_area)
            area = CurrentPrice.objects.filter(mname=select_area)
            return render(request,"area.html",{'area':area,'smallarea':select_all})
    elif 'love' in request.POST['btn']:
        Fav_all = str(request.POST['btn'])
        Fav_mname = Fav_all.split(',')[1]
        Fav_pname = Fav_all.split(',')[3]
        print(Fav_mname + Fav_pname)
        area = CurrentPrice.objects.filter(mname=Fav_mname)
        messages.success(request,'你已成功加入收藏!!')
        return render(request,"area.html",{'area': area,'smallarea':area})
    elif 'shop' in request.POST['btn']:
        Shop_mname = str(request.POST['btn']).split(',')[1]
        Shop_pname = str(request.POST['btn']).split(',')[3]
        Check_list = CurrentPrice.objects.filter(mname=Shop_mname)
        Check = request.POST[Shop_pname]
        print(Check)
        # print(request.POST['btn'])


# def Add_Product(request): 新增作物
#     url = "http://data.coa.gov.tw/Service/OpenData/FromM/FarmTransData.aspx"
#     data = requests.get(url).json()
#     for list in data:
#         P_Name ,created = ProductName.objects.get_or_create(ProductName=list['作物名稱'],ProductNum=list['作物代號'])
#         print(P_Name,created)
#
# def Add_Market(request): 新增地區
#     url = "http://data.coa.gov.tw/Service/OpenData/FromM/FarmTransData.aspx"
#     data = requests.get(url).json()
#     for list in data:
#         M_Name, created = Market.objects.get_or_create(MarketNum=list['市場代號'], MarketName=list['市場名稱'])
#         print(M_Name,created)

def ADD_Market_Product (request):
    url = "http://data.coa.gov.tw/Service/OpenData/FromM/FarmTransData.aspx"
    data = requests.get(url).json()
    for list in data:
        if '市場' in list['市場名稱']:
            pass
        else:
            P_Name ,created = Product.objects.get_or_create(ProductName=list['作物名稱'],ProductNum=list['作物代號'])
            print(P_Name.ProductNum,P_Name.ProductName,created)
            M_Name, created = Market.objects.get_or_create(MarketNum=list['市場代號'], MarketName=list['市場名稱'])
            print(M_Name.MarketNum,M_Name.MarketName,created)
            product = Product.objects.get(ProductNum=list['作物代號'])
            # print(product)
            market = Market.objects.get(MarketName=list['市場名稱'])
            # print(market)
            MP_Name , created = MarketProduct.objects.get_or_create(MarketId=market, ProductId=product)
            print(MP_Name.MarketId,MP_Name.ProductId,created)

def delete(request):
    delet = Market.objects.all()
    delet.delete()
    delet = Product.objects.all()
    delet.delete()
