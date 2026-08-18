from rest_framework import serializers
from apps.interviews.models import MockInterview

class MockInterviewSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.full_name', read_only=True)
    interviewer_name = serializers.CharField(source='interviewer.full_name', read_only=True)

    class Meta:
        model = MockInterview
        fields = '__all__'
