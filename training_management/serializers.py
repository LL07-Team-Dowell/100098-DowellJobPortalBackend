from rest_framework import serializers


class TrainingSerializer(serializers.Serializer):
    DATA_TYPE_CHOICE = (("Real_Data", "Real_Data"), ("Learning_Data", "Learning_Data"),
                        ("Testing_Data", "Testing_Data"), ("Archived_Data", "Archived_Data"))
    MODULE_CHOICE = (("Frontend", "Frontend"), ("Backend", "Backend"))

    company_id = serializers.CharField(allow_null=False, allow_blank=False)
    data_type = serializers.ChoiceField(
        allow_null=False, allow_blank=False, choices=DATA_TYPE_CHOICE)
    question_link = serializers.URLField(allow_null=False)
    module = serializers.ChoiceField(
        choices=MODULE_CHOICE, allow_null=False, allow_blank=False,)
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
    question_link = serializers.URLField(required=True)