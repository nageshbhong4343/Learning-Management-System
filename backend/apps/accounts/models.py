from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
import uuid
from django.utils import timezone

class UserRole(models.TextChoices):
    SUPER_ADMIN = 'SUPER_ADMIN', _('Super Admin')
    ADMIN = 'ADMIN', _('Admin')
    TRAINER = 'TRAINER', _('Trainer')
    PLACEMENT_OFFICER = 'PLACEMENT_OFFICER', _('Placement Officer')
    STUDENT = 'STUDENT', _('Student')
    PARENT = 'PARENT', _('Parent')
    HR_INTERVIEWER = 'HR_INTERVIEWER', _('HR / Interviewer')

class LoginMode(models.TextChoices):
    OTHER_THAN_QUESTION_SOLVING = 'OtherThanQuestionSolving', _('Other Than Question Solving')
    QUESTION_SOLVING = 'QuestionSolving', _('Question Solving')
    QUESTION_SOLVING_COMBO_OTP = 'QuestionSolving(ComboWithOtp)', _('Question Solving (Combo with OTP)')
    ALWAYS_ACTIVE = 'AlwaysActive', _('Always Active')

class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(_('email address'), unique=True)
    phone = models.CharField(max_length=20, unique=True, null=True, blank=True)
    role = models.CharField(
        max_length=30,
        choices=UserRole.choices,
        default=UserRole.STUDENT
    )
    login_mode = models.CharField(
        max_length=50,
        choices=LoginMode.choices,
        default=LoginMode.OTHER_THAN_QUESTION_SOLVING
    )
    is_verified = models.BooleanField(default=False)
    failed_login_attempts = models.IntegerField(default=0)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    def __str__(self):
        return f"{self.email} ({self.get_role_display()})"

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip() or self.username


class StudentProfile(models.Model):
    GENDER_CHOICES = (
        ('MALE', 'Male'),
        ('FEMALE', 'Female'),
        ('OTHER', 'Other'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    dob = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, default='MALE')
    alternate_phone = models.CharField(max_length=20, null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    state = models.CharField(max_length=100, null=True, blank=True)
    pincode = models.CharField(max_length=20, null=True, blank=True)
    
    # Academic & Professional details
    college = models.CharField(max_length=255, null=True, blank=True)
    degree = models.CharField(max_length=100, null=True, blank=True)
    branch = models.CharField(max_length=100, null=True, blank=True)
    graduation_year = models.IntegerField(null=True, blank=True)
    cgpa = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    skills = models.JSONField(default=list, blank=True)
    certifications = models.JSONField(default=list, blank=True)
    
    # Portfolio / Links
    resume = models.FileField(upload_to='resumes/', null=True, blank=True)
    github_url = models.URLField(max_length=500, null=True, blank=True)
    linkedin_url = models.URLField(max_length=500, null=True, blank=True)
    portfolio_url = models.URLField(max_length=500, null=True, blank=True)
    
    # Course & LMS Status
    training_level = models.CharField(max_length=50, default='Level 1 - Foundations')
    current_batch_name = models.CharField(max_length=100, default='Batch A-2026')
    attendance_percentage = models.FloatField(default=92.5)
    certificate_score = models.FloatField(default=85.0)
    mock_interview_score = models.FloatField(default=88.0)
    coding_score = models.FloatField(default=90.0)
    aptitude_score = models.FloatField(default=84.0)
    placement_status = models.CharField(max_length=50, default='Eligible & Active')
    
    locked_by_admin = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Student: {self.user.full_name}"


class ParentProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='parent_profile')
    student = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='parents')
    occupation = models.CharField(max_length=150, null=True, blank=True)
    address = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"Parent: {self.user.full_name}"


class TrainerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='trainer_profile')
    specialization = models.CharField(max_length=200, default='Full Stack & Python')
    experience_years = models.IntegerField(default=5)
    bio = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"Trainer: {self.user.full_name}"


class AdminProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='admin_profile')
    department = models.CharField(max_length=100, default='Operations')
    designation = models.CharField(max_length=100, default='Senior Administrator')

    def __str__(self):
        return f"Admin: {self.user.full_name}"


class LoginHistory(models.Model):
    STATUS_CHOICES = (
        ('SUCCESS', 'Success'),
        ('FAILED', 'Failed'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='login_histories')
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(null=True, blank=True)
    login_mode = models.CharField(max_length=50, default=LoginMode.OTHER_THAN_QUESTION_SOLVING)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='SUCCESS')
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.user.email} - {self.status} at {self.timestamp}"


class OTPVerification(models.Model):
    PURPOSE_CHOICES = (
        ('LOGIN', 'Login'),
        ('PASSWORD_RESET', 'Password Reset'),
        ('EMAIL_VERIFICATION', 'Email Verification'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='otp_verifications')
    otp_code = models.CharField(max_length=6)
    purpose = models.CharField(max_length=30, choices=PURPOSE_CHOICES, default='LOGIN')
    is_used = models.BooleanField(default=False)
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    def is_valid(self):
        return not self.is_used and timezone.now() < self.expires_at

    def __str__(self):
        return f"OTP for {self.user.email} [{self.purpose}]"
