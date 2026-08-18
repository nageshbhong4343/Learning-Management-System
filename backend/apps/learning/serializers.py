from rest_framework import serializers
from apps.learning.models import (
    Course, Subject, Topic, Lesson, LearningMaterial, StudentLessonProgress
)

class LearningMaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = LearningMaterial
        fields = '__all__'


class LessonSerializer(serializers.ModelSerializer):
    materials = LearningMaterialSerializer(many=True, read_only=True)
    is_completed = serializers.SerializerMethodField()

    class Meta:
        model = Lesson
        fields = '__all__'

    def get_is_completed(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            prog = StudentLessonProgress.objects.filter(student=request.user, lesson=obj, is_completed=True).exists()
            return prog
        return False


class TopicSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)

    class Meta:
        model = Topic
        fields = '__all__'


class SubjectSerializer(serializers.ModelSerializer):
    topics = TopicSerializer(many=True, read_only=True)

    class Meta:
        model = Subject
        fields = '__all__'


class CourseSerializer(serializers.ModelSerializer):
    subjects = SubjectSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = '__all__'
