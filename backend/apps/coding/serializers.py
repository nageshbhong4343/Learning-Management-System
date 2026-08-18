from rest_framework import serializers
from apps.coding.models import CodingProblem, TestCase, CodingSubmission

class TestCaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestCase
        fields = ('id', 'input_data', 'expected_output', 'is_public', 'order')


class CodingProblemSerializer(serializers.ModelSerializer):
    test_cases = serializers.SerializerMethodField()

    class Meta:
        model = CodingProblem
        fields = '__all__'

    def get_test_cases(self, obj):
        # Return only public test cases in problem details
        public_cases = obj.test_cases.filter(is_public=True)
        return TestCaseSerializer(public_cases, many=True).data


class CodingSubmissionSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.full_name', read_only=True)
    problem_title = serializers.CharField(source='problem.title', read_only=True)

    class Meta:
        model = CodingSubmission
        fields = '__all__'
        read_only_fields = ('student', 'status', 'passed_cases', 'total_cases', 'execution_time_ms', 'error_output', 'submitted_at')
