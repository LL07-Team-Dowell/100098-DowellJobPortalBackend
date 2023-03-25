import json
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from admin_management.serializers import AdminSerializer
from database.event import get_event_id
from database.database_management import *
from database.connection import dowellconnection
import requests


@method_decorator(csrf_exempt, name='dispatch')
class onboard_candidate(APIView):
    def post(self, request):
            data = request.data
            if data :
                field = {
                    "_id":data.get('document_id'),
                    }
                update_field = {
                    "status":data.get('status'),
                    "onboarded_on":data.get('onboarded_on')
                }
                insert_to_hr_report={
                    "event_id":get_event_id()["event_id"],
                    "applicant":data.get('applicant'),
                    "project":data.get('project'),
                    "status":data.get('status'),
                    "company_id":data.get('company_id'),
                    "data_type":data.get('data_type'),
                    "onboarded_on":data.get('onboarded_on')
                }
                serializer = AdminSerializer(data=field)
                if serializer.is_valid():
                    update_response = dowellconnection(*candidate_management_reports,"update",field,update_field)
                    insert_response = dowellconnection(*account_management_reports,"insert",insert_to_hr_report,update_field)
                    print(update_response)
                    if update_response or insert_response:
                        return Response({"message":f"Candidate has been {data.get('status')}"},status=status.HTTP_200_OK)
                    else:
                        return Response({"message":"HR operation failed"},status=status.HTTP_304_NOT_MODIFIED)
                else:
                    default_errors = serializer.errors
                    new_error = {}
                    for field_name, field_errors in default_errors.items():
                        new_error[field_name] = field_errors[0]
                    return Response(new_error,status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class update_project(APIView):
    def post(self, request):
            data = request.data
            if data :
                field = {
                    "_id":data.get('document_id'),
                    }
                update_field = {
                    "payment":data.get('payment'),
                    "project":data.get('project')
                }
                update_response = dowellconnection(*candidate_management_reports,"update",field,update_field)
                insert_response = dowellconnection(*account_management_reports,"update",field,update_field)
                print(update_response)
                if update_response or insert_response:
                    return Response({"message":f"Candidate project and payment has been updated"},status=status.HTTP_200_OK)
                else:
                    return Response({"message":"Failed to update."},status=status.HTTP_304_NOT_MODIFIED)
            else:
                return Response({"message":"Parametes are not valid"},status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name='dispatch')
class rehire_candidate(APIView):
    def post(self, request):
            data = request.data
            if data :
                field = {
                    "_id":data.get('document_id'),
                    }
                update_field = {
                    "status":data.get('status'),
                }
                update_response = dowellconnection(*candidate_management_reports,"update",field,update_field)
                insert_response = dowellconnection(*account_management_reports,"update",field,update_field)
                print(update_response)
                if update_response or insert_response:
                    return Response({"message":f"Candidate has been {data.get('status')}"},status=status.HTTP_200_OK)
                else:
                    return Response({"message":"HR operation failed"},status=status.HTTP_304_NOT_MODIFIED)
            else:
                return Response({"message":"Parametes are not valid"},status=status.HTTP_400_BAD_REQUEST)
