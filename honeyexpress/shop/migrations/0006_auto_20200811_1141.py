# Generated by Django 3.0.8 on 2020-08-11 09:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0005_auto_20200811_1126'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='image',
            field=models.ImageField(upload_to='productphotos'),
        ),
    ]