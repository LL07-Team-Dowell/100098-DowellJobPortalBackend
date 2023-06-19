import threading
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from database.event import get_event_id
from database.database_management import *
from database.connection import dowellconnection
from hr_management.serializers import HRSerializer, RejectSerializer


@method_decorator(csrf_exempt, name='dispatch')
class shortlisted_candidate(APIView):

    def post(self, request):
            data = request.data
            if data:
                field = {
                    "_id":data.get('document_id'),
                    }
                update_field = {
                    "hr_remarks":data.get('hr_remarks'),
                    "status":data.get('status'),
                    "shortlisted_on":data.get('shortlisted_on')
                }
                insert_to_hr_report={
                    "event_id":get_event_id()["event_id"],
                    "applicant":data.get('applicant'),
                    "hr_remarks":data.get('hr_remarks'),
                    "status":data.get('status'),
                    "company_id":data.get('company_id'),
                    "data_type":data.get('data_type'),
                    "shortlisted_on":data.get('shortlisted_on')
                }
                serializer = HRSerializer(data=data)
                if serializer.is_valid():
                    update_response = dowellconnection(*candidate_management_reports,"update",field,update_field)
                    insert_response = dowellconnection(*hr_management_reports,"insert",insert_to_hr_report,update_field)
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
class selected_candidate(APIView):
    def post(self, request):
            data = request.data
            if data :
                field = {
                    "_id":data.get('document_id'),
                    }
                update_field = {
                    "hr_remarks":data.get('hr_remarks'),
                    "project":data.get('project'),
                    "product_discord_link":data.get('product_discord_link'),
                    "status":data.get('status'),
                    "selected_on":data.get('selected_on')
                }
                insert_to_hr_report={
                    "event_id":get_event_id()["event_id"],
                    "applicant":data.get('applicant'),
                    "hr_remarks":data.get('hr_remarks'),
                    "project":data.get('project'),
                    "product_discord_link":data.get('product_discord_link'),
                    "status":data.get('status'),
                    "company_id":data.get('company_id'),
                    "data_type":data.get('data_type'),
                    "selected_on":data.get('selected_on')
                }
                update_response = dowellconnection(*candidate_management_reports,"update",field,update_field)
                insert_response = dowellconnection(*hr_management_reports,"insert",insert_to_hr_report,update_field)
                print(update_response)
                if update_response or insert_response:
                    return Response({"message":f"Candidate has been {data.get('status')}"},status=status.HTTP_200_OK)
                else:
                    return Response({"message":"HR operation failed"},status=status.HTTP_304_NOT_MODIFIED)
            else:
                return Response({"message":"Parameters are not valid"},status=status.HTTP_400_BAD_REQUEST)
            
            
@method_decorator(csrf_exempt, name='dispatch')
class reject_candidate(APIView):
    def post(self, request):
        data = request.data
        print(data)
        if data:
            field = {
                "_id":data.get('document_id'),
            }
            update_field = {
                "reject_remarks":data.get('reject_remarks'),
                "status":"Rejected",
                "data_type":data.get('data_type'),
                "rejected_on":data.get('rejected_on')
            }
            insert_to_hr_report={
                "company_id":data.get('company_id'),
                "applicant":data.get('applicant'),
                "applicant_email": data.get('applicant_email'),
                "username" : data.get("username"),
                "reject_remarks":data.get('reject_remarks'),
                "status":"Rejected",
                "data_type":data.get('data_type'),
                "rejected_on":data.get('rejected_on')
            }
            serializer = RejectSerializer(data=data)
            if serializer.is_valid():
                def call_dowellconnection(*args):
                    dowellconnection(*args)

                candidate_thread = threading.Thread(target=call_dowellconnection, args=(*candidate_management_reports, "update", field, update_field))
                candidate_thread.start()
                    
                hr_thread = threading.Thread(target=call_dowellconnection,args=(*hr_management_reports,"insert",insert_to_hr_report,update_field))
                hr_thread.start()

                candidate_thread.join()
                hr_thread.join()

                if not candidate_thread.is_alive() and not hr_thread.is_alive():
                    return Response({"message":"Candidate has been Rejected"},status=status.HTTP_200_OK)
                else:
                    return Response({"message":"operation failed"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                default_errors = serializer.errors
                new_error = {}
                for field_name, field_errors in default_errors.items():
                    new_error[field_name] = field_errors[0]
                return Response(new_error,status=status.HTTP_400_BAD_REQUEST)