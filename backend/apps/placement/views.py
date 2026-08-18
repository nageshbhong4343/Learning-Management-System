from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.placement.models import Company, PlacementDrive, DriveApplication
from apps.placement.serializers import CompanySerializer, PlacementDriveSerializer, DriveApplicationSerializer
from apps.accounts.permissions import IsAdmin, IsPlacementOfficer

class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all().order_by('name')
    serializer_class = CompanySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsPlacementOfficer()]
        return [permissions.IsAuthenticated()]


class PlacementDriveViewSet(viewsets.ModelViewSet):
    queryset = PlacementDrive.objects.all().order_by('-drive_date')
    serializer_class = PlacementDriveSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['status', 'work_mode', 'company']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsPlacementOfficer()]
        return [permissions.IsAuthenticated()]

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def apply(self, request, pk=None):
        drive = self.get_object()
        app, created = DriveApplication.objects.get_or_create(drive=drive, student=request.user)
        if not created:
            return Response({'message': 'You have already applied for this placement drive.'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(DriveApplicationSerializer(app).data, status=status.HTTP_201_CREATED)


class DriveApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = DriveApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['ADMIN', 'SUPER_ADMIN', 'PLACEMENT_OFFICER']:
            return DriveApplication.objects.all()
        return DriveApplication.objects.filter(student=user)
