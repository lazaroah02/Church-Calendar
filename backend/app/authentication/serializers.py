from dj_rest_auth.serializers import UserDetailsSerializer
from rest_framework import serializers
from django.contrib.auth import get_user_model
from church_group.serializers import ChurchGroupsReducedSerializer


class CustomUserDetailsSerializer(UserDetailsSerializer):
    is_staff = serializers.BooleanField(read_only=True)
    is_active = serializers.BooleanField(read_only=True)
    is_superuser = serializers.BooleanField(read_only=True)
    username = serializers.CharField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)
    member_groups_full_info = ChurchGroupsReducedSerializer(many=True, source="member_groups", read_only=True)
    member_groups = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='id'
    )

    class Meta:
        model = get_user_model()
        fields = ('id', 'email', 'username', 'full_name', 'member_groups',
                  'description', 'phone_number',
                  'profile_img', 'is_active', 'is_staff',
                  'is_superuser', 'created_at', 'updated_at', "member_groups_full_info")
