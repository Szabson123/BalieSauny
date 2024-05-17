from rest_framework import viewsets, status
from .models import Tub, Reservation, Rating
from .serializers import TubSerializer, ReservationSerializer, RatingSerializer
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import action


class TubViewListSet(viewsets.ModelViewSet):
    queryset = Tub.objects.all()
    serializer_class = TubSerializer


class ReservationViewSet(viewsets.ModelViewSet):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    
    @action(detail=True, methods=['POST'])
    def create_reservation(self, request, pk=None):
        tub = get_object_or_404(Tub, pk=pk)
        user = request.user if request.user.is_authenticated else None
        start_date = request.data.get('start_date')
        end_date = request.data.get('end_date')
        
        if not start_date or not end_date:
            return Response({'message': 'Start Date and End Date are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        if Reservation.objects.filter(tub=tub, start_date__lte=end_date, end_date__gte=start_date).exists():
            return Response({'message': 'This tub is already reserved for the selected dates'}, status=status.HTTP_400_BAD_REQUEST)
        
        reservation = Reservation.objects.create(user=user, tub=tub, start_date=start_date, end_date=end_date, wait_status=True)
        serializer = ReservationSerializer(reservation)
        return Response({'message': 'Reservation created. Wait for acceptance by owner', 'result': serializer.data}, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['Get'])
    def check_reservations(self, request, pk=None):
        tub = get_object_or_404(Tub, pk=pk)
        reservation = Reservation.objects.filter(tub=tub)
        serializer = ReservationSerializer(reservation, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['GET'])
    def all_reservations(self, request):
        reservations = Reservation.objects.all(self.tub.name)
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
        
                
            