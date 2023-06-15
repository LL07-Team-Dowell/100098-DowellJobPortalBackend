import json
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from database.connection import dowellconnection
from database.event import get_event_id
from database.database_management import *
from rest_framework.generics import GenericAPIView
from rest_framework.parsers import FormParser, MultiPartParser
from candidate_management.serializers import CandidateSerializer
import datetime
from dateutil.relativedelta import relativedelta

# apply for jobs


@method_decorator(csrf_exempt, name='dispatch')
class ApplyJob(APIView):
    def is_eligible_to_apply(self, applicant_email):
        data = self.request.data
        field = {
            "applicant": data.get('applicant'),
            "applicant_email": data.get('applicant_email'),
            "username": data.get('username'),
        }
        update_field = {
            "status": "nothing to update"
        }
        applicant = dowellconnection(*rejected_reports_modules, "fetch", field, update_field)
        rejected_reports_modules = []
        rejected_reports_modules.append(applicant)
        
        # Check if applicant is present in rejected_reports_modules
        if applicant is not None:
            rejected_on = applicant.get("rejected_on")
            if rejected_on:
                three_months_after = rejected_on + relativedelta(months=3)
                current_date = datetime.timezone.now().date()
                if current_date >= three_months_after:
                    return True

        return False
    
    def post(self, request):
        data = request.data
        applicant_email = data.get("applicant_email")
        if not self.is_eligible_to_apply(applicant_email):
            return Response({"message": "Not eligible to apply yet."}, status=status.HTTP_400_BAD_REQUEST)
        field = {
            "eventId": get_event_id()['event_id'],
            "job_number": data.get('job_number'),
            "job_title": data.get('job_title'),
            "applicant": data.get('applicant'),
            "applicant_email": data.get('applicant_email'),
            "feedBack": data.get('feedBack'),
            "freelancePlatform": data.get('freelancePlatform'),
            "freelancePlatformUrl": data.get('freelancePlatformUrl'),
            "academic_qualification_type": data.get('academic_qualification_type'),
            "academic_qualification": data.get('academic_qualification'),
            "country": data.get('country'),
            "job_category": data.get('job_category'),
            "agree_to_all_terms": data.get('agree_to_all_terms'),
            "internet_speed": data.get('internet_speed'),
            "other_info": data.get('other_info'),
            "project": "",
            "status": "Pending",
            "hr_remarks": "",
            "teamlead_remarks": "",
            "rehire_remarks": "",
            "module": data.get("module"),
            "server_discord_link": "https://discord.gg/Qfw7nraNPS",
            "product_discord_link": "",
            "payment": data.get('payment'),
            "company_id": data.get('company_id'),
            "username": data.get('username'),
            "portfolio_name": data.get('portfolio_name'),
            "data_type": data.get('data_type'),
            "scheduled_interview_date": "",
            "application_submitted_on": data.get('application_submitted_on'),
            "shortlisted_on": "",
            "selected_on": "",
            "hired_on": "",
            "onboarded_on": "",
        }
        update_field = {
            "status": "nothing to update"
        }

        serializer = CandidateSerializer(data=field)
        if serializer.is_valid():
            response = dowellconnection(*rejected_reports_modules, "fetch", field, update_field)
            if response:
                return Response({"message": "Application received."}, status=status.HTTP_201_CREATED)
            else:
                return Response({"message": "Application failed to receive."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            default_errors = serializer.errors
            new_error = {}
            for field_name, field_errors in default_errors.items():
                new_error[field_name] = field_errors[0]
            return Response(new_error, status=status.HTTP_400_BAD_REQUEST)
    
@method_decorator(csrf_exempt, name='dispatch')
class apply_job(APIView):
    def post(self, request):
        data = request.data
        field = {
            "eventId": get_event_id()['event_id'],
            "job_number": data.get('job_number'),
            "job_title": data.get('job_title'),
            "applicant": data.get('applicant'),
            "applicant_email": data.get('applicant_email'),
            "feedBack": data.get('feedBack'),
            "freelancePlatform": data.get('freelancePlatform'),
            "freelancePlatformUrl": data.get('freelancePlatformUrl'),
            "academic_qualification_type": data.get('academic_qualification_type'),
            "academic_qualification": data.get('academic_qualification'),
            "country": data.get('country'),
            "job_category": data.get('job_category'),
            "agree_to_all_terms": data.get('agree_to_all_terms'),
            "internet_speed": data.get('internet_speed'),
            "other_info": data.get('other_info'),
            "project": "",
            "status": "Pending",
            "hr_remarks": "",
            "teamlead_remarks": "",
            "rehire_remarks": "",
            "module": data.get("module"),
            "server_discord_link": "https://discord.gg/Qfw7nraNPS",
            "product_discord_link": "",
            "payment": data.get('payment'),
            "company_id": data.get('company_id'),
            "username": data.get('username'),
            "portfolio_name": data.get('portfolio_name'),
            "data_type": data.get('data_type'),
            "scheduled_interview_date": "",
            "application_submitted_on": data.get('application_submitted_on'),
            "shortlisted_on": "",
            "selected_on": "",
            "hired_on": "",
            "onboarded_on": "",
        }
        update_field = {
            "status": "nothing to update"
        }
        serializer = CandidateSerializer(data=field)
        if serializer.is_valid():
            response = dowellconnection(*candidate_management_reports, "insert", field, update_field)
            if response:
                return Response({"message": "Application received."}, status=status.HTTP_201_CREATED)
            else:
                return Response({"message": "Application failed to receive."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            default_errors = serializer.errors
            new_error = {}
            for field_name, field_errors in default_errors.items():
                new_error[field_name] = field_errors[0]
            return Response(new_error, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class get_job_application(APIView):
    def get(self, request, company_id):
        field = {
            "company_id": company_id
        }
        update_field = {
            "status": "nothing to update"
        }
        response = dowellconnection(*candidate_management_reports, "fetch", field, update_field)
        print(response)
        if response:
            return Response({"message": "List of job applications.", "response": json.loads(response)},
                            status=status.HTTP_200_OK)
        else:
            return Response({"message": "There is no job applications", "response": json.loads(response)},
                            status=status.HTTP_204_NO_CONTENT)


@method_decorator(csrf_exempt, name='dispatch')
class get_all_onboarded_candidate(APIView):
    def get(self, request, company_id):
        field = {
            "company_id": company_id,
            "status": "onboard"
        }
        update_field = {
            "status": "nothing to update"
        }
        response = dowellconnection(*candidate_management_reports, "fetch", field, update_field)

        if response:
            return Response({"message": "List of onboarded Candidates", "response": json.loads(response)},
                            status=status.HTTP_200_OK)
        else:
            return Response({"message": "There are no onboarded Candidates", "response": json.loads(response)},
                            status=status.HTTP_204_NO_CONTENT)

@method_decorator(csrf_exempt, name='dispatch')
class get_candidate_application(APIView):

    def get(self, request, document_id):
        field = {
            "_id": document_id

        }
        update_field = {
            "status": "nothing to update"
        }
        response = dowellconnection(*candidate_management_reports, "fetch", field, update_field)
        print(response)
        if response:
            return Response({"message": "Candidate job applications.", "response": json.loads(response)},
                            status=status.HTTP_200_OK)
        else:
            return Response({"message": "There is no job applications", "response": json.loads(response)},
                                status=status.HTTP_204_NO_CONTENT)

@method_decorator(csrf_exempt, name='dispatch')
class delete_candidate_application(APIView):
    def delete(self, request):
        data = request.data
        if data:
            field = {
                "_id": data.get('document_id')
            }
            update_field = {
                "data_type": "Archived_Data"
            }
            response = dowellconnection(*candidate_management_reports, "update", field, update_field)
            if response:
                return Response({"message": "candidate application deleted successfully."}, status=status.HTTP_200_OK)
            else:
                return Response({"message": "candidate application deletion has failed."},
                                status=status.HTTP_304_NOT_MODIFIED)
        else:
            return Response({"message": "Parameters are not valid"}, status=status.HTTP_400_BAD_REQUEST)
