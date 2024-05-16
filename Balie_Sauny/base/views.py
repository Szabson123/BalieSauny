from django.shortcuts import render
from base.models import Tub, Reservation, Image
from base.serializers import *
from rest_framework import viewsets


class TubViewSet(viewsets.ModelViewSet):
    queryset = Tub.objects.all()
    serializer_class = TubSerializer
    
