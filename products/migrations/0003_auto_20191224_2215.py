# Generated by Django 2.2.5 on 2019-12-24 14:15

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0002_auto_20191213_1955'),
    ]

    operations = [
        migrations.RenameField(
            model_name='currentprice',
            old_name='Day',
            new_name='DateId',
        ),
    ]