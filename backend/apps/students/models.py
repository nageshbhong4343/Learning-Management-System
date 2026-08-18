from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class StudentProject(models.Model):
    STATUS_CHOICES = (
        ('DRAFT', 'Draft'),
        ('SUBMITTED', 'Submitted for Review'),
        ('APPROVED', 'Approved'),
        ('NEEDS_REVISION', 'Needs Revision'),
    )

    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='projects')
    title = models.CharField(max_length=255)
    description = models.TextField()
    technologies = models.JSONField(default=list, blank=True)
    github_url = models.URLField(max_length=500, null=True, blank=True)
    live_url = models.URLField(max_length=500, null=True, blank=True)
    documentation_url = models.URLField(max_length=500, null=True, blank=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='DRAFT')
    
    # Evaluation fields
    code_quality_score = models.FloatField(default=0.0)
    functionality_score = models.FloatField(default=0.0)
    ui_ux_score = models.FloatField(default=0.0)
    documentation_score = models.FloatField(default=0.0)
    overall_score = models.FloatField(default=0.0)
    evaluator_feedback = models.TextField(null=True, blank=True)
    evaluated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='evaluated_projects')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - {self.student.full_name}"


class StudentWorkExperience(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='work_experiences')
    company_name = models.CharField(max_length=255)
    role = models.CharField(max_length=200)
    description = models.TextField(null=True, blank=True)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    is_current = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.role} at {self.company_name} ({self.student.full_name})"
