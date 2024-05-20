from django.urls import path, include
from rest_framework import routers
from base.views import TubViewListSet, ReservationViewSet, RatingViewSet, DiscountViewSet

router = routers.DefaultRouter()
router.register('tubs', TubViewListSet)
router.register('reservations', ReservationViewSet)
router.register('ratings', RatingViewSet)
router.register('discounts', DiscountViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('tubs/<int:pk>/create_reservation/', ReservationViewSet.as_view({'post': 'create_reservation'}), name='create-reservation'),
    path('tubs/<int:pk>/check_reservations/', ReservationViewSet.as_view({'get': 'check_reservations'}), name='check-reservations'),
    path('reservations/', ReservationViewSet.as_view({'get': 'all_reservations'}), name='all_reservations'),
    path('reservations/<int:pk>/accept_reservation/', ReservationViewSet.as_view({'patch': 'accept_reservation'}), name='accept-reservation'),
    
    path('tubs/<int:pk>/create_rating/', RatingViewSet.as_view({'post':'create_rating'}), name='create_rating'),
    path('tubs/<int:pk>/rating_list/', RatingViewSet.as_view({'get':'rating_list'}, name='rating_list')),
    
    path('discounts/<int:pk>/use/', DiscountViewSet.as_view({'post': 'use_discount'}), name='use-discount'),
]