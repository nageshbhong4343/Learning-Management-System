from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.tests.models import Test, TestAttempt
from apps.tests.serializers import TestSerializer, TestAttemptSerializer
from apps.questions.models import Question, QuestionOption
from apps.accounts.permissions import IsAdmin, IsTrainer

class TestViewSet(viewsets.ModelViewSet):
    queryset = Test.objects.filter(is_active=True).order_by('-created_at')
    serializer_class = TestSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['test_type']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdmin()]
        return [permissions.IsAuthenticated()]

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def submit_attempt(self, request, pk=None):
        test = self.get_object()
        user_answers = request.data.get('answers', {})  # { "q_id": option_id }
        time_taken = int(request.data.get('time_taken_seconds', 0))

        correct_count = 0
        total_questions = test.questions.count()
        if total_questions == 0:
            total_questions = 1

        for q in test.questions.all():
            submitted_option_id = user_answers.get(str(q.id))
            if submitted_option_id:
                correct_opt = q.options.filter(is_correct=True).first()
                if correct_opt and str(correct_opt.id) == str(submitted_option_id):
                    correct_count += 1

        score = float(correct_count)
        total_possible = float(total_questions)
        percentage = (score / total_possible) * 100.0
        is_passed = percentage >= test.passing_percentage

        attempt = TestAttempt.objects.create(
            student=request.user,
            test=test,
            score=score,
            total_possible=total_possible,
            percentage=percentage,
            is_passed=is_passed,
            answers=user_answers,
            time_taken_seconds=time_taken
        )

        return Response(TestAttemptSerializer(attempt).data, status=status.HTTP_201_CREATED)


class TestAttemptViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = TestAttemptSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['ADMIN', 'SUPER_ADMIN', 'TRAINER']:
            return TestAttempt.objects.all()
        return TestAttempt.objects.filter(student=user)
