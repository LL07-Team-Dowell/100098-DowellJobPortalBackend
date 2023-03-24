from rest_framework import serializers


class TaskSerializer(serializers.Serializer):
    pass
    
    # DATA_TYPE_CHOICE = (("Real_Data", "Real_Data"), ("Learning_Data", "Learning_Data"),
    #                     ("Testing_Data", "Testing_Data"), ("Archived_Data", "Archived_Data"))
    
    # data_type = serializers.ChoiceField(allow_null=False, allow_blank=False, choices=DATA_TYPE_CHOICE)
 


    # def update(self, instance, validated_data):
    #     instance.data_type = validated_data.get('data_type', instance.data_type)
    #     instance.save()
    #     return instance
