from rest_framework import viewsets, status
from .models import Tub, Reservation
from .serializers import TubSerializer, ReservationSerializer
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