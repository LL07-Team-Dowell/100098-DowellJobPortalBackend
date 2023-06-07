import json
import requests
import threading
from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .constant import *
from .helper import get_event_id, dowellconnection
from .serializers import AccountSerializer, RejectSerializer, AdminSerializer, TrainingSerializer, \
    UpdateQuestionSerializer, CandidateSerializer, HRSerializer, LeadSerializer, TaskSerializer, \
    SubmitResponseSerializer


# Create your views here.

# api for job portal begins here---------------------------
@method_decorator(csrf_exempt, name='dispatch')
class serverStatus(APIView):
    def get(self, request):
        return Response({"info": "Welcome to Dowell-Job-Portal-Version 2.0"}, status=status.HTTP_200_OK)


# api for job portal ends here--------------------------------


# api for account management begins here______________________
@method_decorator(csrf_exempt, name='dispatch')
class accounts_onboard_candidate(APIView):
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
                                    status=status.HTTP_201_CREATED)
                else:
                    return Response({"message": "HR operation failed"}, status=status.HTTP_304_NOT_MODIFIED)

            else:
                default_errors = serializer.errors
                new_error = {}
                for field_name, field_errors in default_errors.items():
                    new_error[field_name] = field_errors[0]
                return Response(new_error, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class accounts_update_project(APIView):
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
class accounts_rehire_candidate(APIView):
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
                return Response({"message": "Operation failed"}, status=status.HTTP_304_NOT_MODIFIED)
        else:
            return Response({"message": "Parameters are not valid"}, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class accounts_reject_candidate(APIView):
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

                account_thread = threading.Thread(target=call_dowellconnection,
                                                  args=(*account_management_reports, "insert", insert_to_account_report,
                                                        update_field))
                account_thread.start()

                hr_thread.join()
                candidate_thread.join()
                lead_thread.join()
                account_thread.join()

                if not candidate_thread.is_alive() and not hr_thread.is_alive() and not lead_thread.is_alive() and not account_thread.is_alive():
                    return Response({"message": "Candidate has been Rejected"}, status=status.HTTP_200_OK)
                else:
                    return Response({"message": "Operation failed"}, status=status.HTTP_304_NOT_MODIFIED)
            else:
                default_errors = serializer.errors
                new_error = {}
                for field_name, field_errors in default_errors.items():
                    new_error[field_name] = field_errors[0]
                return Response(new_error, status=status.HTTP_400_BAD_REQUEST)


# api for account management ends here______________________

# api for admin management starts here______________________
@method_decorator(csrf_exempt, name='dispatch')
class admin_create_jobs(APIView):
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
                return Response({"message": "Job creation has failed"}, status=status.HTTP_304_NOT_MODIFIED)
        else:
            default_errors = serializer.errors
            new_error = {}
            for field_name, field_errors in default_errors.items():
                new_error[field_name] = field_errors[0]
            return Response(new_error, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class admin_get_job(APIView):
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


# get jobs based on company id
@method_decorator(csrf_exempt, name='dispatch')
class admin_get_all_jobs(APIView):

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


# update the jobs
@method_decorator(csrf_exempt, name='dispatch')
class admin_update_jobs(APIView):
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
                return Response({"message": "Job update was successful"}, status=status.HTTP_200_OK)
            else:
                return Response({"message": "Job update has failed"}, status=status.HTTP_304_NOT_MODIFIED)
        else:
            return Response({"message": "Parameters are not valid"}, status=status.HTTP_400_BAD_REQUEST)


# delete the jobs
@method_decorator(csrf_exempt, name='dispatch')
class admin_delete_job(APIView):
    def delete(self, request, document_id):
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


# api for candidate management starts here______________________
@method_decorator(csrf_exempt, name='dispatch')
class candidate_apply_job(APIView):
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
                return Response({"message": "Application received"}, status=status.HTTP_201_CREATED)
            else:
                return Response({"message": "Application not received"}, status=status.HTTP_304_NOT_MODIFIED)
        else:
            default_errors = serializer.errors
            new_error = {}
            for field_name, field_errors in default_errors.items():
                new_error[field_name] = field_errors[0]
            return Response(new_error, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class candidate_get_job_application(APIView):

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
            return Response({"message": "There are no job applications", "response": json.loads(response)},
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
            return Response({"message": "Candidate job applications", "response": json.loads(response)},
                            status=status.HTTP_200_OK)
        else:
            return Response({"message": "There are no job applications", "response": json.loads(response)},
                            status=status.HTTP_204_NO_CONTENT)


@method_decorator(csrf_exempt, name='dispatch')
class get_all_onboarded_candidate(APIView):
    def get(self, request, company_id):
        data = company_id
        if data:
            field = {
                "company_id": company_id,
                "status": "onboarded"
            }
            update_field = {
                "status": "nothing to update"
            }
            response = dowellconnection(*candidate_management_reports, "fetch", field, update_field)

            if response:
                return Response({"message": f"List of {field['status']} Candidates",
                                 "response": json.loads(response)},
                                status=status.HTTP_200_OK)
            else:
                return Response({"message": f"There are no {field['status']} Candidates",
                                 "response": json.loads(response)},
                                status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"message": "Parameters are not valid"}, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class delete_candidate_application(APIView):
    def delete(self, request, document_id):
        field = {
            "_id": document_id
        }
        update_field = {
            "data_type": "Archived_Data"
        }
        response = dowellconnection(*candidate_management_reports, "update", field, update_field)
        if response:
            return Response({"message": "Candidate application deleted successfully."}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Deleting candidate application has failed"},
                            status=status.HTTP_304_NOT_MODIFIED)


# api for candidate management ends here______________________


# api for hr management starts here______________________
@method_decorator(csrf_exempt, name='dispatch')
class hr_shortlisted_candidate(APIView):
    def post(self, request):
        data = request.data
        if data:
            field = {
                "_id": data.get('document_id'),
            }
            update_field = {
                "hr_remarks": data.get('hr_remarks'),
                "status": data.get('status'),
                "shortlisted_on": data.get('shortlisted_on')
            }
            insert_to_hr_report = {
                "event_id": get_event_id()["event_id"],
                "applicant": data.get('applicant'),
                "hr_remarks": data.get('hr_remarks'),
                "status": data.get('status'),
                "company_id": data.get('company_id'),
                "data_type": data.get('data_type'),
                "shortlisted_on": data.get('shortlisted_on')
            }
            serializer = HRSerializer(data=data)
            if serializer.is_valid():
                def call_dowellconnection(*args):
                    dowellconnection(*args)

                update_response_thread = threading.Thread(target=call_dowellconnection, args=(
                    *candidate_management_reports, "update", field, update_field))
                update_response_thread.start()

                insert_response_thread = threading.Thread(target=call_dowellconnection, args=(
                    *hr_management_reports, "update", insert_to_hr_report, update_field))

                insert_response_thread.start()
                # print(update_response_thread,insert_response_thread)
                update_response_thread.join()
                insert_response_thread.join()

                if not update_response_thread.is_alive() and not insert_response_thread.is_alive():
                    return Response({"message": f"Candidate has been {data.get('status')}"},
                                    status=status.HTTP_201_CREATED)
                else:
                    return Response({"message": "Hr operation failed"}, status=status.HTTP_304_NOT_MODIFIED)
            else:
                default_errors = serializer.errors
                new_error = {}
                for field_name, field_errors in default_errors.items():
                    new_error[field_name] = field_errors[0]
                return Response(new_error, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class hr_selected_candidate(APIView):
    def post(self, request):
        data = request.data
        if data:
            field = {
                "_id": data.get('document_id'),
            }
            update_field = {
                "hr_remarks": data.get('hr_remarks'),
                "project": data.get('project'),
                "product_discord_link": data.get('product_discord_link'),
                "status": data.get('status'),
                "selected_on": data.get('selected_on')
            }
            insert_to_hr_report = {
                "event_id": get_event_id()["event_id"],
                "applicant": data.get('applicant'),
                "hr_remarks": data.get('hr_remarks'),
                "project": data.get('project'),
                "product_discord_link": data.get('product_discord_link'),
                "status": data.get('status'),
                "company_id": data.get('company_id'),
                "data_type": data.get('data_type'),
                "selected_on": data.get('selected_on')
            }

            def call_dowellconnection(*args):
                dowellconnection(*args)

            update_response_thread = threading.Thread(target=call_dowellconnection, args=(
                *candidate_management_reports, "update", field, update_field))
            update_response_thread.start()

            insert_response_thread = threading.Thread(target=call_dowellconnection, args=(
                *hr_management_reports, "update", insert_to_hr_report, update_field))

            insert_response_thread.start()
            # print(update_response_thread,insert_response_thread)
            update_response_thread.join()
            insert_response_thread.join()

            if not update_response_thread.is_alive() and not insert_response_thread.is_alive():
                return Response({"message": f"Candidate has been {data.get('status')}"}, status=status.HTTP_201_CREATED)
            else:
                return Response({"message": "Hr operation failed"}, status=status.HTTP_304_NOT_MODIFIED)
        else:
            return Response({"message": "Parameters are not valid"}, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class hr_reject_candidate(APIView):
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
                "data_type": data.get('data_type'),
                "rejected_on": data.get('rejected_on')
            }
            insert_to_hr_report = {
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
                                             args=(*hr_management_reports, "insert", insert_to_hr_report, update_field))
                hr_thread.start()

                candidate_thread.join()
                hr_thread.join()

                if not candidate_thread.is_alive() and not hr_thread.is_alive():
                    return Response({"message": "Candidate has been Rejected"}, status=status.HTTP_200_OK)
                else:
                    return Response({"message": "Hr Operation failed"}, status=status.HTTP_304_NOT_MODIFIED)
            else:
                default_errors = serializer.errors
                new_error = {}
                for field_name, field_errors in default_errors.items():
                    new_error[field_name] = field_errors[0]
                return Response(new_error, status=status.HTTP_400_BAD_REQUEST)


# api for hr management ends here________________________


# api for lead management starts here________________________
@method_decorator(csrf_exempt, name='dispatch')
class lead_hire_candidate(APIView):
    def post(self, request):
        data = request.data
        if data:
            field = {
                "_id": data.get('document_id'),
            }
            update_field = {
                "teamlead_remarks": data.get('teamlead_remarks'),
                "status": data.get('status'),
                "hired_on": data.get('hired_on')
            }
            insert_to_lead_report = {
                "event_id": get_event_id()["event_id"],
                "applicant": data.get('applicant'),
                "teamlead_remarks": data.get('teamlead_remarks'),
                "status": data.get('status'),
                "company_id": data.get('company_id'),
                "data_type": data.get('data_type'),
                "hired_on": data.get('hired_on')
            }
            serializer = LeadSerializer(data=data)
            if serializer.is_valid():
                def call_dowellconnection(*args):
                    dowellconnection(*args)

                update_response_thread = threading.Thread(target=call_dowellconnection, args=(
                    *candidate_management_reports, "update", field, update_field))
                update_response_thread.start()

                insert_response_thread = threading.Thread(target=call_dowellconnection, args=(
                    *lead_management_reports, "update", insert_to_lead_report, update_field))

                insert_response_thread.start()
                # print(update_response_thread,insert_response_thread)
                update_response_thread.join()
                insert_response_thread.join()

                if not update_response_thread.is_alive() and not insert_response_thread.is_alive():
                    return Response({"message": f"Candidate has been {data.get('status')}"},
                                    status=status.HTTP_201_CREATED)
                else:
                    return Response({"message": "Lead operation failed"}, status=status.HTTP_304_NOT_MODIFIED)

            else:
                default_errors = serializer.errors
                new_error = {}
                for field_name, field_errors in default_errors.items():
                    new_error[field_name] = field_errors[0]
                return Response(new_error, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class lead_rehire_candidate(APIView):
    def post(self, request):
        data = request.data
        if data:
            field = {
                "_id": data.get('document_id'),
            }
            update_field = {
                "rehire_remarks": data.get('rehire_remarks'),
                "status": "Rehired"
            }
            update_response = dowellconnection(*candidate_management_reports, "update", field, update_field)
            print(update_response)
            if update_response:
                return Response({"message": f"Candidate has been {update_field['status']}"}, status=status.HTTP_200_OK)
            else:
                return Response({"message": "Lead Operation failed"}, status=status.HTTP_304_NOT_MODIFIED)
        else:
            return Response({"message": "Parameters are not valid"}, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class lead_reject_candidate(APIView):
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
            insert_to_lead_report = {
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

                hr_thread = threading.Thread(target=call_dowellconnection,
                                             args=(*hr_management_reports, "update", field, update_field))
                hr_thread.start()

                candidate_thread = threading.Thread(target=call_dowellconnection,
                                                    args=(*candidate_management_reports, "update", field, update_field))
                candidate_thread.start()

                lead_thread = threading.Thread(target=call_dowellconnection, args=(
                    *lead_management_reports, "insert", insert_to_lead_report, update_field))
                lead_thread.start()

                hr_thread.join()
                candidate_thread.join()
                lead_thread.join()

                if not hr_thread.is_alive() and not candidate_thread.is_alive() and not lead_thread.is_alive():
                    return Response({"message": "Candidate has been Rejected"}, status=status.HTTP_200_OK)
                else:
                    return Response({"message": "Lead Operation failed"}, status=status.HTTP_304_NOT_MODIFIED)
            else:
                default_errors = serializer.errors
                new_error = {}
                for field_name, field_errors in default_errors.items():
                    new_error[field_name] = field_errors[0]
                return Response(new_error, status=status.HTTP_400_BAD_REQUEST)


# api for lead management ends here________________________


# api for task management starts here________________________
@method_decorator(csrf_exempt, name='dispatch')
class create_task(APIView):
    def post(self, request):
        data = request.data
        if data:
            field = {
                "eventId": get_event_id()["event_id"],
                "project": data.get('project'),
                "applicant": data.get('applicant'),
                "task": data.get('task'),
                "status": "Incomplete",
                "task_added_by": data.get('task_added_by'),
                "data_type": data.get('data_type'),
                "company_id": data.get('company_id'),
                "task_created_date": data.get('task_created_date'),
                "task_updated_date": ""
            }
            update_field = {
                "status": "Nothing to update"
            }
            insert_response = dowellconnection(*task_management_reports, "insert", field, update_field)
            print(insert_response)
            if insert_response:
                return Response({"message": f"Task has been created successfully"},
                                status=status.HTTP_201_CREATED)
            else:
                return Response({"message": "Task failed to be Created"}, status=status.HTTP_304_NOT_MODIFIED)
        else:
            return Response({"message": "Parameters are not valid"}, status=status.HTTP_400_BAD_request)


@method_decorator(csrf_exempt, name='dispatch')
class get_task(APIView):
    def get(self, request, company_id):
        field = {
            "company_id": company_id
        }
        update_field = {
            "status": "Nothing to update"
        }
        response = dowellconnection(*task_management_reports, "fetch", field, update_field)
        print(response)
        if response:
            return Response({"message": "List of the tasks", "response": json.loads(response)},
                            status=status.HTTP_200_OK)
        else:
            return Response({"message": "There are no tasks", "response": json.loads(response)},
                            status=status.HTTP_204_NO_CONTENT)


@method_decorator(csrf_exempt, name='dispatch')
class get_candidate_task(APIView):
    def get(self, request, document_id):
        field = {
            "_id": document_id
        }
        update_field = {
            "status": "Nothing to update"
        }
        response = dowellconnection(*task_management_reports, "fetch", field, update_field)
        print(response)
        if response:
            return Response({"message": "List of the tasks", "response": json.loads(response)},
                            status=status.HTTP_200_OK)
        else:
            return Response({"message": "There are no tasks", "response": json.loads(response)},
                            status=status.HTTP_204_NO_CONTENT)


@method_decorator(csrf_exempt, name='dispatch')
class update_task(APIView):
    def patch(self, request):
        data = request.data
        if data:
            field = {
                "_id": data.get('document_id')
            }
            update_field = {
                "status": data.get('status'),
                "task": data.get('task'),
                "task_added_by": data.get('task_added_by'),
                "task_updated_date": data.get('task_updated_date')

            }
            response = dowellconnection(*task_management_reports, "update", field, update_field)
            print(response)
            if response:
                return Response({"message": "Task updated successfully"}, status=status.HTTP_200_OK)
            else:
                return Response({"message": "Task failed to be updated"}, status=status.HTTP_304_NOT_MODIFIED)
        else:
            return Response({"message": "Parameters are not valid"}, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class delete_task(APIView):
    def delete(self, request, document_id):
        field = {
            "_id": document_id
        }
        update_field = {
            "data_type": "Archived_Data"
        }
        response = dowellconnection(*task_management_reports, "update", field, update_field)
        if response:
            return Response({"message": "Task deleted successfully"}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Task failed to be deleted"}, status=status.HTTP_304_NOT_MODIFIED)


# api for task management ends here________________________


# api for team_task management starts here__________________________

@method_decorator(csrf_exempt, name='dispatch')
class create_team(APIView):
    def post(self, request):
        data = request.data
        if data:
            field = {
                "eventId": get_event_id()['event_id'],
                "team_name": data.get("team_name"),
                "company_id": data.get("company_id"),
                "members": data.get("members")
            }
            update_field = {
                "status": "nothing to update"
            }
            response = dowellconnection(
                *team_management_modules, "insert", field, update_field)
            if response:
                return Response({"message": "Team created successfully"}, status=status.HTTP_201_CREATED)
            else:
                return Response({"message": "Team failed to be created"}, status=status.HTTP_304_NOT_MODIFIED)
        else:
            return Response({"message": "Parameters are not valid"}, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class get_team(APIView):
    def get(self, request, document_id):
        field = {
            "_id": document_id,
        }
        update_field = {
            "status": "nothing to update"
        }
        response = dowellconnection(*team_management_modules, "fetch", field, update_field)
        if response:
            return Response({"message": f"Teams available",
                             "response": json.loads(response)},
                            status=status.HTTP_200_OK)
        else:
            return Response({"message": "There is no team", "response": json.loads(response)},
                            status=status.HTTP_204_NO_CONTENT)


@method_decorator(csrf_exempt, name='dispatch')
class get_all_teams(APIView):  # all teams
    def get(self, request, company_id):
        field = {
            "company_id": company_id,
        }
        update_field = {
            "status": "nothing to update"
        }
        response = dowellconnection(*team_management_modules, "fetch", field, update_field)
        if response:
            return Response({"message": f"Teams with company id - {company_id} available",
                             "response": json.loads(response)},
                            status=status.HTTP_200_OK)
        else:
            return Response({"message": "There is no team", "response": json.loads(response)},
                            status=status.HTTP_204_NO_CONTENT)


@method_decorator(csrf_exempt, name='dispatch')
class edit_team(APIView):
    def patch(self, request, document_id):
        data = request.data
        if data:
            field = {
                "_id": document_id,
            }
            update_field = {
                "members": data.get("members"),
                "team_name": data.get("team_name"),
            }
            response = dowellconnection(
                *team_management_modules, "update", field, update_field)
            if response:
                return Response({"message": "Team Updated successfully",
                                 "response": json.loads(response)},
                                status=status.HTTP_200_OK)
            else:
                return Response({"message": "Team failed to be updated"}, status=status.HTTP_304_NOT_MODIFIED)
        else:
            return Response({"message": "Parameters are not valid"}, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class delete_team(APIView):
    def delete(self, request, team_id):
        field = {
            "_id": team_id
        }
        update_field = {
            "data_type": "Archived_Data"
        }
        response = dowellconnection(*task_management_reports, "update", field, update_field)
        if response:
            return Response({"message": f"Team has been deleted"}, status=status.HTTP_200_OK)
        else:
            return Response({"message": f"Team failed to be deleted"},
                            status=status.HTTP_304_NOT_MODIFIED)


@method_decorator(csrf_exempt, name='dispatch')
class create_team_task(APIView):
    def post(self, request):
        data = request.data
        if data:
            field = {
                "eventId": get_event_id()['event_id'],
                'title': data.get("title"),
                'description': data.get("description"),
                "assignee": data.get("assignee"),
                "completed": data.get("completed"),
                "team_name": data.get("team_name"),
            }
            update_field = {
                "status": "nothing to update"
            }
            response = dowellconnection(
                *team_management_modules, "insert", field, update_field)
            if response:
                return Response({"message": "Task created successfully"}, status=status.HTTP_201_CREATED)
            else:
                return Response({"message": "Task Creation Failed"}, status=status.HTTP_304_NOT_MODIFIED)
        else:
            return Response({"message": "Parameters are not valid"}, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class edit_team_task(APIView):
    def patch(self, request, task_id):
        data = request.data
        if data:
            field = {
                "_id": task_id,
            }
            update_field = {
                "title": data.get("title"),
                "description": data.get("description"),
                "assignee": data.get("assignee"),
                "completed": data.get("completed"),
                "team_name": data.get("team_name"),
            }
            response = dowellconnection(
                *team_management_modules, "update", field, update_field)
            if response:
                return Response({"message": "Team Task Updated successfully",
                                 "response": json.loads(response)},
                                status=status.HTTP_200_OK)
            else:
                return Response({"message": "Team Task failed to be updated"}, status=status.HTTP_304_NOT_MODIFIED)
        else:
            return Response({"message": "Parameters are not valid"}, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class get_team_task(APIView):
    def get(self, request, task_id):
        field = {
            "_id": task_id,
        }
        update_field = {
            "status": "nothing to update"
        }
        response = dowellconnection(
            *team_management_modules, "fetch", field, update_field)
        if response:
            return Response({"message": f"Tasks with id - {task_id} available",
                             "response": json.loads(response)},
                            status=status.HTTP_200_OK)
        else:
            return Response({"message": "There is no task",
                             "response": json.loads(response)},
                            status=status.HTTP_204_NO_CONTENT)


@method_decorator(csrf_exempt, name='dispatch')
class delete_team_task(APIView):
    def delete(self, request, task_id):
        field = {
            "task_id": task_id
        }
        update_field = {
            "data_type": "Archived_Data"
        }
        response = dowellconnection(*task_management_reports, "update", field, update_field)
        if response:
            return Response({"message": f"Task with id {task_id} has been deleted"}, status=status.HTTP_200_OK)
        else:
            return Response({"message": f"Task with id {task_id} failed to be deleted"},
                            status=status.HTTP_304_NOT_MODIFIED)


# this is the api for creating a task for a team member
@method_decorator(csrf_exempt, name='dispatch')
class create_member_task(APIView):
    def post(self, request):
        data = request.data
        # print(request.data)
        if data:
            field = {
                "eventId": get_event_id()['event_id'],
                'title': data.get("title"),
                'description': data.get("description"),
                "assignee": data.get("assignee"),
                "completed": data.get("completed"),
                "team_name": data.get("team_name"),
                "team_member": data.get("team_member"),
            }
            update_field = {
                "status": "nothing to update"
            }
            response = dowellconnection(
                *team_management_modules, "insert", field, update_field)
            if response:
                return Response({"message": "Task for member created successfully"}, status=status.HTTP_201_CREATED)
            else:
                return Response({"message": "Task for member Creation Failed"}, status=status.HTTP_304_NOT_MODIFIED)
        else:
            return Response({"message": "Parameters are not valid"}, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class get_member_task(APIView):
    def get(self, request, task_id):
        field = {
            "_id": task_id,
        }
        update_field = {
            "status": "nothing to update"
        }
        response = dowellconnection(
            *team_management_modules, "fetch", field, update_field)
        if response:
            return Response({"message": f"Member Task with id - {task_id} available",
                             "response": json.loads(response)},
                            status=status.HTTP_200_OK)
        else:
            return Response({"message": "There is no task",
                             "response": json.loads(response)},
                            status=status.HTTP_204_NO_CONTENT)


@method_decorator(csrf_exempt, name='dispatch')
class delete_member_task(APIView):
    def delete(self, request, task_id):
        field = {
            "task_id": task_id
        }
        update_field = {
            "data_type": "Archived_Data"
        }
        response = dowellconnection(*task_management_reports, "update", field, update_field)
        if response:
            return Response({"message": f"Member Task with id {task_id} has been deleted"}, status=status.HTTP_200_OK)
        else:
            return Response({"message": f"Member Task with id {task_id} failed to be deleted"},
                            status=status.HTTP_304_NOT_MODIFIED)


# api for team_task management ends here____________________________


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
        # print(field)
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
                return Response({"message": "Question updated successfully"}, status=status.HTTP_200_OK)
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
        if data:
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
            if insert_response:
                return Response(
                    {"message": "Response has been created successfully", "info": json.loads(insert_response)},
                    status=status.HTTP_201_CREATED)
            else:
                return Response({"message": "Response failed to be Created"}, status=status.HTTP_304_NOT_MODIFIED)
        else:
            return Response({"message": "Parameters are not valid"}, status=status.HTTP_400_BAD_REQUEST)


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
            "status": data.get("status"),
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
            return Response({"message": f"Candidate has been {data.get('status')}"},
                            status=status.HTTP_304_NOT_MODIFIED)


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
            return Response({"message": "List of responses", "response": json.loads(response)},
                            status=status.HTTP_200_OK)
        else:
            return Response({"error": "data not found"}, status=status.HTTP_204_NO_CONTENT)


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
            "video_link": data.get("video_link"),
            "documentation_link": data.get("documentation_link"),
            "answer_link": data.get("answer_link"),
            "submitted_on": data.get("submitted_on"),
        }
        serializer = SubmitResponseSerializer(data=update_field)
        if serializer.is_valid():
            insert_to_response = dowellconnection(
                *response_modules, "update", field, update_field)

            if insert_to_response:
                return Response({"message": "Response has been submitted"}, status=status.HTTP_200_OK)
            else:
                return Response({"message": "operation failed"}, status=status.HTTP_304_NOT_MODIFIED)
        else:
            default_errors = serializer.errors
            new_error = {}
            for field_name, field_errors in default_errors.items():
                new_error[field_name] = field_errors[0]
            return Response(new_error, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class get_all_responses(APIView):
    def get(self, request, company_id):
        field = {
            "company_id": company_id,
        }
        print(field)
        update_field = {
            "status": "nothing to update"
        }
        response = dowellconnection(
            *response_modules, "find", field, update_field)
        print(response)
        if response:
            return Response({"message": "List of responses", "response": json.loads(response)},
                            status=status.HTTP_200_OK)
        else:
            return Response({"error": "data not found"}, status=status.HTTP_204_NO_CONTENT)

# api for training management ends here______________________
