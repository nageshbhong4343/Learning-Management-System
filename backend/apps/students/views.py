from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.students.models import StudentProject, StudentWorkExperience
from apps.students.serializers import StudentProjectSerializer, StudentWorkExperienceSerializer
from apps.accounts.permissions import IsAdmin, IsTrainer, IsStudent

class StudentProjectViewSet(viewsets.ModelViewSet):
    serializer_class = StudentProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['ADMIN', 'SUPER_ADMIN', 'TRAINER']:
            return StudentProject.objects.all().order_by('-created_at')
        return StudentProject.objects.filter(student=user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[IsTrainer])
    def evaluate(self, request, pk=None):
        project = self.get_object()
        q_score = float(request.data.get('code_quality_score', 0))
        f_score = float(request.data.get('functionality_score', 0))
        ui_score = float(request.data.get('ui_ux_score', 0))
        doc_score = float(request.data.get('documentation_score', 0))
        
        overall = (q_score + f_score + ui_score + doc_score) / 4.0
        
        project.code_quality_score = q_score
        project.functionality_score = f_score
        project.ui_ux_score = ui_score
        project.documentation_score = doc_score
        project.overall_score = overall
        project.evaluator_feedback = request.data.get('evaluator_feedback', '')
        project.status = request.data.get('status', 'APPROVED')
        project.evaluated_by = request.user
        project.save()

        return Response(StudentProjectSerializer(project).data, status=status.HTTP_200_OK)


class StudentWorkExperienceViewSet(viewsets.ModelViewSet):
    serializer_class = StudentWorkExperienceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['ADMIN', 'SUPER_ADMIN']:
            return StudentWorkExperience.objects.all()
        return StudentWorkExperience.objects.filter(student=user)

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)
