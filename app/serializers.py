from rest_framework import serializers
from .models import *
import json


# account serializers__________________________________________________________________________
class AccountSerializer(serializers.Serializer):
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
    )

    applicant = serializers.CharField(allow_null=False, allow_blank=False)
    project = serializers.ListField(required=True, allow_empty=False)
    task = serializers.CharField(allow_null=False, allow_blank=False)
    status = serializers.CharField(allow_null=False, allow_blank=False)
    company_id = serializers.CharField(allow_null=False, allow_blank=False)
    data_type = serializers.ChoiceField(
        allow_null=False, allow_blank=False, choices=DATA_TYPE_CHOICE
    )
    onboarded_on = serializers.CharField(allow_null=False, allow_blank=False)


class RejectSerializer(serializers.Serializer):
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
    )

    document_id = serializers.CharField(allow_null=False, allow_blank=False)
    reject_remarks = serializers.CharField(allow_null=False, allow_blank=False)
    applicant = serializers.CharField(allow_null=False, allow_blank=False)
    company_id = serializers.CharField(allow_null=False, allow_blank=False)
    data_type = serializers.ChoiceField(
        allow_null=False, allow_blank=False, choices=DATA_TYPE_CHOICE
    )
    rejected_on = serializers.CharField(allow_null=False, allow_blank=False)
    username = serializers.CharField(allow_null=False, allow_blank=False)


# admin serializers__________________________________________________________________________
class AdminSerializer(serializers.Serializer):
    JOB_CATEGORY_CHOICE = (
        ("Freelancer", "Freelancer"),
        ("Internship", "Internship"),
        ("Employee", "Employee"),
    )

    TYPE_OF_JOB_CHOICE = (
        ("Full time", "Full time"),
        ("Part time", "Part time"),
        ("Time based", "Time based"),
        ("Task based", "Task based"),
    )

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
    paymentInterval_choice = (
        ("hour", "hour"),
        ("day", "day"),
        ("week", "week"),
        ("month", "month"),
        ("year", "year"),
    )

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
    company_id = serializers.CharField(allow_null=False, allow_blank=False)
    module = serializers.ChoiceField(
        allow_null=False, allow_blank=False, choices=MODULE_CHOICE
    )
    data_type = serializers.ChoiceField(
        allow_null=False, allow_blank=False, choices=DATA_TYPE_CHOICE
    )
    created_by = serializers.CharField(allow_null=False, allow_blank=False)
    created_on = serializers.CharField(allow_null=False, allow_blank=False)
    paymentInterval = serializers.ChoiceField(
        allow_null=False, allow_blank=False, choices=paymentInterval_choice
    )
    country = serializers.CharField(allow_null=True, allow_blank=True)
    city = serializers.CharField(allow_null=True, allow_blank=True)
    continent = serializers.CharField(allow_null=True, allow_blank=True)


# candidate serializers__________________________________________________________________
class CandidateSerializer(serializers.Serializer):
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
    )

    MODULE_CHOICE = (
        ("Frontend", "Frontend"),
        ("Backend", "Backend"),
        ("UI/UX", "UI/UX"),
        ("Virtual Assistant", "Virtual Assistant"),
        ("Web", "Web"),
        ("Mobile", "Mobile"),
    )

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
    academic_qualification = serializers.CharField(
        allow_null=False, allow_blank=False)
    country = serializers.CharField(allow_null=False, allow_blank=False)
    agree_to_all_term = serializers.BooleanField(default=False)
    internet_speed = serializers.CharField(allow_null=True, allow_blank=True)
    payment = serializers.CharField(allow_null=False, allow_blank=False)
    company_id = serializers.CharField(allow_null=False, allow_blank=False)
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
    freelancePlatform = serializers.CharField(
        allow_null=False, allow_blank=False)
    freelancePlatformUrl = serializers.CharField(
        allow_null=False, allow_blank=False)
    portfolio_name = serializers.CharField(allow_null=True, allow_blank=True)
    candidate_certificate=serializers.URLField(allow_null=True,allow_blank=True)

    def get_fields(self):
        fields = super().get_fields()
        if self.initial_data.get("job_category") != "Freelancer":
            del fields["freelancePlatform"]
            del fields["freelancePlatformUrl"]
        return fields


# hr serializers__________________________________________________________________
class HRSerializer(serializers.Serializer):
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
    )

    document_id = serializers.CharField(allow_null=False, allow_blank=False)
    hr_remarks = serializers.CharField(allow_null=False, allow_blank=False)
    status = serializers.CharField(allow_null=False, allow_blank=False)
    applicant = serializers.CharField(allow_null=False, allow_blank=False)
    company_id = serializers.CharField(allow_null=False, allow_blank=False)
    data_type = serializers.ChoiceField(
        allow_null=False, allow_blank=False, choices=DATA_TYPE_CHOICE
    )
    shortlisted_on = serializers.CharField(allow_null=False, allow_blank=False)


# lead serializers_______________________________________________________________
class LeadSerializer(serializers.Serializer):
    DATA_TYPE_CHOICE = (
        ("Real_Data", "Real_Data"),
        ("Learning_Data", "Learning_Data"),
        ("Testing_Data", "Testing_Data"),
        ("Archived_Data", "Archived_Data"),
    )

    teamlead_remarks = serializers.CharField(
        allow_null=False, allow_blank=False)
    status = serializers.CharField(allow_null=False, allow_blank=False)
    applicant = serializers.CharField(allow_null=False, allow_blank=False)
    company_id = serializers.CharField(allow_null=False, allow_blank=False)
    data_type = serializers.ChoiceField(
        allow_null=False, allow_blank=False, choices=DATA_TYPE_CHOICE
    )
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
            representation["profile_info"] = json.loads(
                representation["profile_info"])
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
            representation["project_list"] = json.loads(
                representation["project_list"])
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
    company_data_type = serializers.CharField(
        allow_null=False, allow_blank=False)


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
    team_alerted_id = serializers.CharField(
        allow_null=False, allow_blank=False)
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
    actual_product_behavior = serializers.CharField(
        allow_null=False, allow_blank=False)
    expected_product_behavior = serializers.CharField(
        allow_null=False, allow_blank=False
    )
    steps_to_reproduce_thread = serializers.CharField(
        allow_null=False, allow_blank=False
    )


class CommentsSerializer(serializers.Serializer):
    created_by = serializers.CharField(allow_null=False, allow_blank=False)
    comment = serializers.CharField(allow_null=False, allow_blank=False)
    thread_id = serializers.CharField(allow_null=False, allow_blank=False)


class PublicProductURLSerializer(serializers.Serializer):
    public_link_name = serializers.CharField(
        allow_null=False, allow_blank=False)
    product_url = serializers.URLField(allow_null=False, allow_blank=False)
    qr_ids = serializers.ListField(
        child=serializers.CharField(allow_null=False, allow_blank=False)
    )
    job_company_id = serializers.CharField(allow_null=False, allow_blank=False)
    company_data_type = serializers.CharField(
        allow_null=False, allow_blank=False)


class UpdatePaymentStatusSerializer(serializers.Serializer):
    payment_requested = serializers.BooleanField(
        required=True, allow_null=False)
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
    task_approved_by = serializers.CharField(
        allow_null=False, allow_blank=False)


class ProjectDeadlineSerializer(serializers.Serializer):
    project = serializers.CharField(allow_null=False, allow_blank=False)
    company_id = serializers.CharField(allow_null=True, allow_blank=True)
    lead_name = serializers.CharField(allow_null=True, allow_blank=True)
    total_time = serializers.IntegerField()


class regionalassociateSerializer(serializers.Serializer):
    JOB_CATEGORY_CHOICE = (
        ("Freelancer", "Freelancer"),
        ("Internship", "Internship"),
        ("Employee", "Employee"),
        ("regional_associate","regional_associate")
    )
    DATA_TYPE_CHOICE = (
        ("Real_Data", "Real_Data"),
        ("Learning_Data", "Learning_Data"),
        ("Testing_Data", "Testing_Data"),
        ("Archived_Data", "Archived_Data"),
    )
    paymentInterval_choice = (
        ("hour", "hour"),
        ("day", "day"),
        ("week", "week"),
        ("month", "month"),
        ("year", "year"),
    )
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
    company_id = serializers.CharField(allow_null=True, allow_blank=True)
    data_type = serializers.ChoiceField(
        allow_null=False, allow_blank=False, choices=DATA_TYPE_CHOICE
    )
    paymentInterval = serializers.ChoiceField(
        allow_null=False, allow_blank=False, choices=paymentInterval_choice
    )


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
        ("Guest_Pending","Guest_Pending"),
        ("rehired","rehired"),
        ("renew_contract","renew_contract")
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
    project = serializers.CharField(max_length=255,allow_null=False,allow_blank=False)
    sub_project = serializers.CharField(max_length=255,allow_null=False,allow_blank=False)
    lead_name = serializers.CharField(max_length=255,allow_null=False,allow_blank=False)
    company_id = serializers.CharField(max_length=255,allow_null=False,allow_blank=False)
    agenda_title=serializers.CharField(max_length=255,allow_null=False,allow_blank=False)
    agenda_description=serializers.CharField(max_length=10000,allow_null=False,allow_blank=False)
    week_start=serializers.DateField(allow_null=False)
    week_end=serializers.DateField(allow_null=False)
    total_time=serializers.FloatField(allow_null=False)
    aggregate_agenda=serializers.CharField(max_length=10000,allow_null=False,allow_blank=False)
    timeline = serializers.ListField(child=serializers.JSONField())

class GetWeeklyAgendaByIdSerializer(serializers.Serializer):
    document_id = serializers.CharField(max_length=255,allow_null=False,allow_blank=False)
    limit = serializers.IntegerField(allow_null=True)
    offset = serializers.IntegerField(allow_null=True)
    # project = serializers.CharField(max_length=255,allow_null=False,allow_blank=False)

class GetWeeklyAgendasSerializer(serializers.Serializer):
    limit = serializers.IntegerField(allow_null=True)
    offset = serializers.IntegerField(allow_null=True)
    # project = serializers.CharField(max_length=255,allow_null=True,allow_blank=True)
    sub_project = serializers.CharField(max_length=255,allow_null=False,allow_blank=False)

class TaskDetailsInputSerializer(serializers.Serializer):
    task_created_date = serializers.DateField()
    end_date = serializers.DateField()
    user_id = serializers.IntegerField()
    company_id = serializers.IntegerField()

class AddProjectTimeSerializer(serializers.Serializer):
    project = serializers.CharField(max_length=255,allow_null=False,allow_blank=False)
    company_id = serializers.CharField(max_length=255,allow_null=False,allow_blank=False)
    total_time = serializers.FloatField(allow_null=False)
    lead_name = serializers.CharField(max_length=255,allow_null=False,allow_blank=False)
    data_type = serializers.CharField(max_length=255,allow_null=False,allow_blank=False)
    editing_enabled = serializers.BooleanField(allow_null=False)
    
class UpdateProjectTimeSerializer(serializers.Serializer):
    document_id = serializers.CharField(max_length=255,allow_null=False,allow_blank=False)
    total_time = serializers.FloatField(allow_null=False)

class UpdateProjectSpentTimeSerializer(serializers.Serializer):
    project = serializers.CharField(max_length=255,allow_null=False,allow_blank=False)
    company_id = serializers.CharField(max_length=255,allow_null=False,allow_blank=False)
    spent_time = serializers.FloatField(allow_null=False)
       
class UpdateProjectTimeEnabledSerializer(serializers.Serializer):
    document_id = serializers.CharField(max_length=255,allow_null=False,allow_blank=False)
    editing_enabled = serializers.BooleanField(allow_null=False)

class leaveapplyserializers(serializers.Serializer):
    leave_start_date=serializers.DateField(allow_null=False)
    leave_end_date=serializers.DateField(allow_null=False)
    project=serializers.CharField(max_length=255,allow_null=False)
    applicant_id=serializers.CharField(max_length=255,allow_null=False)
    applicant=serializers.CharField(max_length=255,allow_null=False)
    email=serializers.EmailField(allow_null=False)
    company_id = serializers.CharField(max_length=255,allow_null=False,allow_blank=False)

class leaveapproveserializers(serializers.Serializer):
    leave_start=serializers.DateField(allow_null=False)
    leave_end=serializers.DateField(allow_null=False)
    applicant_id=serializers.CharField(allow_null=False)


class AddCollectionSerializer(serializers.Serializer):
    db_name = serializers.CharField(max_length=100)
    api_key = serializers.CharField(max_length=100)
    coll_names = serializers.CharField()
    num_collections = serializers.IntegerField()

class agendaapproveserializer(serializers.Serializer):
    agenda_id=serializers.CharField(max_length=200)
    sub_project=serializers.CharField(max_length=200)

class SubprojectSerializer(serializers.Serializer):
    company_id=serializers.CharField(max_length=200)
    parent_project=serializers.CharField(max_length=200)
    
class AttendanceSerializer(serializers.Serializer):
    applicant_usernames = serializers.ListField(child=serializers.CharField())
    start_date = serializers.DateField(allow_null=False)
    end_date = serializers.DateField(allow_null=False)
    company_id = serializers.IntegerField(allow_null=False)
    meeting = serializers.ListField(child=serializers.CharField())


class Project_Update_Serializer(serializers.Serializer):
    project=serializers.ListField(allow_null=False)
    candidate_id=serializers.CharField(allow_null=False)
    company_id=serializers.CharField(allow_null=False)
class WeeklyAgendaDateReportSerializer(serializers.Serializer):
    subproject_name = serializers.CharField(max_length=255,allow_null=False)
    company_id = serializers.CharField(max_length=255,allow_null=False)
    