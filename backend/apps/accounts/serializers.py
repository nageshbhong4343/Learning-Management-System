from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from apps.accounts.models import (
    UserRole, LoginMode, StudentProfile, ParentProfile,
    TrainerProfile, AdminProfile, LoginHistory, OTPVerification
)

User = get_user_model()


class StudentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentProfile
        fields = '__all__'
        read_only_fields = ('user', 'created_at', 'updated_at')


class ParentProfileSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.full_name', read_only=True)

    class Meta:
        model = ParentProfile
        fields = '__all__'
        read_only_fields = ('user',)


class TrainerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainerProfile
        fields = '__all__'
        read_only_fields = ('user',)


class AdminProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminProfile
        fields = '__all__'
        read_only_fields = ('user',)


class UserSerializer(serializers.ModelSerializer):
    student_profile = StudentProfileSerializer(read_only=True)
    parent_profile = ParentProfileSerializer(read_only=True)
    trainer_profile = TrainerProfileSerializer(read_only=True)
    admin_profile = AdminProfileSerializer(read_only=True)
    full_name = serializers.ReadOnlyField()

    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'phone', 'first_name', 'last_name',
            'full_name', 'role', 'login_mode', 'is_verified', 'is_active',
            'avatar', 'failed_login_attempts', 'student_profile',
            'parent_profile', 'trainer_profile', 'admin_profile',
            'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'is_verified', 'failed_login_attempts', 'created_at', 'updated_at')


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, required=False, allow_blank=True)
    username = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ('email', 'username', 'first_name', 'last_name', 'phone', 'role', 'password', 'password_confirm')

    def validate(self, attrs):
        if not attrs.get('username'):
            base_username = attrs['email'].split('@')[0]
            username = base_username
            counter = 1
            while User.objects.filter(username=username).exists():
                username = f"{base_username}{counter}"
                counter += 1
            attrs['username'] = username
        pass_confirm = attrs.get('password_confirm')
        if pass_confirm and attrs['password'] != pass_confirm:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm', None)
        password = validated_data.pop('password')
        role = validated_data.get('role', UserRole.STUDENT)
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.is_verified = True  # Default auto-verify for dev/seed ease
        user.save()

        # Create corresponding profile based on role
        if role == UserRole.STUDENT:
            StudentProfile.objects.get_or_create(user=user)
        elif role == UserRole.PARENT:
            ParentProfile.objects.get_or_create(user=user)
        elif role == UserRole.TRAINER:
            TrainerProfile.objects.get_or_create(user=user)
        elif role in [UserRole.ADMIN, UserRole.SUPER_ADMIN]:
            AdminProfile.objects.get_or_create(user=user)

        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'

    def validate(self, attrs):
        # Support email or username or phone login
        login_id = attrs.get(self.username_field)
        password = attrs.get('password')
        
        user_obj = User.objects.filter(email=login_id).first() or \
                   User.objects.filter(username=login_id).first() or \
                   User.objects.filter(phone=login_id).first()

        if user_obj:
            attrs['email'] = user_obj.email

        data = super().validate(attrs)
        
        # Reset failed login count on success
        self.user.failed_login_attempts = 0
        self.user.save(update_fields=['failed_login_attempts'])

        # Inject user details & role in token response
        data['user'] = UserSerializer(self.user).data
        data['role'] = self.user.role
        data['login_mode'] = self.user.login_mode

        # Log history
        request = self.context.get('request')
        ip = request.META.get('REMOTE_ADDR') if request else None
        ua = request.META.get('HTTP_USER_AGENT') if request else None
        
        LoginHistory.objects.create(
            user=self.user,
            ip_address=ip,
            user_agent=ua,
            login_mode=self.user.login_mode,
            status='SUCCESS'
        )

        return data


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=8)

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Current password is incorrect.")
        return value


class LoginHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = LoginHistory
        fields = '__all__'


class OTPVerifySerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp_code = serializers.CharField(max_length=6)
    purpose = serializers.CharField(default='LOGIN')
