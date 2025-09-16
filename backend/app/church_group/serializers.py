from rest_framework import serializers
from church_group.models import ChurchGroup


class ChurchGroupsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChurchGroup
        fields = "__all__"


class ChurchGroupsManagementSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChurchGroup
        fields = "__all__"


class ChurchGroupsReducedSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChurchGroup
        fields = ["name", "color"]