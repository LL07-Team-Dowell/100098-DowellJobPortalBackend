from rest_framework import serializers


class AdminSerializer(serializers.Serializer):
    JOB_CATEGORY_CHOICE = (("Freelancer", "Freelancer"),
                           ("Internship", "Internship"), ("Employee", "Employee"))
    
    TYPE_OF_JOB_CHOICE = (("Full time", "Full time"),
                          ("Part time", "Part time"), ("Time based", "Time based"))
    
    DATA_TYPE_CHOICE = (("Real_Data", "Real_Data"), ("Learning_Data", "Learning_Data"),
                        ("Testing_Data", "Testing_Data"), ("Archived_Data", "Archived_Data"))
    
    job_number = serializers.CharField(allow_null=False, allow_blank=False)
    job_title = serializers.CharField(allow_null=False, allow_blank=False)
    description = serializers.CharField(allow_null=False, allow_blank=False)
    qualification = serializers.CharField(allow_null=False, allow_blank=False)
    job_category = serializers.ChoiceField(allow_null=False, allow_blank=False, choices=JOB_CATEGORY_CHOICE)
    skills = serializers.CharField(allow_null=False, allow_blank=False)
    time_interval = serializers.CharField(allow_null=False, allow_blank=False)
    type_of_job = serializers.ChoiceField(allow_null=False, allow_blank=False, choices=TYPE_OF_JOB_CHOICE)
    payment = serializers.CharField(allow_null=False, allow_blank=False)
    is_active = serializers.BooleanField(required=True)
    general_terms = serializers.ListField(required=True, allow_empty=False)
    company_id = serializers.CharField(allow_null=False, allow_blank=False)
    data_type = serializers.ChoiceField(allow_null=False, allow_blank=False, choices=DATA_TYPE_CHOICE)
    created_by = serializers.CharField(allow_null=False, allow_blank=False)
    created_on = serializers.CharField(allow_null=False, allow_blank=False)


