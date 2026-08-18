from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.batches.models import Batch
from apps.batches.serializers import BatchSerializer, BatchDetailSerializer
from apps.accounts.permissions import IsAdmin, IsTrainer
from django.contrib.auth import get_user_model

User = get_user_model()


class BatchViewSet(viewsets.ModelViewSet):
    queryset = Batch.objects.all().order_by('-created_at')
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['batch_type', 'status', 'trainer']
    search_fields = ['name', 'code', 'description']

    def get_serializer_class(self):
        if self.action in ['retrieve', 'update', 'partial_update']:
            return BatchDetailSerializer
        return BatchSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdmin()]
        return [permissions.IsAuthenticated()]

    @action(detail=True, methods=['post'], permission_classes=[IsAdmin])
    def assign_students(self, request, pk=None):
        batch = self.get_object()
        student_ids = request.data.get('student_ids', [])
        students = User.objects.filter(id__in=student_ids, role='STUDENT')
        
        batch.students.add(*students)
        batch.save()
        return Response(BatchDetailSerializer(batch).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[IsAdmin])
    def remove_student(self, request, pk=None):
        batch = self.get_object()
        student_id = request.data.get('student_id')
        student = User.objects.filter(id=student_id).first()
        if student:
            batch.students.remove(student)
        return Response(BatchDetailSerializer(batch).data, status=status.HTTP_200_OK)
