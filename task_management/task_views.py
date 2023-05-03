import json
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from database.event import get_event_id
from database.database_management import *
from database.connection import dowellconnection
import requests
from task_management.serializers import TaskSerializer


@method_decorator(csrf_exempt, name='dispatch')
class create_task(APIView):
    def post(self, request):
        data = request.data
        if data:
            field = {
                "eventId": get_event_id()["event_id"],
                "project": data.get('project'),
                "applicant": data.get('applicant'),
                "task": data.get('task'),
                "status": "Incomplete",
                "task_added_by": data.get('task_added_by'),
                "data_type": data.get('data_type'),
                "company_id": data.get('company_id'),
                "task_created_date": data.get('task_created_date'),
                "task_updated_date": ""
            }
            update_field = {
                "status": "Nothing to update"
            }
            insert_response = dowellconnection(*task_management_reports, "insert", field, update_field)
            print(insert_response)
            if insert_response:
                return Response({"message": f"Task added successfully and the status is {field['status']}"},
                                status=status.HTTP_200_OK)
            else:
                return Response({"message": "failed to add task"}, status=status.HTTP_304_NOT_MODIFIED)
        else:
            return Response({"message": "Parameters are not valid"}, status=status.HTTP_400_BAD_request)


@method_decorator(csrf_exempt, name='dispatch')
class get_task(APIView):
    def post(self, request):
        data = request.data
        if data:
            field = {
                "company_id": data.get('company_id')
            }
            update_field = {
                "status": "Nothing to update"
            }
            response = dowellconnection(*task_management_reports, "fetch", field, update_field)
            print(response)
            if response:
                return Response({"message": "List of the task", "response": json.loads(response)},
                                status=status.HTTP_200_OK)
            else:
                return Response({"message": "There is no task", "response": json.loads(response)},
                                status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"message": "Parametes are not valid"}, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class get_cadidate_task(APIView):
    def post(self, request):
        data = request.data
        if data:
            field = {
                "_id": data.get('document_id')
            }
            update_field = {
                "status": "Nothing to update"
            }
            response = dowellconnection(*task_management_reports, "fetch", field, update_field)
            print(response)
            if response:
                return Response({"message": "List of the task", "response": json.loads(response)},
                                status=status.HTTP_200_OK)
            else:
                return Response({"message": "There is no task", "response": json.loads(response)},
                                status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"message": "Parametes are not valid"}, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class update_task(APIView):
    def post(self, request):
        data = request.data
        if data:
            field = {
                "_id": data.get('document_id')
            }
            update_field = {
                "status": data.get('status'),
                "task": data.get('task'),
                "task_added_by": data.get('task_added_by'),
                "task_updated_date": data.get('task_updated_date')

            }
            response = dowellconnection(*task_management_reports, "update", field, update_field)
            print(response)
            if response:
                return Response({"message": "Task updation successful"}, status=status.HTTP_200_OK)
            else:
                return Response({"message": "Task updation failed"}, status=status.HTTP_304_NOT_MODIFIED)
        else:
            return Response({"message": "Parametes are not valid"}, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class delete_task(APIView):
    def delete(self, request):
        data = request.data
        if data:
            field = {
                "_id": data.get('document_id')
            }
            update_field = {
                "data_type": "Archived_Data"
            }
            response = dowellconnection(*task_management_reports, "update", field, update_field)
            if response:
                return Response({"message": "Task deletion successful."}, status=status.HTTP_200_OK)
            else:
                return Response({"message": "Task deletion has failed."}, status=status.HTTP_304_NOT_MODIFIED)
        else:
            return Response({"message": "Parameters are not valid"}, status=status.HTTP_400_BAD_REQUEST)
