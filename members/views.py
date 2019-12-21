# Create your views here.

from datetime import datetime

from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect, render_to_response
from django.urls import reverse

from members.models import Member


def Index(request):
    return render(request, 'index.html', {

    })


def Login(request):
    if request.method != "POST":
        return render(request, 'login.html')
    else:
        username = request.POST['username']
        password = request.POST['password']
        try:
            checkpassword = Member.objects.filter(MemberAccount=username, Password=password).get()
            print(checkpassword)
            request.session['username'] = username
            return HttpResponseRedirect('/products/')
        except:
            faillogin = '登入失敗'
            return render(request, "login.html", {'faillogin': faillogin})


def Registered(request):
    if request.method != "POST":
        return render(request, 'registered.html')
    else:
        username = request.POST['username']
        password1 = request.POST['password1']
        password2 = request.POST['password2']

        try:
            if password2 != password1:
                twicepwdiswrong = "兩次輸入密碼不同"
                return render(request, "registered.html", {'twicepwdiswrong': twicepwdiswrong})
            Member.objects.filter(MemberAccount=username).get().MemberAccount
            havethisaccount = "帳號已被註冊過"
            return render(request, "registered.html", {'havethisaccount': havethisaccount})
        except:
            CreateMember = Member.objects.get_or_create(MemberAccount=username, Password=password1)
            registersuccess = '註冊成功'
            return render(request, "index.html", {'registersuccess': registersuccess})


def Product(request):
    return render(request, 'product.html', {

    })


def Logout(request):
    if 'username' in request.session:
        #message = request.session['username'] + ' 您已登出!'
        del request.session['username']  # 刪除 Session

    memberlogout = '你已登出'
    return render(request, "index.html", {'memberlogout': memberlogout})
    # return render(request, 'login.html', locals())