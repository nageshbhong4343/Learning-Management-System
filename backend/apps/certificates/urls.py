from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.certificates.views import CertificateSettingViewSet, CertificateViewSet

router = DefaultRouter()
router.register('settings', CertificateSettingViewSet, basename='certificate-settings')
router.register('certificates', CertificateViewSet, basename='certificates')

urlpatterns = [
    path('', include(router.urls)),
]
