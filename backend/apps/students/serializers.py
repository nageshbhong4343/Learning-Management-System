from rest_framework import serializers
from apps.students.models import StudentProject, StudentWorkExperience

class StudentProjectSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.full_name', read_only=True)

    class Meta:
        model = StudentProject
        fields = '__all__'
        read_only_fields = ('student', 'overall_score', 'created_at', 'updated_at')


class StudentWorkExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentWorkExperience
        fields = '__all__'
        read_only_fields = ('student', 'created_at')
