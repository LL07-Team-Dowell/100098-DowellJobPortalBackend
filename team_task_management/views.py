from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics, permissions
from .models import Task, Team, TeamMember, User
from .serializers import *
from rest_framework.views import APIView


class TeamList(generics.ListCreateAPIView):
    queryset = Team.objects.all()
    serializer_class = TeamWithMembers

    def post(self, request, *args, **kwargs):
        serializer = TeamSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Team created successfully"}, status=status.HTTP_201_CREATED)
        else:
            default_errors = serializer.errors
            new_error = {}
            for field_name, field_errors in default_errors.items():
                new_error[field_name] = field_errors[0]
            return Response(new_error, status=status.HTTP_400_BAD_REQUEST)


class create_task(generics.ListCreateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    def post(self, request, *args, **kwargs):
        print(request.data)
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Task created successfully"}, status=status.HTTP_201_CREATED)
        else:
            default_errors = serializer.errors
            new_error = {}
            for field_name, field_errors in default_errors.items():
                new_error[field_name] = field_errors[0]
            return Response(new_error, status=status.HTTP_400_BAD_REQUEST)


# class TeamRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
#     queryset = Team.objects.all()
#     serializer_class = TeamSerializer
#     lookup_field = "id"
class EditTeamAPIView(APIView):
    def patch(self, request, pk):
        try:
            team = Team.objects.get(pk=pk)
        except Team.DoesNotExist:
            return Response({'error': 'Team does not exist'}, status=status.HTTP_404_NOT_FOUND)
        serializer = TeamSerializer(team, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            default_errors = serializer.errors
            new_error = {}
            for field_name, field_errors in default_errors.items():
                new_error[field_name] = field_errors[0]
            return Response(new_error, status=status.HTTP_400_BAD_REQUEST)


class DeleteTeam(APIView):

    def delete(self, request, team_id):
        try:
            # checks if team exists
            team = Team.objects.get(id=team_id)
            team.delete()
            if team.exists():
                message = {"error": f"Team with id - {team_id} was not successfully deleted"}
                return Response(message, status=status.HTTP_400_BAD_REQUEST)
            message = {"message": f"Team with id - {team_id} was successfully deleted"}
            return Response(message, status=status.HTTP_200_OK)
        except Team.DoesNotExist:
            #=====if it doesnt exist, return the reponse below
            return Response({'error': 'Team does not exist'}, status=status.HTTP_404_NOT_FOUND)


