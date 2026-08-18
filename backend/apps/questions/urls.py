from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.questions.views import QuestionViewSet, ReportedQuestionViewSet

router = DefaultRouter()
router.register('questions', QuestionViewSet, basename='questions')
router.register('reports', ReportedQuestionViewSet, basename='reported-questions')

urlpatterns = [
    path('', include(router.urls)),
]
