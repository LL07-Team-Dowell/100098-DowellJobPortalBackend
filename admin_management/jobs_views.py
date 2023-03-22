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
from .serializers import AdminSerializer

# create new job
@method_decorator(csrf_exempt, name='dispatch')
class create_jobs(APIView):
    def post(self, request):
        data = request.data
        field = {
                    "eventId":get_event_id()['event_id'],
                    "job_number":  data.get('job_number'),
                    "job_title":  data.get('job_title'),
                    "description": data.get('description'),
                    "skills": data.get('skills',),
                    "qualification": data.get('qualification'),
                    "time_interval": data.get('time_interval'),
                    "job_category": data.get('job_category'),
                    "type_of_job": data.get('type_of_job'),
                    "payment": data.get('payment',),
                    "is_active": data.get('is_active', False),
                    "general_terms":data.get('general_terms'),
                    "technical_specification":data.get('technical_specification'),
                    "workflow_terms":data.get('workflow_terms'),
                    "payment_terms":data.get('payment_terms'),
                    "other_info":data.get('other_info'), 
                    "company_id":data.get('company_id'),
                    "data_type":data.get('data_type'),
                    "created_by":data.get('created_by'),
                    "created_on":data.get('created_on')
                }
        update_field = {
                    "status":"nothing to update"
                }
        serializer = AdminSerializer(data=field)
        if serializer.is_valid():
            response = dowellconnection(*jobs,"insert",field,update_field)
            if response:
                return Response({"message":"Job creation was successful."},status=status.HTTP_201_CREATED)
            else:
                return Response({"message":"Job creation has failed"},status=status.HTTP_400_BAD_REQUEST)
        else:
            error = {"error":serializer.errors[error][0] for error in serializer.errors}
            return Response(error,status=status.HTTP_400_BAD_REQUEST)


#get jobs based on company id
@method_decorator(csrf_exempt, name='dispatch')
class get_jobs(APIView):

    def post(self,request):
        data = request.data
        if data :
            field = {
                "company_id": data.get('company_id'),
            }
            update_field = {
                "status":"nothing to update"
            }
            response = dowellconnection(*jobs,"fetch",field,update_field)
            # print(response)
            if response:
                return Response({"message":"List of jobs." , "response":json.loads(response)},status=status.HTTP_200_OK)
            else:
                return Response({"message":"There is no jobs" , "response":json.loads(response)},status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"message":"Parameters are not valid"},status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class get_job(APIView):

    def post(self,request):
        data = request.data
        if data :
            field = {
                "_id": data.get('document_id')
            }
            update_field = {
                "status":"nothing to update"
            }
            response = dowellconnection(*jobs,"fetch",field,update_field)
            # print(response)
            if response:
                return Response({"message":"Job details." , "response":json.loads(response)},status=status.HTTP_200_OK)
            else:
                return Response({"message":"There is no jobs" , "response":json.loads(response)},status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"message":"Parameters are not valid"},status=status.HTTP_400_BAD_REQUEST)
            
# update the jobs
@method_decorator(csrf_exempt, name='dispatch')
class update_jobs(APIView):

    def post(self,request):
        data = request.data
        print(data)
        if data :
            field = {
                "_id": data.get('document_id')
            }
            update_field = data
            response = dowellconnection(*jobs,"update",field,update_field)
            # print(response)
            if response:
                return Response({"message":"Job updation successful."},status=status.HTTP_200_OK)
            else:
                return Response({"message":"Job updation has failed." },status=status.HTTP_304_NOT_MODIFIED)
        else:
            return Response({"message":"Parameters are not valid"},status=status.HTTP_400_BAD_REQUEST)
  
# delete the jobs
@method_decorator(csrf_exempt, name='dispatch')
class delete_job(APIView):

    def post(self,request):
        data = request.data
        print(data)
        if data :
            field = {
                "_id": data.get('document_id')
            }
            update_field = {
                "data_type" :"archive_data"
            }
            response = dowellconnection(*jobs,"update",field,update_field)
            # print(response)
            if response:
                return Response({"message":"Job deletion successful."},status=status.HTTP_200_OK)
            else:
                return Response({"message":"Job deletion has failed." },status=status.HTTP_304_NOT_MODIFIED)
        else:
            return Response({"message":"Parameters are not valid"},status=status.HTTP_400_BAD_REQUEST)




