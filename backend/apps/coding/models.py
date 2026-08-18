from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class DifficultyLevel(models.TextChoices):
    EASY = 'EASY', 'Easy'
    MEDIUM = 'MEDIUM', 'Medium'
    HARD = 'HARD', 'Hard'


class CodingProblem(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    description = models.TextField()
    input_format = models.TextField(null=True, blank=True)
    output_format = models.TextField(null=True, blank=True)
    constraints = models.TextField(null=True, blank=True)
    difficulty = models.CharField(max_length=10, choices=DifficultyLevel.choices, default=DifficultyLevel.EASY)
    topic = models.CharField(max_length=100, default='Data Structures & Algorithms')
    
    starter_code = models.JSONField(
        default=dict,
        blank=True,
        help_text='Starter template code per language e.g. {"python": "def solve(): pass"}'
    )
    time_limit_seconds = models.IntegerField(default=2)
    memory_limit_mb = models.IntegerField(default=128)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.difficulty}] {self.title}"


class TestCase(models.Model):
    problem = models.ForeignKey(CodingProblem, on_delete=models.CASCADE, related_name='test_cases')
    input_data = models.TextField()
    expected_output = models.TextField()
    is_public = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=1)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"Testcase #{self.order} for {self.problem.title}"


class CodingSubmission(models.Model):
    STATUS_CHOICES = (
        ('ACCEPTED', 'Accepted'),
        ('WRONG_ANSWER', 'Wrong Answer'),
        ('TIME_LIMIT_EXCEEDED', 'Time Limit Exceeded'),
        ('COMPILATION_ERROR', 'Compilation Error'),
        ('RUNTIME_ERROR', 'Runtime Error'),
    )

    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='coding_submissions')
    problem = models.ForeignKey(CodingProblem, on_delete=models.CASCADE, related_name='submissions')
    language = models.CharField(max_length=20, default='python')
    code = models.TextField()
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='ACCEPTED')
    passed_cases = models.IntegerField(default=0)
    total_cases = models.IntegerField(default=0)
    execution_time_ms = models.FloatField(default=0.0)
    error_output = models.TextField(null=True, blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-submitted_at']

    def __str__(self):
        return f"{self.student.full_name} - {self.problem.title}: {self.status}"
