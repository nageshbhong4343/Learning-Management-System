from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.placement.views import CompanyViewSet, PlacementDriveViewSet, DriveApplicationViewSet

router = DefaultRouter()
router.register('companies', CompanyViewSet, basename='companies')
router.register('drives', PlacementDriveViewSet, basename='placement-drives')
router.register('applications', DriveApplicationViewSet, basename='drive-applications')

urlpatterns = [
    path('', include(router.urls)),
]
