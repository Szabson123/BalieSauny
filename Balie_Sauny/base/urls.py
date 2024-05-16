from django.urls import path, include
from rest_framework import routers
from base.views import TubViewSet

router = routers.DefaultRouter()
router.register('tubs', TubViewSet)

urlpatterns = [
    path('', include(router.urls)),
]