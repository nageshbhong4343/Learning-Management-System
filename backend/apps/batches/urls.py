from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.batches.views import BatchViewSet

router = DefaultRouter()
router.register('batches', BatchViewSet, basename='batches')

urlpatterns = [
    path('', include(router.urls)),
]
