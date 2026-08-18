from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.tests.views import TestViewSet, TestAttemptViewSet

router = DefaultRouter()
router.register('tests', TestViewSet, basename='tests')
router.register('attempts', TestAttemptViewSet, basename='test-attempts')

urlpatterns = [
    path('', include(router.urls)),
]
