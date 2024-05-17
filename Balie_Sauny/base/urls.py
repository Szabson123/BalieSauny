from django.urls import path, include
from rest_framework import routers
from base.views import TubViewListSet, ReservationViewSet

router = routers.DefaultRouter()
router.register('tubs', TubViewListSet)
router.register('reservations', ReservationViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('tubs/<int:pk>/create_reservation/', ReservationViewSet.as_view({'post': 'create_reservation'}), name='create-reservation'),
]