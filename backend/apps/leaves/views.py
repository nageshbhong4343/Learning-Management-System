from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.leaves.models import LeaveRequest, LeaveStatus
from apps.leaves.serializers import LeaveRequestSerializer
from apps.accounts.permissions import IsAdmin, IsTrainer

class LeaveRequestViewSet(viewsets.ModelViewSet):
    serializer_class = LeaveRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['ADMIN', 'SUPER_ADMIN', 'TRAINER']:
            return LeaveRequest.objects.all()
        return LeaveRequest.objects.filter(student=user)

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[IsTrainer])
    def update_status(self, request, pk=None):
        leave_req = self.get_object()
        new_status = request.data.get('status')
        remarks = request.data.get('admin_remarks', '')

        if new_status in LeaveStatus.values:
            leave_req.status = new_status
            leave_req.admin_remarks = remarks
            leave_req.reviewed_by = request.user
            leave_req.save()
            return Response(LeaveRequestSerializer(leave_req).data, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid leave status.'}, status=status.HTTP_400_BAD_REQUEST)
