from rest_framework import serializers
from database.database_management import *

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
    other_info = serializers.ListField(required=True, allow_empty=False)
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

    def get_fields(self):
        fields = super().get_fields()
        if self.initial_data.get('job_category') != "Freelancer":
            del fields['freelancePlatform']
            del fields["freelancePlatformUrl"]
        return fields


    