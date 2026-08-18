from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.leaves.views import LeaveRequestViewSet

router = DefaultRouter()
router.register('requests', LeaveRequestViewSet, basename='leave-requests')

urlpatterns = [
    path('', include(router.urls)),
]
