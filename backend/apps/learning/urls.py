from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.learning.views import (
    CourseViewSet, SubjectViewSet, TopicViewSet, LessonViewSet, LearningMaterialViewSet
)

router = DefaultRouter()
router.register('courses', CourseViewSet, basename='courses')
router.register('subjects', SubjectViewSet, basename='subjects')
router.register('topics', TopicViewSet, basename='topics')
router.register('lessons', LessonViewSet, basename='lessons')
router.register('materials', LearningMaterialViewSet, basename='materials')

urlpatterns = [
    path('', include(router.urls)),
]
