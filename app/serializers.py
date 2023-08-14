from rest_framework import serializers
from .models import *
import json



# account serializers__________________________________________________________________________
class AccountSerializer(serializers.Serializer):
    DATA_TYPE_CHOICE = (("Real_Data", "Real_Data"), ("Learning_Data", "Learning_Data"),
                        ("Testing_Data", "Testing_Data"), ("Archived_Data", "Archived_Data"))
    JOB_CATEGORY_CHOICE = (("Freelancer", "Freelancer"),
                           ("Internship", "Internship"), ("Employee", "Employee"))

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
    JOB_CATEGORY_CHOICE = (("Freelancer", "Freelancer"),
                           ("Internship", "Internship"), ("Employee", "Employee"))

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

    MODULE_CHOICE = (("Frontend", "Frontend"), ("Backend", "Backend"), ("UI/UX", "UI/UX"),
                     ("Virtual Assistant", "Virtual Assistant"),
                     ("Web", "Web"), ("Mobile", "Mobile"))

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


# candidate serializers__________________________________________________________________
class CandidateSerializer(serializers.Serializer):
    DATA_TYPE_CHOICE = (("Real_Data", "Real_Data"), ("Learning_Data", "Learning_Data"),
                        ("Testing_Data", "Testing_Data"), ("Archived_Data", "Archived_Data"))
    JOB_CATEGORY_CHOICE = (("Freelancer", "Freelancer"),
                           ("Internship", "Internship"), ("Employee", "Employee"))
    
    MODULE_CHOICE = (("Frontend", "Frontend"), ("Backend", "Backend"), ("UI/UX", "UI/UX"),
                     ("Virtual Assistant", "Virtual Assistant"), ("Web", "Web"), ("Mobile", "Mobile"))

    job_number = serializers.CharField(allow_null=False, allow_blank=False)
    job_title = serializers.CharField(allow_null=False, allow_blank=False)
    applicant = serializers.CharField(allow_null=False, allow_blank=False)
    applicant_email = serializers.EmailField(required=True)
    feedBack = serializers.CharField(allow_null=False, allow_blank=False)
    module = serializers.ChoiceField(
        choices=MODULE_CHOICE, allow_null=False, allow_blank=False, )
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
        allow_null=True, allow_blank=True)

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
    JOB_CATEGORY_CHOICE = (("Freelancer", "Freelancer"),
                           ("Internship", "Internship"), ("Employee", "Employee"))

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


# training serializers__________________________________________________________________________
class TrainingSerializer(serializers.Serializer):
    DATA_TYPE_CHOICE = (("Real_Data", "Real_Data"), ("Learning_Data", "Learning_Data"),
                        ("Testing_Data", "Testing_Data"), ("Archived_Data", "Archived_Data"))
    MODULE_CHOICE = (("Frontend", "Frontend"), ("Backend", "Backend"), ("UI/UX", "UI/UX"),
                     ("Virtual Assistant", "Virtual Assistant"), ("Web", "Web"), ("Mobile", "Mobile"))

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


class SubmitResponseSerializer(serializers.Serializer):
    video_link = serializers.URLField(allow_null=False, allow_blank=False, required=True)
    answer_link = serializers.URLField(allow_null=False, allow_blank=False, required=True)



# settings serializers______________________________________________________________
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

class CreatePublicLinkSerializer(serializers.Serializer):
    qr_ids = serializers.ListField(child=serializers.CharField(allow_null=False, allow_blank=False))
    job_company_id = serializers.CharField(allow_null=False, allow_blank=False)
    job_id = serializers.CharField(allow_null=False, allow_blank=False)
    company_data_type = serializers.CharField(allow_null=False, allow_blank=False)

class SendMailToPublicSerializer(serializers.Serializer):
    qr_id = serializers.CharField(allow_null=False, allow_blank=False)
    org_name = serializers.CharField(allow_null=False, allow_blank=False)
    org_id = serializers.CharField(allow_null=False, allow_blank=False)
    owner_name = serializers.CharField(allow_null=False, allow_blank=False)
    portfolio_name = serializers.CharField(allow_null=False, allow_blank=False)
    unique_id = serializers.CharField(allow_null=False, allow_blank=False)
    product = serializers.CharField(allow_null=False, allow_blank=False)
    role = serializers.CharField(allow_null=False, allow_blank=False)
    member_type = serializers.CharField(allow_null=False, allow_blank=False)
    toemail = serializers.CharField(allow_null=False, allow_blank=False)
    toname = serializers.CharField(allow_null=False, allow_blank=False)
    subject = serializers.CharField(allow_null=False, allow_blank=False)
    job_role = serializers.CharField(allow_null=False, allow_blank=False)
    data_type = serializers.CharField(allow_null=False, allow_blank=False)
    date_time = serializers.CharField(allow_null=False, allow_blank=False)
    

class UpdateuserSerializer(serializers.Serializer):
    qr_id = serializers.CharField(allow_null=False, allow_blank=False)
    username = serializers.CharField(allow_null=False, allow_blank=False)
    portfolio_name = serializers.CharField(allow_null=False, allow_blank=False)
    job_role = serializers.CharField(allow_null=False, allow_blank=False)
    date_time = serializers.CharField(allow_null=False, allow_blank=False)
    toemail = serializers.CharField(allow_null=False, allow_blank=False)

class ThreadsSerializer(serializers.Serializer):
    thread = serializers.CharField(allow_null=False, allow_blank=False)
    image = serializers.URLField(allow_null=False, allow_blank=False)
    created_by = serializers.CharField(allow_null=False, allow_blank=False)
    team_id = serializers.CharField(allow_null=False, allow_blank=False)
    team_alerted_id = serializers.CharField(allow_null=False, allow_blank=False)
    current_status = serializers.CharField(allow_null=False, allow_blank=False)
    PREVIOUS_STATUS_CHOICE = (("", ""),("Created", "Created"),("In progress", "In progress"), ("Completed", "Completed"), ("Resolved", "Resolved"))

    previous_status =serializers.ListField(child=serializers.ChoiceField(
        choices=PREVIOUS_STATUS_CHOICE, allow_null=False, allow_blank=False, ))

class CommentsSerializer(serializers.Serializer):
    created_by = serializers.CharField(allow_null=False, allow_blank=False)
    comment = serializers.CharField(allow_null=False, allow_blank=False)
    thread_id = serializers.CharField(allow_null=False, allow_blank=False)


class PublicProductURLSerializer(serializers.Serializer):
    public_link_name = serializers.CharField(allow_null=False, allow_blank=False)
    product_url = serializers.URLField(allow_null=False, allow_blank=False)
    qr_ids = serializers.ListField(child=serializers.CharField(allow_null=False, allow_blank=False))
    job_company_id = serializers.CharField(allow_null=False, allow_blank=False)
    company_data_type = serializers.CharField(allow_null=False, allow_blank=False)