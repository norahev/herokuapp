# Generated by Django 3.0.8 on 2020-08-11 09:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0004_auto_20200811_1123'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='image',
            field=models.ImageField(upload_to='shop/static/uploads/'),
        ),
    ]