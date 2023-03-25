import json
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from database.event import get_event_id
from database.database_management import *
from database.connection import dowellconnection
from lead_management.serializers import LeadSerializer


@method_decorator(csrf_exempt, name='dispatch')
class hire_candidate(APIView):
    def post(self, request):
            data = request.data
            if data:
                field = {
                    "_id":data.get('document_id'),
                    }
                update_field = {
                    "teamlead_remarks":data.get('teamlead_remarks'),
                    "status":data.get('status'),
                    "hired_on":data.get('hired_on')
                }
                insert_to_lead_report={
                    "event_id":get_event_id()["event_id"],
                    "applicant":data.get('applicant'),
                    "teamlead_remarks":data.get('teamlead_remarks'),
                    "status":data.get('status'),
                    "company_id":data.get('company_id'),
                    "data_type":data.get('data_type'),
                    "hired_on":data.get('hired_on')
                }
                serializer = LeadSerializer(data=data)
                if serializer.is_valid(): 
                    update_response = dowellconnection(*candidate_management_reports,"update",field,update_field)
                    insert_response = dowellconnection(*lead_management_reports,"insert",insert_to_lead_report,update_field)
                    if update_response or insert_response:
                        return Response({"message":f"Candidate has been {data.get('status')}"},status=status.HTTP_200_OK)
                    else:
                        return Response({"message":"Lead operation failed"},status=status.HTTP_304_NOT_MODIFIED)
                else:
                    default_errors = serializer.errors
                    new_error = {}
                    for field_name, field_errors in default_errors.items():
                        new_error[field_name] = field_errors[0]
                    return Response(new_error,status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class rehire_candidate(APIView):
    def post(self, request):
            data = request.data
            if data :
                field = {
                    "_id":data.get('document_id'),
                    }
                update_field = {
                    "rehire_remarks":data.get('rehire_remarks')
                }
                update_response = dowellconnection(*candidate_management_reports,"update",field,update_field)
                print(update_response)
                if update_response:
                    return Response({"message":f"Candidate has been {data.get('status')}"},status=status.HTTP_200_OK)
                else:
                    return Response({"message":"HR operation failed"},status=status.HTTP_304_NOT_MODIFIED)
            else:
                return Response({"message":"Parametes are not valid"},status=status.HTTP_400_BAD_REQUEST)
