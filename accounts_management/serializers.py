from rest_framework import serializers


class AccountSerializer(serializers.Serializer):
    DATA_TYPE_CHOICE = (("Real_Data", "Real_Data"), ("Learning_Data", "Learning_Data"),
                        ("Testing_Data", "Testing_Data"), ("Archived_Data", "Archived_Data"))
    applicant = serializers.CharField(allow_null=False, allow_blank=False)
    project = serializers.CharField(allow_null=False, allow_blank=False)
    task = serializers.CharField(allow_null=False, allow_blank=False)
    status = serializers.CharField(allow_null=False, allow_blank=False)
    company_id = serializers.CharField(allow_null=False, allow_blank=False)
    data_type = serializers.ChoiceField(
        allow_null=False, allow_blank=False, choices=DATA_TYPE_CHOICE)
    onboarded_on = serializers.CharField(allow_null=False, allow_blank=False)
