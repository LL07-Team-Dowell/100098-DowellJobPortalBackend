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


@method_decorator(csrf_exempt, name='dispatch')
class index(APIView):

    def get(self, request):
        field = {
            "_id":"Manish",
            }
        update_field = {
            "name":"Manish"
        }
        insert_response = dowellconnection(*questionnaire_modules,"insert",field,update_field)
        return Response({"info": insert_response},status=status.HTTP_200_OK)

@method_decorator(csrf_exempt, name='dispatch')
class response(APIView):

    def get(self, request):
        field = {
            "_id":"Manish",
            }
        update_field = {
            "name":"Manish"
        }
        insert_response = dowellconnection(*response_modules,"insert",field,update_field)
        return Response({"info": insert_response},status=status.HTTP_200_OK)
