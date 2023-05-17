from rest_framework import serializers


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
