from datetime import timedelta
from church_group.models import ChurchGroup
from dj_rest_auth.serializers import UserDetailsSerializer
from rest_framework import serializers
from django.contrib.auth import get_user_model
from church_group.serializers import ChurchGroupsReducedSerializer
from dj_rest_auth.registration.serializers import RegisterSerializer
from django.db import transaction
from django.utils.translation import gettext as _
from django.utils.timezone import now

User = get_user_model()


class CustomUserDetailsSerializer(UserDetailsSerializer):
    is_staff = serializers.BooleanField(read_only=True)
    is_active = serializers.BooleanField(read_only=True)
    is_superuser = serializers.BooleanField(read_only=True)
    username = serializers.CharField(read_only=True)
    born_at = serializers.DateField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)
    member_groups_full_info = ChurchGroupsReducedSerializer(many=True, source="member_groups", read_only=True)
    member_groups = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='id'
    )

    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'full_name', 'member_groups',
                  'description', 'phone_number', 'fcm_token',
                  'profile_img', 'is_active', 'is_staff',
                  'is_superuser', 'born_at', 'created_at', 'updated_at', "member_groups_full_info")


class CustomRegisterSerializer(RegisterSerializer):
    email = serializers.EmailField(required=True)
    username = serializers.CharField(required=False, max_length=150)

    full_name = serializers.CharField(required=True, max_length=255)
    born_at = serializers.DateField(required=True, allow_null=False)
    phone_number = serializers.CharField(required=True, max_length=15)

    member_groups = serializers.PrimaryKeyRelatedField(
        queryset=ChurchGroup.objects.all(),
        required=False,
        many=True,
    )

    def validate_email(self, value):
        if User.objects.filter(email=value.lower()).exists():
            raise serializers.ValidationError(_("A user with this email already exists."))
        return value

    def validate_username(self, value):
        if User.objects.filter(username=value.lower()).exists():
            raise serializers.ValidationError(_("A user with this username already exists."))
        return value

    def validate_born_at(self, value):
        today = now().date()
        delta = today - value
        if delta < timedelta(days=365*10):
            raise serializers.ValidationError(_("You must be at least 10 years old to use the app."))
        return value

    @transaction.atomic
    def custom_signup(self, request, user):
        user.full_name = self.validated_data.get('full_name', '')
        user.born_at = self.validated_data.get('born_at', None)
        user.phone_number = self.validated_data.get('phone_number', '')

        provided_username = self.validated_data.get('username')
        if provided_username:
            user.username = provided_username
        elif not user.username or '@' in user.username:
            user.username = user.email.split('@')[0]

        user.save()

        member_groups = self.validated_data.get('member_groups', [])
        if member_groups:
            user.member_groups.set(member_groups)
