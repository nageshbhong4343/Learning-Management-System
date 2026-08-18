from django.db import models
from django.contrib.auth import get_user_model
from apps.learning.models import Subject, Topic

User = get_user_model()


class QuestionType(models.TextChoices):
    MCQ = 'MCQ', 'Multiple Choice'
    APTITUDE = 'APTITUDE', 'Aptitude'
    CODING = 'CODING', 'Coding Problem'
    SQL = 'SQL', 'SQL Query'
    INTERVIEW = 'INTERVIEW', 'Interview Question'
    THEORY = 'THEORY', 'Theory'
    TECHNICAL = 'TECHNICAL', 'Technical'
    HR = 'HR', 'HR Question'


class AptitudeCategory(models.TextChoices):
    QUANTITATIVE = 'QUANTITATIVE', 'Quantitative Aptitude'
    LOGICAL = 'LOGICAL', 'Logical Reasoning'
    VERBAL = 'VERBAL', 'Verbal Ability'
    DATA_INTERPRETATION = 'DATA_INTERPRETATION', 'Data Interpretation'
    NONE = 'NONE', 'None / N/A'


class DifficultyLevel(models.TextChoices):
    EASY = 'EASY', 'Easy'
    MEDIUM = 'MEDIUM', 'Medium'
    HARD = 'HARD', 'Hard'


class Question(models.Model):
    title = models.CharField(max_length=255)
    text = models.TextField()
    description = models.TextField(null=True, blank=True)
    question_type = models.CharField(max_length=20, choices=QuestionType.choices, default=QuestionType.MCQ)
    aptitude_category = models.CharField(max_length=30, choices=AptitudeCategory.choices, default=AptitudeCategory.NONE)
    difficulty = models.CharField(max_length=10, choices=DifficultyLevel.choices, default=DifficultyLevel.EASY)
    
    subject = models.ForeignKey(Subject, on_delete=models.SET_NULL, null=True, blank=True, related_name='questions')
    topic = models.ForeignKey(Topic, on_delete=models.SET_NULL, null=True, blank=True, related_name='questions')
    
    marks = models.FloatField(default=1.0)
    negative_marks = models.FloatField(default=0.0)
    time_limit_seconds = models.IntegerField(default=60)
    explanation = models.TextField(null=True, blank=True)
    tags = models.JSONField(default=list, blank=True)

    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.question_type}] {self.title}"


class QuestionOption(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='options')
    option_text = models.TextField()
    is_correct = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=1)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{'✓' if self.is_correct else '✗'} {self.option_text[:40]}"


class ReportedQuestion(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending Review'),
        ('REVIEWING', 'Under Review'),
        ('FIXED', 'Fixed / Corrected'),
        ('REJECTED', 'Rejected'),
    )
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reported_questions')
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='reports')
    reason = models.CharField(max_length=255)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Report on Q#{self.question.id} by {self.student.full_name}"
