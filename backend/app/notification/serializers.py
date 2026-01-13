from rest_framework import serializers
from notification.models import DevicePushToken


class DevicePushTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = DevicePushToken
        fields = (
            'device_name', 'platform', 'type', 'fcm_token', 'timezone',
            'created_at'
            )
