from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class BatchType(models.TextChoices):
    REGULAR = 'REGULAR', 'Regular Batch'
    UPCOMING = 'UPCOMING', 'Upcoming Batch'
    SPECIAL = 'SPECIAL', 'Special Batch'
    PLACEMENT = 'PLACEMENT', 'Placement Batch'


class BatchStatus(models.TextChoices):
    UPCOMING = 'UPCOMING', 'Upcoming'
    ACTIVE = 'ACTIVE', 'Active'
    COMPLETED = 'COMPLETED', 'Completed'
    INACTIVE = 'INACTIVE', 'Inactive'


class Batch(models.Model):
    name = models.CharField(max_length=200, unique=True)
    code = models.CharField(max_length=50, unique=True)
    batch_type = models.CharField(max_length=30, choices=BatchType.choices, default=BatchType.REGULAR)
    status = models.CharField(max_length=30, choices=BatchStatus.choices, default=BatchStatus.ACTIVE)
    
    trainer = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='assigned_batches', limit_choices_to={'role': 'TRAINER'}
    )
    students = models.ManyToManyField(
        User, blank=True, related_name='enrolled_batches',
        limit_choices_to={'role': 'STUDENT'}
    )
    
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    batch_timing = models.CharField(max_length=100, default='09:00 AM - 01:00 PM')
    capacity = models.PositiveIntegerField(default=60)
    description = models.TextField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.get_batch_type_display()})"

    @property
    def enrolled_count(self):
        return self.students.count()

    @property
    def available_slots(self):
        return max(0, self.capacity - self.enrolled_count)
