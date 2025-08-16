from dj_rest_auth.serializers import UserDetailsSerializer
from rest_framework import serializers
from django.contrib.auth import get_user_model


class CustomUserDetailsSerializer(UserDetailsSerializer):
    is_staff = serializers.BooleanField(read_only=True)
    is_active = serializers.BooleanField(read_only=True)
    is_superuser = serializers.BooleanField(read_only=True)
    username = serializers.CharField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = get_user_model()
        fields = ('id', 'email', 'username', 'full_name', 'member_groups',
                  'description', 'phone_number',
                  'profile_img', 'is_active', 'is_staff',
                  'is_superuser', 'created_at', 'updated_at')
