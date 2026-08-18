from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from apps.accounts.models import (
    User, StudentProfile, ParentProfile, TrainerProfile,
    AdminProfile, LoginHistory, OTPVerification
)

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'username', 'role', 'login_mode', 'is_verified', 'is_active', 'is_staff')
    list_filter = ('role', 'login_mode', 'is_verified', 'is_active', 'is_staff')
    search_fields = ('email', 'username', 'first_name', 'last_name', 'phone')
    ordering = ('email',)
    fieldsets = BaseUserAdmin.fieldsets + (
        ('LMS Profile & Roles', {'fields': ('role', 'login_mode', 'phone', 'is_verified', 'failed_login_attempts', 'avatar')}),
    )

@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'college', 'branch', 'graduation_year', 'cgpa', 'attendance_percentage', 'locked_by_admin')
    search_fields = ('user__email', 'user__first_name', 'user__last_name', 'college', 'degree', 'branch')
    list_filter = ('locked_by_admin', 'gender', 'graduation_year')

@admin.register(ParentProfile)
class ParentProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'student', 'occupation')

@admin.register(TrainerProfile)
class TrainerProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'specialization', 'experience_years')

@admin.register(AdminProfile)
class AdminProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'department', 'designation')

@admin.register(LoginHistory)
class LoginHistoryAdmin(admin.ModelAdmin):
    list_display = ('user', 'status', 'login_mode', 'ip_address', 'timestamp')
    list_filter = ('status', 'login_mode', 'timestamp')

@admin.register(OTPVerification)
class OTPVerificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'otp_code', 'purpose', 'is_used', 'expires_at', 'created_at')
