from rest_framework import serializers
from .models import SettingUserProfileInfo , UserProject
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
        return representation



class UpdateSettingUserProfileInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = SettingUserProfileInfo
        fields = ["profile_info"]


class SettingUserProjectSerializer(serializers.ModelSerializer):
    project_list = serializers.JSONField()

    class Meta:
        model = UserProject
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if isinstance(representation['project_list'], str):
            representation['project_list'] = json.loads(representation['project_list'])
        return representation



class UpdateSettingUserProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProject
        fields = ["project_list"]