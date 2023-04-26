from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics, permissions
from .models import Task, Team, TeamMember, User
from .serializers import *


class TeamList(generics.ListCreateAPIView):
    queryset = Team.objects.all()
    serializer_class = TeamWithMembers
    
    def post(self, request, *args, **kwargs):
        serializer = TeamSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"Team created successfully"}, status=status.HTTP_201_CREATED)
        else:
            default_errors = serializer.errors
            new_error = {}
            for field_name, field_errors in default_errors.items():
                new_error[field_name] = field_errors[0]
            return Response(new_error, status=status.HTTP_400_BAD_REQUEST)
            