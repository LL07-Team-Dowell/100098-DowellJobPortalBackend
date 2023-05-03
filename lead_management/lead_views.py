import json
import threading
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from database.event import get_event_id
from database.database_management import *
from database.connection import dowellconnection
from lead_management.serializers import LeadSerializer, RejectSerializer


@method_decorator(csrf_exempt, name='dispatch')
class hire_candidate(APIView):
    def post(self, request):
        data = request.data
        if data:
            field = {
                "_id": data.get('document_id'),
            }
            update_field = {
                "teamlead_remarks": data.get('teamlead_remarks'),
                "status": data.get('status'),
                "hired_on": data.get('hired_on')
            }
            insert_to_lead_report = {
                "event_id": get_event_id()["event_id"],
                "applicant": data.get('applicant'),
                "teamlead_remarks": data.get('teamlead_remarks'),
                "status": data.get('status'),
                "company_id": data.get('company_id'),
                "data_type": data.get('data_type'),
                "hired_on": data.get('hired_on')
            }
            serializer = LeadSerializer(data=data)
            if serializer.is_valid():
                update_response = dowellconnection(*candidate_management_reports, "update", field, update_field)
                insert_response = dowellconnection(*lead_management_reports, "insert", insert_to_lead_report,
                                                   update_field)
                if update_response or insert_response:
                    return Response({"message": f"Candidate has been {data.get('status')}"}, status=status.HTTP_201_CREATED)
                else:
                    return Response({"message": "Lead operation failed"}, status=status.HTTP_304_NOT_MODIFIED)
            else:
                default_errors = serializer.errors
                new_error = {}
                for field_name, field_errors in default_errors.items():
                    new_error[field_name] = field_errors[0]
                return Response(new_error, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class rehire_candidate(APIView):
    def post(self, request):
        data = request.data
        if data:
            field = {
                "_id": data.get('document_id'),
            }
            update_field = {
                "rehire_remarks": data.get('rehire_remarks')
            }
            update_response = dowellconnection(*candidate_management_reports, "update", field, update_field)
            print(update_response)
            if update_response:
                return Response({"message": f"Candidate has been {data.get('status')}"}, status=status.HTTP_200_OK)
            else:
                return Response({"message": "HR operation failed"}, status=status.HTTP_304_NOT_MODIFIED)
        else:
            return Response({"message": "Parameters are not valid"}, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class reject_candidate(APIView):
    def post(self, request):
        data = request.data
        print(data)
        if data:
            field = {
                "_id": data.get('document_id'),
            }
            update_field = {
                "reject_remarks": data.get('reject_remarks'),
                "status": "Rejected",
                "rejected_on": data.get('rejected_on'),
                "data_type": data.get('data_type')
            }
            insert_to_lead_report = {
                "company_id": data.get('company_id'),
                "applicant": data.get('applicant'),
                "username": data.get("username"),
                "reject_remarks": data.get('reject_remarks'),
                "status": "Rejected",
                "data_type": data.get('data_type'),
                "rejected_on": data.get('rejected_on')
            }

            serializer = RejectSerializer(data=data)
            if serializer.is_valid():
                def call_dowellconnection(*args):
                    dowellconnection(*args)

                hr_thread = threading.Thread(target=call_dowellconnection,
                                             args=(*hr_management_reports, "update", field, update_field))
                hr_thread.start()

                candidate_thread = threading.Thread(target=call_dowellconnection,
                                                    args=(*candidate_management_reports, "update", field, update_field))
                candidate_thread.start()

                lead_thread = threading.Thread(target=call_dowellconnection, args=(
                *lead_management_reports, "insert", insert_to_lead_report, update_field))
                lead_thread.start()

                hr_thread.join()
                candidate_thread.join()
                lead_thread.join()

                if not hr_thread.is_alive() and not candidate_thread.is_alive() and not lead_thread.is_alive():
                    return Response({"message": "Candidate has been Rejected"}, status=status.HTTP_200_OK)
                else:
                    return Response({"message": "operation failed"}, status=status.HTTP_304_NOT_MODIFIED)
            else:
                default_errors = serializer.errors
                new_error = {}
                for field_name, field_errors in default_errors.items():
                    new_error[field_name] = field_errors[0]
                return Response(new_error, status=status.HTTP_400_BAD_REQUEST)
