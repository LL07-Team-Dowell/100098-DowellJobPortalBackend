from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import SettingUserProfileInfo
from .helper import *
from .serializers import SettingUserProfileInfoSerializer, UpdateSettingUserProfileInfoSerializer
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

@method_decorator(csrf_exempt, name='dispatch')
class SettingUserProfileInfoView(APIView):
    serializer_class = SettingUserProfileInfoSerializer

    def post(self, request):
        data = request.data
        serializer = self.serializer_class(data=data)
        if serializer.is_valid(raise_exception=True):
            profile_info = serializer.save()
            return Response({
                "success": "Profile info '{}' created successfully".format(profile_info.profile_info)
            })
        return Response({"message":serializer.errors}, status=400)

    def get(self, request, format=None):
        profiles = SettingUserProfileInfo.objects.all()
        serializer = self.serializer_class(profiles, many=True)
        return Response(serializer.data)


    def put(self, request, pk, *args, **kwargs):
        data=request.data
        setting = SettingUserProfileInfo.objects.get(pk=pk)
        serializer = UpdateSettingUserProfileInfoSerializer(setting,data=request.data)
        if serializer.is_valid():
            current_version = setting.profile_info[-1]["version"]
            setting.profile_info.append({'profile_info': data['profile_title'], 'Role': data['Role'], 'version': update_number(current_version)})
            setting.save()
            old_version = setting.profile_info[-2]["version"]
            setting.profile_info[-2]["version"] = update_string(old_version)
            setting.save()
            return Response(serializer.data, status=200)
        return Response(serializer.error_messages, status=400)

    