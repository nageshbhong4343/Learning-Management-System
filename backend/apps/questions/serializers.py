from rest_framework import serializers
from apps.questions.models import Question, QuestionOption, ReportedQuestion

class QuestionOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionOption
        fields = '__all__'


class QuestionSerializer(serializers.ModelSerializer):
    options = QuestionOptionSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = '__all__'


class ReportedQuestionSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.full_name', read_only=True)
    question_title = serializers.CharField(source='question.title', read_only=True)

    class Meta:
        model = ReportedQuestion
        fields = '__all__'
        read_only_fields = ('student', 'created_at')
