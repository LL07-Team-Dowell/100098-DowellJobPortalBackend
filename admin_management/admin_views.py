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
@method_decorator(csrf_exempt, name='dispatch')
class getServerReport(APIView):

    def get(self, request):
        return Response({"info": "APi services for Admin_view"},status=status.HTTP_200_OK)

# create new job
@method_decorator(csrf_exempt, name='dispatch')
class create_jobs(APIView):

    def post(self, request):
        try:
            data = request.data
            field = {
                "eventId":get_event_id()['event_id'],
                "job_details":{
                    "job_number":  data.get('job_number', ''),
                    "job_title":  data.get('job_title', ''),
                    "description": data.get('description', ''),
                    "skills": data.get('skills', ''),
                    "qualification": data.get('qualification', ''),
                    "time_period": data.get('time_period', ''),
                    "job_catagory": data.get('job_catagory',''),
                    "type_of_job": data.get('type_of_job',''),
                    "payment": data.get('payment', ''),

                },
                "is_active": data.get('is_active', False),
                "time_interval": data.get('time_interval',''),
                "terms_and_condition":{
                    "general_terms":data.get('general_terms',''),
                    "technical_specification":data.get('technical_specification',''),
                    "workflow_terms":data.get('workflow_terms',''),
                    "other_info":data.get('other_info','')  
                },
                "general_info":{
                    "company_id":data.get('company_id',''),
                    "data_type":data.get('data_type',''),
                    "created_by":data.get('created_by','')
                }

            }
            update_field = {
                "status":"nothing to update"
            }
            response = dowellconnection(*jobs,"insert",field,update_field)
            print(response)
            return Response({"message":"Job creation was successful."},status=status.HTTP_201_CREATED)
        except:
            return Response({"message":"Job creation has failed"},status=status.HTTP_400_BAD_REQUEST)






