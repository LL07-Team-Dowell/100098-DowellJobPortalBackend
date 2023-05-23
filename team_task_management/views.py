# from rest_framework.response import Response
# from rest_framework import status
# from rest_framework import generics, permissions
# from .models import Task, Team, TeamMember, User
# from .serializers import *
# import json
# from django.core import serializers
# from rest_framework.views import APIView


# class create_team(generics.ListCreateAPIView):
#     queryset = Team.objects.all()
#     serializer_class = TeamWithMembers

#     def post(self, request, *args, **kwargs):
#         serializer = TeamSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response({"message": "Team created successfully"}, status=status.HTTP_201_CREATED)
#         else:
#             default_errors = serializer.errors
#             new_error = {}
#             for field_name, field_errors in default_errors.items():
#                 new_error[field_name] = field_errors[0]
#             return Response(new_error, status=status.HTTP_400_BAD_REQUEST)


# class get_team(generics.ListCreateAPIView):
#     def get(self, request, company_id):
#         team = Team.objects.filter(company_id=company_id)
#         if team.exists():
#             team_json = serializers.serialize('json', team)
#             return Response({"message": f"Team with company_id - {company_id} available",
#                              "response": json.loads(team_json)},
#                             status=status.HTTP_200_OK)
#         message = {"message": f"Team with company_id - {company_id} not found"}
#         return Response(message, status=status.HTTP_204_NO_CONTENT)


# class create_task(generics.ListCreateAPIView):
#     queryset = Task.objects.all()
#     serializer_class = TaskSerializer

#     def post(self, request, *args, **kwargs):
#         print(request.data)
#         serializer = TaskSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response({"message": "Task created successfully"}, status=status.HTTP_201_CREATED)
#         else:
#             default_errors = serializer.errors
#             new_error = {}
#             for field_name, field_errors in default_errors.items():
#                 new_error[field_name] = field_errors[0]
#             return Response(new_error, status=status.HTTP_400_BAD_REQUEST)


# class EditTeamAPIView(APIView):
#     def patch(self, request, pk):
#         try:
#             team = Team.objects.get(pk=pk)
#         except Team.DoesNotExist:
#             return Response({'error': 'Team does not exist'}, status=status.HTTP_404_NOT_FOUND)
#         serializer = TeamEditSerializer(team, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_200_OK)
#         else:
#             default_errors = serializer.errors
#             new_error = {}
#             for field_name, field_errors in default_errors.items():
#                 new_error[field_name] = field_errors[0]
#             return Response(new_error, status=status.HTTP_400_BAD_REQUEST)


# ## this is the api for deleting a team
# class DeleteTeam(APIView):
#     def delete(self, request, team_id=None):
#         team = Team.objects.filter(id=team_id)
#         if team.exists():
#             team.delete()
#             message = {"message": f"Team with id - {team_id} was successfully deleted"}
#             return Response(message, status=status.HTTP_200_OK)
#         message = {"error": f"Team with id - {team_id} was not successfully deleted"}
#         return Response(message, status=status.HTTP_400_BAD_REQUEST)


# class EditTaskAPIView(APIView):
#     def patch(self, request, pk):
#         try:
#             team = Task.objects.get(pk=pk)
#         except Task.DoesNotExist:
#             return Response({'error': ' This task does not exist'}, status=status.HTTP_404_NOT_FOUND)
#         serializer = TaskEditSerializer(team, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_200_OK)
#         else:
#             new_error = {}
#             for field_name, field_errors in serializer.errors.items():
#                 new_error[field_name] = field_errors[0]
#             return Response(new_error, status=status.HTTP_400_BAD_REQUEST)


# ## this is the api for deleting a task
# class DeleteTask(APIView):
#     def delete(self, request, task_id=None):
#         task = Task.objects.filter(id=task_id)
#         if task.exists():
#             task.delete()
#             message = {"message": f"Task with id - {task_id} was successfully deleted"}
#             return Response(message, status=status.HTTP_200_OK)
#         message = {"error": f"Task with id - {task_id} was not successfully deleted"}
#         return Response(message, status=status.HTTP_400_BAD_REQUEST)


# # this is the api for creating a task for a team member
# class create_member_task(generics.ListCreateAPIView):
#     def post(self, request, *args, **kwargs):
#         # print(request.data)
#         data = request.data
#         team_member = data.get('team_member')  # gets the team_member id from the post request
#         team_member = TeamMember.objects.filter(user=team_member).first()
#         name = f"{team_member.user.name} - ({team_member.team.team_name})"  # gets the member
#         serializer = TaskForMemberSerializer(data=request.data)

#         if serializer.is_valid():
#             serializer.save()
#             # print(TaskForMember.objects.filter(), "====================")
#             return Response({"message": f"Task for member-- {name} is created successfully"},
#                             status=status.HTTP_201_CREATED)
#         else:
#             default_errors = serializer.errors
#             new_error = {}
#             for field_name, field_errors in default_errors.items():
#                 new_error[field_name] = field_errors[0]
#             return Response(new_error, status=status.HTTP_400_BAD_REQUEST)


# # this is the api for deleting a task for a member
# class DeleteMemberTask(APIView):
#     def delete(self, request, task_id=None):
#         task = TaskForMember.objects.filter(id=task_id)
#         # print(task, '===================', TaskForMember.objects.filter())
#         if task.exists():
#             task.delete()
#             message = {"message": f"Task with id - {task_id} for member - {task} was successfully deleted"}
#             return Response(message, status=status.HTTP_200_OK)
#         message = {"error": f"Task with id - {task_id} for member - {task} was not successfully deleted"}
#         return Response(message, status=status.HTTP_400_BAD_REQUEST)
