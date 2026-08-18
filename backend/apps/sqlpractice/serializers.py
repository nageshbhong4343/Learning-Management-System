from rest_framework import serializers
from apps.sqlpractice.models import SQLProblem, SQLSubmission

class SQLProblemSerializer(serializers.ModelSerializer):
    class Meta:
        model = SQLProblem
        fields = '__all__'


class SQLSubmissionSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.full_name', read_only=True)

    class Meta:
        model = SQLSubmission
        fields = '__all__'
        read_only_fields = ('student', 'is_correct', 'execution_time_ms', 'error_message', 'submitted_at')
