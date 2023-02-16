from django.shortcuts import render
import json
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from database.event import get_event_id
from database.database_management import *
from database.connection import dowellconnection


# Create your views here.
@method_decorator(csrf_exempt, name='dispatch')
class apply_job_form(APIView):
    def post(self, request):
            data = request.data
            if data:
                field = {
                    "eventId": get_event_id()["event_id"],
                    "Individual_name": data.get('Individual_name'),
                    "email": data.get('email'),
                    "Individual_address": data.get('Individual_address'),
                    "city": data.get('city'),
                    "state":data.get('state'),
                    "country": data.get('country'),
                    "phone": data.get('phone'),
                    }
                update_field = {
                    "status":"Nothing to update"
                }
                insert_response = dowellconnection(*research_management_reports,"insert",field,update_field)
                print(insert_response)
                if insert_response:
                    return Response({"message":"Task added successfully }"},status=status.HTTP_200_OK)
                else:
                    return Response({"message":"failed to add task"},status=status.HTTP_304_NOT_MODIFIED)
            else:
                return Response({"message":"Parameters are not valid"},status=status.HTTP_400_BAD_request)
            

@method_decorator(csrf_exempt, name='dispatch')
class get_apply_job_form(APIView):
    def get(self, request):
        data = request.data
        if data:
            field = {
                "inserted_id":data.get('inserted_id')

            }
            update_field = {
                "status":"nothing to update"
            }
            response = dowellconnection(*research_management_reports,"fetch",field,update_field)
            print(response)
            if response:
                return Response({"message":"Candidate job apllications.","response":json.loads(response)},status=status.HTTP_200_OK)
            else:
                return Response({"message":"There is no job applications","response":json.loads(response)},status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"message":"Parameters are not valid."},status=status.HTTP_400_BAD_REQUEST)
         

@method_decorator(csrf_exempt, name='dispatch')
class research_job_creation(APIView):
    def post(self, request):
            data = request.data
            if data :
                field = {
                    "eventId": get_event_id()["event_id"],
                    "job_number":  data.get('job_number'),
                    "title": data.get('title'),
                    "description": data.get('description'),
                    "skills": data.get('skills'),
                    "is_active": data.get('is_active'),
                    "typeof": data.get('typeof'),
                    "Avaliable": data.get('Avaliable'),
                    "payment": data.get('payment'),
                    "city": data.get('city'),
                    "location":data.get('location'),
                    "others": data.get('others'),
                    "phone": data.get('phone'),
                    "company_id":data.get('company_id'),
                    "data_type":data.get('data_type'),
                    "created_by":data.get('created_by'),
                    "created_on":data.get('created_on')
                    }
                update_field = {
                    "status":"Nothing to update"
                }
                insert_response = dowellconnection(*research_management_reports,"insert",field,update_field)
                print(insert_response)
                return Response({"message":"List of job apllications.","response":insert_response},status=status.HTTP_200_OK)
            else:
                return Response({"message":"There is no job applications"},status=status.HTTP_400_BAD_REQUEST)
            

@method_decorator(csrf_exempt, name='dispatch')
class get_research_job_creation(APIView):
    def get(self, request):
        data = request.data
        if data:
            field = {
                "company_id": data.get('company_id'),
            }
            update_field = {
                "status":"nothing to update"
            }
            response = dowellconnection(*research_management_reports,"fetch",field,update_field)
            print(response)
            if response:
                return Response({"message":"List of job apllications.","response":json.loads(response)},status=status.HTTP_200_OK)
            else:
                return Response({"message":"There is no job applications","response":json.loads(response)},status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"message":"Parameters are not valid."},status=status.HTTP_400_BAD_REQUEST)
        