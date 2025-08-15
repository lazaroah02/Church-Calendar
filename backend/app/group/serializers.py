from rest_framework import serializers
from group.models import Group


class GroupsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = "__all__"
