from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from apps.accounts.models import UserRole, LoginMode, StudentProfile

User = get_user_model()

class AccountsAuthTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.student_user = User.objects.create_user(
            email='student_test@lms.com',
            username='student_test',
            password='TestPassword123!',
            role=UserRole.STUDENT,
            login_mode=LoginMode.QUESTION_SOLVING
        )
        StudentProfile.objects.create(user=self.student_user)

    def test_login_success(self):
        response = self.client.post('/api/auth/login/', {
            'email': 'student_test@lms.com',
            'password': 'TestPassword123!'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertEqual(response.data['role'], UserRole.STUDENT)

    def test_unauthorized_profile_access(self):
        response = self.client.get('/api/auth/me/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_authorized_profile_access(self):
        self.client.force_authenticate(user=self.student_user)
        response = self.client.get('/api/auth/me/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], 'student_test@lms.com')
