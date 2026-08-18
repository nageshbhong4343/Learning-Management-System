from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.interviews.views import MockInterviewViewSet

router = DefaultRouter()
router.register('interviews', MockInterviewViewSet, basename='mock-interviews')

urlpatterns = [
    path('', include(router.urls)),
]
