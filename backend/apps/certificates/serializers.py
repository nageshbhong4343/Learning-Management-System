from rest_framework import serializers
from apps.certificates.models import CertificateSetting, Certificate

class CertificateSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = CertificateSetting
        fields = '__all__'


class CertificateSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.full_name', read_only=True)

    class Meta:
        model = Certificate
        fields = '__all__'
