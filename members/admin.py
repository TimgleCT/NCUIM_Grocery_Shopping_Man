from django.contrib import admin
from members.models import  Member


class Memeber_display(admin.ModelAdmin):
    list_display = ['id','MemberAccount','Password']

admin.site.register(Member,Memeber_display)
# Register your models here.
