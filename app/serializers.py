from rest_framework import serializers
from .models import *


# account serializers__________________________________________________________________________
class AccountSerializer(serializers.Serializer):
    DATA_TYPE_CHOICE = (("Real_Data", "Real_Data"), ("Learning_Data", "Learning_Data"),
                        ("Testing_Data", "Testing_Data"), ("Archived_Data", "Archived_Data"))
    applicant = serializers.CharField(allow_null=False, allow_blank=False)
    project = serializers.ListField(required=True, allow_empty=False)
    task = serializers.CharField(allow_null=False, allow_blank=False)
    status = serializers.CharField(allow_null=False, allow_blank=False)
    company_id = serializers.CharField(allow_null=False, allow_blank=False)
    data_type = serializers.ChoiceField(
        allow_null=False, allow_blank=False, choices=DATA_TYPE_CHOICE)
    onboarded_on = serializers.CharField(allow_null=False, allow_blank=False)


class RejectSerializer(serializers.Serializer):
    DATA_TYPE_CHOICE = (("Real_Data", "Real_Data"), ("Learning_Data", "Learning_Data"),
                        ("Testing_Data", "Testing_Data"), ("Archived_Data", "Archived_Data"))

    document_id = serializers.CharField(allow_null=False, allow_blank=False)
    reject_remarks = serializers.CharField(allow_null=False, allow_blank=False)
    applicant = serializers.CharField(allow_null=False, allow_blank=False)
    company_id = serializers.CharField(allow_null=False, allow_blank=False)
    data_type = serializers.ChoiceField(
        allow_null=False, allow_blank=False, choices=DATA_TYPE_CHOICE)
    rejected_on = serializers.CharField(allow_null=False, allow_blank=False)
    username = serializers.CharField(allow_null=False, allow_blank=False)


# admin serializers__________________________________________________________________________
class AdminSerializer(serializers.Serializer):
    JOB_CATEGORY_CHOICE = (("Freelancer", "Freelancer"),
                           ("Internship", "Internship"), ("Employee", "Employee"))

    TYPE_OF_JOB_CHOICE = (("Full time", "Full time"),
                          ("Part time", "Part time"), ("Time based", "Time based"), ("Task based", "Task based"))

    DATA_TYPE_CHOICE = (("Real_Data", "Real_Data"), ("Learning_Data", "Learning_Data"),
                        ("Testing_Data", "Testing_Data"), ("Archived_Data", "Archived_Data"))

    MODULE_CHOICE = (("Frontend", "Frontend"), ("Backend", "Backend"),
                     ("UI/UX", "UI/UX"), ("Virtual Assistant",
                                          "Virtual Assistant"), ("Web", "Web"), ("Mobile", "Mobile"))

    job_number = serializers.CharField(allow_null=False, allow_blank=False)
    job_title = serializers.CharField(allow_null=False, allow_blank=False)
    description = serializers.CharField(allow_null=False, allow_blank=False)
    qualification = serializers.CharField(allow_null=False, allow_blank=False)
    job_category = serializers.ChoiceField(
        allow_null=False, allow_blank=False, choices=JOB_CATEGORY_CHOICE)
    skills = serializers.CharField(allow_null=False, allow_blank=False)
    time_interval = serializers.CharField(allow_null=False, allow_blank=False)
    type_of_job = serializers.ChoiceField(
        allow_null=False, allow_blank=False, choices=TYPE_OF_JOB_CHOICE)
    payment = serializers.CharField(allow_null=False, allow_blank=False)
    is_active = serializers.BooleanField(required=True)
    general_terms = serializers.ListField(required=True, allow_empty=False)
    company_id = serializers.CharField(allow_null=False, allow_blank=False)
    module = serializers.ChoiceField(
        allow_null=False, allow_blank=False, choices=MODULE_CHOICE)
    data_type = serializers.ChoiceField(
        allow_null=False, allow_blank=False, choices=DATA_TYPE_CHOICE)
    created_by = serializers.CharField(allow_null=False, allow_blank=False)
    created_on = serializers.CharField(allow_null=False, allow_blank=False)


# training serializers__________________________________________________________________________
class TrainingSerializer(serializers.Serializer):
    DATA_TYPE_CHOICE = (("Real_Data", "Real_Data"), ("Learning_Data", "Learning_Data"),
                        ("Testing_Data", "Testing_Data"), ("Archived_Data", "Archived_Data"))
    MODULE_CHOICE = (("Frontend", "Frontend"), ("Backend", "Backend"))

    company_id = serializers.CharField(allow_null=False, allow_blank=False)
    data_type = serializers.ChoiceField(
        allow_null=False, allow_blank=False, choices=DATA_TYPE_CHOICE)
    question_link = serializers.URLField(allow_null=False)
    module = serializers.ChoiceField(
        choices=MODULE_CHOICE, allow_null=False, allow_blank=False, )
    created_on = serializers.CharField(allow_null=False, allow_blank=False)
    created_by = serializers.CharField(allow_null=False, allow_blank=False)
    is_active = serializers.BooleanField(required=True)

    # def get_fields(self):
    #         fields = super().get_fields()
    #         if self.initial_data.get('module') != "Frontend":
    #             del fields['live_link']
    #         else:
    #             del fields["code_base_link"]
    #         return fields


class UpdateQuestionSerializer(serializers.Serializer):
    is_active = serializers.BooleanField(required=True)


# candidate serializers__________________________________________________________________
class CandidateSerializer(serializers.Serializer):
    DATA_TYPE_CHOICE = (("Real_Data", "Real_Data"), ("Learning_Data", "Learning_Data"),
                        ("Testing_Data", "Testing_Data"), ("Archived_Data", "Archived_Data"))
    JOB_CATEGORY_CHOICE = (("Freelancer", "Freelancer"),
                           ("Internship", "Internship"), ("Employee", "Employee"))

    job_number = serializers.CharField(allow_null=False, allow_blank=False)
    job_title = serializers.CharField(allow_null=False, allow_blank=False)
    applicant = serializers.CharField(allow_null=False, allow_blank=False)
    applicant_email = serializers.EmailField(required=True)
    feedBack = serializers.CharField(allow_null=False, allow_blank=False)
    academic_qualification_type = serializers.CharField(
        allow_null=False, allow_blank=False)
    academic_qualification = serializers.CharField(
        allow_null=False, allow_blank=False)
    country = serializers.CharField(allow_null=False, allow_blank=False)
    agree_to_all_term = serializers.BooleanField(default=False)
    internet_speed = serializers.CharField(allow_null=False, allow_blank=False)
    payment = serializers.CharField(allow_null=False, allow_blank=False)
    company_id = serializers.CharField(allow_null=False, allow_blank=False)
    username = serializers.CharField(allow_null=False, allow_blank=False)
    data_type = serializers.ChoiceField(
        allow_null=False, allow_blank=False, choices=DATA_TYPE_CHOICE)
    application_submitted_on = serializers.CharField(
        allow_null=False, allow_blank=False)
    job_category = serializers.ChoiceField(
        allow_null=False, allow_blank=False, choices=JOB_CATEGORY_CHOICE)
    freelancePlatform = serializers.CharField(
        allow_null=False, allow_blank=False)
    freelancePlatformUrl = serializers.CharField(
        allow_null=False, allow_blank=False)
    portfolio_name = serializers.CharField(
        allow_null=False, allow_blank=False)

    def get_fields(self):
        fields = super().get_fields()
        if self.initial_data.get('job_category') != "Freelancer":
            del fields['freelancePlatform']
            del fields["freelancePlatformUrl"]
        return fields


# hr serializers__________________________________________________________________
class HRSerializer(serializers.Serializer):
    DATA_TYPE_CHOICE = (("Real_Data", "Real_Data"), ("Learning_Data", "Learning_Data"),
                        ("Testing_Data", "Testing_Data"), ("Archived_Data", "Archived_Data"))

    document_id = serializers.CharField(allow_null=False, allow_blank=False)
    hr_remarks = serializers.CharField(allow_null=False, allow_blank=False)
    status = serializers.CharField(allow_null=False, allow_blank=False)
    applicant = serializers.CharField(allow_null=False, allow_blank=False)
    company_id = serializers.CharField(allow_null=False, allow_blank=False)
    data_type = serializers.ChoiceField(
        allow_null=False, allow_blank=False, choices=DATA_TYPE_CHOICE)
    shortlisted_on = serializers.CharField(allow_null=False, allow_blank=False)


# lead serializers_______________________________________________________________
class LeadSerializer(serializers.Serializer):
    DATA_TYPE_CHOICE = (("Real_Data", "Real_Data"), ("Learning_Data", "Learning_Data"),
                        ("Testing_Data", "Testing_Data"), ("Archived_Data", "Archived_Data"))

    teamlead_remarks = serializers.CharField(allow_null=False, allow_blank=False)
    status = serializers.CharField(allow_null=False, allow_blank=False)
    applicant = serializers.CharField(allow_null=False, allow_blank=False)
    company_id = serializers.CharField(allow_null=False, allow_blank=False)
    data_type = serializers.ChoiceField(
        allow_null=False, allow_blank=False, choices=DATA_TYPE_CHOICE)
    hired_on = serializers.CharField(allow_null=False, allow_blank=False)
    document_id = serializers.CharField(allow_null=False, allow_blank=False)


# task serializers________________________________________________________________
class TaskSerializer(serializers.Serializer):
    pass

    # DATA_TYPE_CHOICE = (("Real_Data", "Real_Data"), ("Learning_Data", "Learning_Data"),
    #                     ("Testing_Data", "Testing_Data"), ("Archived_Data", "Archived_Data"))

    # data_type = serializers.ChoiceField(allow_null=False, allow_blank=False, choices=DATA_TYPE_CHOICE)

    # def update(self, instance, validated_data):
    #     instance.data_type = validated_data.get('data_type', instance.data_type)
    #     instance.save()
    #     return instance


# team task serializers___________________________________________________________
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


class TeamTaskSerializer(serializers.ModelSerializer):
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


# Serializer for task for a team member
class TaskForMemberSerializer(serializers.ModelSerializer):
    assignee = serializers.SlugRelatedField(
        slug_field='name',
        queryset=User.objects.all()
    )
    team_member = serializers.SlugRelatedField(
        slug_field='user',
        queryset=TeamMember.objects.all()
    )

    class Meta:
        model = TaskForMember
        fields = ['id', 'title', 'description', "assignee", "completed", "team_member"]
