from rest_framework import serializers
from apps.leaves.models import LeaveRequest

class LeaveRequestSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.full_name', read_only=True)
    reviewed_by_name = serializers.CharField(source='reviewed_by.full_name', read_only=True)

    class Meta:
        model = LeaveRequest
        fields = '__all__'
        read_only_fields = ('student', 'status', 'admin_remarks', 'reviewed_by', 'created_at', 'updated_at')
