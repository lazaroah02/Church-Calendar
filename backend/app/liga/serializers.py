from rest_framework import serializers
from liga.models import Liga


class LigasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Liga
        fields = "__all__"
