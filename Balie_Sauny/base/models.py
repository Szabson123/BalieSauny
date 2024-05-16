from django.db import models
from django.contrib.auth.models import User


class Tub(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    price_per_day = models.DecimalField(max_digits=10, decimal_places=2)
    price_per_week = models.DecimalField(max_digits=10, decimal_places=2)
    # img
    
    def __str__(self) -> str:
        return self.name


class Reservation(models.Model):
    tub = models.ForeignKey(Tub, on_delete=models.CASCADE, related_name='reservations')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_reservations')
    start_date = models.DateField()
    end_date = models.DateField()
    nobody_status = models.BooleanField(default=True)
    wait_status = models.BooleanField(default=False)
    accepted_status = models.BooleanField(default=False)
    
    def __str__(self) -> str:
        return f'Reservation by {self.user} on {self.tub.name}'
    

class Image(models.Model):
    tub = models.ForeignKey(Tub, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='images/')

