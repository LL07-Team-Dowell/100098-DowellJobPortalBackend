import json
import requests
import threading
import calendar
import datetime
from dateutil.relativedelta import relativedelta
import jwt
from collections import Counter
from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .constant import *
from .helper import (
    get_event_id,
    dowellconnection,
    call_notification,
    save_image,
    set_finalize,
    update_number,
    update_string,
    discord_invite,
    get_guild_channels,
    get_guild_members,
    create_master_link,
    send_mail,
    interview_email,
    targeted_population,
    period_check,
    validate_and_generate_times,
    CustomValidationError,
    set_date_format,
    update_task_status,
    valid_period,
)
from .serializers import (
    AccountSerializer,
    RejectSerializer,
    AdminSerializer,
    TaskApprovedBySerializer,
    TrainingSerializer,
    UpdateQuestionSerializer,
    CandidateSerializer,
    HRSerializer,
    LeadSerializer,
    TaskSerializer,
    SubmitResponseSerializer,
    SettingUserProfileInfoSerializer,
    UpdateSettingUserProfileInfoSerializer,
    SettingUserProjectSerializer,
    UpdateSettingUserProjectSerializer,
    SettingUserProfileInfo,
    UpdateuserSerializer,
    UserProject,
    CreatePublicLinkSerializer,
    SendMailToPublicSerializer,
    ThreadsSerializer,
    CommentsSerializer,
    PublicProductURLSerializer,
    UpdatePaymentStatusSerializer,
    TaskModuleSerializer,
    GetCandidateTaskSerializer,
    UpdateTaskByCandidateSerializer,
    GetAllCandidateTaskSerializer,
    settingUsersubProjectSerializer,
    ReportSerializer,
    ProjectWiseReportSerializer,
    githubinfoserializer,
)
from .models import UsersubProject

# Create your views here.

INVERVIEW_CALL = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;300;400;500;600&display=swap" rel="stylesheet">
    <title>Interview Invitation</title>
</head>
<body style="font-family: poppins;background-color: #f5f5f5;margin: 0;padding: 0;text-align: center;">
    <div style="max-width: 600px;margin: 20px auto;background-color: #fff;padding: 20px;border-radius: 4px;box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
        <div style= :text-align: center;margin-bottom: 20px;>
            <img src="https://dowellfileuploader.uxlivinglab.online/hr/logo-2-min-min.png" alt="Company Logo" style="width: 200px;">
        </div>
        <div >
            <h3 style="text-align: center;font-size: 24px;margin: 0;margin-bottom: 10px;">Hello {},</h3>
            <img src="https://img.freepik.com/free-vector/people-talking-via-electronic-mail_52683-38063.jpg?size=626&ext=jpg&ga=GA1.1.225976907.1673277028&semt=ais" alt="Interview Image" style="display: block;margin: 0 auto;width: 400px;max-width: 100%;border-radius: 4px;">
        </div>
        <div>
            <p style="margin: 0;margin-bottom: 10px;line-height: 1.5;">Congratulations! You have been invited to interview for the {} job at DoWell UX Living Lab.</p>
            <p style="margin: 0;margin-bottom: 10px;line-height: 1.5;">Here are the details of the interview:</p>
            <p style="margin: 0;margin-bottom: 10px;line-height: 1.5;"><b>Venue:</b> Discord</p>
            <p style="margin: 0;margin-bottom: 10px;line-height: 1.5;"><b>Time:</b> {}</p>
            <br>
            <p style="margin: 0;margin-bottom: 10px;line-height: 1.5;">Kindly click the button below to join the Discord server:</p>
            <a href="https://discord.gg/Qfw7nraNPS" style="display: inline-block;background-color: #007bff;color: #fff;text-decoration: none;padding: 10px 20px;border-radius: 4px;transition: background-color 0.3s ease;text-align: center;" target="_blank">Join Discord Server</a>
        </div>
    </div>
</body>
</html>
"""

INVITATION_MAIL = """

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FULL SIGNUP MAIL</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter&family=Poppins&display=swap" rel="stylesheet">
</head>
<body>
    <div style="width: 80%; margin: 0 auto;font-family: 'Poppins', sans-serif;">
        <img src="https://dowellfileuploader.uxlivinglab.online/hr/logo-2-min-min.png" alt="Dowell Logo" width="70px" height="70px" style="display: block; margin: 0 auto;">
        <div style="width: 80%; margin: 0 auto; text-align: center;">
            <p style="font-size: 2rem; font-weight: 700;">Hello {},</p>
            <img src="https://img.freepik.com/free-vector/reading-letter-concept-illustration_114360-4591.jpg?size=626&ext=jpg&ga=GA1.1.225976907.1673277028&semt=sph" alt="mail-logo" width="250px" height="250px">
        </div>
        <div style="width: 80%; margin: 0 auto; text-align: center;">
            <p style="font-weight: 400; margin: 0; margin-bottom: 1.5rem; margin-top: 1rem;">Congratulations! Your application for {} has been approved at DoWell UX Living Lab.</p>
            <p style="font-weight: 400; margin: 0; margin-bottom: 1.5rem;">Kindly use the button below to create an account and track your application progress.</p> 
            <a href="{}" style="text-decoration: none; cursor: pointer; background-color: #005734; padding: 1rem; border-radius: 0.5rem; display: block; margin: 5rem auto 0; width: max-content;">
                <p style="display: inline-block; margin: 0; color: #fff; font-weight: 600;">
                    Complete full signup
                </p>
            </a>
        </div>
    </div>
</body>
</html>




"""


# api for job portal begins here---------------------------
@method_decorator(csrf_exempt, name="dispatch")
class serverStatus(APIView):
    def get(self, request):
        return Response(
            {"info": "Welcome to Dowell-Job-Portal-Version 2.0"},
            status=status.HTTP_200_OK,
        )


# api for job portal ends here--------------------------------


# api for account management begins here______________________
@method_decorator(csrf_exempt, name="dispatch")
class accounts_onboard_candidate(APIView):
    def post(self, request):
        data = request.data
        if data:
            # continue with the onboard candidate api----------------
            field = {
                "_id": data.get("document_id"),
            }
            update_field = {
                "status": data.get("status"),
                "onboarded_on": data.get("onboarded_on"),
            }
            insert_to_hr_report = {
                "event_id": get_event_id()["event_id"],
                "applicant": data.get("applicant"),
                "project": data.get("project"),
                "status": data.get("status"),
                "company_id": data.get("company_id"),
                "data_type": data.get("data_type"),
                "onboarded_on": data.get("onboarded_on"),
            }
            serializer = AccountSerializer(data=data)
            if serializer.is_valid():
                c_r = []
                a_r = []

                def call_dowellconnection(*args):
                    d = dowellconnection(*args)
                    if "candidate_report" in args:
                        c_r.append(d)
                    if "account_report" in args:
                        a_r.append(d)

                update_response_thread = threading.Thread(
                    target=call_dowellconnection,
                    args=(*candidate_management_reports, "update", field, update_field),
                )
                update_response_thread.start()

                insert_response_thread = threading.Thread(
                    target=call_dowellconnection,
                    args=(
                        *account_management_reports,
                        "insert",
                        insert_to_hr_report,
                        update_field,
                    ),
                )

                insert_response_thread.start()
                update_response_thread.join()
                insert_response_thread.join()

                if (
                    not update_response_thread.is_alive()
                    and not insert_response_thread.is_alive()
                ):
                    if json.loads(c_r[0])["isSuccess"] == True:
                        return Response(
                            {
                                "message": f"Candidate has been {data.get('status')}",
                                "response": json.loads(c_r[0]),
                            },
                            status=status.HTTP_201_CREATED,
                        )
                    else:
                        return Response(
                            {
                                "message": "Operation has failed",
                                "response": json.loads(c_r[0]),
                            },
                            status=status.HTTP_204_NO_CONTENT,
                        )

                else:
                    return Response(
                        {"message": "Operation failed"},
                        status=status.HTTP_304_NOT_MODIFIED,
                    )
            else:
                default_errors = serializer.errors
                new_error = {}
                for field_name, field_errors in default_errors.items():
                    new_error[field_name] = field_errors[0]
                return Response(new_error, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name="dispatch")
class accounts_update_project(APIView):
    def patch(self, request):
        data = request.data
        if data:
            field = {
                "_id": data.get("document_id"),
            }
            update_field = {
                "payment": data.get("payment"),
                "project": data.get("project"),
            }

            c_r = []
            a_r = []

            def call_dowellconnection(*args):
                d = dowellconnection(*args)
                if "candidate_report" in args:
                    c_r.append(d)
                if "account_report" in args:
                    a_r.append(d)

            update_response_thread = threading.Thread(
                target=call_dowellconnection,
                args=(*candidate_management_reports, "update", field, update_field),
            )
            update_response_thread.start()

            insert_response_thread = threading.Thread(
                target=call_dowellconnection,
                args=(*account_management_reports, "update", field, update_field),
            )

            insert_response_thread.start()
            update_response_thread.join()
            insert_response_thread.join()

            if (
                not update_response_thread.is_alive()
                and not insert_response_thread.is_alive()
            ):
                if json.loads(c_r[0])["isSuccess"] == True:
                    return Response(
                        {
                            "message": f"Candidate project and payment has been updated",
                            "response": json.loads(c_r[0]),
                        },
                        status=status.HTTP_201_CREATED,
                    )
                else:
                    return Response(
                        {"message": "Failed to update", "response": json.loads(c_r[0])},
                        status=status.HTTP_204_NO_CONTENT,
                    )
            else:
                return Response(
                    {"message": "Failed to update"}, status=status.HTTP_304_NOT_MODIFIED
                )
        else:
            return Response(
                {"message": "Parameters are not valid"},
                status=status.HTTP_400_BAD_REQUEST,
            )


@method_decorator(csrf_exempt, name="dispatch")
class accounts_rehire_candidate(APIView):
    def post(self, request):
        data = request.data
        if data:
            # continue with the rehire candidate api----------------

            field = {
                "_id": data.get("document_id"),
            }
            update_field = {
                "status": data.get("status"),
                "rehired_on": str(datetime.datetime.now()),
            }

            c_r = []
            a_r = []

            def call_dowellconnection(*args):
                d = dowellconnection(*args)
                # print(d, *args, "=======================")
                if "candidate_report" in args:
                    c_r.append(d)
                if "account_report" in args:
                    a_r.append(d)

            update_response_thread = threading.Thread(
                target=call_dowellconnection,
                args=(*candidate_management_reports, "update", field, update_field),
            )
            update_response_thread.start()

            insert_response_thread = threading.Thread(
                target=call_dowellconnection,
                args=(*account_management_reports, "update", field, update_field),
            )

            insert_response_thread.start()
            update_response_thread.join()
            insert_response_thread.join()

            if (
                not update_response_thread.is_alive()
                and not insert_response_thread.is_alive()
            ):
                if json.loads(c_r[0])["isSuccess"] == True:
                    return Response(
                        {
                            "message": f"Candidate has been rehired",
                            "response": json.loads(c_r[0]),
                        },
                        status=status.HTTP_200_OK,
                    )
                else:
                    return Response(
                        {"message": "Operation failed", "response": json.loads(c_r[0])},
                        status=status.HTTP_204_NO_CONTENT,
                    )
            else:
                return Response(
                    {"message": "Operation failed"}, status=status.HTTP_304_NOT_MODIFIED
                )
        else:
            return Response(
                {"message": "Parameters are not valid"},
                status=status.HTTP_400_BAD_REQUEST,
            )


@method_decorator(csrf_exempt, name="dispatch")
class accounts_reject_candidate(APIView):
    def post(self, request):
        data = request.data
        # print(data)
        if data:
            # continue with the reject candidate api----------------

            field = {
                "_id": data.get("document_id"),
            }
            update_field = {
                "reject_remarks": data.get("reject_remarks"),
                "status": "Rejected",
                "rejected_on": data.get("rejected_on"),
                "data_type": data.get("data_type"),
            }
            insert_to_account_report = {
                "company_id": data.get("company_id"),
                "applicant": data.get("applicant"),
                "username": data.get("username"),
                "reject_remarks": data.get("reject_remarks"),
                "status": "Rejected",
                "data_type": data.get("data_type"),
                "rejected_on": data.get("rejected_on"),
            }
            serializer = RejectSerializer(data=data)
            if serializer.is_valid():
                c_r = []
                a_r = []

                def call_dowellconnection(*args):
                    d = dowellconnection(*args)
                    # print(d, *args, "=======================")
                    if "candidate_report" in args:
                        c_r.append(d)
                    if "account_report" in args:
                        a_r.append(d)

                candidate_thread = threading.Thread(
                    target=call_dowellconnection,
                    args=(*candidate_management_reports, "update", field, update_field),
                )
                candidate_thread.start()

                hr_thread = threading.Thread(
                    target=call_dowellconnection,
                    args=(*hr_management_reports, "update", field, update_field),
                )
                hr_thread.start()

                lead_thread = threading.Thread(
                    target=call_dowellconnection,
                    args=(*lead_management_reports, "update", field, update_field),
                )
                lead_thread.start()
                account_thread = threading.Thread(
                    target=call_dowellconnection,
                    args=(
                        *account_management_reports,
                        "insert",
                        insert_to_account_report,
                        update_field,
                    ),
                )
                account_thread.start()

                hr_thread.join()
                candidate_thread.join()
                lead_thread.join()
                account_thread.join()

                if (
                    not candidate_thread.is_alive()
                    and not hr_thread.is_alive()
                    and not lead_thread.is_alive()
                    and not account_thread.is_alive()
                ):
                    if json.loads(c_r[0])["isSuccess"] == True:
                        return Response(
                            {
                                "message": f"Candidate has been Rejected",
                                "response": json.loads(c_r[0]),
                            },
                            status=status.HTTP_200_OK,
                        )
                    else:
                        return Response(
                            {
                                "message": "Operation failed",
                                "response": json.loads(c_r[0]),
                            },
                            status=status.HTTP_204_NO_CONTENT,
                        )
                else:
                    return Response(
                        {"message": "Operation failed"},
                        status=status.HTTP_304_NOT_MODIFIED,
                    )
            else:
                default_errors = serializer.errors
                new_error = {}
                for field_name, field_errors in default_errors.items():
                    new_error[field_name] = field_errors[0]
                return Response(new_error, status=status.HTTP_400_BAD_REQUEST)


# api for account management ends here______________________


# api for admin management starts here______________________
@method_decorator(csrf_exempt, name="dispatch")
class admin_create_jobs(APIView):
    def post(self, request):
        data = request.data
        # continue create job api-----
        field = {
            "eventId": get_event_id()["event_id"],
            "job_number": data.get("job_number"),
            "job_title": data.get("job_title"),
            "description": data.get("description"),
            "skills": data.get("skills"),
            "qualification": data.get("qualification"),
            "time_interval": data.get("time_interval"),
            "job_category": data.get("job_category"),
            "type_of_job": data.get("type_of_job"),
            "payment": data.get("payment"),
            "is_active": data.get("is_active", False),
            "general_terms": data.get("general_terms"),
            "module": data.get("module"),
            "technical_specification": data.get("technical_specification"),
            "workflow_terms": data.get("workflow_terms"),
            "payment_terms": data.get("payment_terms"),
            "other_info": data.get("other_info"),
            "company_id": data.get("company_id"),
            "data_type": data.get("data_type"),
            "created_by": data.get("created_by"),
            "created_on": data.get("created_on"),
            "paymentInterval": data.get("paymentInterval"),
        }
        update_field = {"status": "nothing to update"}
        serializer = AdminSerializer(data=field)
        if serializer.is_valid():
            response = dowellconnection(*jobs, "insert", field, update_field)
            if json.loads(response)["isSuccess"] == True:
                return Response(
                    {
                        "message": "Job creation was successful.",
                        "response": json.loads(response),
                    },
                    status=status.HTTP_201_CREATED,
                )
            else:
                return Response(
                    {
                        "message": "Job creation has failed",
                        "response": json.loads(response),
                    },
                    status=status.HTTP_204_NO_CONTENT,
                )
        else:
            default_errors = serializer.errors
            new_error = {}
            for field_name, field_errors in default_errors.items():
                new_error[field_name] = field_errors[0]
            return Response(new_error, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name="dispatch")
class admin_get_job(APIView):
    def get(self, request, document_id):
        field = {"_id": document_id}
        update_field = {"status": "nothing to update"}
        response = dowellconnection(*jobs, "fetch", field, update_field)
        if json.loads(response)["isSuccess"] == True:
            if len(json.loads(response)["data"]) == 0:
                return Response(
                    {
                        "message": "Job details do not exist",
                        "response": json.loads(response),
                    },
                    status=status.HTTP_204_NO_CONTENT,
                )
            else:
                return Response(
                    {"message": "List of jobs.", "response": json.loads(response)},
                    status=status.HTTP_200_OK,
                )
        else:
            return Response(
                {
                    "message": "There are no jobs with this id",
                    "response": json.loads(response),
                },
                status=status.HTTP_204_NO_CONTENT,
            )


@method_decorator(csrf_exempt, name="dispatch")
class admin_get_all_jobs(APIView):
    def get(self, request, company_id):
        field = {
            "company_id": company_id,
        }
        update_field = {"status": "nothing to update"}
        response = dowellconnection(*jobs, "fetch", field, update_field)
        if json.loads(response)["isSuccess"] == True:
            if len(json.loads(response)["data"]) == 0:
                return Response(
                    {
                        "message": "There is no job with the company id",
                        "response": json.loads(response),
                    },
                    status=status.HTTP_204_NO_CONTENT,
                )
            else:
                return Response(
                    {"message": "List of jobs.", "response": json.loads(response)},
                    status=status.HTTP_200_OK,
                )
        else:
            return Response(
                {"message": "There is no jobs", "response": json.loads(response)},
                status=status.HTTP_204_NO_CONTENT,
            )


# update the jobs
@method_decorator(csrf_exempt, name="dispatch")
class admin_update_jobs(APIView):
    def patch(self, request):
        data = request.data
        if data:
            field = {"_id": data.get("document_id")}
            update_field = data
            response = dowellconnection(*jobs, "update", field, update_field)
            # print(response)
            if json.loads(response)["isSuccess"] == True:
                return Response(
                    {
                        "message": "Job update was successful",
                        "response": json.loads(response),
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {
                        "message": "Job update has failed",
                        "response": json.loads(response),
                    },
                    status=status.HTTP_204_NO_CONTENT,
                )
        else:
            return Response(
                {"message": "Parameters are not valid"},
                status=status.HTTP_400_BAD_REQUEST,
            )


# delete the jobs


@method_decorator(csrf_exempt, name="dispatch")
class admin_delete_job(APIView):
    def delete(self, request, document_id):
        field = {"_id": document_id}
        update_field = {"data_type": "archive_data"}
        response = dowellconnection(*jobs, "update", field, update_field)
        # print(response)
        if json.loads(response)["isSuccess"] == True:
            return Response(
                {"message": "Job successfully deleted"}, status=status.HTTP_200_OK
            )
        else:
            return Response(
                {
                    "message": "Job not successfully deleted",
                    "response": json.loads(response),
                },
                status=status.HTTP_204_NO_CONTENT,
            )


# api for admin management ends here______________________


# api for candidate management starts here______________________
@method_decorator(csrf_exempt, name="dispatch")
class candidate_apply_job(APIView):
    def is_eligible_to_apply(self, applicant_email):
        data = self.request.data
        field = {
            "applicant": data.get("applicant"),
            "applicant_email": data.get("applicant_email"),
            "username": data.get("username"),
        }
        update_field = {"status": "nothing to update"}
        applicant = dowellconnection(
            *hr_management_reports, "fetch", field, update_field
        )

        # Check if applicant is present in rejected_reports_modules
        if applicant is not None:
            rejected_dates = [
                datetime.datetime.strptime(item["rejected_on"], "%m/%d/%Y %H:%M:%S")
                for item in json.loads(applicant)["data"]
            ]
            if len(rejected_dates) >= 1:
                rejected_on = max(rejected_dates)
                if rejected_on:
                    three_months_after = rejected_on + relativedelta(months=3)
                    current_date = datetime.datetime.today()
                    if (
                        current_date >= three_months_after
                        or current_date == datetime.datetime.today()
                    ):
                        return True
                return True
            else:
                return True

        return False

    def post(self, request):
        data = request.data
        applicant_email = data.get("applicant_email")
        if not self.is_eligible_to_apply(applicant_email):
            return Response(
                {
                    "message": "Not eligible to apply yet.",
                    "response": {
                        "applicant": data.get("applicant"),
                        "applicant_email": data.get("applicant_email"),
                        "username": data.get("username"),
                    },
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # continue apply api-----
        field = {
            "eventId": get_event_id()["event_id"],
            "job_number": data.get("job_number"),
            "job_title": data.get("job_title"),
            "applicant": data.get("applicant"),
            "applicant_email": data.get("applicant_email"),
            "feedBack": data.get("feedBack"),
            "freelancePlatform": data.get("freelancePlatform"),
            "freelancePlatformUrl": data.get("freelancePlatformUrl"),
            "academic_qualification_type": data.get("academic_qualification_type"),
            "academic_qualification": data.get("academic_qualification"),
            "country": data.get("country"),
            "job_category": data.get("job_category"),
            "agree_to_all_terms": data.get("agree_to_all_terms"),
            "internet_speed": data.get("internet_speed"),
            "other_info": data.get("other_info"),
            "project": "",
            "status": "Pending",
            "hr_remarks": "",
            "teamlead_remarks": "",
            "rehire_remarks": "",
            "server_discord_link": "https://discord.gg/Qfw7nraNPS",
            "product_discord_link": "",
            "payment": data.get("payment"),
            "company_id": data.get("company_id"),
            "company_name": data.get("company_name"),
            "username": data.get("username"),
            "portfolio_name": data.get("portfolio_name"),
            "data_type": data.get("data_type"),
            "user_type": data.get("user_type"),
            "scheduled_interview_date": "",
            "application_submitted_on": data.get("application_submitted_on"),
            "shortlisted_on": "",
            "selected_on": "",
            "hired_on": "",
            "onboarded_on": "",
            "module": data.get("module"),
            "payment_requested": False,
            "current_payment_request_status": "",
        }
        update_field = {"status": "nothing to update"}

        serializer = CandidateSerializer(data=field)
        if serializer.is_valid():
            response = dowellconnection(
                *candidate_management_reports, "insert", field, update_field
            )
            if json.loads(response)["isSuccess"] == True:
                return Response(
                    {
                        "message": "Application received.",
                        "Eligibility": self.is_eligible_to_apply(applicant_email),
                        "response": json.loads(response),
                    },
                    status=status.HTTP_201_CREATED,
                )
            else:
                return Response(
                    {
                        "message": "Application failed to receive.",
                        "response": json.loads(response),
                    },
                    status=status.HTTP_304_NOT_MODIFIED,
                )
        else:
            default_errors = serializer.errors
            new_error = {}
            for field_name, field_errors in default_errors.items():
                new_error[field_name] = field_errors[0]
            return Response(new_error, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name="dispatch")
class candidate_get_job_application(APIView):
    def get(self, request, company_id):
        field = {"company_id": company_id}
        update_field = {"status": "nothing to update"}
        response = dowellconnection(
            *candidate_management_reports, "fetch", field, update_field
        )
        # print(response)

        if json.loads(response)["isSuccess"] == True:
            if len(json.loads(response)["data"]) == 0:
                return Response(
                    {
                        "message": "There is no job with the company id",
                        "response": json.loads(response),
                    },
                    status=status.HTTP_204_NO_CONTENT,
                )
            else:
                return Response(
                    {
                        "message": "List of jobs applications",
                        "response": json.loads(response),
                    },
                    status=status.HTTP_200_OK,
                )
        else:
            return Response(
                {
                    "message": "There are no job applications",
                    "response": json.loads(response),
                },
                status=status.HTTP_204_NO_CONTENT,
            )


@method_decorator(csrf_exempt, name="dispatch")
class get_candidate_application(APIView):
    def get(self, request, document_id):
        field = {"_id": document_id}
        update_field = {"status": "nothing to update"}
        response = dowellconnection(
            *candidate_management_reports, "fetch", field, update_field
        )

        if json.loads(response)["isSuccess"] == True:
            if len(json.loads(response)["data"]) == 0:
                return Response(
                    {
                        "message": "There is no candidate job applications with the document id",
                        "response": json.loads(response),
                    },
                    status=status.HTTP_204_NO_CONTENT,
                )
            else:
                return Response(
                    {
                        "message": "Candidate job applications",
                        "response": json.loads(response),
                    },
                    status=status.HTTP_200_OK,
                )
        else:
            return Response(
                {
                    "message": "There are no job applications",
                    "response": json.loads(response),
                },
                status=status.HTTP_204_NO_CONTENT,
            )


@method_decorator(csrf_exempt, name="dispatch")
class get_all_onboarded_candidate(APIView):
    def get(self, request, company_id):
        data = company_id
        if data:
            field = {"company_id": company_id, "status": "hired"}
            response = dowellconnection(
                *candidate_management_reports, "fetch", field, update_field=None
            )

            if json.loads(response)["isSuccess"] == True:
                if len(json.loads(response)["data"]) == 0:
                    return Response(
                        {
                            "message": f"There is no Onboarded Candidates with this company id",
                            "response": json.loads(response),
                        },
                        status=status.HTTP_204_NO_CONTENT,
                    )
                else:
                    return Response(
                        {
                            "message": f"List of Onboarded Candidates",
                            "response": json.loads(response),
                        },
                        status=status.HTTP_200_OK,
                    )
            else:
                return Response(
                    {
                        "message": f"There are no {field['status']} Candidates",
                        "response": json.loads(response),
                    },
                    status=status.HTTP_204_NO_CONTENT,
                )
        else:
            return Response(
                {"message": "Parameters are not valid"},
                status=status.HTTP_400_BAD_REQUEST,
            )


@method_decorator(csrf_exempt, name="dispatch")
class delete_candidate_application(APIView):
    def delete(self, request, document_id):
        field = {"_id": document_id}
        update_field = {"data_type": "Archived_Data"}
        response = dowellconnection(
            *candidate_management_reports, "update", field, update_field
        )

        if json.loads(response)["isSuccess"] == True:
            return Response(
                {
                    "message": "Candidate application deleted successfully",
                    "response": json.loads(response),
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {
                    "message": "There is no job applications",
                    "response": json.loads(response),
                },
                status=status.HTTP_204_NO_CONTENT,
            )


# api for candidate management ends here______________________


# api for hr management starts here______________________
@method_decorator(csrf_exempt, name="dispatch")
class hr_shortlisted_candidate(APIView):
    def post(self, request):
        data = request.data
        if data:
            field = {
                "_id": data.get("document_id"),
            }
            update_field = {
                "hr_remarks": data.get("hr_remarks"),
                "status": data.get("status"),
                "shortlisted_on": data.get("shortlisted_on"),
            }
            insert_to_hr_report = {
                "event_id": get_event_id()["event_id"],
                "applicant": data.get("applicant"),
                "hr_remarks": data.get("hr_remarks"),
                "status": data.get("status"),
                "company_id": data.get("company_id"),
                "data_type": data.get("data_type"),
                "shortlisted_on": data.get("shortlisted_on"),
            }

            serializer = HRSerializer(data=data)
            if serializer.is_valid():
                c_r = []
                h_r = []

                def call_dowellconnection(*args):
                    d = dowellconnection(*args)
                    # print(d, *args, "=======================")
                    if "candidate_report" in args:
                        c_r.append(d)
                    if "hr_report" in args:
                        h_r.append(d)

                update_response_thread = threading.Thread(
                    target=call_dowellconnection,
                    args=(*candidate_management_reports, "update", field, update_field),
                )
                update_response_thread.start()

                insert_response_thread = threading.Thread(
                    target=call_dowellconnection,
                    args=(
                        *hr_management_reports,
                        "insert",
                        insert_to_hr_report,
                        update_field,
                    ),
                )

                insert_response_thread.start()
                update_response_thread.join()
                insert_response_thread.join()

                if (
                    not update_response_thread.is_alive()
                    and not insert_response_thread.is_alive()
                ):
                    if json.loads(c_r[0])["isSuccess"] == True:
                        return Response(
                            {
                                "message": f"Candidate has been {data.get('status')}",
                                "response": json.loads(c_r[0]),
                            },
                            status=status.HTTP_201_CREATED,
                        )
                    else:
                        return Response(
                            {
                                "message": "Operation has failed",
                                "response": json.loads(c_r[0]),
                            },
                            status=status.HTTP_204_NO_CONTENT,
                        )
                else:
                    return Response(
                        {"message": "Operation has failed"},
                        status=status.HTTP_304_NOT_MODIFIED,
                    )
            else:
                default_errors = serializer.errors
                new_error = {}
                for field_name, field_errors in default_errors.items():
                    new_error[field_name] = field_errors[0]
                return Response(new_error, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name="dispatch")
class hr_selected_candidate(APIView):
    def post(self, request):
        data = request.data
        if data:
            field = {
                "_id": data.get("document_id"),
            }
            update_field = {
                "hr_remarks": data.get("hr_remarks"),
                "project": data.get("project"),
                "product_discord_link": data.get("product_discord_link"),
                "status": data.get("status"),
                "selected_on": data.get("selected_on"),
            }
            insert_to_hr_report = {
                "event_id": get_event_id()["event_id"],
                "applicant": data.get("applicant"),
                "hr_remarks": data.get("hr_remarks"),
                "project": data.get("project"),
                "product_discord_link": data.get("product_discord_link"),
                "status": data.get("status"),
                "company_id": data.get("company_id"),
                "data_type": data.get("data_type"),
                "selected_on": data.get("selected_on"),
            }

            c_r = []
            h_r = []

            def call_dowellconnection(*args):
                d = dowellconnection(*args)
                arg = args
                # print(d, *args, "=======================")
                if "candidate_report" in args:
                    c_r.append(d)
                if "hr_report" in args:
                    h_r.append(d)

            update_response_thread = threading.Thread(
                target=call_dowellconnection,
                args=(*candidate_management_reports, "update", field, update_field),
            )
            update_response_thread.start()

            insert_response_thread = threading.Thread(
                target=call_dowellconnection,
                args=(
                    *hr_management_reports,
                    "insert",
                    insert_to_hr_report,
                    update_field,
                ),
            )

            insert_response_thread.start()
            update_response_thread.join()
            insert_response_thread.join()

            if (
                not update_response_thread.is_alive()
                and not insert_response_thread.is_alive()
            ):
                if json.loads(c_r[0])["isSuccess"] == True:
                    return Response(
                        {
                            "message": f"Candidate has been {data.get('status')}",
                            "response": json.loads(c_r[0]),
                        },
                        status=status.HTTP_200_OK,
                    )
                else:
                    return Response(
                        {
                            "message": "Hr Operation has failed",
                            "response": json.loads(c_r[0]),
                        },
                        status=status.HTTP_204_NO_CONTENT,
                    )
            else:
                return Response(
                    {"message": "Hr operation failed"},
                    status=status.HTTP_304_NOT_MODIFIED,
                )
        else:
            return Response(
                {"message": "Parameters are not valid"},
                status=status.HTTP_400_BAD_REQUEST,
            )


@method_decorator(csrf_exempt, name="dispatch")
class hr_reject_candidate(APIView):
    def post(self, request):
        data = request.data
        # print(data)
        if data:
            # continue reject api-----
            field = {
                "_id": data.get("document_id"),
            }
            update_field = {
                "reject_remarks": data.get("reject_remarks"),
                "status": "Rejected",
                "data_type": data.get("data_type"),
                "rejected_on": data.get("rejected_on"),
            }
            insert_to_hr_report = {
                "company_id": data.get("company_id"),
                "applicant": data.get("applicant"),
                "username": data.get("username"),
                "reject_remarks": data.get("reject_remarks"),
                "status": "Rejected",
                "data_type": data.get("data_type"),
                "rejected_on": data.get("rejected_on"),
            }

        serializer = RejectSerializer(data=data)
        if serializer.is_valid():
            candidate_report_result = []
            hr_report_result = []

            def call_dowellconnection(*args):
                try:
                    result = dowellconnection(*args)
                    if "candidate_report" in args:
                        candidate_report_result.append(result)
                    if "hr_report" in args:
                        hr_report_result.append(result)
                except Exception as e:
                    # Handle the exception
                    print(f"Error in call_dowellconnection: {e}")

            candidate_thread = threading.Thread(
                target=call_dowellconnection,
                args=(*candidate_management_reports, "update", field, update_field),
            )
            candidate_thread.start()

            hr_thread = threading.Thread(
                target=call_dowellconnection,
                args=(
                    *hr_management_reports,
                    "insert",
                    insert_to_hr_report,
                    update_field,
                ),
            )
            hr_thread.start()

            candidate_thread.join()
            hr_thread.join()

            if not candidate_thread.is_alive() and not hr_thread.is_alive():
                if json.loads(candidate_report_result[0])["isSuccess"]:
                    return Response(
                        {
                            "message": f"Candidate has been {insert_to_hr_report['status']}",
                            "response": json.loads(candidate_report_result[0]),
                        },
                        status=status.HTTP_201_CREATED,
                    )
                else:
                    return Response(
                        {
                            "message": "Hr Operation failed",
                            "response": json.loads(candidate_report_result[0]),
                        },
                        status=status.HTTP_204_NO_CONTENT,
                    )
            else:
                return Response(
                    {"message": "Hr Operation failed"},
                    status=status.HTTP_304_NOT_MODIFIED,
                )
        else:
            default_errors = serializer.errors
            new_error = {}
            for field_name, field_errors in default_errors.items():
                new_error[field_name] = field_errors[0]
            return Response(new_error, status=status.HTTP_400_BAD_REQUEST)


# api for hr management ends here________________________


# api for lead management starts here________________________
@method_decorator(csrf_exempt, name="dispatch")
class lead_hire_candidate(APIView):
    def post(self, request):
        data = request.data
        if data:
            # continue hire api-----
            field = {
                "_id": data.get("document_id"),
            }
            update_field = {
                "teamlead_remarks": data.get("teamlead_remarks"),
                "status": data.get("status"),
                "hired_on": data.get("hired_on"),
            }
            insert_to_lead_report = {
                "event_id": get_event_id()["event_id"],
                "applicant": data.get("applicant"),
                "teamlead_remarks": data.get("teamlead_remarks"),
                "status": data.get("status"),
                "company_id": data.get("company_id"),
                "data_type": data.get("data_type"),
                "hired_on": data.get("hired_on"),
            }
            serializer = LeadSerializer(data=data)
            if serializer.is_valid():
                c_r = []
                l_r = []

                def call_dowellconnection(*args):
                    d = dowellconnection(*args)
                    # print(d, *args, "=======================")
                    if "candidate_report" in args:
                        c_r.append(d)
                    if "hr_report" in args:
                        l_r.append(d)

                update_response_thread = threading.Thread(
                    target=call_dowellconnection,
                    args=(*candidate_management_reports, "update", field, update_field),
                )
                update_response_thread.start()

                insert_response_thread = threading.Thread(
                    target=call_dowellconnection,
                    args=(
                        *lead_management_reports,
                        "insert",
                        insert_to_lead_report,
                        update_field,
                    ),
                )

                insert_response_thread.start()
                update_response_thread.join()
                insert_response_thread.join()

                if (
                    not update_response_thread.is_alive()
                    and not insert_response_thread.is_alive()
                ):
                    if json.loads(c_r[0])["isSuccess"] == True:
                        return Response(
                            {
                                "message": f"Candidate has been {insert_to_lead_report['status']}",
                                "response": json.loads(c_r[0]),
                            },
                            status=status.HTTP_200_OK,
                        )
                    else:
                        return Response(
                            {
                                "message": "Hr Operation has failed",
                                "response": json.loads(c_r[0]),
                            },
                            status=status.HTTP_204_NO_CONTENT,
                        )
                else:
                    return Response(
                        {"message": "Lead operation failed"},
                        status=status.HTTP_304_NOT_MODIFIED,
                    )

            else:
                default_errors = serializer.errors
                new_error = {}
                for field_name, field_errors in default_errors.items():
                    new_error[field_name] = field_errors[0]
                return Response(new_error, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name="dispatch")
class lead_rehire_candidate(APIView):
    def post(self, request):
        data = request.data
        if data:
            # continue rehire api-----
            field = {
                "_id": data.get("document_id"),
            }
            update_field = {
                "rehire_remarks": data.get("rehire_remarks"),
                "status": "rehired",
                "rehired_on": str(datetime.datetime.now()),
            }
            update_response = dowellconnection(
                *candidate_management_reports, "update", field, update_field
            )
            # print(update_response)
            if json.loads(update_response)["isSuccess"] == True:
                return Response(
                    {
                        "message": f"Candidate has been {update_field['status']}",
                        "response": json.loads(update_response),
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {
                        "message": "Lead Operation failed",
                        "response": json.loads(update_response),
                    },
                    status=status.HTTP_204_NO_CONTENT,
                )
        else:
            return Response(
                {"message": "Parameters are not valid"},
                status=status.HTTP_400_BAD_REQUEST,
            )


@method_decorator(csrf_exempt, name="dispatch")
class lead_reject_candidate(APIView):
    def post(self, request):
        data = request.data
        # print(data)
        if data:
            # continue reject api-----
            field = {
                "_id": data.get("document_id"),
            }
            update_field = {
                "reject_remarks": data.get("reject_remarks"),
                "status": "Rejected",
                "rejected_on": data.get("rejected_on"),
                "data_type": data.get("data_type"),
            }
            insert_to_lead_report = {
                "company_id": data.get("company_id"),
                "applicant": data.get("applicant"),
                "username": data.get("username"),
                "reject_remarks": data.get("reject_remarks"),
                "status": "Rejected",
                "data_type": data.get("data_type"),
                "rejected_on": data.get("rejected_on"),
            }

            serializer = RejectSerializer(data=data)
            if serializer.is_valid():
                c_r = []
                l_r = []

                def call_dowellconnection(*args):
                    d = dowellconnection(*args)
                    arg = args
                    # print(d, *args, "=======================")
                    if "candidate_report" in args:
                        c_r.append(d)
                    if "hr_report" in args:
                        l_r.append(d)

                hr_thread = threading.Thread(
                    target=call_dowellconnection,
                    args=(*hr_management_reports, "update", field, update_field),
                )
                hr_thread.start()

                candidate_thread = threading.Thread(
                    target=call_dowellconnection,
                    args=(*candidate_management_reports, "update", field, update_field),
                )
                candidate_thread.start()

                lead_thread = threading.Thread(
                    target=call_dowellconnection,
                    args=(
                        *lead_management_reports,
                        "insert",
                        insert_to_lead_report,
                        update_field,
                    ),
                )
                lead_thread.start()

                hr_thread.join()
                candidate_thread.join()
                lead_thread.join()

                if (
                    not hr_thread.is_alive()
                    and not candidate_thread.is_alive()
                    and not lead_thread.is_alive()
                ):
                    if json.loads(c_r[0])["isSuccess"] == True:
                        return Response(
                            {
                                "message": f"Candidate has been {insert_to_lead_report['status']}",
                                "response": json.loads(c_r[0]),
                            },
                            status=status.HTTP_201_CREATED,
                        )
                    else:
                        return Response(
                            {
                                "message": "Lead Operation has failed",
                                "response": json.loads(c_r[0]),
                            },
                            status=status.HTTP_204_NO_CONTENT,
                        )
                else:
                    return Response(
                        {
                            "message": "Lead Operation failed",
                            "response": json.loads(c_r[0]),
                        },
                        status=status.HTTP_304_NOT_MODIFIED,
                    )
            else:
                default_errors = serializer.errors
                new_error = {}
                for field_name, field_errors in default_errors.items():
                    new_error[field_name] = field_errors[0]
                return Response(new_error, status=status.HTTP_400_BAD_REQUEST)


# api for lead management ends here________________________


# api for task management starts here________________________
@method_decorator(csrf_exempt, name="dispatch")
class create_task(APIView):
    def max_updated_date(self, updated_date):
        print(updated_date)
        task_updated_date = datetime.datetime.strptime(
            updated_date, "%m/%d/%Y %H:%M:%S"
        )
        _date = task_updated_date + relativedelta(hours=48)
        _date = _date.strftime("%m/%d/%Y %H:%M:%S")

        return str(_date)

    def post(self, request):
        data = request.data
        if data:
            try:
                start_time_dt, end_time_dt = validate_and_generate_times(
                    data.get("task_type"),
                    data.get("task_created_date"),
                    data.get("start_time"),
                    data.get("end_time"),
                )

            except CustomValidationError as e:
                return Response(
                    {"success": False, "error": str(e)},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            field = {
                "eventId": get_event_id()["event_id"],
                "project": data.get("project"),
                "applicant": data.get("applicant"),
                "task": data.get("task"),
                "status": "Incomplete",
                "task_added_by": data.get("task_added_by"),
                "data_type": data.get("data_type"),
                "company_id": data.get("company_id"),
                "task_created_date": data.get("task_created_date"),
                "task_updated_date": "",
                "approval": False,
                "max_updated_date": self.max_updated_date(
                    data.get("task_created_date")
                ),
                "task_type": data.get("task_type"),
                "start_time": start_time_dt,
                "end_time": end_time_dt,
            }
            update_field = {"status": "Nothing to update"}
            insert_response = dowellconnection(
                *task_management_reports, "insert", field, update_field
            )
            # print(insert_response)
            if json.loads(insert_response)["isSuccess"] == True:
                return Response(
                    {
                        "message": "Task has been created successfully",
                        "response": json.loads(insert_response),
                    },
                    status=status.HTTP_201_CREATED,
                )
            else:
                return Response(
                    {
                        "message": "Task failed to be Created",
                        "response": json.loads(insert_response),
                    },
                    status=status.HTTP_204_NO_CONTENT,
                )
        else:
            return Response(
                {"message": "Parameters are not valid"},
                status=status.HTTP_400_BAD_REQUEST,
            )


@method_decorator(csrf_exempt, name="dispatch")
class get_task(APIView):
    def get(self, request, company_id):
        field = {"company_id": company_id}
        update_field = {"status": "Nothing to update"}
        response = dowellconnection(
            *task_management_reports, "fetch", field, update_field
        )
        # print(response)
        if json.loads(response)["isSuccess"] == True:
            if len(json.loads(response)["data"]) == 0:
                return Response(
                    {
                        "message": f"There is no task with this company id",
                        "response": json.loads(response),
                    },
                    status=status.HTTP_204_NO_CONTENT,
                )
            else:
                return Response(
                    {"message": f"List of Task", "response": json.loads(response)},
                    status=status.HTTP_200_OK,
                )
        else:
            return Response(
                {"message": "There are no tasks", "response": json.loads(response)},
                status=status.HTTP_204_NO_CONTENT,
            )


@method_decorator(csrf_exempt, name="dispatch")
class get_candidate_task(APIView):
    def get(self, request, document_id):
        field = {"_id": document_id}
        update_field = {"status": "Nothing to update"}
        response = dowellconnection(
            *task_management_reports, "fetch", field, update_field
        )
        # print(response)
        if json.loads(response)["isSuccess"] == True:
            if len(json.loads(response)["data"]) == 0:
                return Response(
                    {
                        "message": f"There is no task with this document id",
                        "response": json.loads(response),
                    },
                    status=status.HTTP_204_NO_CONTENT,
                )
            else:
                return Response(
                    {"message": f"List of the tasks", "response": json.loads(response)},
                    status=status.HTTP_200_OK,
                )
        else:
            return Response(
                {"message": "There are no tasks", "response": json.loads(response)},
                status=status.HTTP_204_NO_CONTENT,
            )


@method_decorator(csrf_exempt, name="dispatch")
class update_task(APIView):
    def patch(self, request):
        data = request.data
        if data:
            field = {"_id": data.get("document_id")}
            update_field = {
                "status": data.get("status"),
                "task": data.get("task"),
                "task_added_by": data.get("task_added_by"),
                "task_updated_by": data.get("task_updated_by"),
                "task_updated_date": str(datetime.datetime.now()),
            }
            # check if task exists---
            check = dowellconnection(*task_details_module, "fetch", field, update_field)
            if json.loads(check)["isSuccess"] is True:
                if len(json.loads(check)["data"]) == 0:
                    return Response(
                        {
                            "message": "Task failed to be updated, there is no task with this document id",
                            "response": json.loads(check),
                        },
                        status=status.HTTP_404_NOT_FOUND,
                    )
                else:
                    response = dowellconnection(
                        *task_details_module, "update", field, update_field
                    )
                    # print(response, "=========================")
                    if json.loads(response)["isSuccess"] is True:
                        return Response(
                            {
                                "message": "Task updated successfully",
                                "response": json.loads(response),
                            },
                            status=status.HTTP_200_OK,
                        )
                    else:
                        return Response(
                            {
                                "message": "Task failed to be updated",
                                "response": json.loads(response),
                            },
                            status=status.HTTP_204_NO_CONTENT,
                        )
            else:
                return Response(
                    {
                        "message": "Task failed to be updated, there is no task with this document id",
                        "response": json.loads(check),
                    },
                    status=status.HTTP_404_NOT_FOUND,
                )
        else:
            return Response(
                {"message": "Parameters are not valid"},
                status=status.HTTP_400_BAD_REQUEST,
            )


@method_decorator(csrf_exempt, name="dispatch")
class create_task_update_request(APIView):
    def get_existing_request(self, username, portfolio_name, update_task_date):
        field = {
            "username": username,
            "portfolio_name": portfolio_name,
            "update_task_date": update_task_date,
        }
        update_field = {}
        response = dowellconnection(
            *update_task_request_module, "fetch", field, update_field
        )

        response_json = json.loads(response)
        if response_json.get("isSuccess") and response_json.get("data"):
            return True
        else:
            return False

    def post(self, request):
        data = request.data
        if data:
            username = data.get("username")
            portfolio_name = data.get("portfolio_name")
            update_task_date = data.get("update_task_date")

            # Check if there is an existing request with the same update_task_date
            existing_request = self.get_existing_request(
                username, portfolio_name, update_task_date
            )
            if existing_request == True:
                return Response(
                    {
                        "message": "You have already requested an update for this task date.",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            field = {
                "eventId": get_event_id()["event_id"],
                "company_id": data.get("company_id"),
                "username": username,
                "update_task_date": update_task_date,
                "portfolio_name": portfolio_name,
                "project": data.get("project"),
                "update_reason": data.get("update_reason"),
                "approved": False,
                "request_denied": False,
                "reason_for_denial": data.get("reason_for_denial"),
            }
            update_field = {}

            response = dowellconnection(
                *update_task_request_module, "insert", field, update_field
            )
            if json.loads(response)["isSuccess"] is True:
                return Response(
                    {
                        "message": "Task request update created successfully",
                        "response": json.loads(response),
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {
                        "message": "Task update request failed to create",
                        "response": json.loads(response),
                    },
                    status=status.HTTP_304_NOT_MODIFIED,
                )


@method_decorator(csrf_exempt, name="dispatch")
class get_task_request_update(APIView):
    def get(self, request, document_id):
        field = {"_id": document_id}
        update_field = {"status": "Nothing to update"}
        response = dowellconnection(
            *update_task_request_module, "fetch", field, update_field
        )
        if json.loads(response)["isSuccess"] == True:
            if len(json.loads(response)["data"]) == 0:
                return Response(
                    {
                        "message": f"There is no task with this company id",
                        "response": json.loads(response),
                    },
                    status=status.HTTP_204_NO_CONTENT,
                )
            else:
                return Response(
                    {
                        "message": f"List of the Update tasks",
                        "response": json.loads(response),
                    },
                    status=status.HTTP_200_OK,
                )
        else:
            return Response(
                {
                    "message": "There are no update tasks",
                    "response": json.loads(response),
                },
                status=status.HTTP_204_NO_CONTENT,
            )


@method_decorator(csrf_exempt, name="dispatch")
class get_all_task_request_update(APIView):
    def get(self, request, company_id):
        field = {"company_id": company_id}
        update_field = {"status": "Nothing to update"}
        response = dowellconnection(
            *update_task_request_module, "fetch", field, update_field
        )
        # print(response)
        if json.loads(response)["isSuccess"] == True:
            if len(json.loads(response)["data"]) == 0:
                return Response(
                    {
                        "message": "There is no task with this company id",
                        "response": json.loads(response),
                    },
                    status=status.HTTP_204_NO_CONTENT,
                )
            else:
                return Response(
                    {
                        "message": f"List of the Update tasks",
                        "response": json.loads(response),
                    },
                    status=status.HTTP_200_OK,
                )
        else:
            return Response(
                {
                    "message": "There are no update tasks",
                    "response": json.loads(response),
                },
                status=status.HTTP_204_NO_CONTENT,
            )


@method_decorator(csrf_exempt, name="dispatch")
class approve_task_request_update(APIView):
    def check_approvable(self, id):
        response = dowellconnection(
            *update_task_request_module, "fetch", {"_id": id}, {}
        )
        data = json.loads(response)["data"][0]
        if data["request_denied"] is False:
            return True
        else:
            return False

    def patch(self, request, document_id):
        if self.check_approvable(document_id) is True:
            field = {"_id": document_id}
            update_field = {"approved": True}
            response = dowellconnection(
                *update_task_request_module, "update", field, update_field
            )
            response_json = json.loads(response)
            # print(response_json)
            isSuccess = response_json.get("isSuccess", False)

            if isSuccess:
                return Response(
                    {
                        "message": "Task is approved",
                        "response": response_json,
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {
                        "message": "Task approval failed",
                        "response": response_json,
                    },
                    status=status.status.HTTP_400_BAD_REQUEST,
                )
        else:
            return Response(
                {
                    "error": "Task approval failed",
                    "response": "Task has already been denied",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )


@method_decorator(csrf_exempt, name="dispatch")
class denied_task_request_update(APIView):
    def check_deniable(self, id):
        response = dowellconnection(
            *update_task_request_module, "fetch", {"_id": id}, {}
        )
        data = json.loads(response)["data"][0]
        if data["approved"] is False:
            return True
        else:
            return False

    def patch(self, request, document_id):
        data = request.data
        if self.check_deniable(document_id) is True:
            field = {"_id": document_id}
            update_field = {
                "request_denied": True,
                "reason_for_denial": data.get("reason_for_denial"),
            }

            response = dowellconnection(
                *update_task_request_module, "update", field, update_field
            )

            response_json = json.loads(response)
            isSuccess = response_json.get("isSuccess", False)

            if isSuccess:
                return Response(
                    {
                        "message": "Task is denied",
                        "response": response_json,
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {
                        "message": "Task denial failed",
                        "response": response_json,
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
        else:
            return Response(
                {
                    "error": "Task denial failed",
                    "response": "Task has already been approved",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )


@method_decorator(csrf_exempt, name="dispatch")
class approve_task(APIView):
    def max_updated_date(self, updated_date):
        task_updated_date = datetime.datetime.strptime(
            updated_date, "%m/%d/%Y %H:%M:%S"
        )
        _date = task_updated_date + relativedelta(hours=48)
        _date = _date.strftime("%m/%d/%Y %H:%M:%S")

        return str(_date)

    def valid_teamlead(self, portfolio_name):
        profiles = SettingUserProfileInfo.objects.all()
        serializer = SettingUserProfileInfoSerializer(profiles, many=True)
        # print(serializer.data,"----")
        info = dowellconnection(
            *candidate_management_reports,
            "fetch",
            {"username": username},
            update_field=None,
        )
        # print(len(json.loads(info)["data"]),"==========")
        if len(json.loads(info)["data"]) > 0:
            username = json.loads(info)["data"][0]["username"]
            portfolio_name = [
                names["portfolio_name"] for names in json.loads(info)["data"]
            ]

            valid_profiles = []
            for data in serializer.data:
                for d in data["profile_info"]:
                    if "profile_title" in d.keys():
                        if (
                            d["profile_title"] in portfolio_name
                            and d["Role"] == "Proj_Lead"
                        ):
                            valid_profiles.append(d["profile_title"])
            if len(valid_profiles) > 0:
                if valid_profiles[-1] in portfolio_name:
                    return True
                else:
                    return False
        return False

    def approvable(self):
        data = self.request.data
        field = {"_id": data.get("document_id")}
        update_field = {}
        response = dowellconnection(*task_details_module, "fetch", field, update_field)
        if response is not None:
            for item in json.loads(response)["data"]:
                if "max_updated_date" not in item:
                    return True
            current_date = datetime.datetime.today()
            # print(json.loads(response)["data"],"=========")
            try:
                max_updated_dates = [
                    datetime.datetime.strptime(
                        item["max_updated_date"], "%m/%d/%Y %H:%M:%S"
                    )
                    for item in json.loads(response)["data"]
                ]
            except Exception:
                id = json.loads(response)["data"][0]["_id"]
                task_created_date = set_date_format(
                    json.loads(response)["data"][0]["task_created_date"]
                )
                max_updated_date = self.max_updated_date(task_created_date)
                res = dowellconnection(
                    *task_details_module,
                    "update",
                    {"_id": id},
                    {"max_updated_date": max_updated_date},
                )
                print("response:", res)
                resp = dowellconnection(
                    *task_details_module, "fetch", field, update_field
                )
                max_updated_dates = [
                    datetime.datetime.strptime(
                        item["max_updated_date"], "%m/%d/%Y %H:%M:%S"
                    )
                    for item in json.loads(resp)["data"]
                ]

            if len(max_updated_dates) >= 1:
                max_updated_date = max(max_updated_dates)
                if current_date <= max_updated_date:
                    return True
                else:
                    return False
            else:
                return True

        return False

    def patch(self, request):
        data = request.data
        print(data)
        if data:
            field = {"_id": data.get("document_id")}
            update_field = {
                # "status": data.get("status"),
                "task_approved_by": data.get("lead_username")
            }
            serializer = TaskApprovedBySerializer(data=update_field)
            if serializer.is_valid():
                check_approvable = self.approvable()

                if check_approvable is True:
                    validate_teamlead = self.valid_teamlead(data.get("portfolio_name"))
                    if validate_teamlead is False:
                        return Response(
                            {
                                "message": "This username is not valid. Enter valid username for TeamLead",
                            },
                            status=status.HTTP_400_BAD_REQUEST,
                        )
                    update_field["approved"] = check_approvable
                    update_field["approval"] = check_approvable
                    response = dowellconnection(
                        *task_details_module, "update", field, update_field
                    )
                    if json.loads(response)["isSuccess"] is True:
                        return Response(
                            {
                                "message": "Task approved successfully",
                                "response": json.loads(response),
                            },
                            status=status.HTTP_200_OK,
                        )
                    else:
                        return Response(
                            {
                                "message": "Task failed to be approved",
                                "response": json.loads(response),
                            },
                            status=status.HTTP_204_NO_CONTENT,
                        )
                else:
                    return Response(
                        {
                            "message": "Task approval unsuccessful. The 48-hour approval window has elapsed."
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )
            else:
                return Response(
                    {
                        "message": "Task approval unsuccessful. task_approved_by is required"
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

        else:
            return Response(
                {"message": "Parameters are not valid"},
                status=status.HTTP_400_BAD_REQUEST,
            )


@method_decorator(csrf_exempt, name="dispatch")
class delete_task(APIView):
    def delete(self, request, document_id):
        field = {"_id": document_id}
        update_field = {"data_type": "Archived_Data"}
        response = dowellconnection(
            *task_management_reports, "update", field, update_field
        )
        # print(response)
        if json.loads(response)["isSuccess"] == True:
            return Response(
                {
                    "message": "Task deleted successfully",
                    "response": json.loads(response),
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {
                    "message": "Task failed to be deleted",
                    "response": json.loads(response),
                },
                status=status.HTTP_204_NO_CONTENT,
            )


# api for task management ends here________________________

# api for task module starts here____________________________


@method_decorator(csrf_exempt, name="dispatch")
class task_module(APIView):
    def max_updated_date(self, updated_date):
        task_updated_date = datetime.datetime.strptime(updated_date, "%Y-%m-%d")
        _date = task_updated_date + relativedelta(hours=48)
        _date = _date.strftime("%Y-%m-%d %H:%M:%S")
        return _date

    def post(self, request):
        type_request = request.GET.get("type")

        if type_request == "add_task":
            return self.add_task(request)
        elif type_request == "get_candidate_task":
            return self.get_candidate_task(request)
        elif type_request == "update_candidate_task":
            return self.update_candidate_task(request)
        elif type_request == "update_single_task":
            return self.update_single_task(request)
        elif type_request == "get_all_candidate_tasks":
            return self.get_all_candidate_tasks(request)
        else:
            return self.handle_error(request)

    def get(self, request):
        type_request = request.GET.get("type")

        if type_request == "save_task":
            return self.save_task(request)
        elif type_request == "delete_current_task":
            return self.delete_current_task(request)
        else:
            return self.handle_error(request)

    def add_task(self, request):
        data = request.data
        payload = {
            "project": data.get("project"),
            "subproject": data.get("subproject"),
            "applicant": data.get("applicant"),
            "task": data.get("task"),
            "task_added_by": data.get("task_added_by"),
            "data_type": data.get("data_type"),
            "company_id": data.get("company_id"),
            "task_created_date": data.get("task_created_date"),
            "task_type": data.get("task_type"),
            "start_time": data.get("start_time"),
            "end_time": data.get("end_time"),
            "user_id": data.get("user_id"),
            "max_updated_date": self.max_updated_date(data.get("task_created_date")),
        }

        serializer = TaskModuleSerializer(data=payload)
        if serializer.is_valid():
            field = {
                "eventId": get_event_id()["event_id"],
                "applicant": data.get("applicant"),
                "task_added_by": data.get("task_added_by"),
                "data_type": data.get("data_type"),
                "company_id": data.get("company_id"),
                "task_created_date": data.get("task_created_date"),
                "user_id": data.get("user_id"),
                # "max_updated_date": self.max_updated_date(
                #     data.get("task_created_date")
                # ),
                # "status": "Incomplete",
                # "approval": False,
                "task_saved": False,
            }

            response = json.loads(
                dowellconnection(
                    *task_management_reports, "insert", field, update_field=None
                )
            )
            if response["isSuccess"]:
                field = {
                    "task": data.get("task"),
                    "project": data.get("project"),
                    "subproject": data.get("subproject"),
                    "user_id": data.get("user_id"),
                    "task_type": data.get("task_type"),
                    "company_id": data.get("company_id"),
                    "start_time": data.get("start_time"),
                    "end_time": data.get("end_time"),
                    "is_active": True,
                    "task_created_date": data.get("task_created_date"),
                    "task_id": response["inserted_id"],
                    "max_updated_date": self.max_updated_date(
                        data.get("task_created_date")
                    ),
                    "status": "Incomplete",
                    "approval": False,
                }
                response = json.loads(
                    dowellconnection(
                        *task_details_module, "insert", field, update_field=None
                    )
                )
                if response["isSuccess"]:
                    return Response(
                        {
                            "success": True,
                            "message": "Task added successfully",
                            "response": field,
                        },
                        status.HTTP_201_CREATED,
                    )
                else:
                    return Response(
                        {"success": False, "message": "Failed to add task"},
                        status.HTTP_400_BAD_REQUEST,
                    )
            else:
                return Response(
                    {
                        "success": False,
                        "message": "Failed to create task",
                    },
                    status.HTTP_400_BAD_REQUEST,
                )
        else:
            return Response(
                {
                    "success": False,
                    "message": "Posting wrong data to API",
                    "error": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

    def get_candidate_task(self, request):
        data = request.data
        user_id = data.get("user_id")
        company_id = data.get("company_id")
        data_type = data.get("data_type")
        task_created_date = data.get("task_created_date")
        field = {
            "user_id": user_id,
            "company_id": company_id,
            "data_type": data_type,
            "task_created_date": task_created_date,
        }
        serializer = GetCandidateTaskSerializer(data=field)
        if serializer.is_valid():
            task_details_field = {
                "user_id": user_id,
                "company_id": company_id,
                "data_type": data_type,
            }
            respone = json.loads(
                dowellconnection(
                    *task_management_reports,
                    "fetch",
                    task_details_field,
                    update_field=None,
                )
            )
            task_field = {"user_id": user_id, "task_created_date": task_created_date}
            task_resonse = json.loads(
                dowellconnection(
                    *task_details_module, "fetch", task_field, update_field=None
                )
            )
            return Response(
                {
                    "success": True,
                    "message": f"Task details of {user_id}",
                    "task_details": respone["data"],
                    "task": task_resonse["data"],
                },
                status.HTTP_200_OK,
            )
        else:
            return Response(
                {
                    "success": False,
                    "message": "Posting wrong data to API",
                    "error": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

    def update_candidate_task(self, request):
        data = request.data
        payload = {
            "task_id": request.GET.get("task_id"),
            "project": data.get("project"),
            "subproject": data.get("subproject"),
            "task": data.get("task"),
            "data_type": data.get("data_type"),
            "company_id": data.get("company_id"),
            "task_created_date": data.get("task_created_date"),
            "task_type": data.get("task_type"),
            "start_time": data.get("start_time"),
            "end_time": data.get("end_time"),
            "user_id": data.get("user_id"),
        }
        serializer = UpdateTaskByCandidateSerializer(data=payload)
        if serializer.is_valid():
            field = {
                "task": data.get("task"),
                "user_id": data.get("user_id"),
                "company_id": data.get("company_id"),
                "start_time": data.get("start_time"),
                "end_time": data.get("end_time"),
                "task_created_date": data.get("task_created_date"),
                "project": data.get("project"),
                "subproject": data.get("subproject"),
                "task_id": request.GET.get("task_id"),
                "task_type": data.get("task_type"),
                "is_active": True,
                "max_updated_date": self.max_updated_date(
                    data.get("task_created_date")
                ),
                "status": "Incomplete",
                "approval": False,
            }
            response = json.loads(
                dowellconnection(
                    *task_details_module, "insert", field, update_field=None
                )
            )
            if response["isSuccess"]:
                return Response(
                    {
                        "success": True,
                        "message": "Task added successfully",
                        "response": field,
                        "current_task_id": response["inserted_id"],
                    },
                    status.HTTP_201_CREATED,
                )
            else:
                return Response(
                    {"success": True, "message": "Failed to add task"},
                    status.HTTP_400_BAD_REQUEST,
                )
        else:
            return Response(
                {
                    "success": False,
                    "message": "Posting wrong data to API",
                    "error": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

    def save_task(self, request):
        task_id = request.GET.get("task_id")
        field = {"_id": task_id}
        update_field = {"task_saved": True}
        response = json.loads(
            dowellconnection(*task_management_reports, "update", field, update_field)
        )
        if response["isSuccess"]:
            return Response(
                {"success": True, "message": "Task saved successfully"},
                status.HTTP_200_OK,
            )
        else:
            return Response(
                {"success": False, "message": "Failed save task"},
                status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def update_single_task(self, request):
        current_task_id = request.GET.get("current_task_id")
        update_task = request.data.get("update_task")

        field = {"_id": current_task_id}

        update_field = update_task

        response = json.loads(
            dowellconnection(*task_details_module, "update", field, update_field)
        )
        if response["isSuccess"]:
            return Response(
                {
                    "success": True,
                    "message": "Task updated successfully",
                    "response": update_field,
                }
            )
        else:
            return Response({"success": True, "message": "Failed to update task"})

    def delete_current_task(self, request):
        current_task_id = request.GET.get("current_task_id")
        action = request.GET.get("action")

        if action in ["deactive", "active"]:
            is_active = action == "active"
            if update_task_status(self, current_task_id, is_active):
                success_message = (
                    "Task retrieved successfully"
                    if is_active
                    else "Task deleted successfully"
                )
                return Response({"success": True, "message": success_message})
            else:
                return Response(
                    {"success": False, "message": "Failed to perform action on task"}
                )

        return Response({"success": False, "message": "Invalid action"})

    def get_all_candidate_tasks(self, request):
        data = request.data
        company_id = data.get("company_id")
        data_type = data.get("data_type")
        project = data.get("project")

        field = {
            "company_id": company_id,
            "data_type": data_type,
            # "task_created_date": task_created_date
        }
        serializer = GetAllCandidateTaskSerializer(data=field)
        if serializer.is_valid():
            task_details_field = {
                "company_id": company_id,
                "data_type": data_type,
            }
            respone = json.loads(
                dowellconnection(
                    *task_management_reports,
                    "fetch",
                    task_details_field,
                    update_field=None,
                )
            )
            task_field = {
                "project": project,
                "company_id": company_id,
            }
            task_resonse = json.loads(
                dowellconnection(
                    *task_details_module, "fetch", task_field, update_field=None
                )
            )
            return Response(
                {
                    "success": True,
                    "message": f"List of task {company_id}",
                    "task_details": respone["data"],
                    "task": task_resonse["data"],
                },
                status.HTTP_200_OK,
            )
        else:
            return Response(
                {
                    "success": False,
                    "message": "Posting wrong data to API",
                    "error": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

    """HANDLE ERROR"""

    def handle_error(self, request):
        return Response(
            {"success": False, "message": "Invalid request type"},
            status=status.HTTP_400_BAD_REQUEST,
        )


# api for team_module ends here__________________________


# api for team_task management starts here__________________________
@method_decorator(csrf_exempt, name="dispatch")
class create_team(APIView):
    def get_current_datetime(self, date):
        _date = datetime.datetime.strptime(str(date), "%Y-%m-%d %H:%M:%S.%f").strftime(
            "%m/%d/%Y %H:%M:%S"
        )
        return str(_date)

    def post(self, request):
        data = request.data
        if data:
            field = {
                "eventId": get_event_id()["event_id"],
                "team_name": data.get("team_name"),
                "team_description": data.get("team_description"),
                "created_by": data.get("created_by"),
                "date_created": self.get_current_datetime(datetime.datetime.now()),
                "company_id": data.get("company_id"),
                "data_type": data.get("data_type"),
                "members": data.get("members"),
                "admin_team": False,
            }
            if data.get("admin_team"):
                field["admin_team"] = True

            update_field = {"status": "nothing to update"}
            response = dowellconnection(
                *team_management_modules, "insert", field, update_field
            )
            # print(response)
            if json.loads(response)["isSuccess"] == True:
                return Response(
                    {
                        "message": "Team created successfully",
                        "response": json.loads(response),
                    },
                    status=status.HTTP_201_CREATED,
                )
            else:
                return Response(
                    {
                        "message": "Team failed to be created",
                        "response": json.loads(response),
                    },
                    status=status.HTTP_304_NOT_MODIFIED,
                )
        else:
            return Response(
                {"message": "Parameters are not valid"},
                status=status.HTTP_400_BAD_REQUEST,
            )


@method_decorator(csrf_exempt, name="dispatch")
class get_team(APIView):
    def get(self, request, team_id):
        field = {
            "_id": team_id,
        }
        update_field = {"status": "nothing to update"}
        response = dowellconnection(
            *team_management_modules, "fetch", field, update_field
        )
        # print(response)
        if json.loads(response)["isSuccess"] == True:
            if len(json.loads(response)["data"]) == 0:
                return Response(
                    {
                        "message": "There is no team available with ths document id",
                        "response": json.loads(response),
                    },
                    status=status.HTTP_204_NO_CONTENT,
                )
            else:
                return Response(
                    {
                        "message": "List of Teams available",
                        "response": json.loads(response),
                    },
                    status=status.HTTP_200_OK,
                )
        else:
            return Response(
                {
                    "message": "There is no team available with ths document id",
                    "response": json.loads(response),
                },
                status=status.HTTP_204_NO_CONTENT,
            )


@method_decorator(csrf_exempt, name="dispatch")
class get_all_teams(APIView):  # all teams
    def get(self, request, company_id):
        field = {
            "company_id": company_id,
        }
        update_field = {"status": "nothing to update"}
        response = dowellconnection(
            *team_management_modules, "fetch", field, update_field
        )
        # print(response)
        if json.loads(response)["isSuccess"] == True:
            if len(json.loads(response)["data"]) == 0:
                return Response(
                    {
                        "message": "There is no teams with this company id",
                        "response": json.loads(response),
                    },
                    status=status.HTTP_204_NO_CONTENT,
                )
            else:
                return Response(
                    {
                        "message": f"Teams with company id - {company_id} available",
                        "response": json.loads(response),
                    },
                    status=status.HTTP_200_OK,
                )
        else:
            return Response(
                {
                    "message": "There is no team available with ths document id",
                    "response": json.loads(response),
                },
                status=status.HTTP_204_NO_CONTENT,
            )


@method_decorator(csrf_exempt, name="dispatch")
class edit_team(APIView):
    def patch(self, request, team_id):
        data = request.data

        if data:
            field = {
                "_id": team_id,
            }
            update_field = {
                "members": data.get("members"),
                "team_name": data.get("team_name"),
                "team_description": data.get("team_description"),
            }
            # check if task exists---
            check = dowellconnection(
                *team_management_modules, "fetch", field, update_field
            )
            if len(json.loads(check)["data"]) == 0:
                return Response(
                    {
                        "message": "Cannot be Edited, there is no teamwith this id",
                        "response": json.loads(check),
                    },
                    status=status.HTTP_204_NO_CONTENT,
                )
            else:
                response = dowellconnection(
                    *team_management_modules, "update", field, update_field
                )
                # print(response)
                if json.loads(response)["isSuccess"] == True:
                    return Response(
                        {
                            "message": "Team Updated successfully",
                            "response": json.loads(response),
                        },
                        status=status.HTTP_200_OK,
                    )
                else:
                    return Response(
                        {
                            "message": "Team failed to be updated",
                            "response": json.loads(response),
                        },
                        status=status.HTTP_404_NOT_FOUND,
                    )

        else:
            return Response(
                {"message": "Parameters are not valid"},
                status=status.HTTP_400_BAD_REQUEST,
            )


@method_decorator(csrf_exempt, name="dispatch")
class delete_team(APIView):
    def delete(self, request, team_id):
        field = {"_id": team_id}
        update_field = {"data_type": "Archived_Data"}
        response = dowellconnection(
            *team_management_modules, "update", field, update_field
        )
        # print(response)
        if json.loads(response)["isSuccess"] == True:
            return Response(
                {"message": f"Team has been deleted", "response": json.loads(response)},
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {
                    "message": f"Team failed to be deleted",
                    "response": json.loads(response),
                },
                status=status.HTTP_204_NO_CONTENT,
            )


@method_decorator(csrf_exempt, name="dispatch")
class create_team_task(APIView):
    # def max_updated_date(self, updated_date):
    #     task_updated_date = datetime.datetime.strptime(
    #         updated_date, "%m/%d/%Y %H:%M:%S"
    #     )
    #     _date = task_updated_date + relativedelta(hours=12)
    #     _date = _date.strftime('%m/%d/%Y %H:%M:%S')
    #     return str(_date)
    def get_current_datetime(self, date):
        _date = datetime.datetime.strptime(str(date), "%Y-%m-%d %H:%M:%S.%f").strftime(
            "%m/%d/%Y %H:%M:%S"
        )
        return str(_date)

    def post(self, request):
        data = request.data
        if data:
            field = {
                "eventId": get_event_id()["event_id"],
                "title": data.get("title"),
                "description": data.get("description"),
                "assignee": data.get("assignee"),
                "completed": data.get("completed"),
                "team_id": data.get("team_id"),
                "data_type": data.get("data_type"),
                "task_created_date": self.get_current_datetime(datetime.datetime.now()),
                "due_date": data.get("due_date"),
                "task_updated_date": "",
                "approval": False,
                # "max_updated_date": self.max_updated_date(self.get_current_datetime(datetime.datetime.now())),
            }
            update_field = {"status": "nothing to update"}
            response = dowellconnection(
                *task_management_reports, "insert", field, update_field
            )
            # print(response)
            if json.loads(response)["isSuccess"] == True:
                return Response(
                    {
                        "message": "Task created successfully",
                        "response": json.loads(response),
                    },
                    status=status.HTTP_201_CREATED,
                )
            else:
                return Response(
                    {
                        "message": "Task Creation Failed",
                        "response": json.loads(response),
                    },
                    status=status.HTTP_304_NOT_MODIFIED,
                )
        else:
            return Response(
                {"message": "Parameters are not valid"},
                status=status.HTTP_400_BAD_REQUEST,
            )


@method_decorator(csrf_exempt, name="dispatch")
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
            # check if task exists---
            check = dowellconnection(
                *task_management_reports, "fetch", field, update_field
            )
            if len(json.loads(check)["data"]) == 0:
                return Response(
                    {
                        "message": "Cannot be Edited, there is no team task with this id",
                        "response": json.loads(check),
                    },
                    status=status.HTTP_204_NO_CONTENT,
                )
            else:
                response = dowellconnection(
                    *task_management_reports, "update", field, update_field
                )
                # print(response)
                if json.loads(response)["isSuccess"] == True:
                    return Response(
                        {
                            "message": "Team Task Updated successfully",
                            "response": json.loads(response),
                        },
                        status=status.HTTP_200_OK,
                    )
                else:
                    return Response(
                        {
                            "message": "Team Task failed to be updated",
                            "response": json.loads(response),
                        },
                        status=status.HTTP_404_NOT_FOUND,
                    )
        else:
            return Response(
                {"message": "Parameters are not valid"},
                status=status.HTTP_400_BAD_REQUEST,
            )


@method_decorator(csrf_exempt, name="dispatch")
class get_team_task(APIView):
    def get(self, request, team_id):
        field = {
            "team_id": team_id,
        }
        update_field = {"status": "nothing to update"}
        response = dowellconnection(
            *task_management_reports, "fetch", field, update_field
        )

        if json.loads(response)["isSuccess"] == True:
            if len(json.loads(response)["data"]) == 0:
                return Response(
                    {
                        "message": f"There are no tasks with this team id - {team_id}",
                        "success": False,
                        "Data": [],
                    },
                    status=status.HTTP_204_NO_CONTENT,
                )
            else:
                return Response(
                    {
                        "message": f"Tasks with team id - {team_id} available - {len(json.loads(response)['data'])}",
                        "response": json.loads(response),
                    },
                    status=status.HTTP_200_OK,
                )
        else:
            return Response(
                {
                    "message": "There is no task with team id",
                    "response": json.loads(response),
                },
                status=status.HTTP_204_NO_CONTENT,
            )


@method_decorator(csrf_exempt, name="dispatch")
class delete_team_task(APIView):
    def delete(self, request, task_id):
        field = {"_id": task_id}
        update_field = {"data_type": "Archived_Data"}
        response = dowellconnection(
            *task_management_reports, "update", field, update_field
        )
        # print(response)
        if json.loads(response)["isSuccess"] == True:
            return Response(
                {
                    "message": f"Tasks with task id - {task_id} has been deleted",
                    "response": json.loads(response),
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {
                    "message": f"Task with id {task_id} failed to be deleted",
                    "response": json.loads(response),
                },
                status=status.HTTP_204_NO_CONTENT,
            )


# this is the api for creating a task for a team member
@method_decorator(csrf_exempt, name="dispatch")
class create_member_task(APIView):
    def get_current_datetime(self, date):
        _date = datetime.datetime.strptime(str(date), "%Y-%m-%d %H:%M:%S.%f").strftime(
            "%m/%d/%Y %H:%M:%S"
        )
        return str(_date)

    def post(self, request):
        data = request.data
        if data:
            field = {
                "eventId": get_event_id()["event_id"],
                "title": data.get("title"),
                "description": data.get("description"),
                "assignee": data.get("assignee"),
                "completed": data.get("completed"),
                "team_name": data.get("team_name"),
                "task_created_date": self.get_current_datetime(datetime.datetime.now()),
                "team_member": data.get("team_member"),
                "data_type": data.get("data_type"),
            }
            update_field = {"status": "nothing to update"}
            response = dowellconnection(
                *task_management_reports, "insert", field, update_field
            )
            # print(response)
            if json.loads(response)["isSuccess"] == True:
                return Response(
                    {
                        "message": "Task for member created successfully",
                        "response": json.loads(response),
                    },
                    status=status.HTTP_201_CREATED,
                )
            else:
                return Response(
                    {
                        "message": "Task for member Creation Failed",
                        "response": json.loads(response),
                    },
                    status=status.HTTP_204_NO_CONTENT,
                )
        else:
            return Response(
                {"message": "Parameters are not valid"},
                status=status.HTTP_400_BAD_REQUEST,
            )


@method_decorator(csrf_exempt, name="dispatch")
class get_member_task(APIView):
    def get(self, request, task_id):
        field = {
            "_id": task_id,
        }
        update_field = {"status": "nothing to update"}
        response = dowellconnection(
            *task_management_reports, "fetch", field, update_field
        )
        # print(response)
        if json.loads(response)["isSuccess"] == True:
            if len(json.loads(response)["data"]) == 0:
                return Response(
                    {
                        "message": f"There is no member tasks with this task id",
                        "response": json.loads(response),
                    },
                    status=status.HTTP_204_NO_CONTENT,
                )
            else:
                return Response(
                    {
                        "message": f"Member Task with task id - {task_id} available",
                        "response": json.loads(response),
                    },
                    status=status.HTTP_200_OK,
                )
        else:
            return Response(
                {
                    "message": "There is no member tasks with this task id",
                    "response": json.loads(response),
                },
                status=status.HTTP_204_NO_CONTENT,
            )


@method_decorator(csrf_exempt, name="dispatch")
class delete_member_task(APIView):
    def delete(self, request, task_id):
        field = {"_id": task_id}
        update_field = {"data_type": "Archived_Data"}
        response = dowellconnection(
            *task_management_reports, "update", field, update_field
        )
        # print(response)
        if json.loads(response)["isSuccess"] == True:
            return Response(
                {
                    "message": f"Member Task with id {task_id} has been deleted",
                    "response": json.loads(response),
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {
                    "message": f"Member Task with id {task_id} failed to be deleted",
                    "response": json.loads(response),
                },
                status=status.HTTP_204_NO_CONTENT,
            )


# api for team_task management ends here____________________________


# api for training management starts here______________________
@method_decorator(csrf_exempt, name="dispatch")
class create_question(APIView):
    def post(self, request):
        data = request.data
        field = {
            "eventId": get_event_id()["event_id"],
            "company_id": data.get("company_id"),
            "data_type": data.get("data_type"),
            "question_link": data.get("question_link"),
            "module": data.get("module"),
            "created_on": data.get("created_on"),
            "created_by": data.get("created_by"),
            "is_active": data.get("is_active"),
        }
        update_field = {"status": "nothing to update"}
        serializer = TrainingSerializer(data=field)
        if serializer.is_valid():
            question_response = dowellconnection(
                *questionnaire_modules, "insert", field, update_field
            )
            # print(question_response)
            if json.loads(question_response)["isSuccess"] == True:
                return Response(
                    {
                        "message": "Question created successfully",
                        "response": json.loads(question_response),
                    },
                    status=status.HTTP_201_CREATED,
                )
            else:
                return Response(
                    {
                        "message": "Question failed to be created",
                        "response": json.loads(response),
                    },
                    status=status.HTTP_304_NOT_MODIFIED,
                )
        else:
            default_errors = serializer.errors
            new_error = {}
            for field_name, field_errors in default_errors.items():
                new_error[field_name] = field_errors[0]
            return Response(new_error, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name="dispatch")
class get_all_question(APIView):
    def get(self, request, company_id):
        field = {
            "company_id": company_id,
        }
        update_field = {"status": "nothing to update"}
        question_response = dowellconnection(
            *questionnaire_modules, "fetch", field, update_field
        )
        # print("----response from dowelconnection---", question_response)
        # print(question_response)
        if json.loads(question_response)["isSuccess"] == True:
            if len(json.loads(question_response)["data"]) == 0:
                return Response(
                    {
                        "message": f"There is no questions",
                        "response": json.loads(question_response),
                    },
                    status=status.HTTP_204_NO_CONTENT,
                )
            else:
                return Response(
                    {
                        "message": f"List of questions",
                        "response": json.loads(question_response),
                    },
                    status=status.HTTP_200_OK,
                )
        return Response(
            {
                "error": "There is no questions",
                "response": json.loads(question_response),
            },
            status=status.HTTP_204_NO_CONTENT,
        )


@method_decorator(csrf_exempt, name="dispatch")
class get_question(APIView):
    def get(self, request, document_id):
        field = {
            "_id": document_id,
        }
        update_field = {"status": "nothing to update"}
        question_response = dowellconnection(
            *questionnaire_modules, "fetch", field, update_field
        )
        # print(question_response)
        if json.loads(question_response)["isSuccess"] == True:
            if len(json.loads(question_response)["data"]) == 0:
                return Response(
                    {
                        "message": f"There is no questions",
                        "response": json.loads(question_response),
                    },
                    status=status.HTTP_204_NO_CONTENT,
                )
            else:
                return Response(
                    {
                        "message": f"List of questions",
                        "response": json.loads(question_response),
                    },
                    status=status.HTTP_200_OK,
                )
        else:
            return Response(
                {
                    "error": "No question found",
                    "response": json.loads(question_response),
                },
                status=status.HTTP_204_NO_CONTENT,
            )


@method_decorator(csrf_exempt, name="dispatch")
class update_question(APIView):
    def patch(self, request):
        data = request.data
        field = {
            "_id": data.get("document_id"),
        }
        # print(field)
        update_field = {
            "is_active": data.get("is_active"),
            "question_link": data.get("question_link"),
        }
        serializer = UpdateQuestionSerializer(data=update_field)
        if serializer.is_valid():
            question_response = dowellconnection(
                *questionnaire_modules, "update", field, update_field
            )
            # print(question_response)
            if json.loads(question_response)["isSuccess"] == True:
                return Response(
                    {
                        "message": "Question updated successfully",
                        "response": json.loads(question_response),
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {
                        "message": "Question failed to update",
                        "response": json.loads(question_response),
                    },
                    status=status.HTTP_204_NO_CONTENT,
                )

        else:
            default_errors = serializer.errors
            new_error = {}
            for field_name, field_errors in default_errors.items():
                new_error[field_name] = field_errors[0]
            return Response(new_error, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name="dispatch")
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
                "rating": data.get("rating"),
                "portfolio_name": data.get("portfolio_name"),
            }
            update_field = {}
            insert_response = dowellconnection(
                *response_modules, "insert", field, update_field
            )
            # print(insert_response)
            if json.loads(insert_response)["isSuccess"] == True:
                return Response(
                    {
                        "message": "Response has been created successfully",
                        "info": json.loads(insert_response),
                    },
                    status=status.HTTP_201_CREATED,
                )
            else:
                return Response(
                    {"message": "Response failed to be Created"},
                    status=status.HTTP_304_NOT_MODIFIED,
                )
        else:
            return Response(
                {"message": "Parameters are not valid"},
                status=status.HTTP_400_BAD_REQUEST,
            )


@method_decorator(csrf_exempt, name="dispatch")
class update_response(APIView):
    def patch(self, request):
        data = request.data
        field = {
            "_id": data.get("document_id"),
        }
        update_field = {
            "code_base_link": data.get("code_base_link"),
            "live_link": data.get("live_link"),
            "documentation_link": data.get("documentation_link"),
        }
        insert_to_hr_report = {
            "status": data.get("status"),
        }

        r_m = []
        h_r = []

        def call_dowellconnection(*args):
            d = dowellconnection(*args)
            arg = args
            # print(d, *args, "=======================")
            if "Response_report" in args:
                r_m.append(d)
            if "hr_report" in args:
                h_r.append(d)

        insert_to_response_thread = threading.Thread(
            target=call_dowellconnection,
            args=(*response_modules, "insert", field, update_field),
        )
        insert_to_response_thread.start()

        update_to_hr_thread = threading.Thread(
            target=call_dowellconnection,
            args=(*hr_management_reports, "update", insert_to_hr_report, update_field),
        )

        update_to_hr_thread.start()
        update_to_hr_thread.join()
        insert_to_response_thread.join()

        if (
            not insert_to_response_thread.is_alive()
            and not update_to_hr_thread.is_alive()
        ):
            if json.loads(r_m[0])["isSuccess"] == True:
                return Response(
                    {
                        "message": f"Candidate has been {data.get('status')}",
                        "response": json.loads(r_m[0]),
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {
                        "message": f"Candidate has been {data.get('status')}",
                        "response": json.loads(r_m[0]),
                    },
                    status=status.HTTP_204_NO_CONTENT,
                )
        else:
            return Response(
                {"message": f"Candidate has been {data.get('status')}"},
                status=status.HTTP_304_NOT_MODIFIED,
            )


@method_decorator(csrf_exempt, name="dispatch")
class update_rating(APIView):
    def is_numeric(self, value):
        try:
            float(value)
            return True

        except (ValueError, TypeError):
            return False

    def patch(self, request):
        data = request.data
        rating = data.get("rating")
        validated_rating = self.is_numeric(rating)

        if validated_rating is False:
            return Response(
                {"success": False, "message": "Rating must be numeric value"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if float(rating) > 5:
            return Response(
                {"error": "Rating must be less than or equal to 5."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        field = {
            "_id": data.get("document_id"),
        }
        update_field = {
            "rating": data.get("rating"),
        }

        update_rating = dowellconnection(
            *response_modules, "update", field, update_field
        )
        res = json.loads(update_rating)
        # print(res)
        if res.get("isSuccess") == True:
            return Response(
                {
                    "succes": True,
                    "message": f"rating has been changed to {data.get('rating')}",
                }
            )

        else:
            return Response(
                {
                    "succes": False,
                    "message": f"dowell connection is not responding while updateing the rating",
                }
            )


@method_decorator(csrf_exempt, name="dispatch")
class get_response(APIView):
    def get(self, request, document_id):
        field = {
            "_id": document_id,
        }
        update_field = {"status": "nothing to update"}
        response = dowellconnection(*response_modules, "fetch", field, update_field)
        # print(response)
        if json.loads(response)["isSuccess"] == True:
            if len(json.loads(response)["data"]) == 0:
                return Response(
                    {
                        "message": f"There is no responses",
                        "response": json.loads(response),
                    },
                    status=status.HTTP_204_NO_CONTENT,
                )
            else:
                return Response(
                    {"message": f"List of responses", "response": json.loads(response)},
                    status=status.HTTP_200_OK,
                )
        else:
            return Response(
                {"message": "There is no responses", "response": json.loads(response)},
                status=status.HTTP_204_NO_CONTENT,
            )


@method_decorator(csrf_exempt, name="dispatch")
class submit_response(APIView):
    def patch(self, request):
        data = request.data
        field = {"_id": data.get("document_id")}
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
                *response_modules, "update", field, update_field
            )
            # print(insert_to_response)

            if json.loads(insert_to_response)["isSuccess"] == True:
                return Response(
                    {
                        "message": f"Response has been submitted",
                        "response": json.loads(insert_to_response),
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {
                        "message": "Response failed to be submitted",
                        "response": json.loads(insert_to_response),
                    },
                    status=status.HTTP_204_NO_CONTENT,
                )

        else:
            default_errors = serializer.errors
            new_error = {}
            for field_name, field_errors in default_errors.items():
                new_error[field_name] = field_errors[0]
            return Response(new_error, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name="dispatch")
class get_all_responses(APIView):
    def get(self, request, company_id):
        field = {
            "company_id": company_id,
        }
        # print(field)
        update_field = {"status": "nothing to update"}
        response = dowellconnection(*response_modules, "fetch", field, update_field)
        # print(response)
        if json.loads(response)["isSuccess"] == True:
            if len(json.loads(response)["data"]) == 0:
                return Response(
                    {
                        "message": f"There is no responses",
                        "response": json.loads(response),
                    },
                    status=status.HTTP_204_NO_CONTENT,
                )
            else:
                return Response(
                    {"message": f"List of responses", "response": json.loads(response)},
                    status=status.HTTP_200_OK,
                )
        else:
            return Response(
                {"message": f"There is no responses", "response": json.loads(response)},
                status=status.HTTP_204_NO_CONTENT,
            )


# api for training management ends here______________________


# api for setting starts here___________________________
@method_decorator(csrf_exempt, name="dispatch")
class SettingUserProfileInfoView(APIView):
    serializer_class = SettingUserProfileInfoSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(raise_exception=True):
            for data in request.data["profile_info"]:
                if not "version" in data.keys():
                    return Response(
                        {"error": " 'version', is not in parameter"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                if len(data["version"]) == 0:
                    return Response(
                        {"error": " the parameter 'version', cannot be empty"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        profiles = SettingUserProfileInfo.objects.all()
        serializer = self.serializer_class(profiles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk, *args, **kwargs):
        data = request.data
        setting = SettingUserProfileInfo.objects.get(pk=pk)
        serializer = UpdateSettingUserProfileInfoSerializer(setting, data=request.data)

        if serializer.is_valid():
            try:
                index = len(setting.profile_info) - 1
                current_version = setting.profile_info[index]["version"]
            except Exception:
                current_version = "1"

            new_profile_info = {
                "profile_title": data["profile_title"],
                "Role": data["Role"],
                "project": data["project"],
                "version": update_number(current_version),
            }

            payload_keys = request.data.keys()
            for key in payload_keys:
                if key == "additional_projects" or key == "other_roles":
                    if isinstance(request.data[key], list):
                        new_profile_info[key] = request.data[key]
                    else:
                        return Response(
                            {"success": False, "error": f"{key} must be a list"},
                            status=status.HTTP_400_BAD_REQUEST,
                        )

            setting.profile_info.append(new_profile_info)
            setting.save()

            old_version = setting.profile_info[-2]["version"]
            setting.profile_info[-2]["version"] = update_string(old_version)
            setting.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.error_messages, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, *args, **kwargs):
        try:
            setting = SettingUserProfileInfo.objects.get(pk=pk)
        except SettingUserProfileInfo.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": "the given user _id does not match with the database",
                },
                status=status.HTTP_404_NOT_FOUND,
            )
        setting.data_type = "Archived_Data"
        new_data_type = "Archived_Data"
        setting.save()
        return Response(
            {
                "success": True,
                "message": f"Data_type for the user has been changes to  {new_data_type}",
            },
            status=status.HTTP_200_OK,
        )


@method_decorator(csrf_exempt, name="dispatch")
class SettingUserProjectView(APIView):
    serializer_class = SettingUserProjectSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        profiles = UserProject.objects.all()
        serializer = self.serializer_class(profiles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        my_model = UserProject.objects.get(pk=pk)
        serializer = SettingUserProjectSerializer(my_model, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name="dispatch")
class settingUserSubProject(APIView):
    serializer_class = settingUsersubProjectSerializer

    def get(self, request, pk=None):
        if pk is not None:
            try:
                model = UsersubProject.objects.get(pk=pk)
            except UsersubProject.DoesNotExist:
                return Response(
                    {"success": False, "message": "user id does not exist"},
                    status=status.HTTP_404_NOT_FOUND,
                )
        else:
            model = UsersubProject.objects.all()

        serializer = self.serializer_class(model, many=True if pk is None else False)

        return Response({"success": True, "data": serializer.data})

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        try:
            my_model = UsersubProject.objects.get(pk=pk)
        except UsersubProject.DoesNotExist:
            return Response(
                {"success": False, "message": "The provided user id not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = self.serializer_class(instance=my_model, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"success": True, "message": f"User Subproject has been Updated "},
                status=status.HTTP_200_OK,
            )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, *args, **kwargs):
        try:
            setting = UsersubProject.objects.get(pk=pk)
        except UsersubProject.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": "the given user _id does not match with the database",
                },
                status=status.HTTP_404_NOT_FOUND,
            )
        setting.data_type = "Archived_Data"
        new_data_type = "Archived_Data"
        setting.save()
        return Response(
            {
                "success": True,
                "message": f"Data_type for the user has been changed to  {new_data_type}",
            },
            status=status.HTTP_200_OK,
        )


# api for setting ends here____________________________


# api for discord starts here____________________________
@method_decorator(csrf_exempt, name="dispatch")
class generate_discord_invite(APIView):
    def post(self, request):
        data = request.data
        if data:
            # generate invite link-------------------
            invite = discord_invite(
                server_owner_ids=data.get("owners_ids"),
                guild_id=data.get("guild_id"),
                token=data.get("bot_token"),
            )
            # print(invite[0])
            if invite:
                return Response(
                    {
                        "message": "Invite link has been generated successfully",
                        "response": {
                            "invite_link": f"{invite[0]}",
                            "server": f"{invite}",
                        },
                    },
                    status=status.HTTP_201_CREATED,
                )
            else:
                return Response(
                    {"message": "Invite link failed to be generated"},
                    status=status.HTTP_304_NOT_MODIFIED,
                )
        else:
            return Response(
                {"message": "Parameters are not valid"},
                status=status.HTTP_400_BAD_REQUEST,
            )


@method_decorator(csrf_exempt, name="dispatch")
class get_discord_server_channels(APIView):
    def get(self, request, guild_id, token):
        # print(token,"=====----------------", guild_id)
        channels = get_guild_channels(guildid=guild_id, token=token)
        # print(channels)
        if len(channels) != 0:
            return Response(
                {
                    "message": "List of channels in server",
                    "response": {
                        "num of channels": len(channels),
                        "channels": channels,
                    },
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"message": "There is no channels", "response": channels},
                status=status.HTTP_204_NO_CONTENT,
            )


@method_decorator(csrf_exempt, name="dispatch")
class get_discord_server_members(APIView):
    def get(self, request, guild_id, token):
        # print(token,"=====----------------", guild_id)
        members = get_guild_members(guildid=guild_id, token=token)
        # print(members)
        if len(members) != 0:
            return Response(
                {
                    "message": "List of members in server",
                    "response": {
                        "num of members": len(members),
                        "members": members,
                    },
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"message": f"There is no members", "response": members},
                status=status.HTTP_204_NO_CONTENT,
            )


# api for discord ends here____________________________


# public api for job creation__________________________
@method_decorator(csrf_exempt, name="dispatch")
class Public_apply_job(APIView):
    def post(self, request):
        link_id = request.GET.get("link_id")
        data = request.data
        field = {
            "eventId": get_event_id()["event_id"],
            "job_number": data.get("job_number"),
            "job_title": data.get("job_title"),
            "applicant": data.get("applicant"),
            "applicant_email": data.get("applicant_email"),
            "feedBack": data.get("feedBack"),
            "freelancePlatform": data.get("freelancePlatform"),
            "freelancePlatformUrl": data.get("freelancePlatformUrl"),
            "academic_qualification_type": data.get("academic_qualification_type"),
            "academic_qualification": data.get("academic_qualification"),
            "country": data.get("country"),
            "job_category": data.get("job_category"),
            "agree_to_all_terms": data.get("agree_to_all_terms"),
            "internet_speed": data.get("internet_speed"),
            "other_info": data.get("other_info"),
            "project": "",
            "status": "Guest_Pending",
            "hr_remarks": "",
            "teamlead_remarks": "",
            "rehire_remarks": "",
            "server_discord_link": "https://discord.gg/Qfw7nraNPS",
            "product_discord_link": "",
            "payment": data.get("payment"),
            "company_id": data.get("company_id"),
            "company_name": data.get("company_name"),
            "username": data.get("username"),
            "portfolio_name": data.get("portfolio_name"),
            "data_type": data.get("data_type"),
            "user_type": data.get("user_type"),
            "scheduled_interview_date": "",
            "application_submitted_on": data.get("application_submitted_on"),
            "shortlisted_on": "",
            "selected_on": "",
            "hired_on": "",
            "onboarded_on": "",
            "module": data.get("module"),
            "is_public": True,
            "signup_mail_sent": False,
        }
        update_field = {"status": "nothing to update"}
        update_field = {"status": "nothing to update"}

        serializer = CandidateSerializer(data=field)
        if serializer.is_valid():
            response = dowellconnection(
                *candidate_management_reports, "insert", field, update_field
            )
            if json.loads(response)["isSuccess"] == True:
                set_finalize(linkid=link_id)
                return Response(
                    {
                        "message": "Application received.",
                        "response": json.loads(response),
                    },
                    status=status.HTTP_201_CREATED,
                )
            else:
                return Response(
                    {
                        "message": "Application failed to receive.",
                        "response": json.loads(response),
                    },
                    status=status.HTTP_304_NOT_MODIFIED,
                )
        else:
            default_errors = serializer.errors
            new_error = {}
            for field_name, field_errors in default_errors.items():
                new_error[field_name] = field_errors[0]
            return Response(new_error, status=status.HTTP_400_BAD_REQUEST)


# Generating public link for job application


@method_decorator(csrf_exempt, name="dispatch")
class createPublicApplication(APIView):
    """Create Job Public Job Application link using QRCode function"""

    def post(self, request):
        field = {
            "qr_ids": request.data.get("qr_ids"),
            "job_company_id": request.data.get("job_company_id"),
            "job_id": request.data.get("job_id"),
            "job_name": request.data.get("job_name"),
            "company_data_type": request.data.get("company_data_type"),
        }
        serializer = CreatePublicLinkSerializer(data=field)
        if serializer.is_valid():
            qr_ids = field["qr_ids"]
            generated_links = [
                {
                    "link": generate_public_link.format(
                        qr_id,
                        field["job_company_id"],
                        field["job_id"],
                        field["company_data_type"],
                    )
                }
                for qr_id in qr_ids
            ]
            response_qr_code = create_master_link(
                field["job_company_id"], generated_links, field["job_name"]
            )
            response = json.loads(response_qr_code)
            fields = {
                "eventId": get_event_id()["event_id"],
                "job_company_id": field["job_company_id"],
                "company_data_type": field["company_data_type"],
                "job_id": field["job_id"],
                "job_name": field["job_name"],
                "qr_ids": field["qr_ids"],
                "generated_links": generated_links,
                "master_link": response["qrcodes"][0]["masterlink"],
                "qr_code": response["qrcodes"][0]["qrcode_image_url"],
                "qrcode_id": response["qrcodes"][0]["qrcode_id"],
                "api_key": response["qrcodes"][0]["links"][0]["response"]["api_key"],
            }
            update_field = {"status": "Nothing to update"}
            dowellresponse = dowellconnection(
                *Publiclink_reports, "insert", fields, update_field
            )
            return Response(
                {
                    "success": True,
                    "message": "Master link for public job apllication generated successfully",
                    "master_link": response["qrcodes"][0]["masterlink"],
                    "qr_code": response["qrcodes"][0]["qrcode_image_url"],
                    "job_name": response["qrcodes"][0]["document_name"],
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {
                    "success": False,
                    "message": "Failed to generate master link for public job apllication",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

    def get(self, request, company_id):
        # print(company_id)
        field = {"job_company_id": company_id}
        update_field = {"status": "Nothing to update"}
        responses = dowellconnection(*Publiclink_reports, "fetch", field, update_field)
        response = json.loads(responses)
        # print(response)

        data = []
        for i in response["data"]:
            try:
                link_and_id = {
                    "master_link": i["master_link"],
                    "job_id": i["job_id"],
                    "qr_link": i["qr_code"],
                    "document_id": i["_id"],
                }
                data.append(link_and_id)
            except KeyError:
                pass

            # master_links.append(i["job_id"])

        if response["isSuccess"] == True:
            return Response(
                {
                    "success": True,
                    "message": "Master link deatils.",
                    "data": data,
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"success": False, "message": "User details is not updated."},
                status=status.HTTP_400_BAD_REQUEST,
            )


@method_decorator(csrf_exempt, name="dispatch")
class sendMailToPublicCandidate(APIView):
    """Sending Mail to public user"""

    def post(self, request):
        qr_id = request.data.get("qr_id")
        org_name = request.data.get("org_name")
        org_id = request.data.get("org_id")
        owner_name = request.data.get("owner_name")
        portfolio_name = request.data.get("portfolio_name")
        unique_id = request.data.get("unique_id")
        product = request.data.get("product")
        role = request.data.get("role")
        member_type = request.data.get("member_type")
        toemail = request.data.get("toemail")
        toname = request.data.get("toname")
        subject = request.data.get("subject")
        job_role = request.data.get("job_role")
        data_type = request.data.get("data_type")
        date_time = request.data.get("date_time")

        data = {
            "qr_id": qr_id,
            "org_name": org_name,
            "org_id": org_id,
            "owner_name": owner_name,
            "portfolio_name": portfolio_name,
            "unique_id": unique_id,
            "product": product,
            "role": role,
            "member_type": member_type,
            "toemail": toemail,
            "toname": toname,
            "subject": subject,
            "job_role": job_role,
            "data_type": data_type,
            "date_time": date_time,
        }

        serializer = SendMailToPublicSerializer(data=data)
        if serializer.is_valid():
            encoded_jwt = jwt.encode(
                {
                    "qr_id": qr_id,
                    "org_name": org_name,
                    "org_id": org_id,
                    "owner_name": owner_name,
                    "portfolio_name": portfolio_name,
                    "unique_id": unique_id,
                    "product": product,
                    "role": role,
                    "member_type": member_type,
                    "toemail": toemail,
                    "toname": toname,
                    "data_type": data_type,
                    "date_time": date_time,
                    "job_role": job_role,
                },
                "secret",
                algorithm="HS256",
            )
            link = f"https://100014.pythonanywhere.com/?hr_invitation={encoded_jwt.decode('utf-8')}"
            print("------link new------", link)
            email_content = INVITATION_MAIL.format(toname, job_role, link)
            mail_response = interview_email(toname, toemail, subject, email_content)

            # update the public api by username==================
            field = {"username": qr_id}
            update_field = {"signup_mail_sent": True}
            update_public_application = dowellconnection(
                *candidate_management_reports, "update", field, update_field
            )

            response = json.loads(mail_response)
            if response["success"]:
                return Response(
                    {
                        "success": True,
                        "message": f"Mail sent successfully to {toname}",
                        "response": response,
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {"message": "Something went wrong", "response": response},
                    status=status.HTTP_401_UNAUTHORIZED,
                )
        else:
            return Response(
                {
                    "success": False,
                    "message": "Something went wrong",
                    "error": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )


@method_decorator(csrf_exempt, name="dispatch")
class updateTheUserDetails(APIView):
    """Update the user details by login team"""

    def post(self, request):
        qr_id = request.data.get("qr_id")
        username = request.data.get("username")
        portfolio_name = request.data.get("portfolio_name")
        job_role = request.data.get("job_role")
        date_time = request.data.get("date_time")
        toemail = request.data.get("toemail")
        field = {
            "username": qr_id,
        }
        update_field = {
            "username": username,
            "portfolio_name": portfolio_name,
            "status": "Pending",
        }
        serializer = UpdateuserSerializer(data=request.data)
        if serializer.is_valid():
            response = dowellconnection(
                *candidate_management_reports, "update", field, update_field
            )
            if json.loads(response)["isSuccess"] == True:
                email_content = INVERVIEW_CALL.format(username, job_role, date_time)
                subject = "Interview call from DoWell UX Living Lab"
                send_interview_email = interview_email(
                    username, toemail, subject, email_content
                )
                if json.loads(send_interview_email)["success"]:
                    return Response(
                        {"success": True, "message": "User details is updated."},
                        status=status.HTTP_200_OK,
                    )
                else:
                    return Response(
                        {"success": False, "message": "Mail was not sent."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
            else:
                return Response(
                    {"success": False, "message": "User details is not updated."},
                    status=status.HTTP_400_BAD_REQUEST,
                )


@method_decorator(csrf_exempt, name="dispatch")
class public_product(APIView):
    def post(self, request):
        field = {
            "public_link_name": request.data.get("public_link_name"),
            "product_url": request.data.get("product_url"),
            "qr_ids": request.data.get("qr_ids"),
            "job_company_id": request.data.get("job_company_id"),
            "company_data_type": request.data.get("company_data_type"),
            "job_category": request.data.get("job_category"),
            "report_type": request.data.get("report_type"),
            "start_date": request.data.get("start_date"),
            "end_date": request.data.get("end_date"),
            "threshold": request.data.get("threshold"),
        }
        serializer = PublicProductURLSerializer(data=request.data)
        if serializer.is_valid():
            qr_ids = field["qr_ids"]
            job_category = request.data.get("job_category")
            report_type = request.data.get("report_type")

            if job_category:
                # print(job_category)
                generated_links = [
                    {
                        "link": generate_product_link_with_category.format(
                            field["product_url"],
                            qr_id,
                            field["job_company_id"],
                            field["company_data_type"],
                            field["job_category"],
                        )
                    }
                    for qr_id in qr_ids
                ]
            elif report_type:
                if report_type == "leaderboard":
                    generated_links = [
                        {
                            "link": generate_report_link_leaderboard.format(
                                field["product_url"],
                                qr_id,
                                field["job_company_id"],
                                field["company_data_type"],
                                field["report_type"],
                                field["start_date"],
                                field["end_date"],
                                field["threshold"],
                            )
                        }
                        for qr_id in qr_ids
                    ]
                elif report_type == "organization":
                    generated_links = [
                        {
                            "link": generate_report_link_org.format(
                                field["product_url"],
                                qr_id,
                                field["job_company_id"],
                                field["company_data_type"],
                                field["report_type"],
                                field["start_date"],
                                field["end_date"],
                            )
                        }
                        for qr_id in qr_ids
                    ]
                else:
                    generated_links = [
                        {
                            "link": generate_report_link.format(
                                field["product_url"],
                                qr_id,
                                field["job_company_id"],
                                field["company_data_type"],
                                field["report_type"],
                            )
                        }
                        for qr_id in qr_ids
                    ]
            else:
                generated_links = [
                    {
                        "link": generate_product_link.format(
                            field["product_url"],
                            qr_id,
                            field["job_company_id"],
                            field["company_data_type"],
                        )
                    }
                    for qr_id in qr_ids
                ]
            # print(generated_links)
            response_qr_code = create_master_link(
                field["job_company_id"], generated_links, field["public_link_name"]
            )
            response = json.loads(response_qr_code)
            fields = {
                "eventId": get_event_id()["event_id"],
                "job_company_id": field["job_company_id"],
                "company_data_type": field["company_data_type"],
                "qr_ids": field["qr_ids"],
                "generated_links": generated_links,
                "master_link": response["qrcodes"][0]["masterlink"],
                "qr_code": response["qrcodes"][0]["qrcode_image_url"],
                "qrcode_id": response["qrcodes"][0]["qrcode_id"],
                "api_key": response["qrcodes"][0]["links"][0]["response"]["api_key"],
                "public_link_name": field["public_link_name"],
            }
            if report_type:
                fields["report_type"] = report_type
            update_field = {"status": "Nothing to update"}
            dowellresponse = json.loads(
                dowellconnection(*Publiclink_reports, "insert", fields, update_field)
            )
            if dowellresponse["isSuccess"]:
                return Response(
                    {
                        "success": True,
                        "message": "Master link for public access for the product generated successfully",
                        "master_link": response["qrcodes"][0]["masterlink"],
                        "qr_code": response["qrcodes"][0]["qrcode_image_url"],
                        "link_name": response["qrcodes"][0]["document_name"],
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {"message": "Failed to insert data to db"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        else:
            return Response(
                {
                    "message": "Something went wrong",
                    "error": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

    def get(self, request, job_company_id):
        fields = {"job_company_id": job_company_id}
        update_field = {"status": "Nothing to update"}
        dowellresponse = json.loads(
            dowellconnection(*Publiclink_reports, "fetch", fields, update_field)
        )
        if dowellresponse["isSuccess"]:
            if len(dowellresponse["data"]) == 0:
                return Response(
                    {
                        "message": f"There is no link",
                        "response": dowellresponse,
                    },
                    status=status.HTTP_204_NO_CONTENT,
                )
            else:
                data = []
                for res in dowellresponse["data"]:
                    print(res.keys(), "========")
                    try:
                        if (
                            "public_link_name" in res.keys()
                            and "report_type" in res.keys()
                        ):
                            item = {
                                "master_link": res["master_link"],
                                "link_name": res["public_link_name"],
                                "type": "report",
                            }
                        elif (
                            "public_link_name" in res.keys()
                            and not "report_type" in res.keys()
                        ):
                            item = {
                                "master_link": res["master_link"],
                                "link_name": res["public_link_name"],
                                "type": "product",
                            }
                        data.append(item)
                    except Exception:
                        pass
                return Response(
                    {
                        "message": f"List of links present",
                        "response": data,
                    },
                    status=status.HTTP_200_OK,
                )
        else:
            return Response(
                {"success": False, "message": "Failed to get link"},
                status=status.HTTP_400_BAD_REQUEST,
            )


# _________________Thread And Comment_____________


@method_decorator(csrf_exempt, name="dispatch")
class Thread_Apis(APIView):
    def post(self, request):
        # print(request.data,"==================")
        data = request.data

        serializer_data = {
            "thread_title": data.get("thread_title"),
            "thread": data.get("thread"),
            "image": request.data["image"],
            "created_by": data.get("created_by"),
            "team_id": data.get("team_id"),
            "team_alerted_id": data.get("team_alerted_id"),
            "current_status": "Created",
            "previous_status": [],
            "steps_to_reproduce_thread": data.get("steps_to_reproduce_thread"),
            "expected_product_behavior": data.get("expected_product_behavior"),
            "actual_product_behavior": data.get("actual_product_behavior"),
            "thread_type": data.get("thread_type"),
        }

        field = {
            "event_id": get_event_id()["event_id"],
            "thread_title": data.get("thread_title"),
            "thread": data.get("thread"),
            "image": request.data["image"],
            "created_by": data.get("created_by"),
            "team_id": data.get("team_id"),
            "team_alerted_id": data.get("team_alerted_id"),
            "created_date": f"{datetime.datetime.today().month}/{datetime.datetime.today().day}/{datetime.datetime.today().year} {datetime.datetime.today().hour}:{datetime.datetime.today().minute}:{datetime.datetime.today().second}",
            "current_status": serializer_data["current_status"],
            "previous_status": [],
            "steps_to_reproduce_thread": data.get("steps_to_reproduce_thread"),
            "expected_product_behavior": data.get("expected_product_behavior"),
            "actual_product_behavior": data.get("actual_product_behavior"),
            "thread_type": data.get("thread_type"),
        }
        update_field = {}
        serializer = ThreadsSerializer(data=serializer_data)
        if serializer.is_valid():
            insert_response = dowellconnection(
                *thread_report_module, "insert", field, update_field
            )
            # print(insert_response)

            if json.loads(insert_response)["isSuccess"] == True:
                get_team = dowellconnection(
                    *team_management_modules,
                    "fetch",
                    {"_id": data.get("team_id")},
                    update_field,
                )
                info = dowellconnection(
                    *candidate_management_reports, "fetch", {}, update_field
                )
                users = {}
                send_to_emails = {}
                for user in json.loads(info)["data"]:
                    if "applicant_email" in user.keys():
                        users[user["username"]] = user["applicant_email"]
                for member in json.loads(get_team)["data"][0]["members"]:
                    if member in users.keys():
                        send_to_emails[member] = users[member]

                # print(send_to_emails)
                def send_mail(*args):
                    d = interview_email(*args)

                for name, email in send_to_emails:
                    send_mail_thread = threading.Thread(
                        target=send_mail,
                        args=(
                            name,
                            email,
                            "Notification for Issue created.",
                            f"{data.get('created_by')} has just created and issue. login into your client page to check",
                        ),
                    )
                    send_mail_thread.start()
                    send_mail_thread.join()
                return Response(
                    {
                        "message": "Thread created successfully",
                        "info": json.loads(insert_response),
                        "image_response": serializer_data["image"],
                    },
                    status=status.HTTP_201_CREATED,
                )
            else:
                return Response(
                    {
                        "message": "Thread failed to be Created",
                        "info": json.loads(insert_response),
                    },
                    status=status.HTTP_304_NOT_MODIFIED,
                )
        else:
            return Response(
                {"message": "Parameters are not valid", "error": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def get(self, request, document_id):
        # data = request.data
        # print(data)
        if document_id:
            field = {
                "_id": document_id,
            }
            update_field = {}

            get_response = dowellconnection(
                *thread_report_module, "fetch", field, update_field
            )

            get_comment = dowellconnection(
                *comment_report_module,
                "fetch",
                {"thread_id": document_id},
                update_field,
            )
            # print(get_response)
            # print(get_comment)
            response = json.loads(get_response)
            response["comments"] = json.loads(get_comment)

            if json.loads(get_response)["isSuccess"] == True:
                return Response(
                    {"message": f"Thread with id-{document_id}", "data": response},
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {"message": "Failed to fetch", "data": response},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        else:
            return Response(
                {"message": "Parameters are not valid", "errors": document_id},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def patch(self, request):
        data = request.data
        if data:
            field = {
                "_id": data.get("document_id"),
            }

            # check for previous status
            get_response = dowellconnection(*thread_report_module, "fetch", field, {})
            if json.loads(get_response)["isSuccess"] == True:
                prev = json.loads(get_response)["data"][0]["previous_status"]
            else:
                return Response(
                    {
                        "message": "Failed to update Thread",
                        "data": json.loads(get_response),
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            previous_status = []

            if data.get("current_status") == "":
                return Response(
                    {
                        "message": "Failed to update Thread",
                        "errors": "'current_status' cannot be empty. Set the value for 'current_status'",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
            elif data.get("current_status") == "Created":
                previous_status = []
            elif data.get("current_status") == "In progress":
                previous_status = ["Created"]

            elif data.get("current_status") == "Completed":
                if not "Created" in prev:
                    return Response(
                        {
                            "message": "Failed to update Thread",
                            "errors": " 'Created' is not in previous_status. Firstly, updated current_status to 'In progress'",
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                previous_status = ["Created", "In progress"]
            elif data.get("current_status") == "Resolved":
                if not "Created" in prev:
                    return Response(
                        {
                            "message": "Failed to update Thread",
                            "errors": " 'Created' is not in previous_status. Firstly, updated current_status to 'In progress'",
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                if not "In progress" in prev:
                    return Response(
                        {
                            "message": "Failed to update Thread",
                            "errors": " 'In progress' is not in previous_status. Firstly, updated current_status to 'Completed'",
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                previous_status = ["Created", "In progress", "Completed"]
            else:
                return Response(
                    {
                        "message": "Failed to update Thread",
                        "errors": " 'current_status' must be Created, In progress, Completed or Resolved",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            update_field = {
                "current_status": data.get("current_status"),
                "previous_status": previous_status,
            }

            update_response = dowellconnection(
                *thread_report_module, "update", field, update_field
            )

            # print(update_response)
            if json.loads(update_response)["isSuccess"] == True:
                return Response(
                    {
                        "message": f"Thread with id-{data.get('document_id')} has been successfully updated",
                        "data": json.loads(update_response),
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {
                        "message": "Failed to update Thread",
                        "data": json.loads(update_response),
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
        else:
            return Response(
                {"message": "Parameters are not valid", "errors": data},
                status=status.HTTP_400_BAD_REQUEST,
            )


class GetTeamThreads(APIView):
    def get(self, request, team_id):
        field = {
            "team_id": team_id,
        }
        update_field = {}

        get_response = dowellconnection(
            *thread_report_module, "fetch", field, update_field
        )
        threads = []
        for thread in json.loads(get_response)["data"]:
            if not len(json.loads(get_response)["data"]) <= 0:
                get_comment = dowellconnection(
                    *comment_report_module,
                    "fetch",
                    {"thread_id": thread["_id"]},
                    update_field,
                )
                thread["comments"] = json.loads(get_comment)
                threads.append(thread)

        if json.loads(get_response)["isSuccess"] == True:
            return Response(
                {"message": f"List of Threads with team id-{team_id}", "data": threads},
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"message": "Failed to fetch", "data": threads},
                status=status.HTTP_400_BAD_REQUEST,
            )


class GetAllThreads(APIView):
    def get(self, request):
        field = {}
        update_field = {}

        try:
            get_response = dowellconnection(
                *thread_report_module, "fetch", field, update_field
            )
            threads_response = json.loads(get_response)
            # print(threads_response)
            threads = []
            commentfield = {}
            if threads_response["isSuccess"]:
                threads_data = threads_response["data"]
                get_comment = dowellconnection(
                    *comment_report_module,
                    "fetch",
                    commentfield,
                    update_field,
                )
                # print(get_comment)
                if threads_data:
                    # print(threads_data)

                    for thread in threads_data:
                        thread["comments"] = []

                        for comment in json.loads(get_comment)["data"]:
                            if comment["thread_id"] == thread["_id"]:
                                thread["comments"].append(comment)
                        threads.append(thread)

                return Response(
                    {"isSuccess": True, "message": "List of Threads", "data": threads},
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {"message": "Failed to fetch", "data": threads},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        except:
            return Response(
                {"isSuccess": False, "message": f"An error occurred:", "data": []}
            )


class Comment_Apis(APIView):
    def post(self, request):
        data = request.data
        field = {
            "event_id": get_event_id()["event_id"],
            "created_by": data.get("created_by"),
            "created_date": f"{datetime.datetime.today().month}/{datetime.datetime.today().day}/{datetime.datetime.today().year} {datetime.datetime.today().hour}:{datetime.datetime.today().minute}:{datetime.datetime.today().second}",
            "comment": data.get("comment"),
            "thread_id": data.get("thread_id"),
        }
        update_field = {}
        serializer = CommentsSerializer(data=request.data)
        if serializer.is_valid():
            insert_response = dowellconnection(
                *comment_report_module, "insert", field, update_field
            )
            # print(insert_response)
            if json.loads(insert_response)["isSuccess"] == True:
                return Response(
                    {
                        "message": "Comment created successfully",
                        "info": json.loads(insert_response),
                    },
                    status=status.HTTP_201_CREATED,
                )
            else:
                return Response(
                    {
                        "message": "Comment failed to be Created",
                        "info": json.loads(insert_response),
                    },
                    status=status.HTTP_304_NOT_MODIFIED,
                )
        else:
            return Response(
                {"message": "Parameters are not valid", "error": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def get(self, request, document_id):
        # data = request.data

        if document_id:
            field = {
                "_id": document_id,
            }
            update_field = {}

            insert_response = dowellconnection(
                *comment_report_module, "fetch", field, update_field
            )
            # print(insert_response)
            if json.loads(insert_response)["isSuccess"] == True:
                return Response(
                    {
                        "message": f"Comment with id-{document_id}",
                        "data": json.loads(insert_response),
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {"message": "Failed to fetch", "info": json.loads(insert_response)},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        else:
            return Response(
                {"message": "Parameters are not valid", "error": document_id},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def patch(self, request):
        data = request.data
        field = {
            "_id": data.get("document_id"),
        }
        update_field = {
            "comment": data.get("comment"),
        }
        insert_response = dowellconnection(
            *comment_report_module, "update", field, update_field
        )
        # print(insert_response)
        if json.loads(insert_response)["isSuccess"] == True:
            return Response(
                {
                    "message": f"Comment with id-{data.get('document_id')} has been updated successfully",
                    "data": json.loads(insert_response),
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {
                    "message": "Failed to update Comment",
                    "data": json.loads(insert_response),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )


# generate report api starts here__________________________
@method_decorator(csrf_exempt, name="dispatch")
class Generate_Report(APIView):
    def generate_admin_report(self, request):
        payload = request.data
        if payload:
            if valid_period(payload["start_date"], payload["end_date"]) == True:
                data = {}
                # get all details firstly---------------
                if len(payload["company_id"]) > 0:
                    field = {"company_id": payload["company_id"]}
                else:
                    field = {}
                update_field = {}
                response = dowellconnection(*jobs, "fetch", field, update_field)

                jbs = [res for res in json.loads(response)["data"]]
                res_jobs = period_check(
                    start_dt=payload["start_date"],
                    end_dt=payload["end_date"],
                    data_list=jbs,
                    key="created_on",
                )
                data["jobs"] = res_jobs[1]
                # print(res_jobs[0])

                active_jobs = []
                inactive_jobs = []
                for t in res_jobs[0]:
                    if "is_active" in t.keys():
                        if (
                            t["is_active"] == "True"
                            or t["is_active"] == "true"
                            or t["is_active"] == True
                        ):
                            active_jobs.append([t["_id"], t["is_active"]])
                        if (
                            t["is_active"] == "False"
                            or t["is_active"] == "false"
                            or t["is_active"] == False
                        ):
                            inactive_jobs.append([t["_id"], t["is_active"]])
                data["no_of_active_jobs"] = len(active_jobs)
                data["no_of_inactive_jobs"] = len(inactive_jobs)

                response = dowellconnection(
                    *candidate_management_reports, "fetch", field, update_field
                )
                total = [res for res in json.loads(response)["data"]]
                job_application = [
                    res for res in total if "application_submitted_on" in res.keys()
                ]
                try:
                    job_titles = {}
                    for t in job_application:
                        job_titles[t["job_number"]] = t["job_title"]
                    ids = [t["job_number"] for t in job_application]
                    counter = Counter(ids)
                    most_applied_job = counter.most_common(1)[0][0]
                    least_applied_job = counter.most_common()[-1][0]
                    data["most_applied_job"] = {
                        "job_number": most_applied_job,
                        "job_title": job_titles[most_applied_job],
                        "no_job_applications": ids.count(most_applied_job),
                    }
                    data["least_applied_job"] = {
                        "job_number": least_applied_job,
                        "job_title": job_titles[least_applied_job],
                        "no_job_applications": ids.count(least_applied_job),
                    }

                except Exception:
                    data["most_applied_job"] = {"job_number": "none"}
                    data["least_applied_job"] = {"job_number": "none"}

                new_candidates = [
                    res
                    for res in total
                    if "application_submitted_on" in res.keys()
                    and res["status"] == "Pending"
                ]
                guest_candidates = [
                    res
                    for res in total
                    if "application_submitted_on" in res.keys()
                    and res["status"] == "Guest_Pending"
                ]
                probationary_candidates = [
                    res
                    for res in total
                    if "application_submitted_on" in res.keys()
                    and res["status"] == "probationary"
                ]
                selected = [res for res in total if "selected_on" in res.keys()]
                shortlisted = [res for res in total if "shortlisted_on" in res.keys()]
                hired = [res for res in total if "hired_on" in res.keys()]
                rehired = [res for res in total if "rehired_on" in res.keys()]
                rejected = [res for res in total if "rejected_on" in res.keys()]
                onboarded = [res for res in total if "onboarded_on" in res.keys()]

                res_job_application = period_check(
                    start_dt=payload["start_date"],
                    end_dt=payload["end_date"],
                    data_list=job_application,
                    key="application_submitted_on",
                )

                m = {
                    "January": [],
                    "February": [],
                    "March": [],
                    "April": [],
                    "May": [],
                    "June": [],
                    "July": [],
                    "August": [],
                    "September": [],
                    "October": [],
                    "November": [],
                    "December": [],
                }
                months = []
                month_list = calendar.month_name
                for res in res_job_application[0]:
                    date = set_date_format(res["application_submitted_on"])
                    month = month_list[
                        datetime.datetime.strptime(date, "%m/%d/%Y %H:%M:%S").month
                    ]
                    months.append(
                        {
                            "job_title": res["job_title"],
                            "job_number": res["job_number"],
                            "month": month,
                        }
                    )

                for item in months:
                    if item["month"] in m.keys():
                        i = {
                            "job_number": item["job_number"],
                            "job_title": item["job_title"],
                            "no_job_applications": months.count(item),
                        }
                        if not i in m[item["month"]]:
                            m[item["month"]].append(i)
                for key in m.keys():
                    if len(m[key]) == 0:
                        m[key] = 0

                data["job_applications"] = {
                    "total": res_job_application[1],
                    "months": m,
                }

                res_new_candidates = period_check(
                    start_dt=payload["start_date"],
                    end_dt=payload["end_date"],
                    data_list=new_candidates,
                    key="application_submitted_on",
                )
                data["new_candidates"] = res_new_candidates[1]

                res_guest_candidates = period_check(
                    start_dt=payload["start_date"],
                    end_dt=payload["end_date"],
                    data_list=guest_candidates,
                    key="application_submitted_on",
                )
                data["guest_candidates"] = res_guest_candidates[1]

                res_probationary_candidates = period_check(
                    start_dt=payload["start_date"],
                    end_dt=payload["end_date"],
                    data_list=probationary_candidates,
                    key="application_submitted_on",
                )
                data["probationary_candidates"] = res_probationary_candidates[1]

                res_selected = period_check(
                    start_dt=payload["start_date"],
                    end_dt=payload["end_date"],
                    data_list=selected,
                    key="selected_on",
                )
                data["selected"] = res_selected[1]

                res_shortlisted = period_check(
                    start_dt=payload["start_date"],
                    end_dt=payload["end_date"],
                    data_list=shortlisted,
                    key="shortlisted_on",
                )
                data["shortlisted"] = res_shortlisted[1]

                res_hired = period_check(
                    start_dt=payload["start_date"],
                    end_dt=payload["end_date"],
                    data_list=hired,
                    key="hired_on",
                )
                data["hired"] = res_hired[1]

                res_rehired = period_check(
                    start_dt=payload["start_date"],
                    end_dt=payload["end_date"],
                    data_list=rehired,
                    key="rehired_on",
                )
                data["rehired"] = res_rehired[1]

                res_onboarded = period_check(
                    start_dt=payload["start_date"],
                    end_dt=payload["end_date"],
                    data_list=onboarded,
                    key="onboarded_on",
                )
                data["onboarded"] = res_onboarded[1]

                res_rejected = period_check(
                    start_dt=payload["start_date"],
                    end_dt=payload["end_date"],
                    data_list=rejected,
                    key="rejected_on",
                )
                data["rejected"] = res_rejected[1]

                try:
                    data["hiring_rate"] = (
                        data["hired"] / data["job_applications"]
                    ) * 100
                except Exception:
                    data["hiring_rate"] = 0
                # tasksand teams========================================================================================
                tasks = dowellconnection(
                    *task_management_reports, "fetch", field, update_field
                )
                total_tasks = [res for res in json.loads(tasks)["data"]]
                teams = dowellconnection(
                    *team_management_modules, "fetch", field, update_field
                )
                total_teams = [res for res in json.loads(teams)["data"]]
                total_teams_ids = [res["_id"] for res in json.loads(teams)["data"]]

                res_teams = period_check(
                    start_dt=payload["start_date"],
                    end_dt=payload["end_date"],
                    data_list=total_teams,
                    key="date_created",
                )
                data["teams"] = res_teams[1]

                res_tasks = period_check(
                    start_dt=payload["start_date"],
                    end_dt=payload["end_date"],
                    data_list=total_tasks,
                    key="task_created_date",
                )
                data["tasks"] = res_tasks[1]

                team_tasks = []
                for t in res_tasks[0]:
                    try:
                        if t["team_id"] in total_teams_ids:
                            team_tasks.append(t)
                    except Exception:
                        pass
                data["team_tasks"] = len(team_tasks)

                tasks_completed = []
                for t in res_tasks[0]:
                    try:
                        if (
                            t["status"] == "Complete"
                            or t["status"] == "complete"
                            or t["status"] == "Completed"
                            or t["status"] == "completed"
                        ):
                            tasks_completed.append(t)
                    except Exception:
                        try:
                            if t["completed"] == True or t["Complete"] == True:
                                tasks_completed.append(t)
                        except Exception:
                            pass
                data["tasks_completed"] = len(tasks_completed)
                tasks_uncompleted = []
                for t in res_tasks[0]:
                    try:
                        if t["status"] == "Incomplete" or t["status"] == "Incompleted":
                            tasks_uncompleted.append(t)
                    except Exception:
                        try:
                            if t["Incompleted"] == True or t["Incomplete"] == True:
                                tasks_uncompleted.append(t)
                        except Exception:
                            pass
                data["tasks_uncompleted"] = len(tasks_uncompleted)
                try:
                    data["percentage_tasks_completed"] = (
                        data["tasks_completed"] / data["tasks"]
                    ) * 100
                except Exception:
                    data["percentage_tasks_completed"] = 0

                tasks_completed_on_time = []
                for t in res_tasks[0]:
                    try:
                        due_date = datetime.datetime.strptime(
                            set_date_format(t["due_date"]), "%m/%d/%Y %H:%M:%S"
                        )
                        task_updated_date = datetime.datetime.strptime(
                            set_date_format(t["task_updated_date"]), "%m/%d/%Y %H:%M:%S"
                        )
                        if (
                            "due_date" in t.keys()
                            and "task_updated_date" in t.keys()
                            and due_date > task_updated_date
                        ):
                            tasks_completed_on_time.append(t)
                    except Exception:
                        pass
                data["tasks_completed_on_time"] = len(tasks_completed_on_time)
                try:
                    data["percentage_tasks_completed_on_time"] = (
                        data["tasks_completed_on_time"] / data["tasks_completed"]
                    ) * 100
                except Exception:
                    data["percentage_tasks_completed_on_time"] = 0

                res_tasks_mod = dowellconnection(
                    *task_details_module, "fetch", field, update_field=None
                )
                res_tasks_mod_list = [res for res in json.loads(res_tasks_mod)["data"]]

                res_t = period_check(
                    start_dt=payload["start_date"],
                    end_dt=payload["end_date"],
                    data_list=res_tasks_mod_list,
                    key="task_created_date",
                )
                projects = []
                for r in res_t[0]:
                    try:
                        projects.append(r["project"])
                    except KeyError:
                        r["project"] = "None"
                        projects.append(r["project"])

                c = Counter(projects)
                m = min(c.values())
                least_taskeds = [x for x in projects if c[x] == m]
                least_tasked_projects = []
                for items in set(least_taskeds):
                    count = least_taskeds.count(items)
                    least_tasked_projects.append({"title": items, "tasks_added": count})

                m = max(c.values())
                most_tasked = [x for x in projects if c[x] == m]
                most_tasked_projects = []
                for items in set(most_tasked):
                    count = most_tasked.count(items)
                    most_tasked_projects.append({"title": items, "tasks_added": count})

                data["project_with_most_tasks"] = most_tasked_projects
                data["project_with_least_tasks"] = least_tasked_projects
                return Response(
                    {"message": "Admin Report Generated", "response": data},
                    status=status.HTTP_201_CREATED,
                )
            else:
                return Response(
                    {
                        "message": "Parameters are not valid, start date must be smaller that end date"
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
        else:
            return Response(
                {"message": "Parameters are not valid"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def generate_hr_report(self, request):
        payload = request.data
        if payload:
            if valid_period(payload["start_date"], payload["end_date"]) == True:
                data = {}
                # get all details firstly---------------
                field = {}
                update_field = {}
                response = dowellconnection(
                    *hr_management_reports, "fetch", field, update_field
                )
                total = [res for res in json.loads(response)["data"]]
                selected = [res for res in total if "selected_on" in res.keys()]
                shortlisted = [res for res in total if "shortlisted_on" in res.keys()]
                rejected = [res for res in total if "rejected_on" in res.keys()]
                response_jbs = dowellconnection(*jobs, "fetch", field, update_field)

                jbs = [res for res in json.loads(response_jbs)["data"]]
                res_jobs = period_check(
                    start_dt=payload["start_date"],
                    end_dt=payload["end_date"],
                    data_list=jbs,
                    key="created_on",
                )
                data["jobs"] = res_jobs[1]

                active_jobs = []
                inactive_jobs = []
                for t in res_jobs[0]:
                    if "is_active" in t.keys():
                        if (
                            t["is_active"] == "True"
                            or t["is_active"] == "true"
                            or t["is_active"] == True
                        ):
                            active_jobs.append([t["_id"], t["is_active"]])
                        if (
                            t["is_active"] == "False"
                            or t["is_active"] == "false"
                            or t["is_active"] == False
                        ):
                            inactive_jobs.append([t["_id"], t["is_active"]])
                data["no_of_active_jobs"] = len(active_jobs)
                data["no_of_inactive_jobs"] = len(inactive_jobs)

                response_applications = dowellconnection(
                    *candidate_management_reports, "fetch", field, update_field
                )
                total_applications = [
                    res for res in json.loads(response_applications)["data"]
                ]
                job_application = [
                    res
                    for res in total_applications
                    if "application_submitted_on" in res.keys()
                ]
                try:
                    job_titles = {}
                    for t in job_application:
                        job_titles[t["job_number"]] = t["job_title"]
                    ids = [t["job_number"] for t in job_application]
                    counter = Counter(ids)
                    most_applied_job = counter.most_common(1)[0][0]
                    least_applied_job = counter.most_common()[-1][0]
                    data["most_applied_job"] = {
                        "job_number": most_applied_job,
                        "job_title": job_titles[most_applied_job],
                        "no_job_applications": ids.count(most_applied_job),
                    }
                    data["least_applied_job"] = {
                        "job_number": least_applied_job,
                        "job_title": job_titles[least_applied_job],
                        "no_job_applications": ids.count(least_applied_job),
                    }

                except Exception:
                    data["most_applied_job"] = {"job_number": "none"}
                    data["least_applied_job"] = {"job_number": "none"}

                new_candidates = [
                    res
                    for res in total_applications
                    if "application_submitted_on" in res.keys()
                    and res["status"] == "Pending"
                ]
                guest_candidates = [
                    res
                    for res in total_applications
                    if "application_submitted_on" in res.keys()
                    and res["status"] == "Guest_Pending"
                ]
                probationary_candidates = [
                    res
                    for res in total_applications
                    if "application_submitted_on" in res.keys()
                    and res["status"] == "probationary"
                ]
                hired = [res for res in total_applications if "hired_on" in res.keys()]

                res_job_application = period_check(
                    start_dt=payload["start_date"],
                    end_dt=payload["end_date"],
                    data_list=job_application,
                    key="application_submitted_on",
                )
                data["job_applications"] = res_job_application[1]

                res_new_candidates = period_check(
                    start_dt=payload["start_date"],
                    end_dt=payload["end_date"],
                    data_list=new_candidates,
                    key="application_submitted_on",
                )
                data["new_candidates"] = res_new_candidates[1]

                res_guest_candidates = period_check(
                    start_dt=payload["start_date"],
                    end_dt=payload["end_date"],
                    data_list=guest_candidates,
                    key="application_submitted_on",
                )
                data["guest_candidates"] = res_guest_candidates[1]

                res_probationary_candidates = period_check(
                    start_dt=payload["start_date"],
                    end_dt=payload["end_date"],
                    data_list=probationary_candidates,
                    key="application_submitted_on",
                )
                data["probationary_candidates"] = res_probationary_candidates[1]

                res_selected = period_check(
                    start_dt=payload["start_date"],
                    end_dt=payload["end_date"],
                    data_list=selected,
                    key="selected_on",
                )
                data["selected"] = res_selected[1]

                res_selected = period_check(
                    start_dt=payload["start_date"],
                    end_dt=payload["end_date"],
                    data_list=selected,
                    key="selected_on",
                )
                data["selected"] = res_selected[1]

                res_rejected = period_check(
                    start_dt=payload["start_date"],
                    end_dt=payload["end_date"],
                    data_list=rejected,
                    key="rejected_on",
                )
                data["rejected"] = res_rejected[1]
                res_hired = period_check(
                    start_dt=payload["start_date"],
                    end_dt=payload["end_date"],
                    data_list=hired,
                    key="hired_on",
                )
                data["hired"] = res_hired[1]

                try:
                    data["hiring_rate"] = (
                        str((data["hired"] / data["job_applications"]) * 100) + " %"
                    )
                except Exception:
                    data["hiring_rate"] = "0 %"

                return Response(
                    {"message": "Hr Report Generated", "response": data},
                    status=status.HTTP_201_CREATED,
                )
            else:
                return Response(
                    {
                        "message": "Parameters are not valid, start date must be smaller that end date"
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
        else:
            return Response(
                {"message": "Parameters are not valid"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def generate_account_report(self, request):
        payload = request.data
        if payload:
            if valid_period(payload["start_date"], payload["end_date"]) == True:
                data = {}
                # get all details firstly---------------
                field = {}
                update_field = {}
                response = dowellconnection(
                    *account_management_reports, "fetch", field, update_field
                )
                total = [res for res in json.loads(response)["data"]]
                rehired = [res for res in total if "rehired_on" in res.keys()]
                rejected = [res for res in total if "rejected_on" in res.keys()]
                onboarded = [res for res in total if "onboarded_on" in res.keys()]

                res_rehired = period_check(
                    start_dt=payload["start_date"],
                    end_dt=payload["end_date"],
                    data_list=rehired,
                    key="rehired_on",
                )
                data["rehired"] = res_rehired[1]

                res_onboarded = period_check(
                    start_dt=payload["start_date"],
                    end_dt=payload["end_date"],
                    data_list=onboarded,
                    key="onboarded_on",
                )
                data["onboarded"] = res_onboarded[1]

                res_rejected = period_check(
                    start_dt=payload["start_date"],
                    end_dt=payload["end_date"],
                    data_list=rejected,
                    key="rejected_on",
                )
                data["rejected"] = res_rejected[1]

                return Response(
                    {"message": "Account Report Generated", "response": data},
                    status=status.HTTP_201_CREATED,
                )
            else:
                return Response(
                    {
                        "message": "Parameters are not valid, start date must be smaller that end date"
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
        else:
            return Response(
                {"message": "Parameters are not valid"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def generate_candidate_report(self, request):
        payload = request.data
        if payload:
            if valid_period(payload["start_date"], payload["end_date"]) == True:
                data = {}
                # get all details firstly---------------
                field = {}
                update_field = {}
                response = dowellconnection(
                    *candidate_management_reports, "fetch", field, update_field
                )

                total = [res for res in json.loads(response)["data"]]
                job_application = [
                    res for res in total if "application_submitted_on" in res.keys()
                ]
                new_candidates = [
                    res
                    for res in total
                    if "application_submitted_on" in res.keys()
                    and res["status"] == "Pending"
                ]
                guest_candidates = [
                    res
                    for res in total
                    if "application_submitted_on" in res.keys()
                    and res["status"] == "Guest_Pending"
                ]
                probationary_candidates = [
                    res
                    for res in total
                    if "application_submitted_on" in res.keys()
                    and res["status"] == "probationary"
                ]
                selected = [res for res in total if "selected_on" in res.keys()]
                shortlisted = [res for res in total if "shortlisted_on" in res.keys()]
                hired = [res for res in total if "hired_on" in res.keys()]
                rehired = [res for res in total if "rehired_on" in res.keys()]
                rejected = [res for res in total if "rejected_on" in res.keys()]
                onboarded = [res for res in total if "onboarded_on" in res.keys()]

                res_job_application = period_check(
                    start_dt=payload["start_date"],
                    end_dt=payload["end_date"],
                    data_list=job_application,
                    key="application_submitted_on",
                )
                data["job_applications"] = res_job_application[1]

                res_new_candidates = period_check(
                    start_dt=payload["start_date"],
                    end_dt=payload["end_date"],
                    data_list=new_candidates,
                    key="application_submitted_on",
                )
                data["new_candidates"] = res_new_candidates[1]

                res_guest_candidates = period_check(
                    start_dt=payload["start_date"],
                    end_dt=payload["end_date"],
                    data_list=guest_candidates,
                    key="application_submitted_on",
                )
                data["guest_candidates"] = res_guest_candidates[1]

                res_probationary_candidates = period_check(
                    start_dt=payload["start_date"],
                    end_dt=payload["end_date"],
                    data_list=probationary_candidates,
                    key="application_submitted_on",
                )
                data["probationary_candidates"] = res_probationary_candidates[1]

                res_selected = period_check(
                    start_dt=payload["start_date"],
                    end_dt=payload["end_date"],
                    data_list=selected,
                    key="selected_on",
                )
                data["selected"] = res_selected[1]

                res_shortlisted = period_check(
                    start_dt=payload["start_date"],
                    end_dt=payload["end_date"],
                    data_list=shortlisted,
                    key="shortlisted_on",
                )
                data["shortlisted"] = res_shortlisted[1]

                res_hired = period_check(
                    start_dt=payload["start_date"],
                    end_dt=payload["end_date"],
                    data_list=hired,
                    key="hired_on",
                )
                data["hired"] = res_hired[1]

                res_rehired = period_check(
                    start_dt=payload["start_date"],
                    end_dt=payload["end_date"],
                    data_list=rehired,
                    key="rehired_on",
                )
                data["rehired"] = res_rehired[1]

                res_onboarded = period_check(
                    start_dt=payload["start_date"],
                    end_dt=payload["end_date"],
                    data_list=onboarded,
                    key="onboarded_on",
                )
                data["onboarded"] = res_onboarded[1]

                res_rejected = period_check(
                    start_dt=payload["start_date"],
                    end_dt=payload["end_date"],
                    data_list=rejected,
                    key="rejected_on",
                )
                data["rejected"] = res_rejected[1]

                try:
                    data["hiring_rate"] = (
                        str((data["hired"] / data["job_applications"]) * 100) + " %"
                    )
                except Exception:
                    data["hiring_rate"] = "0 %"

                return Response(
                    {"message": "Candidate Report Generated", "response": data},
                    status=status.HTTP_201_CREATED,
                )
            else:
                return Response(
                    {
                        "message": "Parameters are not valid, start date must be smaller that end date"
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
        else:
            return Response(
                {"message": "Parameters are not valid"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def generate_team_report(self, request):
        payload = request.data
        if payload:
            if valid_period(payload["start_date"], payload["end_date"]) == True:
                data = {}
                # get all details firstly---------------
                field = {"_id": payload["team_id"]}
                update_field = {}
                tasks = dowellconnection(
                    *task_management_reports,
                    "fetch",
                    {"team_id": payload["team_id"]},
                    update_field,
                )
                total_tasks = [res for res in json.loads(tasks)["data"]]

                teams = dowellconnection(
                    *team_management_modules, "fetch", field, update_field
                )
                total_teams = [res for res in json.loads(teams)["data"]]
                data["teams"] = len(total_teams)

                res_team_tasks = period_check(
                    start_dt=payload["start_date"],
                    end_dt=payload["end_date"],
                    data_list=total_tasks,
                    key="task_created_date",
                )
                # print(res_team_tasks)
                data["team_tasks"] = res_team_tasks[1]

                team_tasks_completed = []
                for t in res_team_tasks[0]:
                    try:
                        if (
                            t["status"] == "Complete"
                            or t["status"] == "Completed"
                            or t["status"] == "complete"
                            or t["status"] == "completed"
                        ):
                            team_tasks_completed.append(t)
                    except Exception as e:
                        try:
                            if (
                                t["completed"] == True
                                or t["Completed"] == True
                                or t["Complete"] == True
                                or t["complete"] == True
                            ):
                                team_tasks_completed.append(t)
                        except Exception as e:
                            pass
                data["team_tasks_completed"] = len(team_tasks_completed)
                team_tasks_uncompleted = []
                for t in res_team_tasks[0]:
                    try:
                        if t["status"] == "Incomplete" or t["status"] == "Incompleted":
                            team_tasks_uncompleted.append(t)
                    except Exception:
                        try:
                            if t["Incompleted"] == True or t["Incomplete"] == True:
                                team_tasks_uncompleted.append(t)
                        except Exception:
                            pass
                data["team_tasks_uncompleted"] = len(team_tasks_uncompleted)

                try:
                    data["percentage_team_tasks_completed"] = (
                        data["team_tasks_completed"] / data["team_tasks"]
                    ) * 100
                except Exception:
                    data["percentage_team_tasks_completed"] = 0

                team_tasks_completed_on_time = []
                for t in res_team_tasks[0]:
                    try:
                        due_date = datetime.datetime.strptime(
                            set_date_format(t["due_date"]), "%m/%d/%Y %H:%M:%S"
                        )
                        task_updated_date = datetime.datetime.strptime(
                            set_date_format(t["task_updated_date"]), "%m/%d/%Y %H:%M:%S"
                        )
                        if (
                            "due_date" in t.keys()
                            and "task_updated_date" in t.keys()
                            and due_date > task_updated_date
                        ):
                            team_tasks_completed_on_time.append(t)
                    except Exception as e:
                        # print("error",e)
                        pass
                data["team_tasks_completed_on_time"] = len(team_tasks_completed_on_time)
                try:
                    data["percentage_team_tasks_completed_on_time"] = (
                        data["team_tasks_completed_on_time"]
                        / data["team_tasks_completed"]
                    ) * 100
                except Exception:
                    data["percentage_team_tasks_completed_on_time"] = 0

                return Response(
                    {"message": "Team Report Generated", "response": data},
                    status=status.HTTP_201_CREATED,
                )
            else:
                return Response(
                    {
                        "message": "Parameters are not valid, start date must be smaller that end date"
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
        else:
            return Response(
                {"message": "Parameters are not valid"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def generate_lead_report(self, request):
        payload = request.data
        if payload:
            if valid_period(payload["start_date"], payload["end_date"]) == True:
                data = {}
                # get all details firstly---------------
                field = {}
                update_field = {}
                response = dowellconnection(
                    *lead_management_reports, "fetch", field, update_field
                )
                total = [res for res in json.loads(response)["data"]]
                rehired = [res for res in total if "rehired_on" in res.keys()]
                rejected = [res for res in total if "rejected_on" in res.keys()]
                hired = [res for res in total if "hired_on" in res.keys()]

                res_rehired = period_check(
                    start_dt=payload["start_date"],
                    end_dt=payload["end_date"],
                    data_list=rehired,
                    key="rehired_on",
                )
                data["rehired"] = res_rehired[1]

                res_hired = period_check(
                    start_dt=payload["start_date"],
                    end_dt=payload["end_date"],
                    data_list=hired,
                    key="hired_on",
                )
                data["onboarded"] = res_hired[1]

                res_rejected = period_check(
                    start_dt=payload["start_date"],
                    end_dt=payload["end_date"],
                    data_list=rejected,
                    key="rejected_on",
                )
                data["rejected"] = res_rejected[1]

                return Response(
                    {"message": "Lead Report Generated", "response": data},
                    status=status.HTTP_201_CREATED,
                )
            else:
                return Response(
                    {
                        "message": "Parameters are not valid, start date must be smaller that end date"
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
        else:
            return Response(
                {"message": "Parameters are not valid"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def generate_individual_report(self, request):
        payload = request.data
        if payload:
            if payload.get("role") and payload.get("role") == "Teamlead":
                field = {
                    "username": payload.get("applicant_username"),
                    "_id": payload.get("applicant_id"),
                    "status": "hired",
                }
            else:
                field = {
                    "_id": payload.get("applicant_id"),
                }

            year = payload.get("year")

            if not int(year) <= datetime.date.today().year:
                return Response(
                    {
                        "message": "You cannot get a report on a future date",
                        "error": f"{year} is bigger than current year {datetime.date.today().year}",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
            if (
                payload.get("applicant_username")
                and not payload.get("applicant_username") in Team_Leads
            ):
                return Response(
                    {
                        "message": f"You cannot get a report on ->{payload.get('applicant_username')}",
                        "error": f"The Username->{payload.get('applicant_username')} is not a team lead",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            update_field = {}
            data = {}
            info = dowellconnection(
                *candidate_management_reports, "fetch", field, update_field
            )
            # print(len(json.loads(info)["data"]),"==========")
            if len(json.loads(info)["data"]) > 0:
                data["personal_info"] = json.loads(info)["data"][0]
                username = json.loads(info)["data"][0]["username"]
                portfolio_name = json.loads(info)["data"][0]["portfolio_name"]
                # get the task report based on project for the user
                data["personal_info"]["task_report"] = self.itr_function(username)
            else:
                data["personal_info"] = {}
                username = "None"
                return Response(
                    {
                        "message": f"There is no candidate with such parameters --> "
                        + " ".join([va for va in field.values()])
                    },
                    status=status.HTTP_204_NO_CONTENT,
                )

            ##checking if the user is a team lead-----
            profiles = SettingUserProfileInfo.objects.all()
            serializer = SettingUserProfileInfoSerializer(profiles, many=True)
            # print(serializer.data,"----")
            valid_portfolio_names = []
            for data in serializer.data:
                for d in data["profile_info"]:
                    if "profile_title" in d.keys():
                        if d["Role"] == "Proj_Lead":
                            # print(d,"----")
                            valid_portfolio_names.append(d["profile_title"])
            if (
                payload.get("applicant_username")
                and not portfolio_name in valid_portfolio_names
            ):
                return Response(
                    {
                        "message": f"You cannot get a report on ->{payload.get('applicant_username')}",
                        "error": f"The User ->{payload.get('applicant_username')}-({portfolio_name}) is not a team lead",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            data["data"] = []

            month_list = calendar.month_name
            # print(calendar.month_name[1:])

            item = {
                "January": {},
                "February": {},
                "March": {},
                "April": {},
                "May": {},
                "June": {},
                "July": {},
                "August": {},
                "September": {},
                "October": {},
                "November": {},
                "December": {},
            }
            for key, value in item.items():
                if payload.get("role") == "Teamlead":
                    item[key] = {
                        "tasks_added": 0,
                        "tasks_completed": 0,
                        "tasks_uncompleted": 0,
                        "tasks_approved": 0,
                        "percentage_tasks_completed": 0,
                        "tasks_you_approved": 0,
                        "tasks_you_marked_as_complete": 0,
                        "tasks_you_marked_as_incomplete": 0,
                        "teams": 0,
                        "team_tasks": 0,
                        "team_tasks_completed": 0,
                        "team_tasks_uncompleted": 0,
                        "percentage_team_tasks_completed": 0,
                        "team_tasks_approved": 0,
                        "team_tasks_issues_raised": 0,
                        "team_tasks_issues_resolved": 0,
                        "team_tasks_comments_added": 0,
                    }
                else:
                    item[key] = {
                        "tasks_added": 0,
                        "tasks_completed": 0,
                        "tasks_uncompleted": 0,
                        "tasks_approved": 0,
                        "percentage_tasks_completed": 0,
                        "teams": 0,
                        "team_tasks": 0,
                        "team_tasks_completed": 0,
                        "team_tasks_uncompleted": 0,
                        "percentage_team_tasks_completed": 0,
                        "team_tasks_approved": 0,
                        "team_tasks_issues_raised": 0,
                        "team_tasks_issues_resolved": 0,
                        "team_tasks_comments_added": 0,
                    }

            _tasks_added = dowellconnection(
                *task_management_reports,
                "fetch",
                {"task_added_by": username},
                update_field,
            )
            _task_details = dowellconnection(
                *task_details_module, "fetch", {}, update_field
            )

            tasks_added = []
            for t in json.loads(_tasks_added)["data"]:
                for task in json.loads(_task_details)["data"]:
                    if t["_id"] == task["task_id"]:
                        tasks_added.append(t)

            # tasks_completed =[t for t in json.loads(tasks_added)['data'] if t["status"]=="Completed"]
            # tasks_uncompleted =[t for t in json.loads(tasks_added)['data'] if t["status"]=="Incomplete"]
            teams = dowellconnection(
                *team_management_modules, "fetch", {}, update_field
            )
            issues_raised = dowellconnection(
                *thread_report_module, "fetch", {}, update_field
            )
            comments_added = dowellconnection(
                *comment_report_module, "fetch", {}, update_field
            )

            _teams_list = []
            _teams_ids = []
            for team in json.loads(teams)["data"]:
                try:
                    if username in team["members"]:
                        _teams_list.append(team)
                        _teams_ids.append(team["_id"])
                except KeyError:
                    pass
            _tasks_list = []
            _tasks_completed = []
            _tasks_uncompleted = []
            _tasks_approved = []
            _tasks_you_approved = []
            _tasks_you_marked_as_complete = []
            _tasks_you_marked_as_incomplete = []
            _teams_tasks = []
            _teams_tasks_completed = []
            _teams_tasks_uncompleted = []
            _teams_tasks_approved = []
            _teams_tasks_issues_raised = []
            _teams_tasks_issues_raised_ids = []
            _teams_tasks_issues_resolved = []
            _teams_tasks_comments_added = []
            if len(tasks_added) != 0:
                for task in tasks_added:
                    try:
                        if task["task_added_by"] == username:
                            _tasks_list.append(task)
                    except KeyError:
                        pass
                    try:
                        if task["task_added_by"] == username:
                            if (
                                task["status"] == "Incomplete"
                                or task["status"] == "incompleted"
                                or task["status"] == "incomplete"
                                or task["status"] == "Incompleted"
                            ):
                                _tasks_uncompleted.append(task)
                    except KeyError:
                        pass
                    try:
                        if task["task_added_by"] == username:
                            if (
                                task["status"] == "Completed"
                                or task["status"] == "Complete"
                                or task["status"] == "completed"
                                or task["status"] == "complete"
                            ):
                                _tasks_completed.append(task)
                    except KeyError:
                        pass
                    try:
                        if (
                            task["task_added_by"] == username
                            and task["status"] == "Mark as complete"
                        ):
                            _tasks_completed.append(task)
                    except KeyError:
                        pass
                    try:
                        if task["approved"] == True or task["approval"] == True:
                            _tasks_approved.append(task)
                    except Exception:
                        pass
                    try:
                        if task["task_approved_by"] == username and (
                            task["approved"] == True or task["approval"] == True
                        ):
                            _tasks_you_approved.append(task)
                    except KeyError:
                        pass
                    try:
                        if task["task_approved_by"] == username and (
                            task["status"] == "Completed"
                            or task["status"] == "Complete"
                            or task["status"] == "completed"
                            or task["status"] == "complete"
                        ):
                            _tasks_you_marked_as_complete.append(task)
                    except KeyError:
                        pass
                    try:
                        print(task, "------------------")
                        if task["task_approved_by"] == username and (
                            task["status"] == "Incomplete"
                            or task["status"] == "incompleted"
                            or task["status"] == "incomplete"
                            or task["status"] == "Incompleted"
                        ):
                            _tasks_you_marked_as_incomplete.append(task)
                    except KeyError:
                        pass
                    try:
                        if task["team_id"] in _teams_ids:
                            _teams_tasks.append(task)
                    except KeyError:
                        pass
                    try:
                        if (
                            task["team_id"] in _teams_ids
                            and task["completed"] == "True"
                        ):
                            _teams_tasks_completed.append(task)
                    except KeyError:
                        pass
                    try:
                        if (
                            task["team_id"] in _teams_ids
                            and task["completed"] == "False"
                        ):
                            _teams_tasks_uncompleted.append(task)
                    except KeyError:
                        pass
                    try:
                        if task["team_id"] in _teams_ids:
                            if task["approved"] == True or task["approval"] == True:
                                _teams_tasks_approved.append(task)
                    except KeyError:
                        pass

            if len(json.loads(issues_raised)["data"]) != 0:
                for issue in json.loads(issues_raised)["data"]:
                    try:
                        if issue["team_id"] in _teams_ids:
                            _teams_tasks_issues_raised.append(issue)
                            _teams_tasks_issues_raised_ids.append(issue["_id"])
                    except KeyError:
                        pass
                    try:
                        if (
                            issue["team_id"] in _teams_ids
                            and issue["current_status"] == "Resolved"
                        ):
                            _teams_tasks_issues_resolved.append(issue)
                    except KeyError:
                        pass

            if len(json.loads(comments_added)["data"]) != 0:
                for comment in json.loads(comments_added)["data"]:
                    if comment["thread_id"] in _teams_tasks_issues_raised_ids:
                        _teams_tasks_comments_added.append(comment)

            if len(_tasks_list) != 0:
                months = []
                for task in _tasks_list:
                    month_name = month_list[
                        datetime.datetime.strptime(
                            set_date_format(task["task_created_date"]),
                            "%m/%d/%Y %H:%M:%S",
                        ).month
                    ]
                    months.append(month_name)
                    if month_name in item.keys():
                        if (
                            str(
                                datetime.datetime.strptime(
                                    set_date_format(task["task_created_date"]),
                                    "%m/%d/%Y %H:%M:%S",
                                ).year
                            )
                            == year
                        ):
                            item[month_name].update(
                                {"tasks_added": months.count(month_name)}
                            )
            else:
                for key, value in item.items():
                    item[key].update({"tasks_added": 0})
            # tasks approved----------------------
            if len(_tasks_approved) != 0:
                months = []
                for task in _tasks_approved:
                    month_name = month_list[
                        datetime.datetime.strptime(
                            set_date_format(task["task_created_date"]),
                            "%m/%d/%Y %H:%M:%S",
                        ).month
                    ]

                    months.append(month_name)
                    if month_name in item.keys():
                        if (
                            str(
                                datetime.datetime.strptime(
                                    set_date_format(task["task_created_date"]),
                                    "%m/%d/%Y %H:%M:%S",
                                ).year
                            )
                            == year
                        ):
                            item[month_name].update(
                                {"tasks_approved": months.count(month_name)}
                            )
            else:
                for key, value in item.items():
                    item[key].update({"tasks_approved": 0})

            # tasks completed-----------------------------
            if len(_tasks_completed) != 0:
                months = []
                for task in _tasks_completed:
                    month_name = month_list[
                        datetime.datetime.strptime(
                            set_date_format(task["task_created_date"]),
                            "%m/%d/%Y %H:%M:%S",
                        ).month
                    ]
                    months.append(month_name)
                    if month_name in item.keys():
                        if (
                            str(
                                datetime.datetime.strptime(
                                    set_date_format(task["task_created_date"]),
                                    "%m/%d/%Y %H:%M:%S",
                                ).year
                            )
                            == year
                        ):
                            item[month_name].update(
                                {"tasks_completed": months.count(month_name)}
                            )
                            try:
                                percentage_tasks_completed = (
                                    item[month_name]["tasks_completed"]
                                    / item[month_name]["tasks_added"]
                                ) * 100
                                item[month_name].update(
                                    {
                                        "percentage_tasks_completed": percentage_tasks_completed
                                    }
                                )
                            except Exception:
                                item[month_name].update(
                                    {"percentage_tasks_completed": 0}
                                )
            else:
                for key, value in item.items():
                    item[key].update({"tasks_completed": 0})
                    item[key].update({"percentage_tasks_completed": 0})

            # tasks uncompleted---------------------
            if len(_tasks_uncompleted) != 0:
                months = []
                for task in _tasks_uncompleted:
                    month_name = month_list[
                        datetime.datetime.strptime(
                            set_date_format(task["task_created_date"]),
                            "%m/%d/%Y %H:%M:%S",
                        ).month
                    ]
                    # print(month_name,"=====",task["task_created_date"],"====",item.keys())
                    months.append(month_name)
                    if month_name in item.keys():
                        if (
                            str(
                                datetime.datetime.strptime(
                                    set_date_format(task["task_created_date"]),
                                    "%m/%d/%Y %H:%M:%S",
                                ).year
                            )
                            == year
                        ):
                            item[month_name].update(
                                {"tasks_uncompleted": months.count(month_name)}
                            )
            else:
                for key, value in item.items():
                    item[key].update({"tasks_added": 0})

            # teams----------------------------------------
            if len(_teams_list) != 0:
                months = []
                for team in _teams_list:
                    try:
                        month_name = month_list[
                            datetime.datetime.strptime(
                                set_date_format(team["date_created"]),
                                "%m/%d/%Y %H:%M:%S",
                            ).month
                        ]
                        months.append(month_name)
                        if (
                            str(
                                datetime.datetime.strptime(
                                    set_date_format(team["date_created"]),
                                    "%m/%d/%Y %H:%M:%S",
                                ).year
                            )
                            == year
                        ):
                            item[month_name].update({"teams": months.count(month_name)})
                    except Exception as e:
                        pass
            else:
                for key, value in item.items():
                    item[key].update({"teams": 0})
            # team tasks-------------------------------------------------
            if len(_teams_tasks) != 0:
                months = []
                for task in _teams_tasks:
                    try:
                        month_name = month_list[
                            datetime.datetime.strptime(
                                set_date_format(task["task_created_date"]),
                                "%m/%d/%Y %H:%M:%S",
                            ).month
                        ]
                        months.append(month_name)
                        if (
                            str(
                                datetime.datetime.strptime(
                                    set_date_format(task["task_created_date"]),
                                    "%m/%d/%Y %H:%M:%S",
                                ).year
                            )
                            == year
                        ):
                            item[month_name].update(
                                {"team_tasks": months.count(month_name)}
                            )
                    except Exception as e:
                        pass
            else:
                for key, value in item.items():
                    item[key].update({"team_tasks": 0})
            # completed team tasks------------------------------------
            if len(_teams_tasks_completed) != 0:
                months = []
                for task in _teams_tasks_completed:
                    try:
                        month_name = month_list[
                            datetime.datetime.strptime(
                                set_date_format(task["task_created_date"]),
                                "%m/%d/%Y %H:%M:%S",
                            ).month
                        ]
                        months.append(month_name)
                        if (
                            str(
                                datetime.datetime.strptime(
                                    set_date_format(task["task_created_date"]),
                                    "%m/%d/%Y %H:%M:%S",
                                ).year
                            )
                            == year
                        ):
                            item[month_name].update(
                                {"team_tasks_completed": months.count(month_name)}
                            )
                            try:
                                item[month_name].update(
                                    {
                                        "percentage_team_tasks_completed": (
                                            len(_teams_tasks_completed)
                                            / len(_teams_tasks)
                                        )
                                        * 100
                                    }
                                )
                            except Exception:
                                item[month_name].update(
                                    {"percentage_team_tasks_completed": 0}
                                )
                    except Exception as e:
                        pass
            else:
                for key, value in item.items():
                    item[key].update({"team_tasks_completed": 0})
                    item[key].update({"percentage_team_tasks_completed": 0})

            if len(_teams_tasks_uncompleted) != 0:
                months = []
                for task in _teams_tasks_uncompleted:
                    try:
                        month_name = month_list[
                            datetime.datetime.strptime(
                                set_date_format(task["task_created_date"]),
                                "%m/%d/%Y %H:%M:%S",
                            ).month
                        ]
                        months.append(month_name)
                        if (
                            str(
                                datetime.datetime.strptime(
                                    set_date_format(task["task_created_date"]),
                                    "%m/%d/%Y %H:%M:%S",
                                ).year
                            )
                            == year
                        ):
                            item[month_name].update(
                                {"team_tasks_uncompleted": months.count(month_name)}
                            )
                    except Exception as e:
                        pass
            else:
                for key, value in item.items():
                    item[key].update({"team_tasks_uncompleted": 0})

            if len(_teams_tasks_approved) != 0:
                months = []
                for task in _teams_tasks_approved:
                    try:
                        month_name = month_list[
                            datetime.datetime.strptime(
                                set_date_format(task["task_created_date"]),
                                "%m/%d/%Y %H:%M:%S",
                            ).month
                        ]
                        months.append(month_name)
                        if (
                            str(
                                datetime.datetime.strptime(
                                    set_date_format(task["task_created_date"]),
                                    "%m/%d/%Y %H:%M:%S",
                                ).year
                            )
                            == year
                        ):
                            item[month_name].update(
                                {"team_tasks_approved": months.count(month_name)}
                            )
                    except Exception as e:
                        pass
            else:
                for key, value in item.items():
                    item[key].update({"team_tasks_approved": 0})

            if len(_teams_tasks_issues_raised) != 0:
                months = []
                for thread in _teams_tasks_issues_raised:
                    try:
                        month_name = month_list[
                            datetime.datetime.strptime(
                                set_date_format(thread["created_date"]),
                                "%m/%d/%Y %H:%M:%S",
                            ).month
                        ]
                        months.append(month_name)
                        if (
                            str(
                                datetime.datetime.strptime(
                                    set_date_format(thread["created_date"]),
                                    "%m/%d/%Y %H:%M:%S",
                                ).year
                            )
                            == year
                        ):
                            item[month_name].update(
                                {"team_tasks_issues_raised": months.count(month_name)}
                            )
                    except Exception as e:
                        pass
            else:
                for key, value in item.items():
                    item[key].update({"team_tasks_issues_raised": 0})

            if len(_teams_tasks_issues_resolved) != 0:
                months = []
                for thread in _teams_tasks_issues_resolved:
                    try:
                        month_name = month_list[
                            datetime.datetime.strptime(
                                set_date_format(thread["created_date"]),
                                "%m/%d/%Y %H:%M:%S",
                            ).month
                        ]
                        months.append(month_name)
                        if (
                            str(
                                datetime.datetime.strptime(
                                    set_date_format(thread["created_date"]),
                                    "%m/%d/%Y %H:%M:%S",
                                ).year
                            )
                            == year
                        ):
                            item[month_name].update(
                                {"team_tasks_issues_resolved": months.count(month_name)}
                            )
                    except Exception as e:
                        pass
            else:
                for key, value in item.items():
                    item[key].update({"team_tasks_issues_resolved": 0})

            if len(_teams_tasks_comments_added) != 0:
                months = []
                for comment in _teams_tasks_comments_added:
                    try:
                        month_name = month_list[
                            datetime.datetime.strptime(
                                set_date_format(comment["created_date"]),
                                "%m/%d/%Y %H:%M:%S",
                            ).month
                        ]
                        months.append(month_name)
                        if (
                            str(
                                datetime.datetime.strptime(
                                    set_date_format(comment["created_date"]),
                                    "%m/%d/%Y %H:%M:%S",
                                ).year
                            )
                            == year
                        ):
                            item[month_name].update(
                                {"team_tasks_comments_added": months.count(month_name)}
                            )
                    except Exception as e:
                        pass
            else:
                for key, value in item.items():
                    item[key].update({"team_tasks_comments_added": 0})
            data["data"].append(item)
            return Response(data, status=status.HTTP_201_CREATED)
        else:
            return Response(
                {"message": "Parameters are not valid"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def itr_function(self, username):
        data = []
        field = {"applicant": username}
        tasks = dowellconnection(
            *task_management_reports, "fetch", field, update_field=None
        )
        res = dowellconnection(*task_details_module, "fetch", {}, update_field=None)
        response = {}
        d = []
        for task in json.loads(tasks)["data"]:
            for t in json.loads(res)["data"]:
                if t["task_id"] == task["_id"]:
                    d.append(t)
        response["data"] = d
        projects = []
        item = {}
        total_tasks = []
        total_tasks_last_one_day = []
        total_tasks_last_one_week = []
        # get number of projects or tasks
        for res in response["data"]:
            total_tasks.append(res)
            try:
                if not res["project"] in item.keys():
                    projects.append(res["project"])
            except KeyError:
                res["project"] = "None"
                projects.append(res["project"])

        projects = sorted(projects)
        week_details = []
        subprojects = {}
        total_hours = {}
        total_mins = {}
        total_secs = {}
        for p in set(sorted(projects)):
            subprojects[p] = []
            total_hours[p] = 0
            total_mins[p] = 0
            total_secs[p] = 0

        # total hours, seconds and minutes----------
        today = datetime.date.today()
        start = today - datetime.timedelta(days=today.weekday())
        end = start + datetime.timedelta(days=6)
        today = datetime.datetime.strptime(
            set_date_format(str(today)), "%m/%d/%Y %H:%M:%S"
        )
        start = datetime.datetime.strptime(
            set_date_format(str(start)), "%m/%d/%Y %H:%M:%S"
        )
        end = datetime.datetime.strptime(set_date_format(str(end)), "%m/%d/%Y %H:%M:%S")

        for res in response["data"]:
            try:
                if "task_created_date" in res.keys():
                    task_created_date = datetime.datetime.strptime(
                        set_date_format(res["task_created_date"]), "%m/%d/%Y %H:%M:%S"
                    )
                    if task_created_date >= start and task_created_date <= end:
                        week_details.append(res["project"])
                    if task_created_date >= today - datetime.timedelta(days=1):
                        total_tasks_last_one_day.append(res["project"])
                    if task_created_date >= today - datetime.timedelta(days=7):
                        total_tasks_last_one_week.append(res["project"])
                try:
                    start_time = datetime.datetime.strptime(res["start_time"], "%H:%M")
                except ValueError:
                    start_time = datetime.datetime.strptime(
                        res["start_time"], "%H:%M:%S"
                    )
                try:
                    end_time = datetime.datetime.strptime(res["end_time"], "%H:%M")
                except ValueError:
                    end_time = datetime.datetime.strptime(res["end_time"], "%H:%M:%S")
                duration = end_time - start_time
                dur_secs = (duration).total_seconds()
                dur_mins = dur_secs / 60
                dur_hrs = dur_mins / 60
                total_hours[res["project"]] += dur_hrs
                total_mins[res["project"]] += dur_mins
                total_secs[res["project"]] += dur_secs
                # print(dur_secs, dur_mins, dur_hrs)
            except KeyError:
                pass

        # subprojects------------------
        for res in response["data"]:
            if "subproject" in res.keys():
                if not res["subproject"] == None or not res["subproject"] == "None":
                    if type(res["subproject"]) == list:
                        for sp in res["subproject"]:
                            if "," in sp:
                                for s in sp.split(","):
                                    subprojects[res["project"]].append(s)
                            else:
                                subprojects[res["project"]].append(sp)
                    elif res["subproject"] == None:
                        subprojects[res["project"]].append("None")
                    else:
                        subprojects[res["project"]].append(res["subproject"])
        for p in set(sorted(projects)):
            item = {
                "project": p,
                "subprojects": {sp: subprojects[p].count(sp) for sp in subprojects[p]},
                "total_hours": total_hours[p],
                "total_min": total_mins[p],
                "total_secs": total_secs[p],
                "total_tasks": projects.count(p),
                "tasks_uploaded_this_week": week_details.count(p),
                "total_tasks_last_one_day": total_tasks_last_one_day.count(p),
                "total_tasks_last_one_week": total_tasks_last_one_week.count(p),
                "tasks": total_tasks,
            }
            data.append(item)
        return data

    def generate_individual_task_report(self, request):
        payload = request.data

        if payload:
            response = self.itr_function(payload.get("username"))
            return Response(
                {"message": "Individual task report generated", "response": response},
                status=status.HTTP_201_CREATED,
            )
        else:
            return Response(
                {"message": "Parameters are not valid"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def generate_project_report(self, request):
        payload = request.data
        serializer = ProjectWiseReportSerializer(data=payload)
        if serializer.is_valid():
            project_name = payload["project"]
            company_id = payload["company_id"]
            field1 = {"company_id": company_id, "project": project_name}
            update_field1 = {}
            response1 = dowellconnection(
                *task_details_module, "fetch", field1, update_field1
            )
            field2 = {"company_id": company_id}
            update_field2 = {}
            response2 = dowellconnection(
                *task_management_reports, "fetch", field2, update_field2
            )

            if response1 is not None and response2 is not None:
                team_projects1 = json.loads(response1)
                team_projects2 = json.loads(response2)
                task_data1 = team_projects1["data"]
                task_data2 = team_projects2["data"]
                users_task_count = {}
                total_tasks_added = 0
                user_subprojects = {}

                time_formats = ["%H:%M:%S", "%H:%M"]

                user_total_hours = {}

                for task1 in task_data1:
                    user_id1 = task1.get("user_id")
                    start_time_str = task1["start_time"]
                    end_time_str = task1["end_time"]

                    start_time = None
                    end_time = None

                    for time_format in time_formats:
                        try:
                            start_time = datetime.datetime.strptime(
                                start_time_str, time_format
                            )
                            end_time = datetime.datetime.strptime(
                                end_time_str, time_format
                            )
                            break
                        except ValueError:
                            continue

                    if start_time is not None and end_time is not None:
                        time_difference = (end_time - start_time).total_seconds()
                        work_hours = time_difference / 3600
                        user_total_hours.setdefault(user_id1, 0)
                        user_total_hours[user_id1] += work_hours

                    if user_id1:
                        if user_id1 in users_task_count:
                            users_task_count[user_id1] += 1
                        else:
                            users_task_count[user_id1] = 1
                        total_tasks_added += 1

                user_id_to_name = {}

                for task2 in task_data2:
                    user_id2 = task2.get("user_id")
                    user_name2 = task2.get("task_added_by")
                    if user_id2 and user_name2:
                        user_id_to_name[user_id2] = user_name2
                users_data = []

                subprojects = {}
                for res in task_data1:
                    subprojects[res["user_id"]] = []
                for res in task_data1:
                    # print(res)
                    if "subproject" in res.keys():
                        if (
                            not res["subproject"] == None
                            or not res["subproject"] == "None"
                        ):
                            try:
                                if type(res["subproject"]) == list:
                                    for sp in res["subproject"]:
                                        subprojects[res["user_id"]].append(sp)
                                else:
                                    subprojects[res["user_id"]].append(
                                        res["subproject"]
                                    )

                            except TypeError:
                                pass

                for user_id, task_count in users_task_count.items():
                    task_added_by = user_id_to_name.get(user_id, "Unknown")
                    total_hours = user_total_hours.get(user_id, 0)
                    """try:
                        user_subproject = UsersubProject.objects.get(link_id=user_id)
                        subprojects = user_subproject.sub_project_list
                    except UsersubProject.DoesNotExist:
                        subprojects = []"""
                    sp = {}
                    for s in subprojects[user_id]:
                        try:
                            if "," in s:
                                for i in s.split(","):
                                    sp[i] = subprojects[user_id].count(s)
                            else:
                                sp[s] = subprojects[user_id].count(s)
                        except TypeError:
                            pass
                    users_data.append(
                        {
                            "user_id": user_id,
                            "user": task_added_by,
                            "tasks_added": task_count,
                            "total_hours": total_hours,
                            "subprojects": sp,
                        }
                    )

                response_data = {
                    "total_tasks_added": total_tasks_added,
                    "users_that_added": users_data,
                }

                return Response(
                    {
                        "success": True,
                        "message": "Report Created",
                        "data": response_data,
                    },
                    status=status.HTTP_201_CREATED,
                )
            else:
                return Response(
                    {
                        "message": "Failed to fetch data from dowell connection",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
        else:
            return Response(
                {"message": "Parameters not valid"}, status=status.HTTP_400_BAD_REQUEST
            )

    def generate_task_level_report(self, request):
        payload = request.data

        if payload:
            if valid_period(payload["start_date"], payload["end_date"]) == True:
                if len(payload["company_id"]) > 0:
                    field = {"company_id": payload["company_id"]}
                else:
                    field = {}
                update_field = {}
                threshold = payload["threshold"]
                _tasks_added = dowellconnection(
                    *task_management_reports, "fetch", field, update_field
                )
                _task_added_ids = []
                task_added = {}
                for task in json.loads(_tasks_added)["data"]:
                    _task_added_ids.append(task["_id"])
                    try:
                        task_added[task["_id"]] = task["task_added_by"]
                    except KeyError:
                        task_added[task["_id"]] = "None"
                _task_details = dowellconnection(
                    *task_details_module, "fetch", field, update_field
                )
                # print(_task_details)

                tasks_added_by = []

                res_tasks_added = period_check(
                    start_dt=payload["start_date"],
                    end_dt=payload["end_date"],
                    data_list=json.loads(_task_details)["data"],
                    key="task_created_date",
                )

                projects = []

                for t in res_tasks_added[0]:
                    if t["task_id"] in _task_added_ids:
                        try:
                            tasks_added_by.append(task_added[t["task_id"]])
                        except KeyError:
                            tasks_added_by.append("None")
                            pass
                    try:
                        projects.append(t["project"])
                    except KeyError:
                        t["project"] = "None"
                        projects.append(t["project"])
                response = dowellconnection(
                    *candidate_management_reports, "fetch", field, update_field
                )
                total = [res for res in json.loads(response)["data"]]

                hired = [res for res in total if res["status"] == "hired"]
                data = {user["username"]: {} for user in hired}
                for user in data:
                    data[user] = {
                        "tasks": tasks_added_by.count(user),
                        "status": "Passed"
                        if tasks_added_by.count(user) >= threshold
                        else "Defaulter",
                    }
                # getting projects tasks details------------

                if len(projects) > 0:
                    c = Counter(projects)
                    m = min(c.values())
                    least_taskeds = [x for x in projects if c[x] == m]
                    least_tasked_projects = []
                    for items in set(least_taskeds):
                        count = least_taskeds.count(items)
                        least_tasked_projects.append(
                            {"title": items, "tasks_added": count}
                        )

                    m = max(c.values())
                    most_tasked = [x for x in projects if c[x] == m]
                    most_tasked_projects = []
                    for items in set(most_tasked):
                        count = most_tasked.count(items)
                        most_tasked_projects.append(
                            {"title": items, "tasks_added": count}
                        )

                ## get highest and lowest counts of tasks------------
                if len(tasks_added_by) > 0:
                    c = Counter(tasks_added_by)
                    m = min(c.values())
                    mins = [x for x in tasks_added_by if c[x] == m]
                    min_items = {}
                    for items in set(mins):
                        count = mins.count(items)
                        min_items[items] = count

                    m = max(c.values())
                    maxs = [x for x in tasks_added_by if c[x] == m]
                    max_items = {}
                    for items in set(maxs):
                        count = maxs.count(items)
                        max_items[items] = count

                if len(tasks_added_by) > 0:
                    response = {
                        "highest": max_items,
                        "lowest": min_items,
                        "project_with_most_tasks": most_tasked_projects
                        if len(projects) > 0
                        else "None",
                        "project_with_least_tasks": least_tasked_projects
                        if len(projects) > 0
                        else "None",
                        "threshold": threshold,
                        "users": data,
                    }
                else:
                    response = {
                        "highest": "None",
                        "lowest": "None",
                        "project_with_most_tasks": most_tasked_projects
                        if len(projects) > 0
                        else "None",
                        "project_with_least_tasks": least_tasked_projects
                        if len(projects) > 0
                        else "None",
                        "threshold": threshold,
                        "users": data,
                    }

                return Response(
                    {
                        "message": f"Task Level report generated for Org-{payload['company_id']}",
                        "response": response,
                    },
                    status=status.HTTP_201_CREATED,
                )
            else:
                return Response(
                    {
                        "message": "Parameters are not valid, start date must be smaller that end date"
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
        else:
            return Response(
                {"message": "Parameters are not valid"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def post(self, request):
        serializer = ReportSerializer(data=request.data)
        if serializer.is_valid():
            if request.data["report_type"] == "Admin":
                return self.generate_admin_report(request)
            elif request.data["report_type"] == "Hr":
                return self.generate_hr_report(request)
            elif request.data["report_type"] == "Account":
                return self.generate_account_report(request)
            elif request.data["report_type"] == "Candidate":
                return self.generate_candidate_report(request)
            elif request.data["report_type"] == "Team":
                return self.generate_team_report(request)
            elif request.data["report_type"] == "Lead":
                return self.generate_lead_report(request)
            elif request.data["report_type"] == "Individual":
                return self.generate_individual_report(request)
            elif request.data["report_type"] == "Individual Task":
                return self.generate_individual_task_report(request)
            elif request.data["report_type"] == "Project":
                return self.generate_project_report(request)
            elif request.data["report_type"] == "Public":
                return self.generate_public_report(request)
            elif request.data["report_type"] == "Level":
                return self.generate_task_level_report(request)

        else:
            return Response(
                {
                    "message": "Parameters not Valid. "
                    + str(serializer.errors["report_type"][0]),
                    "response": "It must me one of these -> 'Admin','Hr','Account','Candidate','Team','Lead','Individual','Individual Task','Project','Public' ",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )


class Public_report(APIView):
    def post(self, request):
        status_filter = request.data.get("status")
        company_id = request.data.get("company_id")
        field = {"company_id": company_id}
        update_field = {}
        data = []
        job_applications = dowellconnection(
            *candidate_management_reports, "fetch", field, update_field
        )
        job_applications_json = json.loads(job_applications)["data"]
        filtered_job_applications = []
        if status_filter:
            for application in job_applications_json:
                if application.get("status") == status_filter:
                    filtered_job_applications.append(
                        {
                            "applicant": application.get("applicant"),
                            "username": application.get("username"),
                            "status": application.get("status"),
                            "portfolio_name": application.get("portfolio_name"),
                            "signup_mail_sent": application.get("signup_mail_sent"),
                        }
                    )
        else:
            for application in job_applications_json:
                filtered_job_applications.append(
                    {
                        "applicant": application.get("applicant"),
                        "username": application.get("username"),
                        "status": application.get("status"),
                        "portfolio_name": application.get("portfolio_name"),
                        "signup_mail_sent": application.get("signup_mail_sent"),
                    }
                )
        data = filtered_job_applications
        return Response(
            {
                "isSuccess": True,
                "message": f"Public Job Report Generated",
                "Data": data,
            },
            status=status.HTTP_201_CREATED,
        )


@method_decorator(csrf_exempt, name="dispatch")
class GetQRCode(APIView):
    def get(self, request, job_company_id):
        field = {
            "job_company_id": job_company_id,
        }
        update_field = {}
        response = dowellconnection(*Publiclink_reports, "fetch", field, update_field)
        data = {}
        count = 0
        for item in json.loads(response)["data"]:
            for i in item["qr_ids"]:
                data[str(count)] = i
                count += 1

        if json.loads(response)["isSuccess"] == True:
            return Response(
                {
                    "message": f"qrcode with company_id-{job_company_id}",
                    "response": {"number_of_qr_ids": f"{len(data)}", "data": data},
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {
                    "message": "Failed to fetch",
                    "response": {"number_of_qr_ids": f"{len(data)}", "data": data},
                },
                status=status.HTTP_400_BAD_REQUEST,
            )


@method_decorator(csrf_exempt, name="dispatch")
class Generate_candidate_dublicates(APIView):
    def get(self, request, company_id):
        field = {"company_id": company_id}
        update_field = {}
        data = {}
        job_applications = dowellconnection(
            *candidate_management_reports, "fetch", field, update_field
        )
        Total_job_applications = json.loads(job_applications)["data"]
        applicants = []
        duplicates = []
        for job in Total_job_applications:
            username = job.get("username")
            email = job.get("applicant_email")
            applied_on = job.get("application_submitted_on")
            applicant_status = job.get("status")

            applicant = {
                "username": username,
                "email": email,
                "applied_on": applied_on,
                "applicant_status": applicant_status,
            }
            if applicant in applicants:
                duplicates.append(applicant)
            else:
                applicants.append(applicant)

        unique_usernames = set(applicant["username"] for applicant in applicants)
        data["unique_applicants"] = unique_usernames
        data["duplicates_applicants"] = duplicates

        return Response(
            {
                "message": "Candidate duplicates generated",
                "response": data,
            },
            status=status.HTTP_200_OK,
        )


@method_decorator(csrf_exempt, name="dispatch")
class Update_payment_status(APIView):
    def patch(self, request, document_id):
        data = request.data
        if data:
            field = {
                "_id": document_id,
            }
            update_field = {
                "payment_requested": True,
                "current_payment_request_status": data.get(
                    "current_payment_request_status"
                ),
            }
            # check if candidate application exists exists---
            check = dowellconnection(
                *candidate_management_reports, "fetch", field, update_field
            )
            if len(json.loads(check)["data"]) == 0:
                return Response(
                    {
                        "message": "Cannot be Updated, there is no application with this id",
                        "response": json.loads(check),
                    },
                    status=status.HTTP_204_NO_CONTENT,
                )
            else:
                serializer = UpdatePaymentStatusSerializer(data=update_field)
                if serializer.is_valid():
                    if update_field["payment_requested"] == False:
                        return Response(
                            {
                                "message": "Parameters are not valid",
                                "errors": "The field, 'payment_requested'  must be True",
                            },
                            status=status.HTTP_400_BAD_REQUEST,
                        )
                    response = dowellconnection(
                        *candidate_management_reports, "update", field, update_field
                    )
                    # print(response)
                    if json.loads(response)["isSuccess"] == True:
                        return Response(
                            {
                                "message": "Candidate application has been Updated successfully",
                                "response": json.loads(response),
                            },
                            status=status.HTTP_200_OK,
                        )
                    else:
                        return Response(
                            {
                                "message": "Candidate application failed to be updated",
                                "response": json.loads(response),
                            },
                            status=status.HTTP_404_NOT_FOUND,
                        )
                else:
                    return Response(
                        {
                            "message": "Parameters are not valid",
                            "errors": serializer.errors,
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

        else:
            return Response(
                {"message": "Parameters are not valid"},
                status=status.HTTP_400_BAD_REQUEST,
            )


class Generate_project_task_details_Report(APIView):
    def post(self, request):
        payload = request.data
        serializer = ProjectWiseReportSerializer(data=payload)
        if serializer.is_valid():
            project_name = payload["project"]
            company_id = payload["company_id"]
            field1 = {"company_id": company_id, "project": project_name}
            update_field1 = {}
            response1 = dowellconnection(
                *task_details_module, "fetch", field1, update_field1
            )
            field2 = {"company_id": company_id}
            update_field2 = {}
            response2 = dowellconnection(
                *task_management_reports, "fetch", field2, update_field2
            )
            taskdetails = self.task_details(request).data["data"]

            if response1 is not None and response2 is not None:
                team_projects1 = json.loads(response1)
                team_projects2 = json.loads(response2)
                task_data1 = team_projects1["data"]
                task_data2 = team_projects2["data"]
                users_task_count = {}
                total_tasks_added = 0
                user_subprojects = {}

                time_formats = ["%H:%M:%S", "%H:%M"]

                user_total_hours = {}

                for task1 in task_data1:
                    user_id1 = task1.get("user_id")
                    start_time_str = task1["start_time"]
                    end_time_str = task1["end_time"]

                    start_time = None
                    end_time = None

                    for time_format in time_formats:
                        try:
                            start_time = datetime.datetime.strptime(
                                start_time_str, time_format
                            )
                            end_time = datetime.datetime.strptime(
                                end_time_str, time_format
                            )
                            break
                        except ValueError:
                            continue

                    if start_time is not None and end_time is not None:
                        time_difference = (end_time - start_time).total_seconds()
                        work_hours = time_difference / 3600
                        user_total_hours.setdefault(user_id1, 0)
                        user_total_hours[user_id1] += work_hours

                    if user_id1:
                        if user_id1 in users_task_count:
                            users_task_count[user_id1] += 1
                        else:
                            users_task_count[user_id1] = 1
                        total_tasks_added += 1

                user_id_to_name = {}

                for task2 in task_data2:
                    user_id2 = task2.get("user_id")
                    user_name2 = task2.get("task_added_by")
                    if user_id2 and user_name2:
                        user_id_to_name[user_id2] = user_name2
                users_data = []

                for task2 in task_data1:
                    user_id2 = task2.get("user_id")
                    subprojects = task2.get("subproject", "none")

                    if user_id2 and subprojects in user_subprojects:
                        user_subprojects[user_id2].extend(subprojects)
                    else:
                        user_subprojects[user_id1] = subprojects
                users_data = []

                for user_id, task_count in users_task_count.items():
                    task_added_by = user_id_to_name.get(user_id, "Unknown")
                    total_hours = user_total_hours.get(user_id, 0)
                    try:
                        user_subproject = UsersubProject.objects.get(link_id=user_id)
                        subprojects = user_subproject.sub_project_list
                    except UsersubProject.DoesNotExist:
                        subprojects = []
                    users_data.append(
                        {
                            "user_id": user_id,
                            "user": task_added_by,
                            "tasks_added": task_count,
                            "total_hours": total_hours,
                            "subprojects": subprojects,
                            "tasks": [],
                        }
                    )
                user_task_details_project_wise = []
                for user_data in users_data:
                    user_name = user_data["user"]

                    matching_taskdetails = [
                        task["task_detailds"]
                        for task in taskdetails
                        if task["user"] == user_name
                    ]

                    user_data["tasks"].extend(matching_taskdetails)
                response_data = {
                    "total_tasks_added": total_tasks_added,
                    "users_that_added": users_data,
                }

                return Response(
                    {
                        "success": True,
                        "message": "Report Created",
                        "data": users_data,
                    }
                )
            else:
                return Response(
                    {
                        "success": False,
                        "message": "Failed to fetch data from dowell connection",
                    },
                    status=400,
                )
        else:
            return Response(
                {"success": False, "message": serializer.errors}, status=400
            )

    def task_details(self, request):
        payload = request.data
        serializer = ProjectWiseReportSerializer(data=payload)
        if serializer.is_valid():
            project_name = payload["project"]
            company_id = payload["company_id"]
            field1 = {"company_id": company_id, "project": project_name}
            update_field1 = {}
            response1 = json.loads(
                dowellconnection(*task_details_module, "fetch", field1, update_field1)
            )
            field2 = {"company_id": company_id}
            update_field2 = {}
            response2 = json.loads(
                dowellconnection(
                    *task_management_reports, "fetch", field2, update_field2
                )
            )
            user_task_details = []
            for response in response2["data"]:
                task_id = response["_id"]
                for res in response1["data"]:
                    if res["task_id"] == task_id:
                        # print(res)
                        user_task_details.append(
                            {"user": response["applicant"], "task_detailds": res}
                        )
        return Response({"data": user_task_details}, status=status.HTTP_201_CREATED)


class AddUserGithubInfo(APIView):
    def get(self, request):
        response1 = json.loads(
            dowellconnection(*github_details_module, "fetch", {}, update_field=None)
        )
        github_info = response1
        return Response(
            {"success": True, "data": github_info}, status=status.HTTP_200_OK
        )

    def post(self, request):
        payload = request.data
        serializer = githubinfoserializer(data=payload)
        if serializer.is_valid():
            username = payload["username"]

            field = {
                "username": payload["username"],
                "github_id": payload["github_id"],
                "github_link": payload["github_link"],
            }
            response1 = json.loads(
                dowellconnection(*github_details_module, "fetch", {}, update_field=None)
            )
            for github_info in response1["data"]:
                if github_info["username"] == username:
                    return Response(
                        {
                            "success": False,
                            "message": "The username already exists in the GitHub information database.",
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            response2 = json.loads(
                dowellconnection(
                    *github_details_module, "insert", field, update_field=None
                )
            )
            return Response(
                {
                    "success": True,
                    "message": "User GitHub info added.",
                    "data": response2,
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {
                    "success": False,
                    "message": serializer.errors,
                },
                status=status.HTTP_200_OK,
            )

    def put(self, request):
        payload = request.data

        update_field = {
            "username": payload["username"],
            "github_id": payload["github_id"],
            "github_link": payload["github_link"],
        }

        response2 = json.loads(
            dowellconnection(*github_details_module, "update", {}, update_field)
        )
        return Response(
            {
                "success": True,
                "message": "User GitHub info updated.",
                "data": response2,
            },
            status=status.HTTP_200_OK,
        )
