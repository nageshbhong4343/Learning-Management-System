from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Company(models.Model):
    name = models.CharField(max_length=255, unique=True)
    logo = models.ImageField(upload_to='companies/logos/', null=True, blank=True)
    website = models.URLField(max_length=500, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class WorkMode(models.TextChoices):
    ONSITE = 'ONSITE', 'Onsite'
    REMOTE = 'REMOTE', 'Remote'
    HYBRID = 'HYBRID', 'Hybrid'


class DriveStatus(models.TextChoices):
    UPCOMING = 'UPCOMING', 'Upcoming'
    ACTIVE = 'ACTIVE', 'Active / Applications Open'
    IN_PROGRESS = 'IN_PROGRESS', 'Selection Rounds in Progress'
    COMPLETED = 'COMPLETED', 'Completed'


class PlacementDrive(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='drives')
    job_title = models.CharField(max_length=255)
    job_description = models.TextField()
    location = models.CharField(max_length=200, default='Bengaluru / Hyderabad')
    work_mode = models.CharField(max_length=20, choices=WorkMode.choices, default=WorkMode.HYBRID)
    salary_package = models.CharField(max_length=100, default='₹12,00,000 / yr (12 LPA)')
    min_cgpa = models.DecimalField(max_digits=4, decimal_places=2, default=7.0)
    eligible_branches = models.JSONField(default=list, blank=True)
    drive_date = models.DateField()
    application_deadline = models.DateField()
    status = models.CharField(max_length=30, choices=DriveStatus.choices, default=DriveStatus.ACTIVE)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-drive_date']

    def __str__(self):
        return f"{self.company.name} - {self.job_title}"


class ApplicationStatus(models.TextChoices):
    APPLIED = 'APPLIED', 'Applied'
    SHORTLISTED = 'SHORTLISTED', 'Shortlisted'
    TEST_COMPLETED = 'TEST_COMPLETED', 'Test Completed'
    INTERVIEW = 'INTERVIEW', 'Interview Scheduled'
    SELECTED = 'SELECTED', 'Selected / Offered'
    REJECTED = 'REJECTED', 'Rejected'
    ON_HOLD = 'ON_HOLD', 'On Hold'


class DriveApplication(models.Model):
    drive = models.ForeignKey(PlacementDrive, on_delete=models.CASCADE, related_name='applications')
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='drive_applications')
    status = models.CharField(max_length=30, choices=ApplicationStatus.choices, default=ApplicationStatus.APPLIED)
    current_round = models.CharField(max_length=100, default='Round 1: Online Assessment')
    applied_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('drive', 'student')
        ordering = ['-applied_at']

    def __str__(self):
        return f"{self.student.full_name} -> {self.drive.company.name} ({self.status})"
