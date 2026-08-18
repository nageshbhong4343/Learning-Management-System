from rest_framework import serializers
from apps.placement.models import Company, PlacementDrive, DriveApplication

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'


class PlacementDriveSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)

    class Meta:
        model = PlacementDrive
        fields = '__all__'


class DriveApplicationSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.full_name', read_only=True)
    company_name = serializers.CharField(source='drive.company.name', read_only=True)
    job_title = serializers.CharField(source='drive.job_title', read_only=True)

    class Meta:
        model = DriveApplication
        fields = '__all__'
        read_only_fields = ('student', 'applied_at', 'updated_at')
