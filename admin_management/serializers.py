from rest_framework import serializers


class AdminSerializer(serializers.Serializer):
    JOB_CATEGORY_CHOICE = (("freelancer", "freelancer"),
                           ("internship", "internship"), ("Employee", "Employee"))
    TYPE_OF_JOB_CHOICE = (("Full time", "Full time"),
                          ("Part time", "Part time"), ("Time based", "Time based"))
    DATA_TYPE_CHOICE = (("Real_Data", "Real_Data"), ("Learning_Data", "Learning_Data"),
                        ("Testing_Data", "Testing_Data"), ("Archived_Data", "Archived_Data"))
    job_number = serializers.CharField(allow_null=False, allow_blank=False, error_messages={
        'error': 'field job_number is required'})
    job_title = serializers.CharField(allow_null=False, allow_blank=False, error_messages={
        'error': 'field job_title is required'})
    description = serializers.CharField(allow_null=False, allow_blank=False, error_messages={
        'error': 'field description is required'})
    qualification = serializers.CharField(allow_null=False, allow_blank=False, error_messages={
        'error': 'field qualification is required'})
    job_category = serializers.ChoiceField(allow_null=False, allow_blank=False, choices=JOB_CATEGORY_CHOICE, error_messages={
                                           'invalid_choice': 'Please enter valid choice in job_category'})
    skills = serializers.CharField(allow_null=False, allow_blank=False, error_messages={
        'error': 'field skills is required'})
    time_interval = serializers.CharField(allow_null=False, allow_blank=False, error_messages={
        'error': 'field time_interval is required'})
    type_of_job = serializers.ChoiceField(allow_null=False, allow_blank=False, choices=TYPE_OF_JOB_CHOICE, error_messages={
        'invalid_choice': 'Please enter valid choice in type_of_job'})
    payment = serializers.CharField(allow_null=False, allow_blank=False, error_messages={
        'error': 'field payment is required'})
    is_active = serializers.BooleanField(default=False)
    general_terms = serializers.ListField(required=True, allow_empty=False, error_messages={
        'error': 'field general_terms is required'})
    technical_specification = serializers.ListField(required=True, allow_empty=False, error_messages={
        'error': 'field technical_specification is required'})
    workflow_terms = serializers.ListField(required=True, allow_empty=False, error_messages={
        'error': 'field workflow_terms is required'})
    payment_terms = serializers.CharField(allow_null=False, allow_blank=False, error_messages={
        'error': 'field payment_terms is required'})
    other_info = serializers.ListField(required=True, allow_empty=False, error_messages={
        'error': 'field other_info is required'})
    company_id = serializers.CharField(allow_null=False, allow_blank=False, error_messages={
        'error': 'field company_id is required'})
    data_type = serializers.ChoiceField(allow_null=False, allow_blank=False, choices=DATA_TYPE_CHOICE, error_messages={
        'invalid_choice': 'Please enter valid choice in data_type'})
    created_by = serializers.CharField(allow_null=False, allow_blank=False, error_messages={
        'error': 'field created_by is required'})
    created_on = serializers.CharField(allow_null=False, allow_blank=False, error_messages={
        'error': 'field created_on is required'})
