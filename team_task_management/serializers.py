from rest_framework import serializers
from team_task_management.models import *


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["name"]


class TeamSerializer(serializers.ModelSerializer):
    members = serializers.ListField()

    class Meta:
        model = Team
        fields = ["id", "team_name", "members"]

    def create(self, validated_data):
        members_data = validated_data.pop('members')
        team = Team.objects.create(**validated_data)
        members = []
        for member_data in members_data:
            member, created = User.objects.get_or_create(name=member_data)
            members.append(member)
        team.members.set(members)
        return team


class TeamEditSerializer(serializers.ModelSerializer):
    members = serializers.SlugRelatedField(
        many=True,
        slug_field='name',
        queryset=User.objects.all()
    )

    class Meta:
        model = Team
        fields = ["id", "team_name", "members"]

    def update(self, instance, validated_data):
        members_data = validated_data.pop('members', None)
        instance = super().update(instance, validated_data)
        if members_data is not None:
            members = []
            for member_data in members_data:
                member, created = User.objects.get_or_create(name=member_data)
                members.append(member)
            instance.members.set(members)
        return instance

    def partial_update(self, instance, validated_data):
        instance.team_name = validated_data.get('team_name', instance.team_name)
        members_data = validated_data.get('members', [])
        members = []
        for member_data in members_data:
            member, created = User.objects.get_or_create(name=member_data)
            members.append(member)
        instance.members.set(members)
        instance.save()
        return instance


class TaskSerializer(serializers.ModelSerializer):
    # assignee = UserSerializer(many=True)
    assignee = serializers.SlugRelatedField(
        slug_field='name',
        queryset=User.objects.all()
    )

    class Meta:
        model = Task
        fields = ['id', 'title', 'description', "assignee", "completed", "team"]


class TeamMemberSerializer(serializers.ModelSerializer):
    user = UserSerializer(many=True)

    class Meta:
        model = TeamMember
        fields = '__all__'


class TeamWithMembers(serializers.ModelSerializer):
    members = UserSerializer(many=True)

    class Meta:
        model = Team
        fields = ["id", "team_name", "members"]


# Serializer to edit task
class TaskEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ["id", "title", "description", "assignee", "completed", "team"]

    def update(self, instance, validated_data):
        instance = super().update(instance, validated_data)
        instance.save()
        return instance

    def partial_update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get('description', instance.description)
        instance.assignee = validated_data.get('assignee', instance.assignee)
        instance.completed = validated_data.get('completed', instance.completed)
        instance.team = validated_data.get('team', instance.team)
        instance.save()
        return instance
