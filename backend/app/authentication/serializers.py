from dj_rest_auth.serializers import UserDetailsSerializer
from rest_framework import serializers
from django.contrib.auth import get_user_model


class CustomUserDetailsSerializer(UserDetailsSerializer):
    class Meta:
        model = get_user_model()
        fields = ('id', 'email', 'username', 'first_name', 'last_name',
                  'description', 'phone_number', 'position')

