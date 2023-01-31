import json
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
import requests
from database.connection import dowellconnection
from database.event import get_event_id
from database.database_management import *

# apply for jobs
@method_decorator(csrf_exempt, name='dispatch')
class apply_job_application(APIView):

    def post(self, request):
        data = request.data
        field = {
            "eventId":get_event_id()['event_id'],
            "job_number":  data.get('job_number', ''),
            "job_title":  data.get('job_title', ''),
            "applicant": data.get('applicant', ''),
            "feedBack": data.get('feedBack', ''),
            "freelancePlatform": data.get('freelancePlatform', ''),
            "freelancePlatformUrl": data.get('freelancePlatformUrl',''),
            "country": data.get('country',''),
            "agree_to_all_terms": data.get('agree_to_all_terms',''),
            "status": data.get('status',''), 
            "company_id":data.get('company_id',''),
            "username": data.get('usernames',''),
            "data_type":data.get('data_type','')
        }
        update_field = {
            "status":"nothing to update"
        }
        response = dowellconnection(*candidate_management_reports,"insert",field,update_field)
        print(response)
        if response:
            return Response({"message":"Application received."},status=status.HTTP_201_CREATED)
        else:
            return Response({"message":"Application failed to receive."},status=status.HTTP_400_BAD_REQUEST)

# apply for jobs
@method_decorator(csrf_exempt, name='dispatch')
class get_job_application(APIView):

    def post(self, request):
        data = request.data
        field = {
            "company_id":data.get('company_id','')
        }
        update_field = {
            "status":"nothing to update"
        }
        response = dowellconnection(*candidate_management_reports,"fetch",field,update_field)
        print(response)
        if response:
            return Response({"message":"List of job apllications.","response":json.loads(response)},status=status.HTTP_200_OK)
        else:
            return Response({"message":"There is no job applications","response":json.loads(response)},status=status.HTTP_204_NO_CONTENT)

