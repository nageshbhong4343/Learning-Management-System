from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.questions.models import Question, QuestionOption, ReportedQuestion
from apps.questions.serializers import QuestionSerializer, QuestionOptionSerializer, ReportedQuestionSerializer
from apps.accounts.permissions import IsAdmin, IsTrainer

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all().order_by('-created_at')
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['question_type', 'aptitude_category', 'difficulty', 'subject', 'topic']
    search_fields = ['title', 'text', 'tags']

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[IsAdmin])
    def add_option(self, request, pk=None):
        question = self.get_object()
        serializer = QuestionOptionSerializer(data={**request.data, 'question': question.id})
        if serializer.is_valid():
            serializer.save()
            return Response(QuestionSerializer(question).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ReportedQuestionViewSet(viewsets.ModelViewSet):
    serializer_class = ReportedQuestionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['ADMIN', 'SUPER_ADMIN', 'TRAINER']:
            return ReportedQuestion.objects.all().order_by('-created_at')
        return ReportedQuestion.objects.filter(student=user)

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)
