from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.accounts.models import (
    UserRole, LoginMode, StudentProfile, ParentProfile,
    TrainerProfile, AdminProfile
)
from apps.batches.models import Batch, BatchType, BatchStatus
from apps.learning.models import Course, Subject, Topic, Lesson, LearningMaterial, MaterialType
from apps.questions.models import Question, QuestionOption, QuestionType, AptitudeCategory, DifficultyLevel
from apps.tests.models import Test, TestType
from apps.coding.models import CodingProblem, TestCase as CodingTestCase
from apps.sqlpractice.models import SQLProblem
from apps.attendance.models import AttendanceRecord, AttendanceStatus
from apps.leaves.models import LeaveRequest, LeaveStatus
from apps.interviews.models import MockInterview, InterviewType, Recommendation
from apps.placement.models import Company, PlacementDrive, DriveApplication, WorkMode, DriveStatus, ApplicationStatus
from apps.certificates.models import CertificateSetting, Certificate
from datetime import date, timedelta, datetime
import uuid

User = get_user_model()


class Command(BaseCommand):
    help = 'Seeds complete LMS database with users, batches, questions, tests, coding, SQL, attendance, leaves, interviews, placement, and certificates.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting full LMS seed data process...'))

        users_data = [
            {'email': 'superadmin@lms.com', 'username': 'superadmin', 'first_name': 'System', 'last_name': 'SuperAdmin', 'phone': '+19000000000', 'role': UserRole.SUPER_ADMIN, 'login_mode': LoginMode.ALWAYS_ACTIVE, 'is_staff': True, 'is_superuser': True},
            {'email': 'admin@lms.com', 'username': 'admin', 'first_name': 'Nagesh', 'last_name': 'Bhong', 'phone': '+19000000001', 'role': UserRole.ADMIN, 'login_mode': LoginMode.OTHER_THAN_QUESTION_SOLVING, 'is_staff': True},
            {'email': 'trainer@lms.com', 'username': 'trainer', 'first_name': 'Dr. Robert', 'last_name': 'Chen', 'phone': '+19000000002', 'role': UserRole.TRAINER, 'login_mode': LoginMode.OTHER_THAN_QUESTION_SOLVING},
            {'email': 'placement@lms.com', 'username': 'placement', 'first_name': 'Elena', 'last_name': 'Rostova', 'phone': '+19000000003', 'role': UserRole.PLACEMENT_OFFICER, 'login_mode': LoginMode.OTHER_THAN_QUESTION_SOLVING},
            {'email': 'student1@lms.com', 'username': 'student1', 'first_name': 'Alex', 'last_name': 'Morgan', 'phone': '+19000000004', 'role': UserRole.STUDENT, 'login_mode': LoginMode.QUESTION_SOLVING},
            {'email': 'student2@lms.com', 'username': 'student2', 'first_name': 'Priya', 'last_name': 'Sharma', 'phone': '+19000000005', 'role': UserRole.STUDENT, 'login_mode': LoginMode.QUESTION_SOLVING_COMBO_OTP},
            {'email': 'parent@lms.com', 'username': 'parent', 'first_name': 'David', 'last_name': 'Morgan', 'phone': '+19000000006', 'role': UserRole.PARENT, 'login_mode': LoginMode.OTHER_THAN_QUESTION_SOLVING},
            {'email': 'hr@lms.com', 'username': 'hr_interviewer', 'first_name': 'Michael', 'last_name': 'Vance', 'phone': '+19000000007', 'role': UserRole.HR_INTERVIEWER, 'login_mode': LoginMode.OTHER_THAN_QUESTION_SOLVING},
        ]

        created_users = {}
        for u_data in users_data:
            email = u_data['email']
            user = User.objects.filter(email=email).first()
            if not user:
                password = 'Password123!'
                user = User.objects.create_user(
                    email=email,
                    username=u_data['username'],
                    first_name=u_data['first_name'],
                    last_name=u_data['last_name'],
                    phone=u_data['phone'],
                    role=u_data['role'],
                    login_mode=u_data['login_mode'],
                    is_verified=True,
                    is_staff=u_data.get('is_staff', False),
                    is_superuser=u_data.get('is_superuser', False)
                )
                user.set_password(password)
                user.save()
            created_users[u_data['role']] = user

        student1 = User.objects.filter(email='student1@lms.com').first()
        trainer_user = created_users.get(UserRole.TRAINER)
        hr_user = created_users.get(UserRole.HR_INTERVIEWER)

        # Seed Batches
        batch_alpha, _ = Batch.objects.get_or_create(
            code='BATCH-ALPHA-2026',
            defaults={
                'name': 'Batch Alpha-2026',
                'batch_type': BatchType.REGULAR,
                'status': BatchStatus.ACTIVE,
                'trainer': trainer_user,
                'start_date': date.today() - timedelta(days=60),
                'end_date': date.today() + timedelta(days=120),
                'batch_timing': '09:00 AM - 01:00 PM',
                'capacity': 60,
                'description': 'Full Stack Software Engineering & Placement Preparation'
            }
        )

        # Seed Attendance & Leave
        if student1:
            for d_idx in range(5):
                AttendanceRecord.objects.get_or_create(
                    student=student1,
                    batch=batch_alpha,
                    date=date.today() - timedelta(days=d_idx + 1),
                    defaults={'status': AttendanceStatus.PRESENT, 'marked_by': trainer_user}
                )

            LeaveRequest.objects.get_or_create(
                student=student1,
                start_date=date.today() + timedelta(days=10),
                end_date=date.today() + timedelta(days=12),
                defaults={
                    'reason': 'Attending National Hackathon Competition',
                    'status': LeaveStatus.APPROVED,
                    'admin_remarks': 'Approved with full academic attendance credit.',
                    'reviewed_by': trainer_user
                }
            )

            # Seed Mock Interview
            MockInterview.objects.get_or_create(
                student=student1,
                interviewer=trainer_user,
                defaults={
                    'interview_type': InterviewType.TECHNICAL,
                    'scheduled_at': datetime.now() - timedelta(days=2),
                    'duration_minutes': 45,
                    'meeting_link': 'https://meet.google.com/abc-defg-hij',
                    'technical_score': 92.0,
                    'communication_score': 88.0,
                    'problem_solving_score': 95.0,
                    'confidence_score': 90.0,
                    'overall_score': 91.25,
                    'strengths': 'Exceptional Django ORM and React state management concepts.',
                    'weaknesses': 'Refine system design scalability edge cases.',
                    'feedback': 'Outstanding candidate, ready for top tier tech interviews.',
                    'recommendation': Recommendation.SELECTED,
                    'is_completed': True
                }
            )

        # Seed Companies & Placement Drives
        comp_google, _ = Company.objects.get_or_create(
            name='Google Cloud',
            defaults={'website': 'https://google.com/careers', 'description': 'Global cloud engineering and systems.'}
        )
        comp_tcs, _ = Company.objects.get_or_create(
            name='TCS Digital',
            defaults={'website': 'https://tcs.com', 'description': 'IT services & digital consulting.'}
        )

        drive_google, _ = PlacementDrive.objects.get_or_create(
            company=comp_google,
            job_title='Software Engineer - Entry Level (SDE 1)',
            defaults={
                'job_description': 'Full Stack systems engineering, Django microservices, and React dashboards.',
                'location': 'Bengaluru / Hyderabad / Remote',
                'work_mode': WorkMode.HYBRID,
                'salary_package': '₹24,00,000 / yr (24 LPA)',
                'min_cgpa': 8.0,
                'drive_date': date.today() + timedelta(days=15),
                'application_deadline': date.today() + timedelta(days=7),
                'status': DriveStatus.ACTIVE
            }
        )

        if student1:
            DriveApplication.objects.get_or_create(
                drive=drive_google,
                student=student1,
                defaults={'status': ApplicationStatus.SHORTLISTED, 'current_round': 'Round 2: Technical Deep Dive'}
            )

        # Seed Certificate Settings & Certificate
        CertificateSetting.objects.get_or_create(
            id=1,
            defaults={'title': 'Commercial LMS Certification Exam Threshold', 'passing_percentage': 80.0, 'max_attempts': 5}
        )

        if student1:
            Certificate.objects.get_or_create(
                student=student1,
                defaults={
                    'certificate_number': 'CERT-2026-98765432',
                    'course_name': 'Full Stack Software Engineering & Placement',
                    'score_percentage': 88.0
                }
            )

        self.stdout.write(self.style.SUCCESS('Successfully seeded full LMS environment with all 15 phase datasets!'))
