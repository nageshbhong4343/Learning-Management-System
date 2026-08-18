from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.attendance.models import AttendanceRecord
from apps.attendance.serializers import AttendanceRecordSerializer
from apps.accounts.permissions import IsAdmin, IsTrainer

class AttendanceViewSet(viewsets.ModelViewSet):
    serializer_class = AttendanceRecordSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['batch', 'date', 'status', 'student']

    def get_queryset(self):
        user = self.request.user
        if user.role in ['ADMIN', 'SUPER_ADMIN', 'TRAINER']:
            return AttendanceRecord.objects.all()
        elif user.role == 'PARENT' and hasattr(user, 'parent_profile') and user.parent_profile.student:
            return AttendanceRecord.objects.filter(student=user.parent_profile.student)
        return AttendanceRecord.objects.filter(student=user)

    def perform_create(self, serializer):
        serializer.save(marked_by=self.request.user)

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def summary(self, request):
        user = request.user
        records = AttendanceRecord.objects.filter(student=user)
        total = records.count()
        present = records.filter(status='PRESENT').count()
        late = records.filter(status='LATE').count()
        pct = ((present + late * 0.5) / total * 100.0) if total > 0 else 100.0

        return Response({
            'total_days': total,
            'present_days': present,
            'late_days': late,
            'absent_days': records.filter(status='ABSENT').count(),
            'attendance_percentage': round(pct, 1)
        }, status=status.HTTP_200_OK)
