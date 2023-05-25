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
            if field["members"] == "":
                return Response({"Error": "Members Field is required and can not be empty"},
                                status=status.HTTP_204_NO_CONTENT)
            if field["team_name"] == "":
                return Response({"Error": "Team Name Field is required and can not be empty"},
                                status=status.HTTP_204_NO_CONTENT)
            if field["company_id"] == "":
                return Response({"Error": "Company Id Field is required and can not be empty"},
                                status=status.HTTP_204_NO_CONTENT)
            response = dowellconnection(
                *team_management_modules, "insert", field, update_field)
            if response:
                return Response({"message": "Team created successfully"}, status=status.HTTP_201_CREATED)
            else:
                return Response({"message": "Team Creation Failed"}, status=status.HTTP_304_NOT_MODIFIED)


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
            return Response({"message": f"Teams with id - {document_id} available",
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
            if field["task_id"] == "":
                return Response({"Error": "Task Id Field is required and can not be empty"},
                                status=status.HTTP_204_NO_CONTENT)
            if field["title"] == "":
                return Response({"Error": "Title Field is required and can not be empty"},
                                status=status.HTTP_204_NO_CONTENT)
            if field["description"] == "":
                return Response({"Error": "Description Field is required and can not be empty"},
                                status=status.HTTP_204_NO_CONTENT)
            if field["assignee"] == "":
                return Response({"Error": "Assignee Field is required and can not be empty"},
                                status=status.HTTP_204_NO_CONTENT)
            if field["team_name"] == "":
                return Response({"Error": "Team Name Field is required and can not be empty"},
                                status=status.HTTP_204_NO_CONTENT)
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
