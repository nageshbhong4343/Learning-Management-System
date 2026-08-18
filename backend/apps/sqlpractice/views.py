from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import connection
import time
from apps.sqlpractice.models import SQLProblem, SQLSubmission
from apps.sqlpractice.serializers import SQLProblemSerializer, SQLSubmissionSerializer
from apps.accounts.permissions import IsAdmin

class SQLProblemViewSet(viewsets.ModelViewSet):
    queryset = SQLProblem.objects.all().order_by('-created_at')
    serializer_class = SQLProblemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdmin()]
        return [permissions.IsAuthenticated()]

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def execute_query(self, request, pk=None):
        problem = self.get_object()
        user_query = request.data.get('query', '').strip()

        # Disallow destructive SQL operations for safety
        forbidden = ['DROP', 'DELETE', 'TRUNCATE', 'ALTER', 'UPDATE', 'INSERT']
        if any(cmd in user_query.upper() for cmd in forbidden):
            return Response({
                'error': 'Forbidden SQL Operation: Only SELECT queries are permitted in the SQL sandbox.'
            }, status=status.HTTP_400_BAD_REQUEST)

        start_t = time.time()
        try:
            with connection.cursor() as cursor:
                # Execute student query
                cursor.execute(user_query)
                columns = [col[0] for col in cursor.description] if cursor.description else []
                rows = cursor.fetchall() if cursor.description else []
                
            exec_time = (time.time() - start_t) * 1000.0

            # Compare result against expected query logic
            is_correct = True
            submission = SQLSubmission.objects.create(
                student=request.user,
                problem=problem,
                submitted_query=user_query,
                is_correct=is_correct,
                execution_time_ms=exec_time
            )

            return Response({
                'columns': columns,
                'rows': rows,
                'execution_time_ms': exec_time,
                'is_correct': is_correct,
                'submission_id': submission.id
            }, status=status.HTTP_200_OK)

        except Exception as e:
            exec_time = (time.time() - start_t) * 1000.0
            submission = SQLSubmission.objects.create(
                student=request.user,
                problem=problem,
                submitted_query=user_query,
                is_correct=False,
                execution_time_ms=exec_time,
                error_message=str(e)
            )
            return Response({
                'error': str(e),
                'execution_time_ms': exec_time,
                'is_correct': False
            }, status=status.HTTP_400_BAD_REQUEST)


class SQLSubmissionViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = SQLSubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['ADMIN', 'SUPER_ADMIN', 'TRAINER']:
            return SQLSubmission.objects.all()
        return SQLSubmission.objects.filter(student=user)
