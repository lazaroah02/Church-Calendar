from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password
from church_group.serializers import ChurchGroupsReducedSerializer
from rest_framework import serializers
from django.utils.translation import gettext_lazy, gettext as _

User = get_user_model()


class UserManagmentSerializer(serializers.ModelSerializer):
    """
    Serializer for user management operations (create/update).
    Handles password hashing and validation.
    """
    email = serializers.EmailField(required=True)
    username = serializers.CharField(required=False)
    full_name = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True)
    is_active = serializers.BooleanField(
        initial=True,
        help_text=gettext_lazy("Designates whether the user can log in")
        )
    is_superuser = serializers.BooleanField(
        initial=False,
        help_text=gettext_lazy("Designates whether the user can access the admin panel")
        )
    member_groups_full_info = ChurchGroupsReducedSerializer(many=True, source="member_groups", read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'password', 'phone_number', 'description',
            'full_name', 'profile_img', 'member_groups', 'born_at',
            'is_staff', 'is_superuser', 'is_active', 'updated_at', 'created_at', "member_groups_full_info"
        ]

    def get_fields(self):
        """
        Optionally remove the password field on update requests.
        """
        fields = super().get_fields()
        request = self.context.get('request')
        if request and request.method == 'PUT':
            # Hide password in update
            fields.pop('password')
        return fields

    def create(self, validated_data):
        """
        Create a new user instance with a hashed password.
        """
        validated_data["password"] = make_password(validated_data["password"])
        validated_data["username"] = validated_data.get(
            "username", validated_data["email"].split("@")[0]
            ).lower()
        return super().create(validated_data)

    def validate(self, data):
        """
        Validate the password and superuser/staff logic on user creation.
        """
        request = self.context.get('request')

        # Password validation only on POST
        if request and request.method == "POST":
            try:
                password = data["password"]
                validate_password(password)
            except ValidationError as e:
                raise serializers.ValidationError({"password": e.messages})

        # Check that superuser is also staff
        if data.get("is_superuser") and not data.get("is_staff"):
            raise serializers.ValidationError({
                "is_superuser": _("An admin/superuser user must be staff too")
            })

        return data

    def validate_email(self, value):
        user_id = self.instance.id if self.instance else None
        if User.objects.exclude(id=user_id).filter(email=value.lower()).exists():
            raise serializers.ValidationError(_("A user with this email already exists."))
        return value

    def validate_username(self, value):
        user_id = self.instance.id if self.instance else None
        if User.objects.exclude(id=user_id).filter(username=value.lower()).exists():
            raise serializers.ValidationError(_("A user with this username already exists."))
        return value
