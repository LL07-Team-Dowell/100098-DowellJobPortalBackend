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
        return Response({"info": "APi services for Hr_view"},status=status.HTTP_200_OK)

@method_decorator(csrf_exempt, name='dispatch')
class get_candidate_views(APIView):

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

@method_decorator(csrf_exempt, name='dispatch')
class hr_save_view(APIView):
    def post(self, request):
            data = request.data
            print(data.get('id',''))
            field = {
                "_id":data.get('id',''),
                }
            fields = {
                "eventId":get_event_id()['event_id'],
                "company_id":data.get('company_id',''),
                 "applicant ": data.get('applicant ', ''),
                "hr_remarks ": data.get('hr_remarks ', ''),
                "status":data.get('status ', ''),
                }
            update_field = {
               "hr_remarks ": data.get('hr_remarks ', ''),
                "status":data.get('status ', ''),
            }
            print("hello")
            response = dowellconnection(*candidate_management_reports,"fetch",field,update_field)
            print(response)
            # response1 = dowellconnection(*hr_management_reports,"insert",fields,update_field)
            # print(response1)
            return Response({"message":"Job creation was successful."},status=status.HTTP_201_CREATED)

            # return Response({"message":"Job creation has failed"},status=status.HTTP_400_BAD_REQUEST)