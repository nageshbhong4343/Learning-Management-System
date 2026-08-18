from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from apps.certificates.models import CertificateSetting, Certificate
from apps.certificates.serializers import CertificateSettingSerializer, CertificateSerializer
from apps.accounts.permissions import IsAdmin

class CertificateSettingViewSet(viewsets.ModelViewSet):
    queryset = CertificateSetting.objects.all()
    serializer_class = CertificateSettingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdmin()]
        return [permissions.IsAuthenticated()]


class CertificateViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CertificateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['ADMIN', 'SUPER_ADMIN']:
            return Certificate.objects.all()
        return Certificate.objects.filter(student=user)
