# Generated by Django 4.2.6 on 2024-05-20 12:03

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0008_reservation_price_per_day_after_discount'),
    ]

    operations = [
        migrations.RenameField(
            model_name='reservation',
            old_name='price_per_day_after_discount',
            new_name='price',
        ),
    ]
