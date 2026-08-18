from rest_framework import generics, viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from django.utils import timezone
import random
from datetime import timedelta

from apps.accounts.models import (
    UserRole, StudentProfile, ParentProfile, TrainerProfile,
    AdminProfile, LoginHistory, OTPVerification
)
from apps.accounts.serializers import (
    UserSerializer, RegisterSerializer, CustomTokenObtainPairSerializer,
    StudentProfileSerializer, ParentProfileSerializer, TrainerProfileSerializer,
    AdminProfileSerializer, ChangePasswordSerializer, LoginHistorySerializer,
    OTPVerifySerializer
)
from apps.accounts.permissions import IsAdmin, IsSuperAdmin

User = get_user_model()


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class StudentProfileUpdateView(generics.UpdateAPIView):
    serializer_class = StudentProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.student_profile

    def update(self, request, *args, **kwargs):
        profile = self.get_object()
        if profile.locked_by_admin and request.user.role == UserRole.STUDENT:
            return Response(
                {"error": "Your profile fields have been locked by an administrator."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)


class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            request.user.set_password(serializer.validated_data['new_password'])
            request.user.save()
            return Response({"message": "Password changed successfully."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RequestOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        purpose = request.data.get('purpose', 'LOGIN')
        user = User.objects.filter(email=email).first()
        if not user:
            return Response({"error": "User with this email does not exist."}, status=status.HTTP_404_NOT_FOUND)

        code = str(random.randint(100000, 999999))
        expires = timezone.now() + timedelta(minutes=10)
        
        OTPVerification.objects.create(
            user=user,
            otp_code=code,
            purpose=purpose,
            expires_at=expires
        )
        
        # Simulated OTP log for dev environment
        print(f"[OTP DEV NOTIFICATION] OTP for {email} ({purpose}): {code}")

        return Response({
            "message": f"OTP sent successfully to {email}.",
            "dev_otp": code  # Exposed in dev mode for easy test execution
        }, status=status.HTTP_200_OK)


class VerifyOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = OTPVerifySerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            otp_code = serializer.validated_data['otp_code']
            purpose = serializer.validated_data['purpose']

            user = User.objects.filter(email=email).first()
            if not user:
                return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

            otp = OTPVerification.objects.filter(
                user=user,
                otp_code=otp_code,
                purpose=purpose,
                is_used=False
            ).order_by('-created_at').first()

            if not otp or not otp.is_valid():
                return Response({"error": "Invalid or expired OTP."}, status=status.HTTP_400_BAD_REQUEST)

            otp.is_used = True
            otp.save()

            return Response({"message": "OTP verified successfully.", "verified": True}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginHistoryListView(generics.ListAPIView):
    serializer_class = LoginHistorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in [UserRole.ADMIN, UserRole.SUPER_ADMIN]:
            return LoginHistory.objects.all()
        return LoginHistory.objects.filter(user=user)


class UserManagementViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-created_at')
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]
    filterset_fields = ['role', 'login_mode', 'is_active', 'is_verified']
    search_fields = ['email', 'username', 'first_name', 'last_name', 'phone']

    def get_serializer_class(self):
        if self.action == 'create':
            return RegisterSerializer
        return UserSerializer

    def perform_destroy(self, instance):
        # Soft-deactivate user rather than hard deletion
        instance.is_active = False
        instance.save()
