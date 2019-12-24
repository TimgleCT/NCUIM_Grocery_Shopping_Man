from django.core.checks import messages
from django.shortcuts import render
from django.http import HttpResponse,JsonResponse
from products.models import *
import requests
import datetime


# Create your views here.


# def Trend(request):
#     return render(request, 'trend.html', {
#
#     })

def Favorites(request):
    curdate = datetime.datetime.now()
    yesdate = datetime.timedelta(days=1)
    lastdate = curdate - yesdate
    lastdate = lastdate.strftime(".%m.%d")
    curyear = datetime.datetime.now().strftime("%Y")
    realyear = str(int(curyear) - 1911)
    if int(datetime.datetime.now().strftime("%H")) < 12:
        querydate = realyear + lastdate
    else:
        curdate = curdate.strftime(".%m.%d")
        querydate = realyear + curdate
    username = request.session['username']
    userid = Member.objects.get(MemberAccount=username)
    userFav = Favorite.objects.filter(MemberId=userid).values()
    js = []
    for item in userFav:
        MP = MarketProduct.objects.get(id=item['MPId_id'])
        market = Market.objects.get(id=MP.MarketId_id)
        product = Product.objects.get(id=MP.ProductId_id)
        print(market.MarketName, product.ProductName)
        avg = CurrentPrice.objects.get(MarketName=market.MarketName, ProductName=product.ProductName, Date=querydate)
        print(avg.AveragePrice)
        mp = {
            'ProductName': product.ProductName,
            'MarketName': market.MarketName,
            'AveragePrice': avg.AveragePrice,
            'Fav_id':MP.id,
        }
        js.append(mp)
    print(js)
    return render(request, 'favorite.html', {'FavoriteData':js

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
                DateId=day,
                MPId=mp,
                Date=date,
                ProductId=pid,
                ProductName=pname,
                MarketId=mid,
                MarketName=mname,
                AveragePrice=avg
            )
            print(save_data.Date, save_data.MarketName, save_data.ProductName, save_data.AveragePrice, created)
            # save.save()

    return HttpResponse("save")


def Trend(request):
    default_prod = '椰子'
    default_mkt = '台北二'
    print('trend work')
    if request.method == "GET":
        prod = list(CurrentPrice.objects.filter(ProductName=default_prod)
                    .filter(MarketName=default_mkt).values('Date', 'AveragePrice'))
        print(prod)
        return render(request, "trend.html", {'prod': prod})
    elif '送出' in request.POST['btn_t']:  # 待改
        print('work Trend')
        if request.POST['market_t'] != '-' and request.POST['selection_t'] != '-':
            default_prod = request.POST['selection_t']
            default_mkt = request.POST['market_t']
            print('work')
            prod = list(CurrentPrice.objects.filter(ProductName=default_prod)
                        .filter(MarketName=default_mkt).values('Date', 'AveragePrice'))
            return render(request, "trend.html", {'prod': prod})


def select(request):
    curdate = datetime.datetime.now()
    yesdate = datetime.timedelta(days=1)
    lastdate = curdate - yesdate
    lastdate = lastdate.strftime(".%m.%d")
    curyear = datetime.datetime.now().strftime("%Y")
    realyear = str(int(curyear) - 1911)
    if int(datetime.datetime.now().strftime("%H")) < 12:
        querydate = realyear + lastdate
    else:
        curdate = curdate.strftime(".%m.%d")
        querydate = realyear + curdate
    default_area = '台北二'
    if request.method == "GET":
        area = list(CurrentPrice.objects.filter(MarketName=default_area, Date=querydate).values())
        print(area)
        return render(request, "products.html", {'area': area})
    elif '確認' in request.POST['btn']:#待改
        if request.POST['market'] != '-' and request.POST['selection'] == '-':#待改
            default_area = request.POST['market']#待改
            area = list(CurrentPrice.objects.filter(MarketName=default_area,Date=querydate).values())
            return render(request, "products.html", {'area': area})
        else :
            select_area = request.POST['market']
            select_pro = request.POST['selection']
            select_all = list(CurrentPrice.objects.filter(ProductName=select_pro, MarketName=select_area, Date=querydate).values())
            return render(request,"products.html",{'area':select_all})
    # elif 'love' in request.POST['btn']:
    #     Fav_all = str(request.POST['btn'])
    #     Fav_mname = Fav_all.split(',')[1]
    #     Fav_pname = Fav_all.split(',')[3]
    #     print(Fav_mname + Fav_pname)
    #     area = CurrentPrice.objects.filter(mname=Fav_mname)
    #     messages.success(request,'你已成功加入收藏!!')
    #     return render(request,"area.html",{'area': area,'smallarea':area})
    # elif 'shop' in request.POST['btn']:
    #     Shop_mname = str(request.POST['btn']).split(',')[1]
    #     Shop_pname = str(request.POST['btn']).split(',')[3]
    #     Check_list = CurrentPrice.objects.filter(mname=Shop_mname)
    #     Check = request.POST[Shop_pname]
    #     print(Check)
    #     # print(request.POST['btn'])


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

def ADD_Market_Product(request):
    url = "http://data.coa.gov.tw/Service/OpenData/FromM/FarmTransData.aspx"
    data = requests.get(url).json()
    for list in data:
        if '市場' in list['市場名稱']:
            pass
        else:
            P_Name, created = Product.objects.get_or_create(ProductName=list['作物名稱'], ProductNum=list['作物代號'])
            print(P_Name.ProductNum, P_Name.ProductName, created)
            M_Name, created = Market.objects.get_or_create(MarketNum=list['市場代號'], MarketName=list['市場名稱'])
            print(M_Name.MarketNum, M_Name.MarketName, created)
            product = Product.objects.get(ProductNum=list['作物代號'])
            # print(product)
            market = Market.objects.get(MarketName=list['市場名稱'])
            # print(market)
            MP_Name, created = MarketProduct.objects.get_or_create(MarketId=market, ProductId=product)
            print(MP_Name.MarketId, MP_Name.ProductId, created)


def delete(request):
    delet = Market.objects.all()
    delet.delete()
    delet = Product.objects.all()
    delet.delete()

def ADD_Favorite(request,FavoriteJSON):
    username = request.session['username']
    user = Member.objects.get(MemberAccount=username)
    FavoritMarket = str(FavoriteJSON).split(',')[0]
    FavoriteProduct = str(FavoriteJSON).split(',')[1]
    MarketName = Market.objects.get(MarketName=FavoritMarket)
    ProductName = Product.objects.get(ProductName=FavoriteProduct)
    MP = MarketProduct.objects.get(MarketId__id=str(MarketName.id), ProductId__id=str(ProductName.id))
    fav, created = Favorite.objects.get_or_create(MPId=MP, MemberId=user)
    if created == True:
        return HttpResponse("success")
    else:
        return HttpResponse("no")

def Change_Product(request,SelectMarketName):
    curdate = datetime.datetime.now()
    yesdate = datetime.timedelta(days=1)
    lastdate = curdate - yesdate
    lastdate = lastdate.strftime(".%m.%d")
    curyear = datetime.datetime.now().strftime("%Y")
    realyear = str(int(curyear) - 1911)
    if int(datetime.datetime.now().strftime("%H")) < 12:
        querydate = realyear + lastdate
    else:
        curdate = curdate.strftime(".%m.%d")
        querydate = realyear + curdate
    Change = list(CurrentPrice.objects.filter(MarketName=SelectMarketName,Date=querydate).values('ProductName'))
    Change = str(Change)
    return HttpResponse(Change)

def Change_trend(request,SelectMarketName):
    print('change t')
    curdate = datetime.datetime.now()
    yesdate = datetime.timedelta(days=1)
    lastdate = curdate - yesdate
    lastdate = lastdate.strftime(".%m.%d")
    curyear = datetime.datetime.now().strftime("%Y")
    realyear = str(int(curyear) - 1911)
    if int(datetime.datetime.now().strftime("%H")) < 12:
        querydate = realyear + lastdate
    else:
        curdate = curdate.strftime(".%m.%d")
        querydate = realyear + curdate
    mkid = Market.objects.get(MarketName=SelectMarketName)
    mpid = MarketProduct.objects.filter(MarketId_id=str(mkid.id)).values()
    js=[]
    for item in mpid:
        pro = Product.objects.get(id=item['ProductId_id'])
        pname = {
            'ProductName': pro.ProductName,
        }
        js.append(pname)
    # Change_t = list(CurrentPrice.objects.filter(MarketName=SelectMarketName,Date=querydate).values('ProductName'))
    Change_t = str(js)
    return HttpResponse(Change_t)

def Delete_Fav (request,DeleteBackEnd):
    username = request.session['username']
    user = Member.objects.get(MemberAccount=username)
    mpid = str(DeleteBackEnd)
    del_fav = Favorite.objects.get(MemberId=str(user.id),MPId=mpid)
    del_fav.delete()
