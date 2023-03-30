from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import *
from .helper import *
from .serializers import *
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

@method_decorator(csrf_exempt, name='dispatch')
class SettingUserProfileInfoView(APIView):
    serializer_class = SettingUserProfileInfoSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    def get(self, request):
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


@method_decorator(csrf_exempt, name='dispatch')
class SettingUserProjectView(APIView):
    serializer_class = SettingUserProjectSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    def get(self, request):
        profiles = UserProject.objects.all()
        serializer = self.serializer_class(profiles, many=True)
        return Response(serializer.data)
    
    def put(self, request, pk):
        my_model = UserProject.objects.get(pk=pk)
        serializer = SettingUserProjectSerializer(my_model, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=400)
    
    