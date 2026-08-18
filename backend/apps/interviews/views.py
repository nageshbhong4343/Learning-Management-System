from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.interviews.models import MockInterview
from apps.interviews.serializers import MockInterviewSerializer
from apps.accounts.permissions import IsAdmin, IsTrainer, IsHRInterviewer

class MockInterviewViewSet(viewsets.ModelViewSet):
    serializer_class = MockInterviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['ADMIN', 'SUPER_ADMIN', 'TRAINER', 'PLACEMENT_OFFICER', 'HR_INTERVIEWER']:
            return MockInterview.objects.all()
        return MockInterview.objects.filter(student=user)

    @action(detail=True, methods=['post'], permission_classes=[IsHRInterviewer])
    def submit_feedback(self, request, pk=None):
        interview = self.get_object()
        t_score = float(request.data.get('technical_score', 0))
        c_score = float(request.data.get('communication_score', 0))
        p_score = float(request.data.get('problem_solving_score', 0))
        conf_score = float(request.data.get('confidence_score', 0))
        
        overall = (t_score + c_score + p_score + conf_score) / 4.0

        interview.technical_score = t_score
        interview.communication_score = c_score
        interview.problem_solving_score = p_score
        interview.confidence_score = conf_score
        interview.overall_score = overall
        interview.strengths = request.data.get('strengths', '')
        interview.weaknesses = request.data.get('weaknesses', '')
        interview.feedback = request.data.get('feedback', '')
        interview.recommendation = request.data.get('recommendation', 'NEEDS_IMPROVEMENT')
        interview.is_completed = True
        interview.save()

        return Response(MockInterviewSerializer(interview).data, status=status.HTTP_200_OK)
