from rest_framework import serializers
from apps.tests.models import Test, TestAttempt
from apps.questions.serializers import QuestionSerializer

class TestSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    questions_count = serializers.SerializerMethodField()

    class Meta:
        model = Test
        fields = '__all__'

    def get_questions_count(self, obj):
        return obj.questions.count()


class TestAttemptSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.full_name', read_only=True)
    test_title = serializers.CharField(source='test.title', read_only=True)

    class Meta:
        model = TestAttempt
        fields = '__all__'
        read_only_fields = ('student', 'score', 'total_possible', 'percentage', 'is_passed', 'created_at')
