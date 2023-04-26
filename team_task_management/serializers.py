from rest_framework import serializers
from team_task_management.models import *

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["name"]

class TeamSerializer(serializers.ModelSerializer):
    members = serializers.ListField(child=serializers.CharField(),required=True)

    class Meta:
        model = Team
        fields = ["team_name", "members"]

    def create(self, validated_data):
        members_data = validated_data.pop('members')
        team = Team.objects.create(**validated_data)
        members = []
        for member_data in members_data:
            member, created = User.objects.get_or_create(name=member_data)
            members.append(member)
        team.members.set(members)
        return team


class TaskSerializer(serializers.ModelSerializer):
    assignee = UserSerializer()

    class Meta:
        model = Task
        fields = '__all__'


class TeamMemberSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = TeamMember
        fields = '__all__'

class TeamWithMembers(serializers.ModelSerializer):
    members = UserSerializer(many=True)

    class Meta:
        model = Team
        fields = ["team_name", "members"]
