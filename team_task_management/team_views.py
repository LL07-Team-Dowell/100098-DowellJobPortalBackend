from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from database.event import get_event_id
from database.database_management import *
from database.connection import dowellconnection
import json


@method_decorator(csrf_exempt, name='dispatch')
class create_team(APIView):
    def post(self, request):
        data = request.data
        if data:
            field = {
                "eventId": get_event_id()['event_id'],
                "team_name": data.get("team_name"),
                "company_id": data.get("company_id"),
                "members": data.get("members")
            }
            update_field = {
                "status": "nothing to update"
            }
            response = dowellconnection(
                *team_management_modules, "insert", field, update_field)
            if response:
                return Response({"message": "Team created successfully"}, status=status.HTTP_201_CREATED)
            else:
                return Response({"message": "Team Creation Failed"}, status=status.HTTP_304_NOT_MODIFIED)


@method_decorator(csrf_exempt, name='dispatch')
class edit_team(APIView):
    def patch(self, request,document_id):
        data = request.data
        if data:
            field = {
                "_id": document_id, 
            }
            update_field = {
                "members": data.get("members"),
                "team_name": data.get("team_name"),
            }
            response = dowellconnection(
                *team_management_modules, "update", field, update_field)
            if response:
                return Response({"message": f"Team Updated Successfully",
                                 "response": json.loads(response)},
                            status=status.HTTP_200_OK)
            else:
                return Response({"message": f"Team Update Failed"}, status=status.HTTP_304_NOT_MODIFIED)

@method_decorator(csrf_exempt, name='dispatch')
class get_team(APIView):  ## single team
    def get(self, request, document_id):
        field = {
            "_id": document_id,
        }
        update_field = {
            "status": "nothing to update"
        }
        response = dowellconnection(*team_management_modules, "fetch", field, update_field)
        if response:
            return Response({"message": f"Teams available",
                             "response": json.loads(response)},
                            status=status.HTTP_200_OK)
        else:
            return Response({"message": "There is no team", "response": json.loads(response)},
                            status=status.HTTP_204_NO_CONTENT)


@method_decorator(csrf_exempt, name='dispatch')
class get_all_teams(APIView):  # all teams
    def get(self, request, company_id):
        field = {
            "company_id": company_id,
        }
        update_field = {
            "status": "nothing to update"
        }
        response = dowellconnection(*team_management_modules, "fetch", field, update_field)
        if response:
            return Response({"message": f"Teams with company id - {company_id} available",
                             "response": json.loads(response)},
                            status=status.HTTP_200_OK)
        else:
            return Response({"message": "There is no team", "response": json.loads(response)},
                            status=status.HTTP_204_NO_CONTENT)


@method_decorator(csrf_exempt, name='dispatch')
class delete_team(APIView):
    def delete(self, request, team_id):
        field = {
            "_id": team_id
        }
        update_field = {
            "data_type": "Archived_Data"
        }
        response = dowellconnection(*task_management_reports, "update", field, update_field)
        if response:
            return Response({"message": f"Team with id {team_id} has been deleted"}, status=status.HTTP_200_OK)
        else:
            return Response({"message": f"Team with id {team_id} failed to be deleted"},
                            status=status.HTTP_304_NOT_MODIFIED)


@method_decorator(csrf_exempt, name='dispatch')
class create_task(APIView):
    def post(self, request):
        data = request.data
        if data:
            field = {
                "eventId": get_event_id()['event_id'],
                "task_id": data.get("task_id"),
                'title': data.get("title"),
                'description': data.get("description"),
                "assignee": data.get("assignee"),
                "completed": data.get("completed"),
                "team_name": data.get("team_name"),
            }
            update_field = {
                "status": "nothing to update"
            }
            response = dowellconnection(
                *team_management_modules, "insert", field, update_field)
            if response:
                return Response({"message": "Task created successfully"}, status=status.HTTP_201_CREATED)
            else:
                return Response({"message": "Task Creation Failed"}, status=status.HTTP_304_NOT_MODIFIED)


@method_decorator(csrf_exempt, name='dispatch')
class get_task(APIView):
    def get(self, request, task_id):
        field = {
            "task_id": task_id,
        }
        update_field = {
            "status": "nothing to update"
        }
        response = dowellconnection(
            *team_management_modules, "fetch", field, update_field)
        if response:
            return Response({"message": f"Tasks with id - {task_id} available",
                             "response": json.loads(response)},
                            status=status.HTTP_200_OK)
        else:
            return Response({"message": "There is no task",
                             "response": json.loads(response)},
                            status=status.HTTP_204_NO_CONTENT)


@method_decorator(csrf_exempt, name='dispatch')
class delete_task(APIView):
    def delete(self, request, task_id):
        field = {
            "_id": task_id
        }
        update_field = {
            "data_type": "Archived_Data"
        }
        response = dowellconnection(*task_management_reports, "update", field, update_field)
        if response:
            return Response({"message": f"Task with id {task_id} has been deleted"}, status=status.HTTP_200_OK)
        else:
            return Response({"message": f"Task with id {task_id} failed to be deleted"},
                            status=status.HTTP_304_NOT_MODIFIED)
