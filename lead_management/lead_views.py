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
class getServerReport(APIView):

    def get(self, request):
        return Response({"info": "APi services for lead_view"},status=status.HTTP_200_OK)

@method_decorator(csrf_exempt, name='dispatch')
class team_lead_view(APIView):
    def post(self, request):
        try:
            data = request.data
            field = {
                "eventId":get_event_id()['event_id'],
                "name" : data.get('name', ''),
                "team_lead": data.get('team_lead', ''),
                "discord_link": data.get('discord_link', ''),
                "general_info":{
                    "company_id":data.get('company_id',''),
                    "data_type":data.get('data_type',''),
                    "created_by":data.get('created_by','')
                }
                }

            update_field = {
                "status":"nothing to update"
            }
            response = dowellconnection(*lead_management_reports,"insert",field,update_field)
            print(response)
            return Response({"message":"Job creation was successful."},status=status.HTTP_201_CREATED)
        except:
            return Response({"message":"Job creation has failed"},status=status.HTTP_400_BAD_REQUEST)