from rest_framework import serializers
from .models import SettingUserProfileInfo
import json

class SettingUserProfileInfoSerializer(serializers.ModelSerializer):
    profile_info = serializers.JSONField()

    class Meta:
        model = SettingUserProfileInfo
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if isinstance(representation['profile_info'], str):
            representation['profile_info'] = json.loads(representation['profile_info'])
            representation['project_list'] = json.loads(representation['project_list'])
        return representation



class UpdateSettingUserProfileInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = SettingUserProfileInfo
        fields = ["profile_info"]