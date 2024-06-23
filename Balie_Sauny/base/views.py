from rest_framework import viewsets, status, generics
from .models import Tub, Reservation, Rating, Discount, Faq
from .serializers import TubSerializer, ReservationSerializer, RatingSerializer, DiscountSerializer, FaqSerializer, AddTubSerializer, Address
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import action
from decimal import Decimal

class TubViewListSet(viewsets.ModelViewSet):
    queryset = Tub.objects.all()
    serializer_class = TubSerializer


class AddTubView(generics.CreateAPIView):
    queryset = Tub.objects.all()
    serializer_class = AddTubSerializer


class ReservationViewSet(viewsets.ModelViewSet):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer

    @action(detail=True, methods=['POST'])
    def create_reservation(self, request, pk=None):
        user = request.user if request.user.is_authenticated else None
        start_date = request.data.get('start_date')
        end_date = request.data.get('end_date')
        address_data = {
            'city': request.data.get('city'),
            'street': request.data.get('street'),
            'home_number': request.data.get('home_number')
        }
        discount_id = request.data.get('discount_id')

        tub = get_object_or_404(Tub, pk=pk)

        if not start_date or not end_date:
            return Response({'message': 'Start Date and End Date are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        if Reservation.objects.filter(tub=tub, start_date__lte=end_date, end_date__gte=start_date).exists():
            return Response({'message': 'This tub is already reserved for the selected dates'}, status=status.HTTP_400_BAD_REQUEST)

        price = tub.price_per_day
        if discount_id:
            discount = get_object_or_404(Discount, pk=discount_id)
            
            if discount.tub != tub:
                return Response({'message': 'This is not the right code for this tub'}, status=status.HTTP_400_BAD_REQUEST)
        
            if not discount.active:
                return Response({'message': 'This code is not available'}, status=status.HTTP_400_BAD_REQUEST)
            
            if not discount.is_multi_use and discount.used:
                return Response({'message': 'This code has already been used'}, status=status.HTTP_400_BAD_REQUEST)
            
            discount_value = Decimal(discount.value) / Decimal(100)
            price = tub.price_per_day * (Decimal(1) - discount_value)
            
            if not discount.is_multi_use:
                discount.used = True
                discount.active = False
            
            discount.save()

        reservation = Reservation.objects.create(
            user=user,
            tub=tub,
            price=price,
            start_date=start_date,
            end_date=end_date,
            wait_status=True
        )

        Address.objects.create(
            reservation=reservation,
            **address_data
        )

        response_data = {
            'message': 'Reservation created. Wait for acceptance by owner',
            'result': ReservationSerializer(reservation).data
        }

        if discount_id:
            response_data['message'] = 'Reservation created, discount applied successfully. Wait for acceptance by owner'
            response_data['discounted_price_per_day'] = price
            response_data['original_price_per_day'] = tub.price_per_day
            response_data['discount_value'] = f'{discount.value}%'

        return Response(response_data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['GET'])
    def check_reservations(self, request, pk=None):
        tub = get_object_or_404(Tub, pk=pk)
        reservations = Reservation.objects.filter(tub=tub)
        serializer = ReservationSerializer(reservations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['GET'])
    def all_reservations(self, request):
        reservations = Reservation.objects.all()
        serializer = ReservationSerializer(reservations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['PATCH'])
    def accept_reservation(self, request, pk=None):
        reservation = get_object_or_404(Reservation, pk=pk)
        reservation.wait_status = False
        reservation.accepted_status = True
        reservation.save()
        serializer = ReservationSerializer(reservation)
        return Response({'message': 'Reservation accepted', 'result': serializer.data}, status=status.HTTP_200_OK)


class RatingViewSet(viewsets.ModelViewSet):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
    
    @action(detail=True, methods=['POST'])
    def create_rating(self, request, pk=None):
        tub = get_object_or_404(Tub, pk=pk)
        user = self.request.user if request.user.is_authenticated else None
        stars = request.data.get('stars')
        
        if stars is not None:
            try:
                rating = Rating.objects.get(user=user, tub=tub)
                rating.stars = stars
                rating.save()
                serializer = RatingSerializer(rating, many=False)
                return Response({'message':'Rating updated', 'result': serializer.data}, status=status.HTTP_200_OK)
            except Rating.DoesNotExist:
                rating = Rating.objects.create(user=user, tub=tub, stars=stars)
                serializer = RatingSerializer(rating, many=False)
                return Response({'message': 'Rating Created', 'result': serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({'message':'You need to provide starts'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['GET'])
    def rating_list(self, request, pk=None):
        tub = get_object_or_404(Tub, pk=pk)
        rating = Rating.objects.filter(tub=tub)
        serializer = RatingSerializer(rating, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
                
class DiscountViewSet(viewsets.ModelViewSet):
    queryset = Discount.objects.all()
    serializer_class = DiscountSerializer


class FaqViewSer(viewsets.ModelViewSet):
    queryset = Faq
    serializer_class = FaqSerializer