from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator, MinValueValidator


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
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_reservations', null=True)
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


class Rating(models.Model):
    tub = models.ForeignKey(Tub, on_delete=models.CASCADE, related_name='ratings', null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_rating')
    stars = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    desciption = models.TextField(null=True)
    
    class Meta:
        unique_together = (('user', 'tub'))
        index_together = (('user', 'tub'))
        

class Discount(models.Model):
    tub = models.ForeignKey(Tub, on_delete=models.CASCADE, null=True, related_name = 'tube_discount')
    main = models.CharField(max_length=15)
    active = models.BooleanField(default=False)
    used = models.BooleanField(default=False)
    is_multi_use = models.BooleanField(default=False)
    value = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(100)], null=True)
    
    def __str__(self) -> str:
         return f'{self.main} for {self.tub.name if self.tub else "any tub"}'