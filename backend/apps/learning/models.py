from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Course(models.Model):
    title = models.CharField(max_length=255)
    code = models.CharField(max_length=50, unique=True)
    description = models.TextField()
    thumbnail = models.ImageField(upload_to='courses/thumbnails/', null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class Subject(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='subjects')
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=50)
    description = models.TextField(null=True, blank=True)
    order = models.PositiveIntegerField(default=1)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.name} ({self.course.title})"


class Topic(models.Model):
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='topics')
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    order = models.PositiveIntegerField(default=1)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.title} - {self.subject.name}"


class Lesson(models.Model):
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name='lessons')
    title = models.CharField(max_length=255)
    summary = models.TextField(null=True, blank=True)
    order = models.PositiveIntegerField(default=1)
    duration_minutes = models.IntegerField(default=30)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.title} ({self.topic.title})"


class MaterialType(models.TextChoices):
    TEXT = 'TEXT', 'Text Article'
    PDF = 'PDF', 'PDF Document'
    VIDEO = 'VIDEO', 'Video Lecture'
    URL = 'URL', 'External Resource URL'
    CODE = 'CODE', 'Code Example'


class LearningMaterial(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='materials')
    title = models.CharField(max_length=255)
    material_type = models.CharField(max_length=20, choices=MaterialType.choices, default=MaterialType.TEXT)
    content_text = models.TextField(null=True, blank=True)
    file_attachment = models.FileField(upload_to='materials/files/', null=True, blank=True)
    video_url = models.URLField(max_length=500, null=True, blank=True)
    external_url = models.URLField(max_length=500, null=True, blank=True)
    code_snippet = models.TextField(null=True, blank=True)
    order = models.PositiveIntegerField(default=1)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.title} [{self.get_material_type_display()}]"


class StudentLessonProgress(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='lesson_progress')
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='student_progress')
    is_completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    last_accessed = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('student', 'lesson')

    def __str__(self):
        return f"{self.student.full_name} - {self.lesson.title} ({'Done' if self.is_completed else 'In Progress'})"
