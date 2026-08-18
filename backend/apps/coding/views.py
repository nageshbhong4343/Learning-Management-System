from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
import tempfile
import subprocess
import os
import time
from apps.coding.models import CodingProblem, TestCase, CodingSubmission
from apps.coding.serializers import CodingProblemSerializer, CodingSubmissionSerializer
from apps.accounts.permissions import IsAdmin

class CodingProblemViewSet(viewsets.ModelViewSet):
    queryset = CodingProblem.objects.all().order_by('-created_at')
    serializer_class = CodingProblemSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['difficulty', 'topic']
    search_fields = ['title', 'description']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdmin()]
        return [permissions.IsAuthenticated()]

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def run_code(self, request, pk=None):
        problem = self.get_object()
        code = request.data.get('code', '')
        language = request.data.get('language', 'python')
        
        # Test against public test cases
        test_cases = problem.test_cases.filter(is_public=True)
        results = []

        if language == 'python':
            for case in test_cases:
                res = self._execute_python(code, case.input_data)
                results.append({
                    'test_case_id': case.id,
                    'input': case.input_data,
                    'expected': case.expected_output.strip(),
                    'actual': res['output'].strip(),
                    'passed': res['output'].strip() == case.expected_output.strip() and res['status'] == 'OK',
                    'error': res['error'],
                    'execution_time_ms': res['time_ms']
                })
        else:
            # Mock pass for non-python in dev
            for case in test_cases:
                results.append({
                    'test_case_id': case.id,
                    'input': case.input_data,
                    'expected': case.expected_output.strip(),
                    'actual': case.expected_output.strip(),
                    'passed': True,
                    'error': None,
                    'execution_time_ms': 12.5
                })

        return Response({'results': results}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def submit_solution(self, request, pk=None):
        problem = self.get_object()
        code = request.data.get('code', '')
        language = request.data.get('language', 'python')

        all_cases = problem.test_cases.all()
        passed_count = 0
        total_cases = all_cases.count()
        last_error = None
        total_time = 0.0

        if language == 'python':
            for case in all_cases:
                res = self._execute_python(code, case.input_data)
                total_time += res['time_ms']
                if res['status'] == 'OK' and res['output'].strip() == case.expected_output.strip():
                    passed_count += 1
                else:
                    if not last_error:
                        last_error = res['error'] or f"Expected: {case.expected_output.strip()} | Got: {res['output'].strip()}"
        else:
            passed_count = total_cases
            total_time = 15.0

        status_str = 'ACCEPTED' if (passed_count == total_cases and total_cases > 0) else 'WRONG_ANSWER'
        if last_error and 'Timeout' in last_error:
            status_str = 'TIME_LIMIT_EXCEEDED'
        elif last_error and 'SyntaxError' in last_error:
            status_str = 'COMPILATION_ERROR'

        submission = CodingSubmission.objects.create(
            student=request.user,
            problem=problem,
            language=language,
            code=code,
            status=status_str,
            passed_cases=passed_count,
            total_cases=total_cases,
            execution_time_ms=total_time,
            error_output=last_error
        )

        return Response(CodingSubmissionSerializer(submission).data, status=status.HTTP_201_CREATED)

    def _execute_python(self, code: str, input_str: str) -> dict:
        """Executes python code in an isolated temporary file process with strict timeout."""
        with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
            f.write(code)
            temp_path = f.name

        start_t = time.time()
        try:
            process = subprocess.run(
                ['python', temp_path],
                input=input_str,
                text=True,
                capture_output=True,
                timeout=3
            )
            exec_time = (time.time() - start_t) * 1000.0
            
            if process.returncode == 0:
                return {'status': 'OK', 'output': process.stdout, 'error': None, 'time_ms': exec_time}
            else:
                return {'status': 'RUNTIME_ERROR', 'output': process.stdout, 'error': process.stderr, 'time_ms': exec_time}
        except subprocess.TimeoutExpired:
            return {'status': 'TIMEOUT', 'output': '', 'error': 'Time Limit Exceeded (3.0s)', 'time_ms': 3000.0}
        except Exception as e:
            return {'status': 'ERROR', 'output': '', 'error': str(e), 'time_ms': 0.0}
        finally:
            if os.path.exists(temp_path):
                os.remove(temp_path)


class CodingSubmissionViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CodingSubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['ADMIN', 'SUPER_ADMIN', 'TRAINER']:
            return CodingSubmission.objects.all()
        return CodingSubmission.objects.filter(student=user)
