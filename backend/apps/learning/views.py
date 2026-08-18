from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from apps.learning.models import (
    Course, Subject, Topic, Lesson, LearningMaterial, StudentLessonProgress
)
from apps.learning.serializers import (
    CourseSerializer, SubjectSerializer, TopicSerializer,
    LessonSerializer, LearningMaterialSerializer
)
from apps.accounts.permissions import IsAdmin, IsTrainer

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.filter(is_active=True).order_by('-created_at')
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdmin()]
        return [permissions.IsAuthenticated()]


class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all().order_by('order')
    serializer_class = SubjectSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['course']


class TopicViewSet(viewsets.ModelViewSet):
    queryset = Topic.objects.all().order_by('order')
    serializer_class = TopicSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['subject']


class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all().order_by('order')
    serializer_class = LessonSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['topic']

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def toggle_complete(self, request, pk=None):
        lesson = self.get_object()
        prog, created = StudentLessonProgress.objects.get_or_create(student=request.user, lesson=lesson)
        prog.is_completed = not prog.is_completed
        prog.completed_at = timezone.now() if prog.is_completed else None
        prog.save()
        return Response({'status': 'updated', 'is_completed': prog.is_completed}, status=status.HTTP_200_OK)


class LearningMaterialViewSet(viewsets.ModelViewSet):
    queryset = LearningMaterial.objects.all().order_by('order')
    serializer_class = LearningMaterialSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['lesson', 'material_type']
