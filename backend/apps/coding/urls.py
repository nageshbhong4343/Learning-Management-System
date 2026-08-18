from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.coding.views import CodingProblemViewSet, CodingSubmissionViewSet

router = DefaultRouter()
router.register('problems', CodingProblemViewSet, basename='coding-problems')
router.register('submissions', CodingSubmissionViewSet, basename='coding-submissions')

urlpatterns = [
    path('', include(router.urls)),
]
