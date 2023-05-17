from django.shortcuts import render
import requests
import json
import threading
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import AccountSerializer, RejectSerializer, AdminSerializer, TrainingSerializer, \
    UpdateQuestionSerializer

from .helper import get_event_id, dowellconnection
from .constant import *


# Create your views here.

# api for job portal begins here---------------------------
@method_decorator(csrf_exempt, name='dispatch')
class serverStatus(APIView):

    def get(self, request):
        return Response({"info": "Welcome to Dowell-Job-Portal-Version2.0"}, status=status.HTTP_200_OK)


# api for job portal ends here--------------------------------


# api for account management begins here______________________
@method_decorator(csrf_exempt, name='dispatch')
class onboard_candidate(APIView):
    def post(self, request):
        data = request.data
        if data:
            field = {
                "_id": data.get('document_id'),
            }
            update_field = {
                "status": data.get('status'),
                "onboarded_on": data.get('onboarded_on')
            }
            insert_to_hr_report = {
                "event_id": get_event_id()["event_id"],
                "applicant": data.get('applicant'),
                "project": data.get('project'),
                "status": data.get('status'),
                "company_id": data.get('company_id'),
                "data_type": data.get('data_type'),
                "onboarded_on": data.get('onboarded_on')
            }
            serializer = AccountSerializer(data=data)
            if serializer.is_valid():
                def call_dowellconnection(*args):
                    dowellconnection(*args)

                update_response_thread = threading.Thread(target=call_dowellconnection, args=(
                    *candidate_management_reports, "update", field, update_field))
                update_response_thread.start()

                insert_response_thread = threading.Thread(target=call_dowellconnection, args=(
                    *account_management_reports, "update", insert_to_hr_report, update_field))

                insert_response_thread.start()
                # print(update_response_thread,insert_response_thread)
                update_response_thread.join()
                insert_response_thread.join()

                if not update_response_thread.is_alive() and not insert_response_thread.is_alive():
                    return Response({"message": f"Candidate has been {data.get('status')}"},
                                    status=status.HTTP_200_OK)
                else:
                    return Response({"message": "HR operation failed"}, status=status.HTTP_304_NOT_MODIFIED)

            else:
                default_errors = serializer.errors
                new_error = {}
                for field_name, field_errors in default_errors.items():
                    new_error[field_name] = field_errors[0]
                return Response(new_error, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class update_project(APIView):
    def patch(self, request):
        data = request.data
        if data:
            field = {
                "_id": data.get('document_id'),
            }
            update_field = {
                "payment": data.get('payment'),
                "project": data.get('project')
            }

            def call_dowellconnection(*args):
                dowellconnection(*args)

            update_response_thread = threading.Thread(target=call_dowellconnection, args=(
                *candidate_management_reports, "update", field, update_field))
            update_response_thread.start()

            insert_response_thread = threading.Thread(target=call_dowellconnection, args=(
                *account_management_reports, "update", field, update_field))

            insert_response_thread.start()
            # print(update_response_thread,insert_response_thread)
            update_response_thread.join()
            insert_response_thread.join()

            if not update_response_thread.is_alive() and not insert_response_thread.is_alive():
                return Response({"message": f"Candidate project and payment has been updated"},
                                status=status.HTTP_200_OK)
            else:
                return Response({"message": "Failed to update"}, status=status.HTTP_304_NOT_MODIFIED)
        else:
            return Response({"message": "Parameters are not valid"}, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class rehire_candidate(APIView):
    def post(self, request):
        data = request.data
        if data:
            field = {
                "_id": data.get('document_id'),
            }
            update_field = {
                "status": data.get('status'),
            }

            def call_dowellconnection(*args):
                dowellconnection(*args)

            update_response_thread = threading.Thread(target=call_dowellconnection, args=(
                *candidate_management_reports, "update", field, update_field))
            update_response_thread.start()

            insert_response_thread = threading.Thread(target=call_dowellconnection, args=(
                *account_management_reports, "update", field, update_field))

            insert_response_thread.start()
            # print(update_response_thread,insert_response_thread)
            update_response_thread.join()
            insert_response_thread.join()

            if not update_response_thread.is_alive() and not insert_response_thread.is_alive():
                return Response({"message": "Candidate has been Rehired"}, status=status.HTTP_200_OK)
            else:
                return Response({"message": "operation failed"}, status=status.HTTP_304_NOT_MODIFIED)
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
            insert_to_account_report = {
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

                candidate_thread = threading.Thread(target=call_dowellconnection,
                                                    args=(*candidate_management_reports, "update", field, update_field))
                candidate_thread.start()

                hr_thread = threading.Thread(target=call_dowellconnection,
                                             args=(*hr_management_reports, "update", field, update_field))
                hr_thread.start()

                lead_thread = threading.Thread(target=call_dowellconnection,
                                               args=(*lead_management_reports, "update", field, update_field))
                lead_thread.start()

                account_thread = threading.Thread(target=call_dowellconnection, args=(
                    *account_management_reports, "insert", insert_to_account_report, update_field))
                account_thread.start()

                hr_thread.join()
                candidate_thread.join()
                lead_thread.join()
                account_thread.join()

                if not candidate_thread.is_alive() and not hr_thread.is_alive() and not lead_thread.is_alive() and not account_thread.is_alive():
                    return Response({"message": "Candidate has been Rejected"}, status=status.HTTP_200_OK)
                else:
                    return Response({"message": "operation failed"}, status=status.HTTP_304_NOT_MODIFIED)
            else:
                default_errors = serializer.errors
                new_error = {}
                for field_name, field_errors in default_errors.items():
                    new_error[field_name] = field_errors[0]
                return Response(new_error, status=status.HTTP_400_BAD_REQUEST)


# api for account management ends here______________________

# api for admin management starts here______________________
@method_decorator(csrf_exempt, name='dispatch')
class create_jobs(APIView):
    def post(self, request):
        data = request.data
        field = {
            "eventId": get_event_id()['event_id'],
            "job_number": data.get('job_number'),
            "job_title": data.get('job_title'),
            "description": data.get('description'),
            "skills": data.get('skills', ),
            "qualification": data.get('qualification'),
            "time_interval": data.get('time_interval'),
            "job_category": data.get('job_category'),
            "type_of_job": data.get('type_of_job'),
            "payment": data.get('payment', ),
            "is_active": data.get('is_active', False),
            "general_terms": data.get('general_terms'),
            "module": data.get("module"),
            "technical_specification": data.get('technical_specification'),
            "workflow_terms": data.get('workflow_terms'),
            "payment_terms": data.get('payment_terms'),
            "other_info": data.get('other_info'),
            "company_id": data.get('company_id'),
            "data_type": data.get('data_type'),
            "created_by": data.get('created_by'),
            "created_on": data.get('created_on')
        }
        update_field = {
            "status": "nothing to update"
        }
        serializer = AdminSerializer(data=field)
        if serializer.is_valid():
            response = dowellconnection(*jobs, "insert", field, update_field)
            if response:
                return Response({"message": "Job creation was successful."}, status=status.HTTP_201_CREATED)
            else:
                return Response({"message": "Job creation has failed"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            default_errors = serializer.errors
            new_error = {}
            for field_name, field_errors in default_errors.items():
                new_error[field_name] = field_errors[0]
            return Response(new_error, status=status.HTTP_400_BAD_REQUEST)


# get jobs based on company id
@method_decorator(csrf_exempt, name='dispatch')
class get_jobs(APIView):

    def get(self, request, company_id):
        field = {
            "company_id": company_id,
        }
        update_field = {
            "status": "nothing to update"
        }
        response = dowellconnection(*jobs, "fetch", field, update_field)
        # print(response)
        if response:
            return Response({"message": "List of jobs.", "response": json.loads(response)},
                            status=status.HTTP_200_OK)
        else:
            return Response({"message": "There is no jobs", "response": json.loads(response)},
                            status=status.HTTP_204_NO_CONTENT)


@method_decorator(csrf_exempt, name='dispatch')
class get_job(APIView):

    def get(self, request, document_id):
        field = {
            "_id": document_id
        }
        update_field = {
            "status": "nothing to update"
        }
        response = dowellconnection(*jobs, "fetch", field, update_field)
        # print(response)
        if response:
            return Response({"message": "Job details.", "response": json.loads(response)},
                            status=status.HTTP_200_OK)
        else:
            return Response({"message": "There is no jobs", "response": json.loads(response)},
                            status=status.HTTP_204_NO_CONTENT)


# update the jobs
@method_decorator(csrf_exempt, name='dispatch')
class update_jobs(APIView):

    def patch(self, request):
        data = request.data
        print(data)
        if data:
            field = {
                "_id": data.get('document_id')
            }
            update_field = data
            response = dowellconnection(*jobs, "update", field, update_field)
            # print(response)
            if response:
                return Response({"message": "Job update is successful."}, status=status.HTTP_200_OK)
            else:
                return Response({"message": "Job update has failed"}, status=status.HTTP_304_NOT_MODIFIED)
        else:
            return Response({"message": "Parameters are not valid"}, status=status.HTTP_400_BAD_REQUEST)


# delete the jobs
@method_decorator(csrf_exempt, name='dispatch')
class delete_job(APIView):

    def delete(self, request, document_id=None):
        field = {
            "_id": document_id
        }
        update_field = {
            "data_type": "archive_data"
        }
        response = dowellconnection(*jobs, "update", field, update_field)
        # print(response)
        if response:
            return Response({"message": "Job successfully deleted"}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Job not successfully deleted"}, status=status.HTTP_304_NOT_MODIFIED)


# api for admin management ends here______________________


# api for training management starts here______________________
@method_decorator(csrf_exempt, name='dispatch')
class create_question(APIView):
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
    def get(self, request, company_id):
        field = {
            "company_id": company_id,
        }
        update_field = {
            "status": "nothing to update"
        }
        question_response = dowellconnection(*questionnaire_modules, "fetch", field, update_field)
        print("----response from dowelconnection---", question_response)
        print(question_response)
        if question_response:
            return Response({"message": "List of questions.", "response": json.loads(question_response)},
                            status=status.HTTP_200_OK)
        return Response({"error": "No question found"}, status=status.HTTP_204_NO_CONTENT)


@method_decorator(csrf_exempt, name='dispatch')
class get_question(APIView):
    def get(self, request, document_id):
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
            "event_id": get_event_id()["event_id"],
            "company_id": data.get("company_id"),
            "data_type": data.get("data_type"),
            "module": data.get("module"),
            "project_name": data.get("project_name"),
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
class update_response(APIView):
    def patch(self, request):
        data = request.data
        field = {
            "_id": data.get('document_id'),
        }
        update_field = {
            "code_base_link": data.get("code_base_link"),
            "live_link": data.get("live_link"),
            "documentation_link": data.get("documentation_link"),
        }
        insert_to_hr_report = {
            "status": "hire",
        }

        def call_dowellconnection(*args):
            dowellconnection(*args)

        insert_to_response_thread = threading.Thread(target=call_dowellconnection, args=(
            *response_modules, "insert", field, update_field))
        insert_to_response_thread.start()

        update_to_hr_thread = threading.Thread(target=call_dowellconnection, args=(
            *hr_management_reports, "update", insert_to_hr_report, update_field))

        update_to_hr_thread.start()
        # print(insert_to_response_thread,update_to_hr_thread)
        update_to_hr_thread.join()
        insert_to_response_thread.join()

        if not insert_to_response_thread.is_alive() and not update_to_hr_thread.is_alive():
            return Response({"message": f"Candidate has been {data.get('status')}"}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Hr operation failed"}, status=status.HTTP_304_NOT_MODIFIED)


@method_decorator(csrf_exempt, name='dispatch')
class get_response(APIView):
    def get(self, request, document_id):
        field = {
            "_id": document_id,
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
            return Response({"error": "data not found"}, status=status.HTTP_304_NOT_MODIFIED)

# api for training management ends here______________________

