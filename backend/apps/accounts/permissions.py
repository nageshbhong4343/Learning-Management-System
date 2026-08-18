from rest_framework import permissions
from apps.accounts.models import UserRole

class IsSuperAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == UserRole.SUPER_ADMIN)

class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and request.user.is_authenticated and 
            request.user.role in [UserRole.ADMIN, UserRole.SUPER_ADMIN]
        )

class IsTrainer(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and request.user.is_authenticated and 
            request.user.role in [UserRole.TRAINER, UserRole.ADMIN, UserRole.SUPER_ADMIN]
        )

class IsPlacementOfficer(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and request.user.is_authenticated and 
            request.user.role in [UserRole.PLACEMENT_OFFICER, UserRole.ADMIN, UserRole.SUPER_ADMIN]
        )

class IsStudent(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == UserRole.STUDENT)

class IsParent(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == UserRole.PARENT)

class IsHRInterviewer(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and request.user.is_authenticated and 
            request.user.role in [UserRole.HR_INTERVIEWER, UserRole.PLACEMENT_OFFICER, UserRole.ADMIN, UserRole.SUPER_ADMIN]
        )
