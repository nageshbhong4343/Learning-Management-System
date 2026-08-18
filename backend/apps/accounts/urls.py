from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView
from apps.accounts.views import (
    CustomTokenObtainPairView, RegisterView, UserProfileView,
    StudentProfileUpdateView, ChangePasswordView, RequestOTPView,
    VerifyOTPView, LoginHistoryListView, UserManagementViewSet
)

router = DefaultRouter()
router.register('users', UserManagementViewSet, basename='user-management')

urlpatterns = [
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('me/', UserProfileView.as_view(), name='auth_me'),
    path('student-profile/', StudentProfileUpdateView.as_view(), name='auth_student_profile'),
    path('change-password/', ChangePasswordView.as_view(), name='auth_change_password'),
    path('request-otp/', RequestOTPView.as_view(), name='auth_request_otp'),
    path('verify-otp/', VerifyOTPView.as_view(), name='auth_verify_otp'),
    path('login-history/', LoginHistoryListView.as_view(), name='auth_login_history'),
    path('', include(router.urls)),
]
