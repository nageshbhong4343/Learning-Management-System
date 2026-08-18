from rest_framework import serializers
from apps.batches.models import Batch
from apps.accounts.serializers import UserSerializer

class BatchSerializer(serializers.ModelSerializer):
    trainer_details = UserSerializer(source='trainer', read_only=True)
    enrolled_count = serializers.ReadOnlyField()
    available_slots = serializers.ReadOnlyField()

    class Meta:
        model = Batch
        fields = '__all__'


class BatchDetailSerializer(serializers.ModelSerializer):
    trainer_details = UserSerializer(source='trainer', read_only=True)
    students_details = UserSerializer(source='students', many=True, read_only=True)
    enrolled_count = serializers.ReadOnlyField()
    available_slots = serializers.ReadOnlyField()

    class Meta:
        model = Batch
        fields = '__all__'
