from rest_framework import serializers
from .models import *
import json, re
from bson import ObjectId


DATA_TYPE_CHOICE = (
    ("Real_Data", "Real_Data"),
    ("Learning_Data", "Learning_Data"),
    ("Testing_Data", "Testing_Data"),
    ("Archived_Data", "Archived_Data"),
)
JOB_CATEGORY_CHOICE = (
    ("Freelancer", "Freelancer"),
    ("Internship", "Internship"),
    ("Employee", "Employee"),
    ("regional_associate", "regional_associate")
)

STATUS_CATEGORY_CHOICE = (
    ("hired", "hired"),
    ("Removed", "Removed"),
    ("shortlisted", "shortlisted"),
    ("selected", "selected"),
    ("rehire","rehire"),
    ("Rejected","Rejected"),
    ("Pending", "Pending"),
    ("Guest_Pending", "Guest_Pending"),
    ("renew_contract", "renew_contract"),
    ("probationary","probationary"),
    ("to_rehire", "to_rehire"),
    ("teamlead_hire", "teamlead_hire"),
    ("teamlead_rehire", "teamlead_rehire"),
    ("Leave","Leave")   
)

PAYMENT_INTERVAL_CHOICE = (
    ("hour", "hour"),
    ("day", "day"),
    ("week", "week"),
    ("month", "month"),
    ("year", "year"),
)

MODULE_CHOICE = (
        ("Frontend", "Frontend"),
        ("Backend", "Backend"),
        ("UI/UX", "UI/UX"),
        ("Virtual Assistant", "Virtual Assistant"),
        ("Web", "Web"),
        ("Mobile", "Mobile"),
    )

TYPE_OF_JOB_CHOICE = (
        ("Full time", "Full time"),
        ("Part time", "Part time"),
        ("Time based", "Time based"),
        ("Task based", "Task based"),
    )

class IDField(serializers.CharField):
    def to_internal_value(self,value):
        try:
            ObjectId(value)
            return value
        except Exception as e:
            raise serializers.ValidationError(e)   
        
class DateField(serializers.CharField):
    def is_leap_year(self,year):
        if year % 4 == 0:  # Check if the year is evenly divisible by 4
            if year % 100 == 0:  # If divisible by 100, also check if divisible by 400
                if year % 400 == 0:
                    return True
                else:
                    return False
            else:
                return True
        else:
            return False
        
    def to_internal_value(self, value):
        # Check if the value matches the YYYY-MM-DD format
        if not re.match(r"\d{4}-\d{2}-\d{2}", value) or len(value) != 10:
            raise serializers.ValidationError("Date must be in YYYY-MM-DD format")
        
        # Extract month part from the date string
        year, month, day = map(int, value.split('-'))
        
        # Check if the month is within the range of 1 to 12
        if not 1 <= month <= 12:
            raise serializers.ValidationError("Month must be between 1 and 12")
        if month in [1,3,5,7,8,10,12]:
            if not 1 <= day <= 31:
                raise serializers.ValidationError("Day must be between 1 and 31")
        if month in [4,6,9,11]:
            if not 1 <= day <= 30:
                raise serializers.ValidationError("Day must be between 1 and 30")
        if month in [2]:
            if self.is_leap_year(year):
                if not 1 <= day <= 29:
                    raise serializers.ValidationError("Day must be between 1 and 29 for leap year")
            else:
                if not 1 <= day <= 28:
                    raise serializers.ValidationError("Day must be between 1 and 28")
        
        return value
    
#<account serializers__________________________________________________________________________
class AccountSerializer(serializers.Serializer):
    document_id = IDField(allow_null=False, allow_blank=False)
    applicant = serializers.CharField(allow_null=False, allow_blank=False)
    project = serializers.ListField(required=True, allow_empty=False)
    task = serializers.CharField(allow_null=False, allow_blank=False)
    company_id = IDField(allow_null=False, allow_blank=False)
    data_type = serializers.ChoiceField(allow_null=False, allow_blank=False, choices=DATA_TYPE_CHOICE)
    onboarded_on = DateField(allow_null=False, allow_blank=False)

class AccountUpdateSerializer(serializers.Serializer):
    document_id = IDField(allow_null=False, allow_blank=False)
    project = serializers.ListField(required=True, allow_empty=False)
    payment = serializers.CharField(allow_null=False, allow_blank=False)

class RehireSerializer(serializers.Serializer):
    rehire_remarks = serializers.CharField(allow_null=True, allow_blank=True, required=False)
    document_id = IDField(allow_null=False, allow_blank=False)
    rehired_on = DateField(allow_null=False, allow_blank=False)

class RejectSerializer(serializers.Serializer):
    document_id = IDField(allow_null=False, allow_blank=False)
    reject_remarks = serializers.CharField(allow_null=False, allow_blank=False)
    applicant = serializers.CharField(allow_null=False, allow_blank=False)
    company_id = IDField(allow_null=False, allow_blank=False)
    data_type = serializers.ChoiceField(
        allow_null=False, allow_blank=False, choices=DATA_TYPE_CHOICE
    )
    rejected_on = DateField(allow_null=False, allow_blank=False)
    username = serializers.CharField(allow_null=False, allow_blank=False)
#/account serializers>_________________________________________________________________________

#<admin serializers__________________________________________________________________________
class AdminSerializer(serializers.Serializer):
    job_number = serializers.CharField(allow_null=False, allow_blank=False)
    job_title = serializers.CharField(allow_null=False, allow_blank=False)
    description = serializers.CharField(allow_null=False, allow_blank=False)
    qualification = serializers.CharField(allow_null=False, allow_blank=False)
    job_category = serializers.ChoiceField(
        allow_null=False, allow_blank=False, choices=JOB_CATEGORY_CHOICE
    )
    skills = serializers.CharField(allow_null=False, allow_blank=False)
    time_interval = serializers.CharField(allow_null=False, allow_blank=False)
    type_of_job = serializers.ChoiceField(
        allow_null=False, allow_blank=False, choices=TYPE_OF_JOB_CHOICE
    )
    payment = serializers.CharField(allow_null=False, allow_blank=False)
    is_active = serializers.BooleanField(required=True)
    general_terms = serializers.ListField(required=True, allow_empty=False)
    company_id = IDField(allow_null=False, allow_blank=False)
    module = serializers.ChoiceField(
        allow_null=False, allow_blank=False, choices=MODULE_CHOICE
    )
    data_type = serializers.ChoiceField(
        allow_null=False, allow_blank=False, choices=DATA_TYPE_CHOICE
    )
    created_by = serializers.CharField(allow_null=False, allow_blank=False)
    created_on = DateField(allow_null=False, allow_blank=False)
    paymentInterval = serializers.ChoiceField(
        allow_null=False, allow_blank=False, choices=PAYMENT_INTERVAL_CHOICE
    )
    country = serializers.CharField(allow_null=True, allow_blank=True)
    city = serializers.CharField(allow_null=True, allow_blank=True)
    continent = serializers.CharField(allow_null=True, allow_blank=True)
    
class regionalassociateSerializer(serializers.Serializer):
    job_title = serializers.CharField()
    country = serializers.CharField()
    city = serializers.CharField()
    is_active = serializers.BooleanField()
    job_category = serializers.CharField()
    job_number = serializers.CharField(allow_null=False, allow_blank=False)
    skills = serializers.ListField(child=serializers.CharField())
    description = serializers.CharField()
    qualification = serializers.CharField()
    payment = serializers.DecimalField(max_digits=10, decimal_places=2)
    company_id = IDField(allow_null=False, allow_blank=False)
    data_type = serializers.ChoiceField(
        allow_null=False, allow_blank=False, choices=DATA_TYPE_CHOICE
    )
    paymentInterval = serializers.ChoiceField(
        allow_null=False, allow_blank=False, choices=PAYMENT_INTERVAL_CHOICE
    )
    continent = serializers.CharField()
#/admin serializers>________________________________________________________________________

# <candidate serializers__________________________________________________________________
class CandidateSerializer(serializers.Serializer):
    job_number = serializers.CharField(allow_null=False, allow_blank=False)
    job_title = serializers.CharField(allow_null=False, allow_blank=False)
    applicant = serializers.CharField(allow_null=False, allow_blank=False)
    applicant_email = serializers.EmailField(required=True)
    feedBack = serializers.CharField(allow_null=False, allow_blank=False)
    module = serializers.ChoiceField(
        choices=MODULE_CHOICE,
        allow_null=False,
        allow_blank=False,
    )
    academic_qualification_type = serializers.CharField(
        allow_null=False, allow_blank=False
    )
    academic_qualification = serializers.CharField(allow_null=False, allow_blank=False)
    country = serializers.CharField(allow_null=False, allow_blank=False)
    agree_to_all_term = serializers.BooleanField(default=False)
    internet_speed = serializers.CharField(allow_null=True, allow_blank=True)
    payment = serializers.CharField(allow_null=False, allow_blank=False)
    company_id = IDField(allow_null=False, allow_blank=False)
    username = serializers.CharField(allow_null=False, allow_blank=False)
    data_type = serializers.ChoiceField(
        allow_null=False, allow_blank=False, choices=DATA_TYPE_CHOICE
    )
    application_submitted_on = serializers.CharField(
        allow_null=False, allow_blank=False
    )
    job_category = serializers.ChoiceField(
        allow_null=False, allow_blank=False, choices=JOB_CATEGORY_CHOICE
    )
    freelancePlatform = serializers.CharField(allow_null=False, allow_blank=False)
    freelancePlatformUrl = serializers.CharField(allow_null=False, allow_blank=False)
    portfolio_name = serializers.CharField(allow_null=True, allow_blank=True)
    candidate_certificate = serializers.URLField(allow_null=True, allow_blank=True)

    def get_fields(self):
        fields = super().get_fields()
        if self.initial_data.get("job_category") != "Freelancer":
            del fields["freelancePlatform"]
            del fields["freelancePlatformUrl"]
        return fields
# /candidate serializers>__________________________________________________________________

# hr serializers__________________________________________________________________
class ShortlistSerializer(serializers.Serializer):
    document_id = IDField(allow_null=False, allow_blank=False)
    hr_remarks = serializers.CharField(allow_null=False, allow_blank=False)
    applicant = serializers.CharField(allow_null=False, allow_blank=False)
    company_id = IDField(allow_null=False, allow_blank=False)
    data_type = serializers.ChoiceField(
        allow_null=False, allow_blank=False, choices=DATA_TYPE_CHOICE
    )
    shortlisted_on = DateField(allow_null=False, allow_blank=False)

class SelectSerializer(serializers.Serializer):
    document_id = IDField(allow_null=False, allow_blank=False)
    hr_remarks = serializers.CharField(allow_null=False, allow_blank=False)
    project = serializers.CharField(allow_null=False, allow_blank=False)
    product_discord_link = serializers.URLField(allow_null=False, allow_blank=False)
    applicant = serializers.CharField(allow_null=False, allow_blank=False)
    company_id = IDField(allow_null=False, allow_blank=False)
    data_type = serializers.ChoiceField(
        allow_null=False, allow_blank=False, choices=DATA_TYPE_CHOICE
    )
    selected_on = DateField(allow_null=False, allow_blank=False)

# lead serializers_______________________________________________________________
class HireSerializer(serializers.Serializer):
    teamlead_remarks = serializers.CharField(allow_null=False, allow_blank=False)
    status = serializers.ChoiceField(allow_null=False, allow_blank=False,choices=STATUS_CATEGORY_CHOICE)
    applicant = serializers.CharField(allow_null=False, allow_blank=False)
    company_id = IDField(allow_null=False, allow_blank=False)
    data_type = serializers.ChoiceField(allow_null=False, allow_blank=False, choices=DATA_TYPE_CHOICE)
    hired_on = DateField(allow_null=False, allow_blank=False)
    document_id = IDField(allow_null=False, allow_blank=False)

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
    DATA_TYPE_CHOICE = (
        ("Real_Data", "Real_Data"),
        ("Learning_Data", "Learning_Data"),
        ("Testing_Data", "Testing_Data"),
        ("Archived_Data", "Archived_Data"),
    )
    MODULE_CHOICE = (
        ("Frontend", "Frontend"),
        ("Backend", "Backend"),
        ("UI/UX", "UI/UX"),
        ("Virtual Assistant", "Virtual Assistant"),
        ("Web", "Web"),
        ("Mobile", "Mobile"),
    )

    company_id = serializers.CharField(allow_null=False, allow_blank=False)
    data_type = serializers.ChoiceField(
        allow_null=False, allow_blank=False, choices=DATA_TYPE_CHOICE
    )
    question_link = serializers.URLField(allow_null=False)
    module = serializers.ChoiceField(
        choices=MODULE_CHOICE,
        allow_null=False,
        allow_blank=False,
    )
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
    video_link = serializers.URLField(
        allow_null=False, allow_blank=False, required=True
    )
    answer_link = serializers.URLField(
        allow_null=False, allow_blank=False, required=True
    )


# settings serializers______________________________________________________________
class SettingUserProfileInfoSerializer(serializers.ModelSerializer):
    profile_info = serializers.JSONField()

    class Meta:
        model = SettingUserProfileInfo
        fields = "__all__"

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if isinstance(representation["profile_info"], str):
            representation["profile_info"] = json.loads(representation["profile_info"])
        return representation


class UpdateSettingUserProfileInfoSerializer(serializers.ModelSerializer):
    version = serializers.CharField(required=False)

    class Meta:
        model = SettingUserProfileInfo
        fields = ["profile_info", "version"]


class SettingUserProjectSerializer(serializers.ModelSerializer):
    project_list = serializers.JSONField()

    class Meta:
        model = UserProject
        fields = "__all__"

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if isinstance(representation["project_list"], str):
            representation["project_list"] = json.loads(representation["project_list"])
        return representation


class settingUsersubProjectSerializer(serializers.ModelSerializer):
    # subproject_list=serializers.JSONField()

    class Meta:
        model = UsersubProject
        fields = "__all__"


class UpdateSettingUserProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProject
        fields = ["project_list"]


class CreatePublicLinkSerializer(serializers.Serializer):
    qr_ids = serializers.ListField(
        child=serializers.CharField(allow_null=False, allow_blank=False)
    )
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
    PREVIOUS_STATUS_CHOICE = (
        ("", ""),
        ("Created", "Created"),
        ("In progress", "In progress"),
        ("Completed", "Completed"),
        ("Resolved", "Resolved"),
    )

    thread_title = serializers.CharField(allow_null=False, allow_blank=False)
    thread = serializers.CharField(allow_null=False, allow_blank=False)
    image = serializers.URLField(allow_null=False, allow_blank=True)
    created_by = serializers.CharField(allow_null=False, allow_blank=False)
    team_id = serializers.CharField(allow_null=False, allow_blank=False)
    team_alerted_id = serializers.CharField(allow_null=False, allow_blank=False)
    current_status = serializers.CharField(allow_null=False, allow_blank=False)
    previous_status = serializers.ListField(
        child=serializers.ChoiceField(
            choices=PREVIOUS_STATUS_CHOICE,
            allow_null=False,
            allow_blank=False,
        )
    )
    THREAD_TYPE = (("BUG", "BUG"), ("SUGGESTION", "SUGGESTION"))
    thread_type = serializers.ChoiceField(
        allow_null=False, allow_blank=False, choices=THREAD_TYPE
    )
    actual_product_behavior = serializers.CharField(allow_null=False, allow_blank=False)
    expected_product_behavior = serializers.CharField(
        allow_null=False, allow_blank=False
    )
    steps_to_reproduce_thread = serializers.CharField(
        allow_null=False, allow_blank=False
    )
    user_id = serializers.CharField(allow_null=False, allow_blank=False)


class CommentsSerializer(serializers.Serializer):
    created_by = serializers.CharField(allow_null=False, allow_blank=False)
    comment = serializers.CharField(allow_null=False, allow_blank=False)
    thread_id = serializers.CharField(allow_null=False, allow_blank=False)
    user_id = serializers.CharField(allow_null=False, allow_blank=False)


class PublicProductURLSerializer(serializers.Serializer):
    public_link_name = serializers.CharField(allow_null=False, allow_blank=False)
    product_url = serializers.URLField(allow_null=False, allow_blank=False)
    qr_ids = serializers.ListField(
        child=serializers.CharField(allow_null=False, allow_blank=False)
    )
    job_company_id = serializers.CharField(allow_null=False, allow_blank=False)
    company_data_type = serializers.CharField(allow_null=False, allow_blank=False)


class UpdatePaymentStatusSerializer(serializers.Serializer):
    payment_requested = serializers.BooleanField(required=True, allow_null=False)
    current_payment_request_status = serializers.CharField(
        allow_null=False, allow_blank=False
    )


class TaskModuleSerializer(serializers.Serializer):
    TASK_TYPE = (
        ("MEETING UPDATE", "MEETING UPDATE"),
        ("TASK UPDATE", "TASK UPDATE"),
    )
    project = serializers.CharField(allow_null=False, allow_blank=False)
    task_type = serializers.ChoiceField(
        allow_null=False, allow_blank=False, choices=TASK_TYPE
    )
    task_image = serializers.URLField(allow_null=True)
    applicant = serializers.CharField(allow_null=False, allow_blank=False)
    task = serializers.CharField(allow_null=False, allow_blank=False)
    task_added_by = serializers.CharField(allow_null=False, allow_blank=False)
    data_type = serializers.CharField(allow_null=True, allow_blank=True)
    company_id = serializers.CharField(allow_null=True, allow_blank=True)
    task_created_date = serializers.DateField(allow_null=True)
    start_time = serializers.TimeField(allow_null=False)
    end_time = serializers.TimeField(allow_null=False)
    user_id = serializers.CharField(allow_null=True, allow_blank=True)


class GetCandidateTaskSerializer(serializers.Serializer):
    company_id = serializers.CharField(allow_null=False, allow_blank=False)
    user_id = serializers.CharField(allow_null=False, allow_blank=False)
    data_type = serializers.CharField(allow_null=False, allow_blank=False)
    task_created_date = serializers.DateField(allow_null=True)


class GetAllCandidateTaskSerializer(serializers.Serializer):
    company_id = serializers.CharField(allow_null=False, allow_blank=False)
    data_type = serializers.CharField(allow_null=False, allow_blank=False)
    # project=serializers.CharField(allow_null=False,allow_blank=False)
    # task_created_date = serializers.DateField(allow_null=True)


class UpdateTaskByCandidateSerializer(serializers.Serializer):
    TASK_TYPE = (
        ("MEETING UPDATE", "MEETING UPDATE"),
        ("TASK UPDATE", "TASK UPDATE"),
    )
    project = serializers.CharField(allow_null=False, allow_blank=False)
    task_type = serializers.ChoiceField(
        allow_null=False, allow_blank=False, choices=TASK_TYPE
    )
    task_id = serializers.CharField(allow_null=False, allow_blank=False)
    task = serializers.CharField(allow_null=False, allow_blank=False)
    data_type = serializers.CharField(allow_null=True, allow_blank=True)
    company_id = serializers.CharField(allow_null=True, allow_blank=True)
    task_created_date = serializers.DateField(allow_null=True)
    start_time = serializers.TimeField(allow_null=False)
    end_time = serializers.TimeField(allow_null=False)
    user_id = serializers.CharField(allow_null=True, allow_blank=True)


class ReportSerializer(serializers.Serializer):
    REPORT_TYPE = (
        ("Admin", "Admin"),
        ("Hr", "Hr"),
        ("Account", "Account"),
        ("Candidate", "Candidate"),
        ("Team", "Team"),
        ("Lead", "Lead"),
        ("Individual", "Individual"),
        ("Individual Task", "Individual Task"),
        ("Project", "Project"),
        ("Public", "Public"),
        ("Level", "Level"),
    )
    report_type = serializers.ChoiceField(
        allow_null=False, allow_blank=False, choices=REPORT_TYPE
    )


class ProjectWiseReportSerializer(serializers.Serializer):
    project = serializers.CharField(allow_null=False, allow_blank=False)
    company_id = serializers.CharField(allow_null=True, allow_blank=True)


class githubinfoserializer(serializers.Serializer):
    username = serializers.CharField(allow_null=False, allow_blank=False)
    github_id = serializers.CharField(allow_null=False, allow_blank=False)
    github_link = serializers.URLField(allow_null=False, allow_blank=False)


class TaskApprovedBySerializer(serializers.Serializer):
    task_approved_by = serializers.CharField(allow_null=False, allow_blank=False)


class ProjectDeadlineSerializer(serializers.Serializer):
    project = serializers.CharField(allow_null=False, allow_blank=False)
    company_id = serializers.CharField(allow_null=True, allow_blank=True)
    lead_name = serializers.CharField(allow_null=True, allow_blank=True)
    total_time = serializers.IntegerField()



class TeamTaskSerializer(serializers.Serializer):
    title = serializers.CharField(allow_null=False, allow_blank=False)
    description = serializers.CharField(allow_null=False, allow_blank=False)
    task_image = serializers.URLField(allow_null=True)
    assignee = serializers.ListField(
        child=serializers.CharField(allow_null=False, allow_blank=False)
    )
    team_id = serializers.CharField(allow_null=False, allow_blank=False)
    task_created_date = serializers.CharField(allow_null=False, allow_blank=False)
    subtasks = serializers.DictField(allow_null=True)
    user_id = serializers.CharField(allow_null=False, allow_blank=False)


class DashBoardStatusSerializer(serializers.Serializer):
    STATUS_CATEGORY_CHOICE = (
        ("hired", "hired"),
        ("Removed", "Removed"),
        ("shortlisted", "Shortlisted"),
        ("selected", "Selected"),
        ("Rejected", "Rejected"),
        ("to_rehire", "to_rehire"),
        ("teamlead_hire", "teamlead_hire"),
        ("teamlead_rehire", "teamlead_rehire"),
        ("Pending", "Pending"),
        ("Guest_Pending", "Guest_Pending"),
        ("rehired", "rehired"),
        ("renew_contract", "renew_contract"),
    )
    candidate_id = serializers.CharField(allow_null=False, allow_blank=False)
    status = serializers.ChoiceField(
        allow_null=False, allow_blank=False, choices=STATUS_CATEGORY_CHOICE
    )


class DashBoardJobCategorySerializer(serializers.Serializer):
    JOB_CATEGORY_CHOICE = (
        ("Freelancer", "Freelancer"),
        ("Internship", "Internship"),
        ("Employee", "Employee"),
    )
    candidate_id = serializers.CharField(allow_null=False, allow_blank=False)
    job_category = serializers.ChoiceField(
        allow_null=False, allow_blank=False, choices=JOB_CATEGORY_CHOICE
    )


class SubtaskSerializer(serializers.Serializer):
    subtask = serializers.CharField()
    hours = serializers.FloatField()


class GroupLeadAgendaSerializer(serializers.Serializer):
    project = serializers.CharField(max_length=255, allow_null=False, allow_blank=False)
    sub_project = serializers.CharField(
        max_length=255, allow_null=False, allow_blank=False
    )
    lead_name = serializers.CharField(
        max_length=255, allow_null=False, allow_blank=False
    )
    company_id = serializers.CharField(
        max_length=255, allow_null=False, allow_blank=False
    )
    agenda_title = serializers.CharField(
        max_length=255, allow_null=False, allow_blank=False
    )
    agenda_description = serializers.CharField(
        max_length=10000, allow_null=False, allow_blank=False
    )
    week_start = serializers.DateField(allow_null=False)
    week_end = serializers.DateField(allow_null=False)
    total_time = serializers.FloatField(allow_null=False)
    aggregate_agenda = serializers.CharField(
        max_length=10000, allow_null=False, allow_blank=False
    )
    timeline = serializers.ListField(child=serializers.JSONField())


class GetWeeklyAgendaByIdSerializer(serializers.Serializer):
    document_id = serializers.CharField(
        max_length=255, allow_null=False, allow_blank=False
    )
    limit = serializers.IntegerField(allow_null=True)
    offset = serializers.IntegerField(allow_null=True)
    # project = serializers.CharField(max_length=255,allow_null=False,allow_blank=False)


class GetWeeklyAgendasSerializer(serializers.Serializer):
    limit = serializers.IntegerField(allow_null=True)
    offset = serializers.IntegerField(allow_null=True)
    # project = serializers.CharField(max_length=255,allow_null=True,allow_blank=True)
    sub_project = serializers.CharField(
        max_length=255, allow_null=False, allow_blank=False
    )


class TaskDetailsInputSerializer(serializers.Serializer):
    task_created_date = serializers.DateField()
    end_date = serializers.DateField()
    user_id = serializers.IntegerField()
    company_id = serializers.CharField()


class AddProjectTimeSerializer(serializers.Serializer):
    project = serializers.CharField(max_length=255, allow_null=False, allow_blank=False)
    company_id = serializers.CharField(
        max_length=255, allow_null=False, allow_blank=False
    )
    total_time = serializers.FloatField(allow_null=False)
    lead_name = serializers.CharField(
        max_length=255, allow_null=False, allow_blank=False
    )
    data_type = serializers.CharField(
        max_length=255, allow_null=False, allow_blank=False
    )
    editing_enabled = serializers.BooleanField(allow_null=False)


class UpdateProjectTimeSerializer(serializers.Serializer):
    document_id = serializers.CharField(
        max_length=255, allow_null=False, allow_blank=False
    )
    total_time = serializers.FloatField(allow_null=False)


class UpdateProjectSpentTimeSerializer(serializers.Serializer):
    project = serializers.CharField(max_length=255, allow_null=False, allow_blank=False)
    company_id = serializers.CharField(
        max_length=255, allow_null=False, allow_blank=False
    )
    spent_time = serializers.FloatField(allow_null=False)


class UpdateProjectTimeEnabledSerializer(serializers.Serializer):
    document_id = serializers.CharField(
        max_length=255, allow_null=False, allow_blank=False
    )
    editing_enabled = serializers.BooleanField(allow_null=False)


class leaveapplyserializers(serializers.Serializer):
    leave_start_date = serializers.DateField(allow_null=False)
    leave_end_date = serializers.DateField(allow_null=False)
    project = serializers.CharField(max_length=255, allow_null=False)
    user_id = serializers.CharField(max_length=255, allow_null=False)
    applicant = serializers.CharField(max_length=255, allow_null=False)
    email = serializers.EmailField(allow_null=False)
    company_id = serializers.CharField(
        max_length=255, allow_null=False, allow_blank=False
    )
    data_type = serializers.ChoiceField(
        allow_null=False, required=False, allow_blank=False, choices=DATA_TYPE_CHOICE
    )
    Leave_Approval = serializers.BooleanField(allow_null=False, default=False)


class leaveapproveserializers(serializers.Serializer):
    user_id = serializers.CharField(allow_null=False)
    leave_id = serializers.CharField(allow_null=False)


class AddCollectionSerializer(serializers.Serializer):
    db_name = serializers.CharField(max_length=100)
    api_key = serializers.CharField(max_length=100)
    coll_names = serializers.CharField()
    num_collections = serializers.IntegerField()


class agendaapproveserializer(serializers.Serializer):
    agenda_id = serializers.CharField(max_length=200)
    sub_project = serializers.CharField(max_length=200)


class SubprojectSerializer(serializers.Serializer):
    company_id = serializers.CharField(max_length=200)
    parent_project = serializers.CharField(max_length=200)


class AttendanceSerializer(serializers.Serializer):
    user_present = serializers.ListField(child=serializers.CharField())
    user_absent = serializers.ListField(child=serializers.CharField())
    date_taken = serializers.DateField(allow_null=False)
    company_id = serializers.CharField(max_length=255, allow_null=False)
    event_id = serializers.CharField(allow_null=False)
    project = serializers.CharField(allow_null=False)
    data_type = serializers.ChoiceField(
        allow_null=False, required=False, allow_blank=False, choices=DATA_TYPE_CHOICE
    )


class AttendanceRetrievalSerializer(serializers.Serializer):
    start_date = serializers.DateField(allow_null=False)
    end_date = serializers.DateField(allow_null=False)
    project = serializers.CharField(max_length=255, allow_null=False)
    company_id = serializers.CharField(allow_null=False)
    meeting = serializers.CharField(allow_null=False)
    project = serializers.ListField(allow_null=False)
    data_type = serializers.ChoiceField(
        allow_null=False, required=False, allow_blank=False, choices=DATA_TYPE_CHOICE
    )


class IndividualAttendanceRetrievalSerializer(serializers.Serializer):
    start_date = serializers.DateField(allow_null=False)
    end_date = serializers.DateField(allow_null=False)
    project = serializers.CharField(max_length=255, allow_null=False)
    usernames = serializers.ListField(allow_null=False)
    company_id = serializers.CharField(allow_null=False)
    meeting = serializers.CharField(allow_null=False)
    project = serializers.CharField(allow_null=False)
    data_type = serializers.ChoiceField(
        allow_null=False, required=False, allow_blank=False, choices=DATA_TYPE_CHOICE
    )


class UpdateAttendanceSerializer(serializers.Serializer):
    user_present = serializers.ListField(child=serializers.CharField())
    user_absent = serializers.ListField(child=serializers.CharField())
    date_taken = serializers.DateField(allow_null=False)
    document_id = serializers.CharField(
        max_length=255, allow_null=False, allow_blank=False
    )


class Project_Update_Serializer(serializers.Serializer):
    project = serializers.ListField(allow_null=False)
    candidate_id = serializers.CharField(allow_null=False)
    company_id = serializers.CharField(allow_null=False)


class WeeklyAgendaDateReportSerializer(serializers.Serializer):
    subproject_name = serializers.CharField(max_length=255, allow_null=False)
    company_id = serializers.CharField(max_length=255, allow_null=False)


class CompanyStructureAddCeoSerializer(serializers.Serializer):
    company_id = serializers.CharField(max_length=255, allow_null=False)
    company_name = serializers.CharField(max_length=255, allow_null=False)
    ceo = serializers.CharField(max_length=255, allow_null=False)


class CompanyStructureUpdateCeoSerializer(serializers.Serializer):
    company_id = serializers.CharField(max_length=255, allow_null=False)
    company_name = serializers.CharField(max_length=255, allow_null=False)
    previous_ceo = serializers.CharField(
        max_length=255, allow_null=False, required=False
    )
    current_ceo = serializers.CharField(
        max_length=255, allow_null=False, required=False
    )
    DATA_TYPE_CHOICE = (
        ("Real_Data", "Real_Data"),
        ("Archived_Data", "Archived_Data"),
    )
    data_type = serializers.ChoiceField(
        allow_null=False, required=False, allow_blank=False, choices=DATA_TYPE_CHOICE
    )


class CompanyStructureAddProjectLeadSerializer(serializers.Serializer):
    company_id = serializers.CharField(max_length=255, allow_null=False)
    project_lead = serializers.CharField(max_length=255, allow_null=False)
    projects_managed = serializers.ListField(allow_null=False)


class CompanyStructureUpdateProjectLeadSerializer(serializers.Serializer):
    company_id = serializers.CharField(max_length=255, allow_null=False)
    project_lead = serializers.CharField(max_length=255, allow_null=False)
    projects_managed = serializers.ListField(allow_null=False, required=True)
    DATA_TYPE_CHOICE = (
        ("Real_Data", "Real_Data"),
        ("Archived_Data", "Archived_Data"),
    )
    data_type = serializers.ChoiceField(
        allow_null=False, required=False, allow_blank=False, choices=DATA_TYPE_CHOICE
    )


class CompanyStructureProjectsSerializer(serializers.Serializer):
    project = serializers.CharField(max_length=255, allow_null=False)
    company_id = serializers.CharField(max_length=255, allow_null=False)
    team_lead = serializers.CharField(max_length=255, allow_null=True, required=False)
    members = serializers.ListField(allow_null=True, required=False)
    group_leads = serializers.ListField(allow_null=True, required=False)


class WorklogsDateSerializer(serializers.Serializer):
    company_id = serializers.CharField(max_length=255, allow_null=False)
    user_id = serializers.CharField(max_length=255, allow_null=False)
    data_type = serializers.ChoiceField(
        allow_null=False, required=False, allow_blank=False, choices=DATA_TYPE_CHOICE
    )


class UpdateUserIdSerializer(serializers.Serializer):
    user_id = serializers.CharField(max_length=255, allow_null=False)
    data_type = serializers.ChoiceField(
        allow_null=False, allow_blank=False, choices=DATA_TYPE_CHOICE
    )
    application_id = serializers.CharField(max_length=255, allow_null=False)


class InsertPaymentInformation(serializers.Serializer):
    weekly_payment_amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    payment_currency = serializers.CharField(max_length=10)
    last_payment_date = serializers.DateField()
    current_payment_amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    db_record_type = serializers.CharField()
    previous_weekly_amounts = serializers.ListField(
        child=serializers.DecimalField(max_digits=10, decimal_places=2)
    )


class IndividualAttendanceRetrievalSerializer(serializers.Serializer):
    start_date = serializers.DateField(allow_null=False)
    end_date = serializers.DateField(allow_null=False)
    project = serializers.CharField(max_length=255, allow_null=False)
    usernames = serializers.ListField(allow_null=False)
    company_id = serializers.CharField(allow_null=False)
    data_type = serializers.ChoiceField(
        allow_null=False, required=False, allow_blank=False, choices=DATA_TYPE_CHOICE
    )


class UpdateAttendanceSerializer(serializers.Serializer):
    user_present = serializers.ListField(child=serializers.CharField())
    user_absent = serializers.ListField(child=serializers.CharField())
    date_taken = serializers.DateField(allow_null=False)
    document_id = serializers.CharField(
        max_length=255, allow_null=False, allow_blank=False
    )


class GetEventAttendanceSerializer(serializers.Serializer):
    event_id = serializers.CharField(
        max_length=255, allow_null=False, allow_blank=False
    )
    project = serializers.CharField(max_length=255, allow_null=False, allow_blank=False)
    date_taken = serializers.DateField(allow_null=False)


class AddEventSerializer(serializers.Serializer):
    company_id = serializers.CharField(max_length=225, allow_null=False)
    event_name = serializers.CharField(max_length=225, allow_null=False)
    event_type = serializers.ChoiceField(choices=("Meeting", "Event"), allow_null=False)
    event_frequency = serializers.ChoiceField(
        allow_null=False,
        choices=(
            "daily",
            "weekly",
            "twice_a_week",
            "monthly",
            "once_in_two_months",
            "yearly",
            "custom",
        ),
    )
    event_host = serializers.CharField(max_length=225, allow_null=False)
    data_type = serializers.ChoiceField(
        allow_null=False, allow_blank=False, choices=DATA_TYPE_CHOICE
    )
    is_mendatory = serializers.BooleanField(allow_null=False)


class UpdateEventSerializer(serializers.Serializer):
    company_id = serializers.CharField(max_length=225, allow_null=False)
    event_frequency = serializers.ChoiceField(
        allow_null=False,
        choices=(
            "daily",
            "weekly",
            "twice_a_week",
            "monthly",
            "once_in_two_months",
            "yearly",
            "custom",
        ),
    )
    document_id = serializers.CharField(allow_null=False, allow_blank=False)


class GetEventSerializer(serializers.Serializer):
    company_id = serializers.CharField(max_length=225, allow_null=False)
    data_type = serializers.ChoiceField(
        allow_null=True, required=False, allow_blank=True, choices=DATA_TYPE_CHOICE
    )


class PaymentSerializer(serializers.Serializer):
    PAYMENT_MONTH_CHOICE = (
        ("January", "January"),
        ("February", "February"),
        ("March", "March"),
        ("April", "April"),
        ("May", "May"),
        ("June", "June"),
        ("July", "July"),
        ("August", "August"),
        ("September", "September"),
        ("October", "October"),
        ("November", "November"),
        ("December", "December"),
    )
    user_id = serializers.CharField(max_length=100)
    payment_month = serializers.ChoiceField(choices=PAYMENT_MONTH_CHOICE)
    payment_year = serializers.IntegerField(min_value=1)
    number_of_leave_days = serializers.IntegerField(min_value=0)
    approved_logs_count = serializers.IntegerField(min_value=0)
    total_logs_required = serializers.IntegerField(min_value=0)
    payment_from = serializers.DateField(format="%Y-%m-%d")
    payment_to = serializers.DateField(format="%Y-%m-%d")

    def validate(self, data):
        payment_from = data.get("payment_from")
        payment_to = data.get("payment_to")

        if payment_from and payment_to:
            if payment_from >= payment_to:
                raise serializers.ValidationError(
                    "payment_from must be before payment_to."
                )
        return data
