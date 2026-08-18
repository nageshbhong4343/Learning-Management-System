from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class InterviewType(models.TextChoices):
    TECHNICAL = 'TECHNICAL', 'Technical Mock Interview'
    HR = 'HR', 'HR & Behavioral Interview'


class Recommendation(models.TextChoices):
    SELECTED = 'SELECTED', 'Selected / Highly Recommended'
    NEEDS_IMPROVEMENT = 'NEEDS_IMPROVEMENT', 'Needs Improvement'
    REATTEMPT = 'REATTEMPT', 'Reattempt Required'
    NOT_SELECTED = 'NOT_SELECTED', 'Not Selected'


class MockInterview(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='mock_interviews')
    interviewer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='conducted_interviews')
    interview_type = models.CharField(max_length=30, choices=InterviewType.choices, default=InterviewType.TECHNICAL)
    scheduled_at = models.DateTimeField()
    duration_minutes = models.IntegerField(default=45)
    meeting_link = models.URLField(max_length=500, null=True, blank=True)
    notes = models.TextField(null=True, blank=True)

    # Multi-dimensional Evaluation Rubric
    technical_score = models.FloatField(default=0.0)
    communication_score = models.FloatField(default=0.0)
    problem_solving_score = models.FloatField(default=0.0)
    confidence_score = models.FloatField(default=0.0)
    overall_score = models.FloatField(default=0.0)
    
    strengths = models.TextField(null=True, blank=True)
    weaknesses = models.TextField(null=True, blank=True)
    feedback = models.TextField(null=True, blank=True)
    recommendation = models.CharField(max_length=30, choices=Recommendation.choices, default=Recommendation.NEEDS_IMPROVEMENT)

    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-scheduled_at']

    def __str__(self):
        return f"{self.interview_type} for {self.student.full_name} by {self.interviewer.full_name}"
