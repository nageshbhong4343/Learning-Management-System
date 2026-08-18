from django.db import models
from django.contrib.auth import get_user_model
import uuid

User = get_user_model()


class CertificateSetting(models.Model):
    title = models.CharField(max_length=200, default='Global Certificate Examination')
    passing_percentage = models.FloatField(default=80.0, help_text="Configurable passing score threshold (defaults to 80%)")
    max_attempts = models.IntegerField(default=5)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} (Passing: {self.passing_percentage}%)"


class Certificate(models.Model):
    certificate_number = models.CharField(max_length=100, unique=True, default=uuid.uuid4)
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='certificates')
    course_name = models.CharField(max_length=255, default='Full Stack Software Engineering & Placement')
    issue_date = models.DateField(auto_now_add=True)
    score_percentage = models.FloatField(default=88.0)
    pdf_file = models.FileField(upload_to='certificates/pdfs/', null=True, blank=True)

    def __str__(self):
        return f"Certificate #{self.certificate_number} - {self.student.full_name}"
