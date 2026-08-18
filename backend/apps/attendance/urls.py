from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.attendance.views import AttendanceViewSet

router = DefaultRouter()
router.register('records', AttendanceViewSet, basename='attendance-records')

urlpatterns = [
    path('', include(router.urls)),
]
