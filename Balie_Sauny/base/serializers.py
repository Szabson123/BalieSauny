from rest_framework import serializers
from .models import Tub, Image, Reservation, Rating, Discount

class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ['id', 'image']


class TubSerializer(serializers.ModelSerializer):
    images = ImageSerializer(many=True, read_only=True)
    class Meta:
        model = Tub
        fields = ['id', 'name', 'description', 'price_per_day', 'price_per_week', 'images']


class ReservationSerializer(serializers.ModelSerializer):
    tub_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Reservation
        fields = ['id', 'tub_name', 'user', 'start_date', 'end_date', 'nobody_status', 'wait_status', 'accepted_status']
        
    def get_tub_name(self, obj):
        return obj.tub.name


class RatingSerializer(serializers.ModelSerializer):
    tub_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Rating
        fields = ['id', 'tub_name', 'user', 'stars', 'desciption']
        
    def get_tub_name(self, obj):
        return obj.tub.name
    

class DiscountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discount
        fields = ['tub', 'main', 'active', 'used', 'is_multi_use']