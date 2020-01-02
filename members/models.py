from django.db import models

# Create your models here.
class Member(models.Model):
    MemberAccount = models.CharField(max_length=30)
    Password = models.CharField(max_length=30)

    def __str__(self):
        return str(self.id)

