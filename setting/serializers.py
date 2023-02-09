from rest_framework import serializers
from .models import SettingUserProfileInfo

class SettingUserProfileInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = SettingUserProfileInfo
        fields = '__all__'


class UpdateSettingUserProfileInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = SettingUserProfileInfo
        fields = ["profile_info"]