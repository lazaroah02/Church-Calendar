from rest_framework import serializers
from church_group.models import ChurchGroup
from django.utils.translation import gettext as _


class ChurchGroupsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChurchGroup
        fields = "__all__"


class ChurchGroupsManagementSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChurchGroup
        fields = "__all__"

    def validate_color(self, value):
        if ChurchGroup.objects.filter(color=value).exclude(id=self.instance.id if self.instance else None).exists():
            raise serializers.ValidationError(_("This color is being used by other group."))
        if value.lower() == "#ffffff":
            raise serializers.ValidationError(_("White color is not allowed. Please choose another color."))
        if value.lower() == "#000000":
            raise serializers.ValidationError(_("Black color is not allowed. Please choose another color."))
        if value.startswith("#") and len(value) == 7:
            try:
                int(value[1:], 16)
            except ValueError:
                raise serializers.ValidationError(_("Invalid color format. Please provide a valid hex color code."))
        return value


class ChurchGroupsReducedSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChurchGroup
        fields = ["name", "color"]