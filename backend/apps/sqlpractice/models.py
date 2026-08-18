from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class SQLProblem(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    database_schema = models.TextField(help_text="SQL DDL and schema description for student reference")
    sample_data_json = models.JSONField(default=dict, blank=True)
    expected_query = models.TextField(help_text="Reference solution SQL query")
    difficulty = models.CharField(max_length=10, default='EASY')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[SQL] {self.title}"


class SQLSubmission(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sql_submissions')
    problem = models.ForeignKey(SQLProblem, on_delete=models.CASCADE, related_name='submissions')
    submitted_query = models.TextField()
    is_correct = models.BooleanField(default=False)
    execution_time_ms = models.FloatField(default=0.0)
    error_message = models.TextField(null=True, blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-submitted_at']

    def __str__(self):
        return f"{self.student.full_name} - {self.problem.title} ({'✓' if self.is_correct else '✗'})"
