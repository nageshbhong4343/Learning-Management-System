from django.db import models
from django.contrib.auth import get_user_model
from apps.questions.models import Question

User = get_user_model()


class TestType(models.TextChoices):
    MCQ = 'MCQ', 'MCQ Test'
    APTITUDE = 'APTITUDE', 'Aptitude Test'
    CERTIFICATE = 'CERTIFICATE', 'Certificate Exam'


class Test(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    test_type = models.CharField(max_length=30, choices=TestType.choices, default=TestType.MCQ)
    duration_minutes = models.IntegerField(default=30)
    passing_percentage = models.FloatField(default=80.0)  # Configurable threshold (defaults to 80%)
    questions = models.ManyToManyField(Question, related_name='tests', blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.get_test_type_display()})"


class TestAttempt(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='test_attempts')
    test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name='attempts')
    score = models.FloatField(default=0.0)
    total_possible = models.FloatField(default=100.0)
    percentage = models.FloatField(default=0.0)
    is_passed = models.BooleanField(default=False)
    answers = models.JSONField(default=dict, blank=True)  # { "question_id": option_id }
    time_taken_seconds = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.student.full_name} - {self.test.title}: {self.percentage:.1f}% ({'Passed' if self.is_passed else 'Failed'})"
