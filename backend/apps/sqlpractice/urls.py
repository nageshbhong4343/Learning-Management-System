from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.sqlpractice.views import SQLProblemViewSet, SQLSubmissionViewSet

router = DefaultRouter()
router.register('problems', SQLProblemViewSet, basename='sql-problems')
router.register('submissions', SQLSubmissionViewSet, basename='sql-submissions')

urlpatterns = [
    path('', include(router.urls)),
]
