from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.students.views import StudentProjectViewSet, StudentWorkExperienceViewSet

router = DefaultRouter()
router.register('projects', StudentProjectViewSet, basename='student-projects')
router.register('experiences', StudentWorkExperienceViewSet, basename='student-experiences')

urlpatterns = [
    path('', include(router.urls)),
]
