from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from base.views import TubViewSet

router = DefaultRouter
router.register(r'tubs', TubViewSet)

urlpatterns = [
    path('', include(router.urls)),
]