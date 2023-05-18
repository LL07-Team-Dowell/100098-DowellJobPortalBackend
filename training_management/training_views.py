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
from training_management.serializers import TrainingSerializer, UpdateQuestionSerializer


@method_decorator(csrf_exempt, name='dispatch')
class question(APIView):
    def post(self, request):
        data = request.data
        field = {
            "eventId": get_event_id()['event_id'],
            "company_id": data.get("company_id"),
            "data_type": data.get("data_type"),
            "question_link": data.get("question_link"),
            "module": data.get("module"),
            "created_on": data.get("created_on"),
            "created_by": data.get("created_by"),
            "is_active": data.get("is_active")
        }
        update_field = {
            "status": "nothing to update"
        }
        serializer = TrainingSerializer(data=field)
        if serializer.is_valid():
            question_response = dowellconnection(
                *questionnaire_modules, "insert", field, update_field)
            print(question_response)
            if question_response:
                return Response({"message": "Question created successfully"}, status=status.HTTP_201_CREATED)
            else:
                return Response({"message": "Question failed to be created"}, status=status.HTTP_304_NOT_MODIFIED)
        else:
            default_errors = serializer.errors
            new_error = {}
            for field_name, field_errors in default_errors.items():
                new_error[field_name] = field_errors[0]
            return Response(new_error, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class get_all_question(APIView):
    def get(self, request ,company_id):
        field = {
            "company_id": company_id,
        }
        update_field = {
            "status": "nothing to update"
        }
        question_response = dowellconnection(*questionnaire_modules, "fetch", field, update_field)
        print("----respoonse from dowelconnection---",question_response)
        print(question_response)
        if question_response:
            return Response({"message": "List of questions.", "response": json.loads(question_response)},
                            status=status.HTTP_200_OK)
        return Response({"error": "No question found"}, status=status.HTTP_204_NO_CONTENT)


@method_decorator(csrf_exempt, name='dispatch')
class get_question(APIView):
    def get(self, request , document_id ):
        field = {
            "_id": document_id,
        }
        print(field)
        update_field = {
            "status": "nothing to update"
        }
        question_response = dowellconnection(
            *questionnaire_modules, "fetch", field, update_field)
        print(question_response)
        if question_response:
            return Response({"message": "List of questions.", "response": json.loads(question_response)},
                            status=status.HTTP_200_OK)
        else:
            return Response({"error": "No question found"}, status=status.HTTP_204_NO_CONTENT)


@method_decorator(csrf_exempt, name='dispatch')
class update_question(APIView):
    def patch(self, request):
        data = request.data
        field = {
            "_id": data.get("document_id"),
        }
        print(field)
        update_field = {
            "is_active": data.get("is_active"),
            "question_link": data.get("question_link")
        }
        serializer = UpdateQuestionSerializer(data=update_field)
        if serializer.is_valid():
            question_response = dowellconnection(
                *questionnaire_modules, "update", field, update_field)
            print(question_response)
            if question_response:
                return Response({"message": "Question updated successfully"}, status=status.HTTP_201_CREATED)
            else:
                return Response({"message": "Question updating failed"}, status=status.HTTP_304_NOT_MODIFIED)
        else:
            default_errors = serializer.errors
            new_error = {}
            for field_name, field_errors in default_errors.items():
                new_error[field_name] = field_errors[0]
            return Response(new_error, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class response(APIView):

    def post(self, request):
        data = request.data
        field = {
            "eventId": get_event_id()["event_id"],
            "company_id": data.get("company_id"),
            "data_type": data.get("data_type"),
            "module": data.get("module"),
            "username": data.get("username"),
            "code_base_link": data.get("code_base_link"),
            "live_link": data.get("live_link"),
            "documentation_link": data.get("documentation_link"),
            "started_on": data.get("started_on"),
            "submitted_on": data.get("submitted_on"),
            "rating": data.get("rating")
        }
        update_field = {

        }
        insert_response = dowellconnection(
            *response_modules, "insert", field, update_field)
        return Response({"info": insert_response}, status=status.HTTP_201_CREATED)


@method_decorator(csrf_exempt, name='dispatch')
class submit_response(APIView):
    def patch(self, request):
        data = request.data
        field = {
            "_id": data.get('document_id'),
        }
        update_field = {
            "code_base_link": data.get("code_base_link"),
            "live_link": data.get("live_link"),
            "documentation_link": data.get("documentation_link"),  
            "answer_link": data.get("answer_link"), 
            "submitted_on": data.get("submitted_on"), 
        }
        insert_to_response = dowellconnection(
            *response_modules, "update", field, update_field)
        
        if insert_to_response:
            return Response({"message": "Response has been submitted"}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "operation failed"}, status=status.HTTP_304_NOT_MODIFIED)

@method_decorator(csrf_exempt, name='dispatch')
class update_response(APIView):
    def patch(self, request):
        data = request.data
        field = {
            "_id": data.get('document_id'),
        }
        update_field = {
            "data_type": data.get("data_type"),
            "submitted_on": data.get("submitted_on"),
            "rating": data.get("rating"),
            "status":data.get("status")
        }
        insert_to_hr_report = {   
            "status":data.get("status")
            }
        insert_to_response = dowellconnection(
            *response_modules, "update", field, update_field)
        update_to_hr = dowellconnection(
            *hr_management_reports, "update", insert_to_hr_report, update_field)

        if insert_to_response or update_to_hr:
            return Response({"message": f"Candidate has been {data.get('status')}"}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "HR operation failed"}, status=status.HTTP_304_NOT_MODIFIED)

@method_decorator(csrf_exempt, name='dispatch')
class get_response(APIView):
    def get(self, request):
        data = request.data
        field = {
            "_id": data.get('document_id'),
        }
        print(field)
        update_field = {
            "status": "nothing to update"
        }
        response = dowellconnection(
            *response_modules, "fetch", field, update_field)
        print(response)
        if response:
            return Response({"message": "List of response.", "response": json.loads(response)},
                            status=status.HTTP_200_OK)
        else:
            return Response({"error": "data not found"}, status=status.HTTP_204_NO_CONTENT)
