from rest_framework import viewsets
from .models import Tub
from .serializers import TubSerializer

class TubViewSet(viewsets.ModelViewSet):
    queryset = Tub.objects.all()
    serializer_class = TubSerializer

    def list(self, request, *args, **kwargs):
        print("Debug: TubViewSet list method called")
        return super().list(request, *args, **kwargs)
