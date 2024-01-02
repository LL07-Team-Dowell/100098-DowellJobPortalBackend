import json
import requests
import datetime
import threading
import calendar
from datetime import datetime, timedelta, date
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
    validate_id,
    get_positions,
    get_month_details,
    samanta_content_evaluator,
    datacube_data_insertion,
    datacube_data_retrival,
    datacube_add_collection,
    datacube_data_update,
    get_subproject,
    check_speed_test, 
    get_projects,
    get_speed_test_data,
    get_speed_test_result
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
    ProjectDeadlineSerializer,
    regionalassociateSerializer,
    TeamTaskSerializer,
    DashBoardStatusSerializer,
    DashBoardJobCategorySerializer,
    GroupLeadAgendaSerializer,
    TaskDetailsInputSerializer,
    AddProjectTimeSerializer,
    UpdateProjectTimeSerializer,
    UpdateProjectSpentTimeSerializer,
    UpdateProjectTimeEnabledSerializer,
    GetWeeklyAgendaByIdSerializer,
    GetWeeklyAgendasSerializer,
    leaveapproveserializers,
    AddCollectionSerializer,
    agendaapproveserializer,
    leaveapplyserializers,
    SubprojectSerializer,
    AttendanceSerializer
)
from .authorization import (
    verify_user_token,
    sign_token,
)
from .models import UsersubProject, TaskReportdata, MonthlyTaskData, PersonalInfo
from django.views.decorators.csrf import csrf_protect

from dotenv import load_dotenv
import os

"""for linux server"""
load_dotenv("/home/100098/100098-DowellJobPortal/.env")
if os.getenv("API_KEY"):
    API_KEY = str(os.getenv("API_KEY"))
if os.getenv("DB_Name"):
    DB_Name = str(os.getenv("DB_Name"))
if os.getenv("REPORT_DB_NAME"):
    REPORT_DB_NAME = str(os.getenv("REPORT_DB_NAME"))
if os.getenv("PROJECT_DB_NAME"):
    PROJECT_DB_NAME = str(os.getenv("PROJECT_DB_NAME"))
if os.getenv("ATTENDANCE_DB_NAME"):
    ATTENDANCE_DB_NAME = str(os.getenv("ATTENDANCE_DB_NAME"))
else:
    """for windows local"""
    load_dotenv(f"{os.getcwd()}/.env")
    API_KEY = str(os.getenv("API_KEY"))
    DB_Name = str(os.getenv("DB_Name"))
    REPORT_DB_NAME = str(os.getenv("REPORT_DB_NAME"))
    PROJECT_DB_NAME = str(os.getenv("PROJECT_DB_NAME"))
    leave_report_collection = str(os.getenv("LEAVE_REPORT_COLLECTION"))
    PROJECT_DB_NAME = str(os.getenv("PROJECT_DB_NAME"))
    ATTENDANCE_DB_NAME = str(os.getenv("ATTENDANCE_DB_NAME"))

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
ISSUES_MAIL = """
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;300;400;500;600&display=swap"
      rel="stylesheet"
    />
    <title>Issue Update</title>
  </head>
  <body
    style="
      font-family: poppins;
      background-color: #f5f5f5;
      margin: 0;
      padding: 0;
      text-align: center;
      height: 100vh;
      display: flex;
      width: 100%;
      align-items: center;
    "
  >
    <div
      style="
        max-width: 600px;
        margin: 10px auto;
        background-color: #fff;
        padding: 10px 20px;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      "
    >
      <div style="text-align: center; margin-bottom: 0px;">
        <img
          src="http://67.217.61.253/hr/logo-2-min-min.png"
          alt="Company Logo"
          style="width: 100px; height: 100px;"
        />
      </div>
      <div style="text-align: center;">
        <h3 style="font-size: 24px; margin: 0; margin-bottom: 5px;">
          Issue Raised By {},
        </h3>
      </div>
      <div style="margin: 0; margin-bottom: 10px; line-height: 1.5;">
        <p style="font-weight: bold;">
          Issue Description:
        </p>
        <p>
          This is the issue raised by {} to understand the sample of the issue
        </p>
        <a
          href="https://web.discord.com"
          style="
            display: inline-block;
            background-color: #007bff;
            color: #fff;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 4px;
            transition: background-color 0.3s ease;
            text-align: center;
          "
          target="_blank"
          >Issue Page</a>
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


# authorization api----------------------------------------
@method_decorator(csrf_exempt, name="dispatch")
class auth(APIView):
    """get jwt token for authorization"""

    def post(self, request):
        # print(request.data.get("company_id"))
        if not validate_id(request.data.get("company_id")):
            return Response("something went wrong ok!", status.HTTP_400_BAD_REQUEST)
        user = {
            "username": request.data.get("username"),
            "portfolio": request.data.get("portfolio"),
            "data_type": request.data.get("data_type"),
            "company_id": request.data.get("company_id"),
        }
        return sign_token(user)


# authorization ends here-----------------------------------


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
                "rehired_on": str(datetime.now()),
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
            "type_of_opening": data.get("type_of_opening"),
            "country": request.data.get("country"),
            "city": request.data.get("city"),
            "continent": request.data.get("continent"),
        }
        type_request = request.GET.get("type")
        if type_request == "is_internal":
            if (
                data.get("type_of_opening") == "Group_Lead"
                or data.get("type_of_opening") == "Team_Lead"
                or data.get("type_of_opening") == None
            ):
                field["is_internal"] = True
                field["type_of_opening"] = data.get("type_of_opening")
            else:
                return Response(
                    {
                        "message": "Job creation was unsuccessful.",
                        "response": " Pass 'type_of_opening' as either 'Group_Lead' or 'Team_Lead'",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

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
class associate_job(APIView):
    def post(self, request):
        data = request.data
        # continue create job api-----
        field = {
            "job_title": data.get("job_title"),
            "country": data.get("country"),
            "city": data.get("city"),
            "is_active": data.get("is_active"),
            "job_category": "regional_associate",
            "job_number": data.get("job_number"),
            "skills": data.get("skills"),
            "description": data.get("description"),
            "qualification": data.get("qualification"),
            "payment": data.get("payment"),
            "company_id": data.get("company_id"),
            "data_type": data.get("data_type"),
            "paymentInterval": data.get("paymentInterval"),
        }
        update_field = {"status": "nothing to update"}

        serializer = regionalassociateSerializer(data=field)
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
    def duplicate_check(self, applicant_email):
        data = self.request.data
        candidate_field = {
            "job_number": data.get("job_number"),
            "applicant_email": applicant_email,
        }
        candidate_report = json.loads(dowellconnection(*candidate_management_reports, "fetch", candidate_field, update_field=None))["data"]
        # print(candidate_report)
        if len(candidate_report) > 0:
            return False
        else:
            return True

    def is_eligible_to_apply(self, applicant_email):
        data = self.request.data
        field = {
            "applicant": data.get("applicant"),
            "applicant_email": applicant_email,
            "username": data.get("username"),
        }
        applicant = dowellconnection(*hr_management_reports, "fetch", field, update_field=None)

        if applicant is not None:
            rejected_dates = [
                datetime.strptime(item["rejected_on"], "%m/%d/%Y %H:%M:%S")
                for item in json.loads(applicant)["data"]
            ]
            if len(rejected_dates) >= 1:
                rejected_on = max(rejected_dates)
                if rejected_on:
                    three_months_after = rejected_on + relativedelta(months=3)
                    current_date = datetime.today()
                    if (
                        current_date >= three_months_after
                        or current_date == datetime.today()
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
        if not self.duplicate_check(applicant_email):
            return Response(
                {
                    "message": "You have already applied for the job",
                    "Success": False,
                    "response": {
                        "applicant": data.get("applicant"),
                        "applicant_email": data.get("applicant_email"),
                        "username": data.get("username"),
                    },
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
            
        speed_test_response= check_speed_test(applicant_email)
        print(speed_test_response)
        if speed_test_response["success"] == False:
            return Response(
                speed_test_response,
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
            "internet_speed": speed_test_response['internet_speed'],
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
            "candidate_certificate":data.get("candidate_certificate")
        }
        serializer = CandidateSerializer(data=field)
        if serializer.is_valid():
            response = json.loads(dowellconnection(*candidate_management_reports, "insert", field, update_field=None))
            if response["isSuccess"] == True:
                return Response(
                    {
                        "message": "Application received.",
                        "Eligibility": self.is_eligible_to_apply(applicant_email),
                        "response": response,
                    },
                    status=status.HTTP_201_CREATED,
                )
            else:
                return Response(
                    {
                        "message": "Application failed to receive.",
                        "response": response,
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
class get_all_removed_candidate(APIView):
    def get(self, request, company_id):
        field = {"company_id": company_id, "status": "Removed"}
        response = dowellconnection(
            *candidate_management_reports, "fetch", field, update_field=None
        )

        if json.loads(response)["isSuccess"] == True:
            if len(json.loads(response)["data"]) == 0:
                return Response(
                    {
                        "message": f"There is no Removed Candidates with this company id",
                        "response": json.loads(response),
                    },
                    status=status.HTTP_204_NO_CONTENT,
                )
            else:
                candidates=[{"_id":res["_id"],
                    "applicant":res["applicant"],
                    "username":res["username"],
                    "applicant_email":res["applicant_email"]} for res in json.loads(response)["data"]]
                
                return Response(
                    {
                        "message": f"List of Removed Candidates",
                        "response": candidates,
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
@method_decorator(csrf_exempt, name="dispatch")
class get_all_hired_candidate(APIView):
    def get(self, request, company_id):
        field = {"company_id": company_id, "status": "hired"}
        response = dowellconnection(
            *candidate_management_reports, "fetch", field, update_field=None
        )
        if json.loads(response)["isSuccess"] == True:
            if len(json.loads(response)["data"]) == 0:
                return Response(
                    {
                        "message": f"There are no hired Candidates with this company id",
                        "response": json.loads(response),
                    },
                    status=status.HTTP_204_NO_CONTENT,
                )
            else:
                candidates=[{"_id":res["_id"],
                    "applicant":res["applicant"],
                    "username":res["username"],
                    "applicant_email":res["applicant_email"]} for res in json.loads(response)["data"]]
                
                return Response(
                    {
                        "message": f"List of hired Candidates",
                        "response": candidates,
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
@method_decorator(csrf_exempt, name="dispatch")
class get_all_renew_contract_candidate(APIView):
    def get(self, request, company_id):
        data = company_id
        if data:
            field = {"company_id": company_id, "status": "renew_contract"}
            response = dowellconnection(
                *candidate_management_reports, "fetch", field, update_field=None
            )

            if json.loads(response)["isSuccess"] == True:
                if len(json.loads(response)["data"]) == 0:
                    return Response(
                        {
                            "message": f"There are no Candidates with Renewed Contracts with this company id",
                            "response": json.loads(response),
                        },
                        status=status.HTTP_204_NO_CONTENT,
                    )
                else:
                    candidates=[{"_id":res["_id"],
                    "applicant":res["applicant"],
                    "username":res["username"],
                    "applicant_email":res["applicant_email"]} for res in json.loads(response)["data"]]
                    
                    return Response(
                        {
                            "message": f"List of Candidates with Renewed Contracts",
                            "response": candidates,
                        },
                        status=status.HTTP_200_OK,
                    )
            else:
                return Response(
                    {
                        "message": f"There are no Candidates with Renewed Contracts",
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
                "rehired_on": str(datetime.now()),
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
        # print(updated_date)
        task_updated_date = datetime.strptime(updated_date, "%m/%d/%Y %H:%M:%S")
        _date = task_updated_date + relativedelta(hours=336)
        _date = _date.strftime("%m/%d/%Y %H:%M:%S")

        return str(_date)

    @verify_user_token
    def post(self, request, user):
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
    @verify_user_token
    def get(self, request,user,company_id):
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
    #@verify_user_token
    def get(self, request,document_id):
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
    @verify_user_token
    def patch(self, request, user):
        data = request.data
        if data:
            field = {"_id": data.get("document_id")}
            update_field = {
                "status": data.get("status"),
                "task": data.get("task"),
                "task_added_by": data.get("task_added_by"),
                "task_updated_by": data.get("task_updated_by"),
                "task_updated_date": str(datetime.now()),
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

    @verify_user_token
    def post(self, request, user):
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
    @verify_user_token
    def get(self, request, user, document_id):
        field = {"_id": document_id}
        update_field = {"status": "Nothing to update"}
        response = dowellconnection(
            *update_task_request_module, "fetch", field, update_field
        )
        if json.loads(response)["isSuccess"] == True:
            if len(json.loads(response)["data"]) == 0:
                return Response(
                    {
                        "message": f"There is no update task with this document id",
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
    @verify_user_token
    def get(self, request, user, company_id):
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
    def check_denied(self, id):
        response = dowellconnection(
            *update_task_request_module, "fetch", {"_id": id}, {}
        )
        data = json.loads(response)["data"][0]
        if data["request_denied"] is False:
            return True
        else:
            return False

    def check_approved(self, id):
        response = dowellconnection(
            *update_task_request_module, "fetch", {"_id": id}, {}
        )
        data = json.loads(response)["data"][0]
        if data["approved"] is True:
            return False
        else:
            return True

    @verify_user_token
    def patch(self, request, user, document_id):
        data = request.data

        if self.check_approved(document_id) is False:
            return Response(
                {
                    "error": "Request failed to be approved",
                    "response": "Request has already been approved",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        if self.check_denied(document_id) is True:
            if not data.get("approved_by"):
                return Response(
                    {
                        "error": "Request failed to be approved",
                        "response": "Ensure that 'approved_by' is set to your username",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
            field = {"_id": document_id}
            update_field = {
                "approved": True,
                "approved_by": data.get("approved_by"),
                "approved_on": set_date_format(datetime.now()),
            }
            response = dowellconnection(
                *update_task_request_module, "update", field, update_field
            )
            response_json = json.loads(response)
            # print(response_json)
            isSuccess = response_json.get("isSuccess", False)

            if isSuccess:
                return Response(
                    {
                        "message": "Request is approved",
                        "response": response_json,
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {
                        "message": "Request failed to be approved",
                        "response": response_json,
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
        else:
            return Response(
                {
                    "error": "Request failed to be approved",
                    "response": "Request has already been denied",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )


@method_decorator(csrf_exempt, name="dispatch")
class denied_task_request_update(APIView):
    def check_denied(self, id):
        response = dowellconnection(
            *update_task_request_module, "fetch", {"_id": id}, {}
        )
        data = json.loads(response)["data"][0]
        if data["request_denied"] is False:
            return True
        else:
            return False

    def check_approved(self, id):
        response = dowellconnection(
            *update_task_request_module, "fetch", {"_id": id}, {}
        )
        data = json.loads(response)["data"][0]
        if data["approved"] is True:
            return False
        else:
            return True

    @verify_user_token
    def patch(self, request, user, document_id):
        data = request.data

        if self.check_denied(document_id) is False:
            return Response(
                {
                    "error": "Request failed to be denied",
                    "response": "Request has already been denied",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        if self.check_approved(document_id) is True:
            if not data.get("reason_for_denial"):
                return Response(
                    {
                        "error": "Request failed to be denied",
                        "response": "The Reason for denial has not been added",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
            if not data.get("denied_by"):
                return Response(
                    {
                        "error": "Request failed to be denied",
                        "response": "Ensure that 'denied_by' is set to your username",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
            field = {"_id": document_id}
            update_field = {
                "request_denied": True,
                "reason_for_denial": data.get("reason_for_denial"),
                "denied_by": data.get("denied_by"),
                "denied_on": set_date_format(datetime.now()),
            }

            response = dowellconnection(
                *update_task_request_module, "update", field, update_field
            )

            response_json = json.loads(response)
            isSuccess = response_json.get("isSuccess", False)

            if isSuccess:
                return Response(
                    {
                        "message": "Request has been denied",
                        "response": response_json,
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {
                        "message": "Request failed to be denied",
                        "response": response_json,
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
        else:
            return Response(
                {
                    "error": "Request failed to be denied",
                    "response": "Request has already been approved",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )


@method_decorator(csrf_exempt, name="dispatch")
class approve_task(APIView):
    def max_updated_date(self, updated_date):
        task_updated_date = datetime.strptime(updated_date, "%m/%d/%Y %H:%M:%S")
        _date = task_updated_date + relativedelta(hours=336)
        _date = _date.strftime("%m/%d/%Y %H:%M:%S")

        return str(_date)

    def valid_teamlead(self, username):
        profiles = SettingUserProfileInfo.objects.all()
        serializer = SettingUserProfileInfoSerializer(profiles, many=True)
        # print(serializer.data,"----")
        info = dowellconnection(
            *candidate_management_reports,
            "fetch",
            {
                "username": username,
            },
            update_field=None,
        )
        # print(len(json.loads(info)["data"]),"==========")
        if len(json.loads(info)["data"]) > 0:
            username = json.loads(info)["data"][0]["username"]
            portfolio_name = [
                names["portfolio_name"] for names in json.loads(info)["data"] if "portfolio_name" in names.keys()
            ]
            valid_profiles = []
            for data in serializer.data:
                for d in data["profile_info"]:
                    if "profile_title" in d.keys():
                        if d["profile_title"] in portfolio_name:
                            if (
                                d["Role"] == "Project_Lead"
                                or d["Role"] == "Proj_Lead"
                                or d["Role"] == "super_admin"
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
            current_date = datetime.today()
            # print(json.loads(response)["data"],"=========")
            try:
                max_updated_dates = [
                    datetime.strptime(item["max_updated_date"], "%m/%d/%Y %H:%M:%S")
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
                # print("response:", res)
                resp = dowellconnection(
                    *task_details_module, "fetch", field, update_field
                )
                max_updated_dates = [
                    datetime.strptime(item["max_updated_date"], "%m/%d/%Y %H:%M:%S")
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

    @verify_user_token
    def patch(self, request, user):
        data = request.data
        # print(data)
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
                    validate_teamlead = self.valid_teamlead(data.get("lead_username"))
                    if validate_teamlead is False:
                        return Response(
                            {
                                "message": "This username is not valid. Enter valid username for TeamLead or ProjectLead",
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
                            "message": "Task approval unsuccessful. The 2-weeks approval window has elapsed."
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
    @verify_user_token
    def delete(self, request, user, document_id):
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
        task_updated_date = datetime.strptime(updated_date, "%Y-%m-%d")
        _date = task_updated_date + relativedelta(hours=336)
        _date = _date.strftime("%Y-%m-%d %H:%M:%S")
        return _date

    #@verify_user_token
    def post(self, request):
        type_request = request.GET.get("type")

        if type_request == "add_task":
            return self.add_task(request)
        elif type_request == "get_candidate_task":
            return self.get_candidate_task(request)
        elif type_request == "get_specific_task":
            return self.get_specific_task(request)
        elif type_request == "update_candidate_task":
            return self.update_candidate_task(request)
        elif type_request == "update_single_task":
            return self.update_single_task(request)
        elif type_request == "get_all_candidate_tasks":
            return self.get_all_candidate_tasks(request)
        elif type_request == "task_details":
            return self.get_all_task_details(request)
        elif type_request == "get_subproject_tasks":
            return self.get_subproject_tasks(request)
        else:
            return self.handle_error(request)

    @verify_user_token
    def get(self, request, user):
        type_request = request.GET.get("type")

        if type_request == "save_task":
            return self.save_task(request)
        elif type_request == "delete_current_task":
            return self.delete_current_task(request)
        else:
            return self.handle_error(request)

    #@verify_user_token
    def add_task(self, request):
        data = request.data
        payload = {
            "project": data.get("project"),
            "subproject": data.get("subproject"),
            "applicant": data.get("applicant"),
            "applicant_id": data.get("applicant_id"),
            "task_image": data.get("image"),
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
                "applicant_id": data.get("applicant_id"),
                "task_image": data.get("image"),
                "task_added_by": data.get("task_added_by"),
                "data_type": data.get("data_type"),
                "company_id": data.get("company_id"),
                "task_created_date": data.get("task_created_date"),
                "user_id": data.get("user_id"),
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
                    "applicant_id": data.get("applicant_id"),
                    "task_image": data.get("image"),
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
                    field["_id"]=response["inserted_id"]
                    # year,monthname, monthcount = get_month_details(data.get("task_created_date"))
                    # filter_params={
                    #    "applicant_id":data.get("applicant_id"),
                    #    "username":data.get("task_added_by"),
                    #    "year":year,
                    #    "month":monthname,
                    #    "company_id":data.get("company_id")
                    # }
                    # task_params={"task_added"}
                    # report =updatereportdb(filter_params=filter_params,task_params=task_params)
                    ##------------------------------------------------

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

    @verify_user_token
    def get_candidate_task(self, request, user):
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

    def get_specific_task(self, request):
        data = request.data
        field = {"_id": data.get("document_id")}
        response = dowellconnection(
            *task_details_module, "fetch", field, update_field=None
        )
        # print(response,"===================")

        if json.loads(response)["isSuccess"] == True:
            if len(json.loads(response)["data"]) == 0:
                return Response(
                    {
                        "message": f"No task found for this id - {data.get('document_id')}",
                        "response": json.loads(response),
                    },
                    status=status.HTTP_204_NO_CONTENT,
                )
            else:
                return Response(
                    {
                        "message": f"Task details of {data.get('document_id')}",
                        "response": json.loads(response),
                    },
                    status=status.HTTP_200_OK,
                )
        else:
            return Response(
                {
                    "error": f"No task found for this id - {data.get('document_id')}",
                    "response": json.loads(response),
                },
                status=status.HTTP_204_NO_CONTENT,
            )

    @verify_user_token
    def update_candidate_task(self, request, user):
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

    def get_all_task_details(self, request):
        data = request.data
        company_id = data.get("company_id")
        user_id = data.get("user_id")
        start_date_str = request.data.get("start_date")
        end_date_str = request.data.get("end_date")
        start_date = datetime.strptime(start_date_str, "%Y-%m-%d")
        end_date = datetime.strptime(end_date_str, "%Y-%m-%d")

        def try_parse_date(date_str):
            # List of date formats to try
            date_formats = [
                "%m/%d/%Y %H:%M:%S",
                "%Y-%m-%d %H:%M:%S",
                "%m/%d/%Y",
                "%Y-%m-%d",
            ]

            for date_format in date_formats:
                try:
                    return datetime.strptime(set_date_format(date_str), date_format)
                except ValueError:
                    pass
            return None

        if not data.get("company_id"):
            return Response(
                {"success": False, "error": "please specify the company id"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if not data.get("user_id"):
            return Response(
                {"success": False, "error": "please specify the user id"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if not data.get("start_date"):
            return Response(
                {"success": False, "error": "please specify the start date"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if not data.get("end_date"):
            return Response(
                {"success": False, "error": "please specify the end date"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        field = {
            "user_id": user_id,
            "company_id": company_id,
        }
        filtered_tasks = []
        response_json = dowellconnection(
            *task_details_module, "fetch", field, update_field=None
        )
        response = json.loads(response_json)
        # print(response)
        for task in response["data"]:
            if (
                "task_created_date" in task.keys()
                and set_date_format(task["task_created_date"]) != ""
            ):
                try:
                    task_created_date = try_parse_date(task["task_created_date"])
                    if (
                        task_created_date is not None
                        and start_date <= task_created_date <= end_date
                    ):
                        filtered_tasks.append(task)
                except Exception as error:
                    print(error)

        return Response(
            {
                "success": True,
                "message": "Get all task details",
                "num_of_tasks": len(filtered_tasks),
                "task_details": filtered_tasks,
            }
        )

    def get_subproject_tasks(self, request):
        try:
            # Parse dates at the beginning
            start_date_str = request.data.get("start_date")
            end_date_str = request.data.get("end_date")
            start_date = datetime.strptime(start_date_str, "%Y-%m-%d")
            end_date = datetime.strptime(end_date_str, "%Y-%m-%d")
        except ValueError as ve:
            return Response(
                {"success": False, "error": f"Error parsing dates: {ve}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        company_id = request.GET.get("company_id")
        subproject = request.GET.get("subproject")
        project = request.GET.get("project")

        # Check for required parameters
        if not company_id:
            return Response(
                {"success": False, "error": "Please specify the company id"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if not start_date_str:
            return Response(
                {"success": False, "error": "Please specify the start date"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if not end_date_str:
            return Response(
                {"success": False, "error": "Please specify the end date"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        field = {"company_id": company_id}

        if subproject:
            field["subproject"] = subproject

        if project:
            field["project"] = project

        filtered_tasks = []
        response_json = dowellconnection(
            *task_details_module, "fetch", field, update_field=None
        )
        response = json.loads(response_json)
        for task in response["data"]:
            if (
                "task_created_date" in task.keys()
                and set_date_format(task["task_created_date"]) != ""
            ):
                try:
                    task_created_date = datetime.strptime(
                        task["task_created_date"], "%Y-%m-%d "
                    )

                    if start_date <= task_created_date <= end_date:
                        filtered_tasks.append(task)
                except ValueError as error:
                    print("Error parsing task_created_date:", error)
                    pass

        return Response(
            {
                "success": True,
                "message": "Get all task details",
                "num_of_tasks": len(filtered_tasks),
                "task_details": filtered_tasks,
            }
        )

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
        _date = datetime.strptime(str(date), "%Y-%m-%d %H:%M:%S.%f").strftime(
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
                "date_created": self.get_current_datetime(datetime.now()),
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
    #     task_updated_date = datetime.strptime(
    #         updated_date, "%m/%d/%Y %H:%M:%S"
    #     )
    #     _date = task_updated_date + relativedelta(hours=12)
    #     _date = _date.strftime('%m/%d/%Y %H:%M:%S')
    #     return str(_date)
    def get_current_datetime(self, date):
        _date = datetime.strptime(str(date), "%Y-%m-%d %H:%M:%S.%f").strftime(
            "%m/%d/%Y %H:%M:%S"
        )
        return str(_date)

    def post(self, request):
        data = request.data
        payload = {
            "title": data.get("title"),
            "description": data.get("description"),
            "task_image": data.get("image"),
            "assignee": data.get("assignee"),
            "team_id": data.get("team_id"),
            "task_created_date": self.get_current_datetime(datetime.now()),
            "subtasks": data.get("subtasks"),
        }
        serializer = TeamTaskSerializer(data=payload)
        if serializer.is_valid():
            field = {
                "eventId": get_event_id()["event_id"],
                "title": data.get("title"),
                "description": data.get("description"),
                "task_image": data.get("image"),
                "assignee": data.get("assignee"),
                "completed": data.get("completed"),
                "team_id": data.get("team_id"),
                "data_type": data.get("data_type"),
                "task_created_date": self.get_current_datetime(datetime.now()),
                "due_date": data.get("due_date"),
                "task_updated_date": "",
                "approval": False,
                "subtasks": data.get("subtasks"),
                # "max_updated_date": self.max_updated_date(self.get_current_datetime(datetime.now())),
            }
            update_field = {"status": "nothing to update"}
            
            response = dowellconnection(
                *task_management_reports, "insert", field, update_field
            )
            # print(response)
            if json.loads(response)["isSuccess"] == True:
                ##adding to sqlite--------------------------------
                # year,monthname, monthcount = get_month_details(data.get("task_created_date"))
                # filter_params={
                #    "applicant_id":data.get("applicant_id"),
                #    "username":data.get("task_added_by"),
                #    "year":year,
                #    "month":monthname,
                #    "company_id":data.get("company_id")
                # }
                # task_params={"team_tasks"}
                # report =updatereportdb(filter_params=filter_params,task_params=task_params)
                ##------------------------------------------------

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
                {"message": "Parameters are not valid", "response": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )


@method_decorator(csrf_exempt, name="dispatch")
class edit_team_task(APIView):
    def get_current_datetime(self, date):
        _date = datetime.strptime(str(date), "%Y-%m-%d %H:%M:%S.%f").strftime(
            "%m/%d/%Y %H:%M:%S"
        )
        return str(_date)

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
                "team_name": data.get("team_name"),
                "subtasks": data.get("subtasks"),
            }
            iscomplete=False
            if (
                data.get("completed") == "True"
                or data.get("completed") == "true"
                or data.get("completed") == True
            ):
                update_field["completed"] = data.get("completed")
                update_field["completed_on"] = self.get_current_datetime(datetime.now())
            # print(update_field, "=====")
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
                        "response": [],
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
        _date = datetime.strptime(str(date), "%Y-%m-%d %H:%M:%S.%f").strftime(
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
                "task_created_date": self.get_current_datetime(datetime.now()),
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
    def duplicate_check(self, applicant_email):
        data = self.request.data
        candidate_field = {
            "job_number": data.get("job_number"),
            "applicant_email": applicant_email,
        }
        update_field = {"status": "nothing to update"}
        candidate_report = json.loads(
            dowellconnection(
                *candidate_management_reports, "fetch", candidate_field, update_field
            )
        )["data"]
        # print(candidate_report)
        if len(candidate_report) > 0:
            return False
        else:
            return True

    def post(self, request):
        link_id = request.GET.get("link_id")
        data = request.data
        applicant_email = data.get("applicant_email")
        if not self.duplicate_check(applicant_email):
            return Response(
                {
                    "message": "You have already applied for the job",
                    "Success": False,
                    "response": {
                        "applicant": data.get("applicant"),
                        "applicant_email": data.get("applicant_email"),
                        "username": data.get("username"),
                    },
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
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
        application_id = request.data.get("application_id")

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
            if type(encoded_jwt) == bytes:
                decodedbytestr = encoded_jwt.decode("utf-8")
            else:
                decodedbytestr = encoded_jwt
            link = f"https://100014.pythonanywhere.com/?hr_invitation={decodedbytestr}"
            # print("------link new------", link)
            email_content = INVITATION_MAIL.format(toname, job_role, link)
            mail_response = interview_email(toname, toemail, subject, email_content)

            # update the public api by username==================
            field = {"username": qr_id, "_id": application_id}
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
                    # print(res.keys(), "========")
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
            "company_id": data.get("company_id"),
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
            "company_id": data.get("company_id"),
            "created_by": data.get("created_by"),
            "team_id": data.get("team_id"),
            "team_alerted_id": data.get("team_alerted_id"),
            "created_date": f"{datetime.today().month}/{datetime.today().day}/{datetime.today().year} {datetime.today().hour}:{datetime.today().minute}:{datetime.today().second}",
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

                if len(json.loads(get_team)["data"]) > 0:
                    for member in json.loads(get_team)["data"][0]["members"]:
                        if member in users.keys():
                            send_to_emails[member] = users[member]

                # print(send_to_emails)
                def send_mail(*args):
                    d = interview_email(*args)

                email_content = ISSUES_MAIL.format(
                    data.get("created_by"), data.get("created_by")
                )
                for name, email in send_to_emails.items():
                    send_mail_thread = threading.Thread(
                        target=send_mail,
                        args=(
                            name,
                            email,
                            "Notification for Issue created.",
                            email_content,
                        ),
                    )
                    send_mail_thread.start()
                    send_mail_thread.join()
                ##------------------------------------------------

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
            if data.get("current_status") == "Resolved":
                update_field = {
                    "current_status": data.get("current_status"),
                    "previous_status": previous_status,
                    "resolved_on": str(datetime.now().strftime("%m/%d/%Y %H:%M:%S")),
                }

            elif data.get("current_status") == "Completed":
                update_field = {
                    "current_status": data.get("current_status"),
                    "previous_status": previous_status,
                    "completed_on": str(datetime.now().strftime("%m/%d/%Y %H:%M:%S")),
                }

            elif data.get("current_status") == "In progress":
                update_field = {
                    "current_status": data.get("current_status"),
                    "previous_status": previous_status,
                    "started_on": str(datetime.now().strftime("%m/%d/%Y %H:%M:%S")),
                }

            elif data.get("current_status") == "Created":
                update_field = {
                    "current_status": data.get("current_status"),
                    "previous_status": previous_status,
                    "created_date": str(datetime.now().strftime("%m/%d/%Y %H:%M:%S")),
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


@method_decorator(csrf_exempt, name="dispatch")
class GetTeamAlertedThreads(APIView):
    def get(self, request, team_alerted_id):
        field = {
            "team_alerted_id": team_alerted_id,
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
                {
                    "message": f"List of Threads with team id-{team_alerted_id}",
                    "data": threads,
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"message": "Failed to fetch", "data": threads},
                status=status.HTTP_400_BAD_REQUEST,
            )


class GetAllThreads(APIView):
    def get(self, request, company_id):
        field = {"company_id": company_id}
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
                if len(threads) > 0:
                    return Response(
                        {
                            "isSuccess": True,
                            "message": "List of Threads",
                            "data": threads,
                        },
                        status=status.HTTP_200_OK,
                    )
                else:
                    return Response(
                        {
                            "isSuccess": True,
                            "message": f"No Threads with this company_id- {company_id} found",
                            "data": threads,
                        },
                        status=status.HTTP_204_NO_CONTENT,
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
            "created_date": f"{datetime.today().month}/{datetime.today().day}/{datetime.today().year} {datetime.today().hour}:{datetime.today().minute}:{datetime.today().second}",
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
                status=status.HTTP_304_NOT_MODIFIED,
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
                        datetime.strptime(date, "%m/%d/%Y %H:%M:%S").month
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
                        due_date = datetime.strptime(
                            set_date_format(t["due_date"]), "%m/%d/%Y %H:%M:%S"
                        )
                        task_updated_date = datetime.strptime(
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
                print(tasks,"===")

                comments = dowellconnection(
                    *comment_report_module, "fetch", {}, update_field
                )
                update_field = {}

                team_threads = json.loads(
                    dowellconnection(
                        *thread_report_module,
                        "fetch",
                        {
                            "team_id": payload["team_id"],
                        },
                        update_field,
                    )
                )["data"]

                Threads_Resolved = []
                Threads_In_pending = []
                Threads_Completed = []
                total_threads_raised = []
                all_issue_resolved_time = timedelta()

                total_comments = 0
                for threads in team_threads:
                    total_threads_raised.append(threads)
                    if threads["current_status"] == "Created":
                        Threads_In_pending.append(threads)
                    if threads["current_status"] == "Resolved":
                        Threads_Resolved.append(threads)
                    if threads["current_status"] == "In progress":
                        Threads_In_pending.append(threads)
                    if threads["current_status"] == "Completed":
                        Threads_Completed.append(threads)

                    for comment in json.loads(comments)["data"]:
                        if comment["thread_id"] == threads["_id"]:
                            total_comments += 1
                if len(total_threads_raised) > 0:
                    average_comment_count_per_issue = total_comments / len(
                        total_threads_raised
                    )
                else:
                    average_comment_count_per_issue = 0

                for threads in Threads_Resolved:
                    if "resolved_on" in threads.keys():
                        threads_created_on=threads["created_date"]
                        threads_resolved_on=threads["resolved_on"]
                        date_format = '%m/%d/%Y %H:%M:%S'
                        created_date = datetime.strptime(threads_created_on,date_format )
                        resolved_date = datetime.strptime(threads_resolved_on,date_format )
                        time_to_solve_issue=resolved_date-created_date
                        all_issue_resolved_time +=time_to_solve_issue   
                if len(Threads_Resolved) > 0:
                    average_time_taken_to_resolve = all_issue_resolved_time / len(
                        Threads_Resolved
                    )
                else:
                    average_time_taken_to_resolve = 0

                data["total_issues_raised"] = len(total_threads_raised)
                data["total_issues_pending"] = len(Threads_In_pending)
                data["total_issues_resolved"] = len(Threads_Resolved)
                data["total_issues_completed"] = len(Threads_Completed)
                data["average_time_to_resolve_issues"] = average_time_taken_to_resolve
                data["total_comments"] = total_comments
                data[
                    "average_comment_count_per_issue"
                ] = average_comment_count_per_issue

                total_tasks = [res for res in json.loads(tasks)["data"]]

                teams = dowellconnection(
                    *team_management_modules, "fetch", field, update_field
                )
                total_teams = [res for res in json.loads(teams)["data"]]
                # print(total_teams)
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
                    # print(t)
                    try:
                        if t["status"] == "Incomplete" or t["status"] == "Incompleted":
                            team_tasks_uncompleted.append(t)
                    except Exception:
                        try:
                            if t["Incompleted"] == True or t["Incomplete"] == True:
                                team_tasks_uncompleted.append(t)
                                # print(team_tasks_uncompleted)
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
                        due_date = datetime.strptime(
                            set_date_format(t["due_date"]), "%m/%d/%Y %H:%M:%S"
                        )
                        task_updated_date = datetime.strptime(
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
        company_id = payload.get("company_id")
        if payload:
            # intializing query parameters-----------------------------------------------------
            field = {
                "_id": payload.get("applicant_id"),
                "company_id": payload.get("company_id"),
            }
            year = payload.get("year")
            update_field = {}
            data = {}
            # ----------------------------------------------------------------------------------

            # ensuring the given year is a valid year------------------------------------------
            if int(year) > datetime.today().year:
                return Response(
                    {
                        "message": "You cannot get a report on a future date",
                        "error": f"{year} is bigger than current year {datetime.today().year}",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
            # -------------------------------------------------------------------------------

            # add fields values if role has been given--------------------------------------
            if payload.get("role"):
                field["username"] = payload.get("applicant_username")
                field["status"] = "hired"
            # -------------------------------------------------------------------------------

            # check if the user has any data------------------------------------------------
            info = dowellconnection(
                *candidate_management_reports, "fetch", field, update_field
            )
            if len(json.loads(info)["data"]) <= 0:
                data["personal_info"] = {}
                username = "None"
                return Response(
                    {
                        "message": f"There is no candidate with such parameters --> "
                        + " ".join([va for va in field.values()])
                    },
                    status=status.HTTP_204_NO_CONTENT,
                )
            data["personal_info"] = json.loads(info)["data"][0]
            username = json.loads(info)["data"][0]["username"]
            portfolio_name = json.loads(info)["data"][0]["portfolio_name"]

            # get the task report based on project for the user----------------------------------------
            data["personal_info"]["task_report"] = []
            # -------------------------------------------------------------------------------------------

            # if a position is given, check within any of the contained positions-------------------
            if payload.get("role"):
                profiles = SettingUserProfileInfo.objects.all()
                serializer = SettingUserProfileInfoSerializer(profiles, many=True)
                # print(serializer.data,"----")
                positions = get_positions(serializer.data)
                teamleads = positions["teamleads"]
                accountleads = positions["accountleads"]
                hrs = positions["hrs"]
                subadmins = positions["subadmins"]
                groupleads = positions["groupleads"]
                superadmins = positions["superadmins"]
                candidates = positions["candidates"]
                viewers = positions["viewers"]
                projectlead = positions["projectlead"]
                leaders = positions["leaders"]

                # checking if the user is a team lead--------------------------------------------

                if (
                    payload.get("role") == "Teamlead"
                    or payload.get("role") == "TeamLead"
                ):
                    if portfolio_name not in teamleads:
                        return Response(
                            {
                                "message": f"You cannot get a report on ->{payload.get('applicant_username')}",
                                "error": f"The User ->{payload.get('applicant_username')}-({portfolio_name}) is not a team lead",
                            },
                            status=status.HTTP_400_BAD_REQUEST,
                        )
                # _-------------------------------------------------------------------------------

            # checking if the user is a team lead-----
            profiles = SettingUserProfileInfo.objects.all()
            serializer = SettingUserProfileInfoSerializer(profiles, many=True)
            # print(serializer.data,"----")
            teamleads = []
            accountleads = []
            hrs = []
            subadmins = []
            groupleads = []
            superadmins = []
            candidates = []
            viewers = []
            projectlead = []
            freelancers = []
            for user in serializer.data:
                for d in user["profile_info"]:
                    if "profile_title" in d.keys() and "Role" in d.keys():
                        if d["Role"] == "Proj_Lead":
                            teamleads.append(d["profile_title"])
                        if d["Role"] == "Dept_Lead":
                            accountleads.append(d["profile_title"])
                        if d["Role"] == "Hr":
                            hrs.append(d["profile_title"])
                        if d["Role"] == "sub_admin":
                            subadmins.append(d["profile_title"])
                        if d["Role"] == "group_lead":
                            groupleads.append(d["profile_title"])
                        if d["Role"] == "super_admin":
                            superadmins.append(d["profile_title"])
                        if d["Role"] == "candidate":
                            candidates.append(d["profile_title"])
                        if d["Role"] == "Project_Lead":
                            projectlead.append(d["profile_title"])
                        if d["Role"] == "Viewer":
                            viewers.append(d["profile_title"])
                    elif "profile_title" in d.keys():
                        freelancers.append(d["profile_title"])

            if (
                payload.get("applicant_username")
                and payload.get("role") == "Teamlead"
                and not portfolio_name in teamleads
            ):
                return Response(
                    {
                        "message": f"You cannot get a report on ->{payload.get('applicant_username')}",
                        "error": f"The User ->{payload.get('applicant_username')}-({portfolio_name}) is not a team lead",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # initializing the data content as an empty list
            data["data"] = []
            # -----------------------------------------------------------------------------

            # initializing all the months with empty data-------------------------------------------------
            month_list = calendar.month_name
            # print(calendar.month_name[1:])
            item = {}
            for month in month_list[1:]:
                item[month] = {
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
            # -----------------------------------------------------------------------------

            # --calling multiple dowell connections using threads----------------------
            _tasks_added = []
            _task_details = []
            teams = []
            issues_raised = []
            comments_added = []

            def call_dowellconnection(*args):
                # print(*args)
                d = dowellconnection(*args)
                if "task_reports" in args:
                    _tasks_added.append(d)
                if "task_details" in args:
                    _task_details.append(d)
                if "team_management_report" in args:
                    teams.append(d)
                if "ThreadReport" in args:
                    issues_raised.append(d)
                if "ThreadCommentReport" in args:
                    comments_added.append(d)

            _tasks_added_thread = threading.Thread(
                target=call_dowellconnection,
                args=(
                    *task_management_reports,
                    "fetch",
                    {"task_added_by": username, "company_id": company_id},
                    update_field,
                ),
            )
            _tasks_added_thread.start()

            _task_details_thread = threading.Thread(
                target=call_dowellconnection,
                args=(*task_details_module, "fetch", {}, update_field),
            )
            _task_details_thread.start()

            teams_thread = threading.Thread(
                target=call_dowellconnection,
                args=(*team_management_modules, "fetch", {}, update_field),
            )
            teams_thread.start()

            issues_raised_thread = threading.Thread(
                target=call_dowellconnection,
                args=(*thread_report_module, "fetch", {}, update_field),
            )
            issues_raised_thread.start()

            comments_added_thread = threading.Thread(
                target=call_dowellconnection,
                args=(*comment_report_module, "fetch", {}, update_field),
            )
            comments_added_thread.start()

            _tasks_added_thread.join()
            _task_details_thread.join()
            teams_thread.join()
            issues_raised_thread.join()
            comments_added_thread.join()
            # -----------------------------------------------------------------------------

            # if all the threads are finished  continue------------------------

            if (
                not _tasks_added_thread.is_alive()
                and not _task_details_thread.is_alive()
                and not teams_thread.is_alive()
                and not issues_raised_thread.is_alive()
                and not comments_added_thread.is_alive()
            ):
                # teams-------------------------
                _teams_ids = []
                for team in json.loads(teams[0])["data"]:
                    if "members" in team.keys() and username in team["members"]:
                        try:
                            t_year, t_month_name, t_months_cnt = get_month_details(
                                team["date_created"]
                            )
                            if t_year == year:
                                item[t_month_name]["teams"] += t_months_cnt
                        except Exception as e:
                            pass
                        _teams_ids.append(team["_id"])
                # -------------------------------

                # comment and issues-------------------------
                _teams_tasks_issues_raised_ids = []
                if len(json.loads(issues_raised[0])["data"]) != 0:
                    for issue in json.loads(issues_raised[0])["data"]:
                        if "team_id" in issue.keys() and issue["team_id"] in _teams_ids:
                            try:
                                t_year, t_month_name, t_months_cnt = get_month_details(
                                    issue["created_date"]
                                )
                                if t_year == year:
                                    item[t_month_name][
                                        "team_tasks_issues_raised"
                                    ] += t_months_cnt
                            except Exception as e:
                                pass
                            _teams_tasks_issues_raised_ids.append(issue["_id"])

                        if (
                            "team_id" in issue.keys() and issue["team_id"] in _teams_ids
                        ) and (
                            "current_status" in issue.keys()
                            and issue["current_status"] == "Resolved"
                        ):
                            try:
                                t_year, t_month_name, t_months_cnt = get_month_details(
                                    issue["created_date"]
                                )
                                if t_year == year:
                                    item[t_month_name][
                                        "team_tasks_issues_resolved"
                                    ] += t_months_cnt
                            except Exception as e:
                                pass

                if len(json.loads(comments_added[0])["data"]) != 0:
                    for comment in json.loads(comments_added[0])["data"]:
                        if comment["thread_id"] in _teams_tasks_issues_raised_ids:
                            try:
                                t_year, t_month_name, t_months_cnt = get_month_details(
                                    comment["created_date"]
                                )
                                if t_year == year:
                                    item[t_month_name][
                                        "team_tasks_comments_added"
                                    ] += t_months_cnt
                            except Exception as e:
                                pass
                ## -------------------------------------------------------

                ## tasks-------------------------------------------------
                # intializing total hours, seconds and minutes----------
                projects = []
                i_t = {}
                total_tasks = []
                total_tasks_last_one_day = []
                total_tasks_last_one_week = []
                week_details = []
                subprojects = {}
                total_hours = {}
                total_mins = {}
                total_secs = {}

                today = datetime.today()
                start = today - timedelta(days=today.weekday())
                end = start + timedelta(days=6)
                today = datetime.strptime(
                    set_date_format(str(today)), "%m/%d/%Y %H:%M:%S"
                )
                start = datetime.strptime(
                    set_date_format(str(start)), "%m/%d/%Y %H:%M:%S"
                )
                end = datetime.strptime(set_date_format(str(end)), "%m/%d/%Y %H:%M:%S")
                # ---------------------------------------------------------

                start_now = datetime.now()
                for task in json.loads(_task_details[0])["data"]:
                    for t in json.loads(_tasks_added[0])["data"]:
                        if t["_id"] == task["task_id"]:
                            t_year, t_month_name, t_months_cnt = get_month_details(
                                t["task_created_date"]
                            )
                            if t_year == year:
                                item[t_month_name]["tasks_added"] += t_months_cnt

                            if (
                                "approved" in task.keys() and task["approved"] == True
                            ) or (
                                "approval" in task.keys() and task["approval"] == True
                            ):
                                t_year, t_month_name, t_months_cnt = get_month_details(
                                    task["task_created_date"]
                                )
                                if t_year == year:
                                    item[t_month_name]["tasks_approved"] += t_months_cnt

                            if "status" in task.keys():
                                if (
                                    task["status"] == "Completed"
                                    or task["status"] == "Complete"
                                    or task["status"] == "completed"
                                    or task["status"] == "complete"
                                    or task["status"] == "Mark as complete"
                                ):
                                    (
                                        t_year,
                                        t_month_name,
                                        t_months_cnt,
                                    ) = get_month_details(task["task_created_date"])
                                    if t_year == year:
                                        item[t_month_name][
                                            "tasks_completed"
                                        ] += t_months_cnt
                                        try:
                                            percentage_tasks_completed = (
                                                item[t_month_name]["tasks_completed"]
                                                / item[t_month_name]["tasks_added"]
                                            ) * 100
                                            item[t_month_name].update(
                                                {
                                                    "percentage_tasks_completed": percentage_tasks_completed
                                                }
                                            )
                                        except Exception:
                                            item[t_month_name].update(
                                                {"percentage_tasks_completed": 0}
                                            )
                                if (
                                    task["status"] == "Incomplete"
                                    or task["status"] == "incompleted"
                                    or task["status"] == "incomplete"
                                    or task["status"] == "Incompleted"
                                ):
                                    (
                                        t_year,
                                        t_month_name,
                                        t_months_cnt,
                                    ) = get_month_details(task["task_created_date"])
                                    if t_year == year:
                                        item[t_month_name][
                                            "tasks_uncompleted"
                                        ] += t_months_cnt

                            if (
                                "team_id" in task.keys()
                                and task["team_id"] in _teams_ids
                            ):
                                try:
                                    (
                                        t_year,
                                        t_month_name,
                                        t_months_cnt,
                                    ) = get_month_details(task["task_created_date"])
                                    if t_year == year:
                                        item[t_month_name]["team_tasks"] += t_months_cnt
                                except Exception as e:
                                    pass

                            if (
                                "team_id" in task.keys() and "completed" in task.keys()
                            ) and (
                                task["team_id"] in _teams_ids
                                and task["completed"] == "True"
                            ):
                                try:
                                    (
                                        t_year,
                                        t_month_name,
                                        t_months_cnt,
                                    ) = get_month_details(task["task_created_date"])
                                    if t_year == year:
                                        item[t_month_name][
                                            "team_tasks_completed"
                                        ] += t_months_cnt
                                        try:
                                            item[t_month_name].update(
                                                {
                                                    "percentage_team_tasks_completed": (
                                                        len(_teams_tasks_completed)
                                                        / len(_teams_tasks)
                                                    )
                                                    * 100
                                                }
                                            )
                                        except Exception:
                                            item[t_month_name].update(
                                                {"percentage_team_tasks_completed": 0}
                                            )
                                except Exception as e:
                                    pass

                            if (
                                "team_id" in task.keys() and "completed" in task.keys()
                            ) and (
                                task["team_id"] in _teams_ids
                                and task["completed"] == "False"
                            ):
                                try:
                                    (
                                        t_year,
                                        t_month_name,
                                        t_months_cnt,
                                    ) = get_month_details(task["task_created_date"])
                                    if t_year == year:
                                        item[t_month_name][
                                            "team_tasks_uncompleted"
                                        ] += t_months_cnt
                                except Exception as e:
                                    pass

                            if (
                                "team_id" in task.keys()
                                and task["team_id"] in _teams_ids
                            ):
                                if (
                                    "approved" in task.keys()
                                    and task["approved"] == True
                                ) or (
                                    "approval" in task.keys()
                                    and task["approval"] == True
                                ):
                                    try:
                                        (
                                            t_year,
                                            t_month_name,
                                            t_months_cnt,
                                        ) = get_month_details(task["task_created_date"])
                                        if t_year == year:
                                            item[t_month_name][
                                                "team_tasks_approved"
                                            ] += t_months_cnt
                                    except Exception as e:
                                        pass

                    if (
                        "task_approved_by" in task.keys()
                        and task["task_approved_by"] == username
                    ):
                        t_year, t_month_name, t_months_cnt = get_month_details(
                            task["task_created_date"]
                        )
                        if t_year == year:
                            item[t_month_name]["tasks_you_approved"] += t_months_cnt
                    if (
                        "task_approved_by" in task.keys()
                        and task["task_approved_by"] == username
                        and "status" in task.keys()
                    ):
                        if (
                            task["status"] == "Completed"
                            or task["status"] == "Complete"
                            or task["status"] == "completed"
                            or task["status"] == "complete"
                        ):
                            t_year, t_month_name, t_months_cnt = get_month_details(
                                task["task_created_date"]
                            )
                            if t_year == year:
                                item[t_month_name][
                                    "tasks_you_marked_as_complete"
                                ] += t_months_cnt

                    if (
                        "task_approved_by" in task.keys()
                        and task["task_approved_by"] == username
                        and "status" in task.keys()
                    ):
                        if (
                            task["status"] == "Incomplete"
                            or task["status"] == "incompleted"
                            or task["status"] == "incomplete"
                            or task["status"] == "Incompleted"
                        ):
                            t_year, t_month_name, t_months_cnt = get_month_details(
                                task["task_created_date"]
                            )
                            if t_year == year:
                                item[t_month_name][
                                    "tasks_you_marked_as_incomplete"
                                ] += t_months_cnt

                    try:
                        if not task["project"] in i_t.keys():
                            if task["project"] not in projects:
                                projects.append(task["project"])
                                subprojects[task["project"]] = []
                                total_hours[task["project"]] = 0
                                total_mins[task["project"]] = 0
                                total_secs[task["project"]] = 0
                    except KeyError:
                        task["project"] = "None"
                        if task["project"] not in projects:
                            projects.append(task["project"])
                            subprojects[task["project"]] = []
                            total_hours[task["project"]] = 0
                            total_mins[task["project"]] = 0
                            total_secs[task["project"]] = 0

                    try:
                        if "task_created_date" in task.keys():
                            task_created_date = datetime.strptime(
                                set_date_format(task["task_created_date"]),
                                "%m/%d/%Y %H:%M:%S",
                            )
                            if task_created_date >= start and task_created_date <= end:
                                week_details.append(task["project"])
                            if task_created_date >= today - timedelta(days=1):
                                total_tasks_last_one_day.append(task["project"])
                            if task_created_date >= today - timedelta(days=7):
                                total_tasks_last_one_week.append(task["project"])
                        try:
                            start_time = datetime.strptime(task["start_time"], "%H:%M")
                        except ValueError:
                            start_time = datetime.strptime(
                                task["start_time"], "%H:%M:%S"
                            )
                        try:
                            end_time = datetime.strptime(task["end_time"], "%H:%M")
                        except ValueError:
                            end_time = datetime.strptime(task["end_time"], "%H:%M:%S")
                        duration = end_time - start_time
                        dur_secs = (duration).total_seconds()
                        dur_mins = dur_secs / 60
                        dur_hrs = dur_mins / 60
                        total_hours[task["project"]] += dur_hrs
                        total_mins[task["project"]] += dur_mins
                        total_secs[task["project"]] += dur_secs
                        # print(dur_secs, dur_mins, dur_hrs)
                    except KeyError:
                        pass

                    if "subproject" in task.keys():
                        if (
                            not task["subproject"] == None
                            or not task["subproject"] == "None"
                        ):
                            if type(task["subproject"]) == list:
                                for sp in task["subproject"]:
                                    if "," in sp:
                                        for s in sp.split(","):
                                            subprojects[task["project"]].append(s)
                                    else:
                                        subprojects[task["project"]].append(sp)
                            elif task["subproject"] == None:
                                subprojects[task["project"]].append("None")
                            else:
                                subprojects[task["project"]].append(task["subproject"])
                ## --------------------------------------------------

                for p in set(sorted(projects)):
                    task_r = {
                        "project": p,
                        "subprojects": {
                            sp: subprojects[p].count(sp) for sp in subprojects[p]
                        },
                        "total_hours": total_hours[p],
                        "total_min": total_mins[p],
                        "total_secs": total_secs[p],
                        "total_tasks": projects.count(p),
                        "tasks_uploaded_this_week": week_details.count(p),
                        "total_tasks_last_one_day": total_tasks_last_one_day.count(p),
                        "total_tasks_last_one_week": total_tasks_last_one_week.count(p),
                        "tasks": total_tasks,
                    }
                    data["personal_info"]["task_report"].append(task_r)
                end_now = datetime.now()
                # print("time taken for task :",end_now-start_now)
            data["data"].append(item)
            return Response(data, status=status.HTTP_201_CREATED)
        else:
            return Response(
                {"message": "Parameters are not valid"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def itr_function(self, username, company_id):
        data = []
        field = {"applicant": username, "company_id": company_id}
        tasks = dowellconnection(
            *task_management_reports, "fetch", field, update_field=None
        )
        task_details = dowellconnection(
            *task_details_module, "fetch", {}, update_field=None
        )
        response = {}
        d = []
        for task in json.loads(tasks)["data"]:
            for t in json.loads(task_details)["data"]:
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
        today = datetime.today()
        start = today - timedelta(days=today.weekday())
        end = start + timedelta(days=6)
        today = datetime.strptime(set_date_format(str(today)), "%m/%d/%Y %H:%M:%S")
        start = datetime.strptime(set_date_format(str(start)), "%m/%d/%Y %H:%M:%S")
        end = datetime.strptime(set_date_format(str(end)), "%m/%d/%Y %H:%M:%S")

        for res in response["data"]:
            try:
                if "task_created_date" in res.keys():
                    task_created_date = datetime.strptime(
                        set_date_format(res["task_created_date"]), "%m/%d/%Y %H:%M:%S"
                    )
                    if task_created_date >= start and task_created_date <= end:
                        week_details.append(res["project"])
                    if task_created_date >= today - timedelta(days=1):
                        total_tasks_last_one_day.append(res["project"])
                    if task_created_date >= today - timedelta(days=7):
                        total_tasks_last_one_week.append(res["project"])
                try:
                    start_time = datetime.strptime(res["start_time"], "%H:%M")
                except ValueError:
                    start_time = datetime.strptime(res["start_time"], "%H:%M:%S")
                try:
                    end_time = datetime.strptime(res["end_time"], "%H:%M")
                except ValueError:
                    end_time = datetime.strptime(res["end_time"], "%H:%M:%S")
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
            response = self.itr_function(
                payload.get("username"), payload.get("company_id")
            )
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
                            start_time = datetime.strptime(start_time_str, time_format)
                            end_time = datetime.strptime(end_time_str, time_format)
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

                # get highest and lowest counts of tasks------------
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
                            start_time = datetime.strptime(start_time_str, time_format)
                            end_time = datetime.strptime(end_time_str, time_format)
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
                status=status.HTTP_400_BAD_REQUEST,
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


# import secrets
# from django.conf import settings
# class SecureEndPoint(APIView):
#     def post(self, request):
#         allowed_hosts = ["100098.pythonanywhere.com"]
#         referer = request.META.get('HTTP_REFERER')
#         if any(host in referer for host in allowed_hosts):
#             data = request.data
#             field = {}
#             update_field = {}
#             serializer = CommentsSerializer(data=request.data)

#             if serializer.is_valid():
#                 insert_response = dowellconnection(
#                         *comment_report_module, "insert", field, update_field
#                     )

#                 if json.loads(insert_response)["isSuccess"]:
#                         return Response(
#                             {
#                                 "message": "Successfully",
#                                 "info": json.loads(insert_response),
#                             },
#                             status=status.HTTP_201_CREATED,
#                         )
#                 else:
#                         return Response(
#                             {
#                                 "message": "Not successful",
#                                 "info": json.loads(insert_response),
#                             },
#                             status=status.HTTP_304_NOT_MODIFIED,
#                         )
#         else:
#             return Response(
#                         {"message": "not allowed", "error": serializer.errors},
#                         status=status.HTTP_400_BAD_REQUEST,
#                     )


class SecureEndPoint(APIView):
    @verify_user_token
    def post(self, request, user):
        name = request.data.get("name")
        email = request.data.get("email")

        return Response(
            {"success": True, "message": "sample output", "name": name, "email": email}
        )

    @verify_user_token
    def get(self, request, user):
        return Response(
            {
                "success": True,
                "message": "sample output",
                "name": "Manish",
                "email": "manish@gmail.com",
            }
        )


# ------------------ Project Time API -----------------------------  #


@method_decorator(csrf_exempt, name="dispatch")
class ProjectTotalTime(APIView):
    def get_current_datetime(self, date):
        _date = datetime.strptime(str(date), "%Y-%m-%d %H:%M:%S.%f").strftime(
            "%m/%d/%Y %H:%M:%S"
        )
        return str(_date)

    def post(self, request):
        data = request.data
        serializer = AddProjectTimeSerializer(data=data)
        if serializer.is_valid():
            response = json.loads(
                dowellconnection(
                    *time_detail_module,
                    "fetch",
                    {
                        "project": data.get("project"),
                        "company_id": data.get("company_id"),
                    },
                    update_field=None,
                )
            )
            if len(response["data"]) > 0:
                return Response(
                    {
                        "success": False,
                        "error": f"A Project time has been set for this project with company_id-{data.get('company_id')}",
                    },
                    status=status.HTTP_409_CONFLICT,
                )
            field = {
                "project": data.get("project"),
                "company_id": data.get("company_id"),
                "total_time": data.get("total_time"),
                "lead_name": data.get("lead_name"),
                "editing_enabled": data.get("editing_enabled"),
                "data_type": "Real_Data",
                "spent_time": 0,
                "left_time": data.get("total_time"),
                "date_created": self.get_current_datetime(datetime.now()),
            }
            response = json.loads(
                dowellconnection(
                    *time_detail_module, "insert", field, update_field=None
                )
            )
            return Response(
                {
                    "success": True,
                    "message": "Created",
                    "data": response,
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {
                    "success": False,
                    "message": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

    def get(self, request, document_id):
        field = {"_id": document_id, "data_type": "Real_Data"}
        response = json.loads(
            dowellconnection(*time_detail_module, "fetch", field, update_field=None)
        )
        return Response(
            {
                "message": True,
                "data": response["data"],
            },
            status=status.HTTP_200_OK,
        )

    def patch(self, request):
        data = request.data
        serializer = UpdateProjectTimeSerializer(data=data)
        if serializer.is_valid():
            field = {
                "_id": data.get("document_id"),
            }

            get_response = json.loads(
                dowellconnection(*time_detail_module, "fetch", field, update_field=None)
            )
            if len(get_response["data"]) > 0:
                spent_time = get_response["data"][0]["spent_time"]

                update_field = {
                    "total_time": data.get("total_time"),
                    "left_time": data.get("total_time") - spent_time,
                }
                response = json.loads(
                    dowellconnection(*time_detail_module, "update", field, update_field)
                )
                if response["isSuccess"] == True:
                    return Response(
                        {
                            "success": True,
                            "message": f"total_time has been updated successfully",
                        },
                        status=status.HTTP_200_OK,
                    )
                else:
                    return Response(
                        {
                            "success": False,
                            "message": "Failed to update total_time",
                            "data": response,
                        },
                        status=status.HTTP_304_NOT_MODIFIED,
                    )
            return Response(
                {
                    "success": False,
                    "message": "No Project time with this id exists",
                },
                status=status.HTTP_204_NO_CONTENT,
            )
        else:
            return Response(
                {
                    "success": False,
                    "message": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

    def delete(self, request, document_id):
        data = request.data
        field = {
            "_id": document_id,
        }

        get_response = json.loads(
            dowellconnection(*time_detail_module, "fetch", field, update_field=None)
        )
        if len(get_response["data"]) > 0:
            update_field = {"data_type": "Archived_Data"}
            response = json.loads(
                dowellconnection(*time_detail_module, "update", field, update_field)
            )
            if response["isSuccess"] == True:
                return Response(
                    {
                        "success": True,
                        "message": f"Project time has been deleted successfully",
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {
                        "success": False,
                        "message": "Failed to delete Project time",
                        "data": response,
                    },
                    status=status.HTTP_304_NOT_MODIFIED,
                )
        return Response(
            {
                "success": False,
                "message": "No Project time with this id exists",
            },
            status=status.HTTP_204_NO_CONTENT,
        )

class AllProjectTotalTime(APIView):
    def get(self, request, company_id):
        field = {"company_id": company_id, "data_type": "Real_Data"}
        response = json.loads(
            dowellconnection(*time_detail_module, "fetch", field, update_field=None)
        )
        return Response(
            {
                "success": True,
                "data": response["data"],
            },
            status=status.HTTP_200_OK,
        )

class EnabledProjectTotalTime(APIView):
    def patch(self, request):
        data = request.data
        serializer = UpdateProjectTimeEnabledSerializer(data=data)
        if serializer.is_valid():
            field = {
                "_id": data.get("document_id"),
            }

            get_response = json.loads(
                dowellconnection(*time_detail_module, "fetch", field, update_field=None)
            )
            if len(get_response["data"]) > 0:
                update_field = {
                    "editing_enabled": data.get("editing_enabled"),
                }
                response = json.loads(
                    dowellconnection(*time_detail_module, "update", field, update_field)
                )
                if response["isSuccess"] == True:
                    return Response(
                        {
                            "success": True,
                            "message": f"editing_enabled has been updated successfully",
                        },
                        status=status.HTTP_200_OK,
                    )
                else:
                    return Response(
                        {
                            "success": False,
                            "message": "Failed to update editing_enabled",
                            "data": response,
                        },
                        status=status.HTTP_304_NOT_MODIFIED,
                    )
            return Response(
                {
                    "success": False,
                    "message": "No Project time with this id exists",
                },
                status=status.HTTP_204_NO_CONTENT,
            )
        else:
            return Response(
                {
                    "success": False,
                    "message": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

class UpdateProjectSpentTime(APIView):
    def patch(self, request):
        data = request.data
        serializer = UpdateProjectSpentTimeSerializer(data=data)
        if serializer.is_valid():
            field = {
                "project": data.get("project"),
                "company_id": data.get("company_id"),
                "data_type": "Real_Data",
            }

            get_response = json.loads(
                dowellconnection(*time_detail_module, "fetch", field, update_field=None)
            )
            if get_response["isSuccess"] is True:
                if len(get_response["data"]) > 0:
                    total_time = get_response["data"][0]["total_time"]
                    # print(total_time,"==========",get_response["data"])
                    spent_time = get_response["data"][0]["spent_time"] + data.get(
                        "spent_time"
                    )

                    update_field = {
                        "spent_time": spent_time,
                        "left_time": total_time - spent_time,
                    }
                    response = json.loads(
                        dowellconnection(
                            *time_detail_module,
                            "update",
                            {"_id": get_response["data"][0]["_id"]},
                            update_field,
                        )
                    )
                    if response["isSuccess"] == True:
                        return Response(
                            {
                                "success": True,
                                "message": f"spent_time has been updated successfully for id-{get_response['data'][0]['_id']}",
                            },
                            status=status.HTTP_200_OK,
                        )
                    else:
                        return Response(
                            {
                                "success": False,
                                "message": "Failed to update spent_time",
                                "data": response,
                            },
                            status=status.HTTP_304_NOT_MODIFIED,
                        )
                return Response(
                    {
                        "success": False,
                        "message": "No Project time with these details exists"
                    },
                    status=status.HTTP_204_NO_CONTENT,
                )
            return Response(
                {
                    "success": False,
                    "message": "No Project time with these details exists"
                },
                status=status.HTTP_204_NO_CONTENT,
            )

        else:
            return Response(
                {
                    "success": False,
                    "message": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

@method_decorator(csrf_exempt, name="dispatch")
class ProjectDetails(APIView):
    def post(self,request):
        type_request = request.GET.get("type")

        if type_request == "update_day_project":
            return self.update_day_project(request)
        elif type_request == "update_month_project":
            return self.update_month_project(request)
        elif type_request == "update_year_project":
            return self.update_year_project(request)
        else:
            return self.handle_error(request,"'update_day_project'|'update_month_project'|'update_year_project'")
        
    def get(self, request):
        type_request = request.GET.get("type")
        if type_request == "day":
            return self.get_day_project(request)
        elif type_request == "custom":
            return self.get_custom_project(request)
        else:
            return self.handle_error(request,"'day'|'custom'")
    
    def get_day_project(self, request):
        if not request.GET.get("date"):
            return Response({"success": False,"message": "Please provide date"},status=status.HTTP_400_BAD_REQUEST)
        if not request.GET.get("company_id"):
            return Response({"success": False,"message": "Please provide company_id"},status=status.HTTP_400_BAD_REQUEST)
        _date=request.GET.get("date")#e.g 2023-12-24
        api_key = API_KEY
        db_name= PROJECT_DB_NAME
        coll_name =_date
        query={'company_id':request.GET.get('company_id')} #{"company_id":'6385c0f18eca0fb652c94561'}
        get_collection = json.loads(datacube_data_retrival(api_key,db_name,coll_name,query,10,0))
        if get_collection['success']==True:
            res= get_collection['data']
            if len(get_collection['data'])>0:
                res= get_collection['data'][-1]
            return Response(
                {
                    "success": get_collection['success'],
                    'message': f'Successfully fetched project details for {_date}',
                    "data": res,
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response({"success": False, "message": f"Failed to fetch project details,{get_collection['message']}"}, status=status.HTTP_400_BAD_REQUEST)

    def get_custom_project(self, request):
        if not request.GET.get("start_date"):
            return Response({"success": False, "message": "Please provide start date"}, status=status.HTTP_400_BAD_REQUEST)
        if not request.GET.get("end_date"):
            return Response({"success": False, "message": "Please provide end date"}, status=status.HTTP_400_BAD_REQUEST)
        if not request.GET.get("company_id"):
            return Response({"success": False, "message": "Please provide company id"}, status=status.HTTP_400_BAD_REQUEST)
        
        st_date = datetime.strptime(request.GET.get("start_date"), "%Y-%m-%d")
        ed_date = datetime.strptime(request.GET.get("end_date"), "%Y-%m-%d")
        delta = timedelta(days=1)

        if st_date > ed_date:
            return Response({"success": False, "message": "Start date should be less than end date"}, status=status.HTTP_400_BAD_REQUEST)
        if st_date.date() > datetime.now().date():
            return Response({"success": False, "message": "Start date should be less than or equal to today's date"}, status=status.HTTP_400_BAD_REQUEST)
        if ed_date.date() > datetime.now().date():
            return Response({"success": False, "message": "End date should be less than or equal to today's date"}, status=status.HTTP_400_BAD_REQUEST)
        
        res={'company_id':request.GET.get('company_id'),
             'data':[]}
        _d={'data':{}}
        
        custom_dates =[]
        while st_date <= ed_date:
            custom_dates.append(f"{st_date.year}-{st_date.month}-{st_date.day}")
            st_date += delta

        def call_datacube(field):
            _date=field['task_created_date']
            api_key = API_KEY
            db_name= PROJECT_DB_NAME
            coll_name =_date
            query={'company_id':request.GET.get('company_id')}
            get_collection = json.loads(datacube_data_retrival(api_key,db_name,coll_name,query,10,0))
            
            # Process the response_str here or store it in a suitable data structure
            for item in get_collection['data']:
                for i in item['data']:
                    if i['project'] not in _d['data'].keys():
                        _d['data'][i['project']]={}
                    if 'total time (hrs)' not in _d['data'][i['project']].keys():
                        _d['data'][i['project']]["total time (hrs)"]=0
                    _d['data'][i['project']]["total time (hrs)"]+=i["total time (hrs)"]
                    
                    if 'total tasks' not in _d['data'][i['project']].keys():
                        _d['data'][i['project']]["total tasks"]=0
                    _d['data'][i['project']]["total tasks"]+=i['total tasks']
                    
                    if "subprojects" not in _d['data'][i['project']].keys():
                        _d['data'][i['project']]['subprojects'] = {}
                    for x in i['subprojects']:
                        if x["subproject"] not in _d['data'][i['project']]['subprojects'].keys():
                            _d['data'][i['project']]['subprojects'][x["subproject"]]={}
                        if "time added (hrs)" not in _d['data'][i['project']]['subprojects'][x["subproject"]].keys():
                            _d['data'][i['project']]['subprojects'][x["subproject"]]["time added (hrs)"]=0
                        _d['data'][i['project']]['subprojects'][x["subproject"]]["time added (hrs)"]+=x["time added (hrs)"]
                        
                        if "total_tasks" not in _d['data'][i['project']]['subprojects'][x["subproject"]].keys():
                            _d['data'][i['project']]['subprojects'][x["subproject"]]["total_tasks"]=0
                        _d['data'][i['project']]['subprojects'][x["subproject"]]["total_tasks"]+=x["total_tasks"]
                        
                        if "candidates" not in _d['data'][i['project']]['subprojects'][x["subproject"]].keys():
                            _d['data'][i['project']]['subprojects'][x["subproject"]]["candidates"]={}
                        for y in x["candidates"]:
                            if y["candidate"] not in _d['data'][i['project']]['subprojects'][x["subproject"]]["candidates"].keys():
                                _d['data'][i['project']]['subprojects'][x["subproject"]]["candidates"][y["candidate"]]={}
                            if "time added (hrs)" not in _d['data'][i['project']]['subprojects'][x["subproject"]]["candidates"][y["candidate"]].keys():
                                _d['data'][i['project']]['subprojects'][x["subproject"]]["candidates"][y["candidate"]]["time added (hrs)"]=0
                            
                            _d['data'][i['project']]['subprojects'][x["subproject"]]["candidates"][y["candidate"]]["time added (hrs)"]+=y["time added (hrs)"]
                            if "total_tasks" not in _d['data'][i['project']]['subprojects'][x["subproject"]]["candidates"][y["candidate"]].keys():
                                _d['data'][i['project']]['subprojects'][x["subproject"]]["candidates"][y["candidate"]]["total_tasks"]=0
                            
                            _d['data'][i['project']]['subprojects'][x["subproject"]]["candidates"][y["candidate"]]["total_tasks"]+=y["total_tasks"]
  
        # Define a function to fetch data using threads
        def fetch_data_for_date(task_created_date, company_id):
            field = {'company_id': company_id, 'task_created_date': task_created_date}
            try:
                call_datacube(field)
            except json.decoder.JSONDecodeError as error:
                call_datacube(field)
                
        # Create threads for each date
        threads = []
        for task_created_date in custom_dates:
            thread = threading.Thread(target=fetch_data_for_date, args=(task_created_date, request.GET.get('company_id')))
            threads.append(thread)
            thread.start()
        # Wait for all threads to complete
        for thread in threads:
            thread.join()
            
        if (not i.is_alive() for i in threads):
            for k,v in _d['data'].items():
                item={'project':k,
                      'total time (hrs)':v['total time (hrs)'],
                      'total tasks':v['total tasks'],
                      'subprojects':[]
                      }
                for k1,v1 in v['subprojects'].items():
                    subitem={'total tasks':k1,
                             'time added (hrs)':v1['time added (hrs)'],
                             'total_tasks':v1['total_tasks'],
                             'candidates':[]
                             }
                    for k2,v2 in v1['candidates'].items():
                        subsubitem={'candidate':k2,
                                    'time added (hrs)':v2['time added (hrs)'],
                                    'total_tasks':v2['total_tasks']
                                    }
                        subitem['candidates'].append(subsubitem)
                    item['subprojects'].append(subitem)
                res["data"].append(item)
            return Response(
                {
                    "success": True,
                    "message": "Total number of worklogs for the month",
                    "data": res,
                }
            )
        else:
            return Response({"success": False, "message": "Failed to fetch logs"})
        
    def update_day_project(self,request): 
        print("------------checking paramaters------------")
        if not request.GET.get('date'):
            print("------------date is required------------")
            return Response({"success": False, "message": "Date is required"}, status=status.HTTP_400_BAD_REQUEST)
        if not request.GET.get('company_id'):
            print("------------company id is required------------")
            return Response({"success": False, "message": "Company id is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        res=[]
        item={}
        
        _date=request.GET.get('date')# e.g 2023-12-24
        _date = datetime.strptime(_date, "%Y-%m-%d").date()
        if _date >= datetime.today().date():
            return Response({"success": False, "message": f"Date {request.GET.get('date')} should be less than today"}, status=status.HTTP_400_BAD_REQUEST)
        task_created_date=f"{_date.year}-{_date.month}-{_date.day}"
        field={"company_id":request.GET.get("company_id"), "task_created_date":task_created_date}
        tasks=json.loads(dowellconnection(*task_details_module, "fetch", field, update_field=None))
        if (tasks['isSuccess'] == True):
            print("tasks exists, processing projects details-------------------",len(tasks['data']))
            for i,task in enumerate(tasks['data']):
                print(f"----------processing details for task {i+1}/{len(tasks['data'])}----------")
                if 'task_id' in task.keys():
                    c=json.loads(dowellconnection(*task_management_reports, "fetch", {"task_created_date":task_created_date, "_id":task["task_id"]}, update_field=None))['data']
                    if len(c) > 0:
                        candidate=c[0]['task_added_by']
                    else:
                        candidate='None'
                if ('project' in task.keys() and 'subproject' in task.keys() ):
                    """print(t,"======")"""
                    try:
                        start_time = datetime.strptime(task['start_time'], "%H:%M")
                        end_time = datetime.strptime(task['end_time'], "%H:%M")
                    except Exception:
                        start_time = datetime.strptime(task['start_time'], "%H:%M:%S")
                        end_time = datetime.strptime(task['end_time'], "%H:%M:%S")
                    time_difference = (end_time - start_time).total_seconds()
                    work_hours = time_difference / 3600
                    if task['project'] not in item.keys():
                        item[task['project']] = {"total time (hrs)":0, "total tasks":0, "subprojects":{}}
                    if "total time (hrs)" not in item[task['project']].keys():
                        item[task['project']]["total time (hrs)"] = work_hours
                    else:
                        item[task['project']]["total time (hrs)"] += work_hours
                    if "total tasks" not in item[task['project']].keys():
                        item[task['project']]["total tasks"] = 1
                    else:
                        item[task['project']]["total tasks"] += 1
                    if "subprojects" not in item[task['project']].keys():
                        item[task['project']]["subprojects"] = {}
                    
                    if task['subproject'] not in item[task['project']]['subprojects'].keys():
                        item[task['project']]['subprojects'][task['subproject']] = {}
                    
                    if "time added (hrs)" not in item[task['project']]['subprojects'][task['subproject']].keys():
                        item[task['project']]['subprojects'][task['subproject']]['time added (hrs)'] = work_hours
                    else:
                        item[task['project']]['subprojects'][task['subproject']]['time added (hrs)'] += work_hours
                    
                    if "total_tasks" not in item[task['project']]['subprojects'][task['subproject']].keys():
                        item[task['project']]['subprojects'][task['subproject']]['total_tasks'] = 1
                    else:
                        item[task['project']]['subprojects'][task['subproject']]['total_tasks'] += 1
                    if "candidates" not in item[task['project']]['subprojects'][task['subproject']].keys():
                        item[task['project']]['subprojects'][task['subproject']]['candidates'] = {}
                    if candidate not in item[task['project']]['subprojects'][task['subproject']]['candidates'].keys():
                        item[task['project']]['subprojects'][task['subproject']]['candidates'][candidate]={'time added (hrs)':0,'total_tasks':0}
                    
                    if "time added (hrs)" not in item[task['project']]['subprojects'][task['subproject']]['candidates'][candidate].keys():
                        item[task['project']]['subprojects'][task['subproject']]['candidates'][candidate]['time added (hrs)'] = work_hours
                    else:
                        item[task['project']]['subprojects'][task['subproject']]['candidates'][candidate]['time added (hrs)'] += work_hours
                    
                    if "total_tasks" not in item[task['project']]['subprojects'][task['subproject']]['candidates'][candidate].keys():
                        item[task['project']]['subprojects'][task['subproject']]['candidates'][candidate]['total_tasks'] = 1
                    else:
                        item[task['project']]['subprojects'][task['subproject']]['candidates'][candidate]['total_tasks'] += 1
                    
            for k,v in item.items(): 
                _d = {
                    "project":k,
                    "total time (hrs)":v["total time (hrs)"] if 'total time (hrs)' in v.keys() else 0,
                    "total tasks":v["total tasks"] if 'total tasks' in v.keys() else 0,
                    "subprojects":[]
                }
                for k1,v1 in v["subprojects"].items():
                    _d1 = {
                        "subproject":k1,
                        "time added (hrs)":v1["time added (hrs)"] if 'time added (hrs)' in v1.keys() else 0,
                        "total_tasks":v1["total_tasks"] if 'total_tasks' in v1.keys() else 0,
                        "candidates":[]
                    }
                    if 'candidates' in v1.keys():
                        for k2, v2 in v1['candidates'].items():
                            _d2 ={
                                "candidate":k2,
                                "time added (hrs)":v2["time added (hrs)"] if "time added (hrs)" in v2.keys() else 0,
                                "total_tasks": v2['total_tasks'] if 'total_tasks' in v2.keys() else 0
                            }
                            _d1['candidates'].append(_d2)
                    _d["subprojects"].append(_d1)
                res.append(_d)
            
            api_key = API_KEY
            db_name= PROJECT_DB_NAME
            coll_name=task_created_date
            data={"date":task_created_date, 'company_id':request.GET.get("company_id"), "data":res}
            response = json.loads(datacube_add_collection(api_key,db_name,coll_name,1))
            if response['success']==True:
                print(f'successfully created the collection-{coll_name}-------------')
                #inserting data into the collection------------------------------
                
                response = json.loads(datacube_data_insertion(api_key,db_name,coll_name,data))
                if response['success']==True:
                    print(f'successfully inserted the data the collection-{coll_name}---------------')
                    return Response(
                        {
                            "success": True,
                            'message': f'successfully inserted the data the collection-{coll_name}',
                            "data": data,
                        },status=status.HTTP_200_OK)
            print(f"error in inserting the data -> {response['message']}--------------------")
            return Response({"success": False, "message": response['message']}, status=status.HTTP_400_BAD_REQUEST)
    
    def update_month_project(self,request):
        if not request.GET.get('company_id'):
            return Response({"success": False, "message": "please provide the company_id"}, status=status.HTTP_400_BAD_REQUEST)
        if not request.GET.get('month'):
            return Response({"success": False, "message": "please provide the month"}, status=status.HTTP_400_BAD_REQUEST)
        if not request.GET.get('year'):
            return Response({"success": False, "message": "please provide the year"}, status=status.HTTP_400_BAD_REQUEST)
        month = request.GET.get('month')
        year = request.GET.get('year')
        
        _, number_of_days = calendar.monthrange(int(year), int(month))
        _month_dates = [f"{year}-{month}-{d}" for d in range(1, number_of_days + 1)]
        #print(_month_dates)
        res=[]
        item={}
        for day in _month_dates:
            task_created_date=day# e.g 2023-12-24
            field={"company_id":request.GET.get("company_id"), "task_created_date":task_created_date}
            tasks=json.loads(dowellconnection(*task_details_module, "fetch", field, update_field=None))
            if (tasks['isSuccess'] == True):
                for task in tasks['data']:
                    if 'task_id' in task.keys():
                        c=json.loads(dowellconnection(*task_management_reports, "fetch", {"task_created_date":task_created_date, "_id":task["task_id"]}, update_field=None))['data']
                        if len(c) > 0:
                            candidate=c[0]['task_added_by']
                        else:
                            candidate='None'
                    if ('project' in task.keys() and 'subproject' in task.keys() ):
                        """print(t,"======")"""
                        try:
                            start_time = datetime.strptime(task['start_time'], "%H:%M")
                            end_time = datetime.strptime(task['end_time'], "%H:%M")
                        except Exception:
                            start_time = datetime.strptime(task['start_time'], "%H:%M:%S")
                            end_time = datetime.strptime(task['end_time'], "%H:%M:%S")
                        time_difference = (end_time - start_time).total_seconds()
                        work_hours = time_difference / 3600
                        if task['project'] not in item.keys():
                            item[task['project']] = {"total time (hrs)":0, "total tasks":0, "subprojects":{}}
                        if "total time (hrs)" not in item[task['project']].keys():
                            item[task['project']]["total time (hrs)"] = work_hours
                        else:
                            item[task['project']]["total time (hrs)"] += work_hours
                        if "total tasks" not in item[task['project']].keys():
                            item[task['project']]["total tasks"] = 1
                        else:
                            item[task['project']]["total tasks"] += 1
                        if "subprojects" not in item[task['project']].keys():
                            item[task['project']]["subprojects"] = {}
                        
                        if task['subproject'] not in item[task['project']]['subprojects'].keys():
                            item[task['project']]['subprojects'][task['subproject']] = {}
                        
                        if "time added (hrs)" not in item[task['project']]['subprojects'][task['subproject']].keys():
                            item[task['project']]['subprojects'][task['subproject']]['time added (hrs)'] = work_hours
                        else:
                            item[task['project']]['subprojects'][task['subproject']]['time added (hrs)'] += work_hours
                        
                        if "total_tasks" not in item[task['project']]['subprojects'][task['subproject']].keys():
                            item[task['project']]['subprojects'][task['subproject']]['total_tasks'] = 1
                        else:
                            item[task['project']]['subprojects'][task['subproject']]['total_tasks'] += 1
                        if "candidates" not in item[task['project']]['subprojects'][task['subproject']].keys():
                            item[task['project']]['subprojects'][task['subproject']]['candidates'] = {}
                        if candidate not in item[task['project']]['subprojects'][task['subproject']]['candidates'].keys():
                            item[task['project']]['subprojects'][task['subproject']]['candidates'][candidate]={'time added (hrs)':0,'total_tasks':0}
                        
                        if "time added (hrs)" not in item[task['project']]['subprojects'][task['subproject']]['candidates'][candidate].keys():
                            item[task['project']]['subprojects'][task['subproject']]['candidates'][candidate]['time added (hrs)'] = work_hours
                        else:
                            item[task['project']]['subprojects'][task['subproject']]['candidates'][candidate]['time added (hrs)'] += work_hours
                        
                        if "total_tasks" not in item[task['project']]['subprojects'][task['subproject']]['candidates'][candidate].keys():
                            item[task['project']]['subprojects'][task['subproject']]['candidates'][candidate]['total_tasks'] = 1
                        else:
                            item[task['project']]['subprojects'][task['subproject']]['candidates'][candidate]['total_tasks'] += 1
                    
                for k,v in item.items(): 
                    _d = {
                        "project":k,
                        "total time (hrs)":v["total time (hrs)"] if 'total time (hrs)' in v.keys() else 0,
                        "total tasks":v["total tasks"] if 'total tasks' in v.keys() else 0,
                        "subprojects":[]
                    }
                    for k1,v1 in v["subprojects"].items():
                        _d1 = {
                            "subproject":k1,
                            "time added (hrs)":v1["time added (hrs)"] if 'time added (hrs)' in v1.keys() else 0,
                            "total_tasks":v1["total_tasks"] if 'total_tasks' in v1.keys() else 0,
                            "candidates":[]
                        }
                        if 'candidates' in v1.keys():
                            for k2, v2 in v1['candidates'].items():
                                _d2 ={
                                    "candidate":k2,
                                    "time added (hrs)":v2["time added (hrs)"] if "time added (hrs)" in v2.keys() else 0,
                                    "total_tasks": v2['total_tasks'] if 'total_tasks' in v2.keys() else 0
                                }
                                _d1['candidates'].append(_d2)
                        _d["subprojects"].append(_d1)
                    res.append(_d)
                
                api_key = API_KEY
                db_name= PROJECT_DB_NAME
                coll_name=task_created_date
                data={"date":task_created_date, 'company_id':request.GET.get("company_id"), "data":res}
                response = json.loads(datacube_add_collection(api_key,db_name,coll_name,1))
                if response['success']==True:
                    response = json.loads(datacube_data_insertion(api_key,db_name,coll_name,data))
            
        return Response(
            {
                "success": True,
                'message': f'successfully inserted the data '
            },status=status.HTTP_200_OK)
        
    def update_year_project(self, request):
        if not request.GET.get('year'):
            return Response({"success": False, "message": "please provide the year"}, status=status.HTTP_400_BAD_REQUEST)
        if not request.GET.get('company_id'):
             return Response({"success": False, "message": "please provide the company_id"}, status=status.HTTP_400_BAD_REQUEST)
        
        year = request.GET.get('year')
        _year_dates=[]
        for month in range(1, 13):
            _, number_of_days = calendar.monthrange(int(year), month)
            month_dates = [f"{year}-{month}-{d}" for d in range(1, number_of_days + 1)]
            _year_dates+=month_dates
        #print(_year_dates)
        res=[]
        item={}
        for day in _year_dates:
            task_created_date=day# e.g 2023-12-24
            field={"company_id":request.GET.get("company_id"), "task_created_date":task_created_date}
            tasks=json.loads(dowellconnection(*task_details_module, "fetch", field, update_field=None))
            if (tasks['isSuccess'] == True):
                for task in tasks['data']:
                    if 'task_id' in task.keys():
                        c=json.loads(dowellconnection(*task_management_reports, "fetch", {"task_created_date":task_created_date, "_id":task["task_id"]}, update_field=None))['data']
                        if len(c) > 0:
                            candidate=c[0]['task_added_by']
                        else:
                            candidate='None'
                    if ('project' in task.keys() and 'subproject' in task.keys() ):
                        """print(t,"======")"""
                        try:
                            start_time = datetime.strptime(task['start_time'], "%H:%M")
                            end_time = datetime.strptime(task['end_time'], "%H:%M")
                        except Exception:
                            start_time = datetime.strptime(task['start_time'], "%H:%M:%S")
                            end_time = datetime.strptime(task['end_time'], "%H:%M:%S")
                        time_difference = (end_time - start_time).total_seconds()
                        work_hours = time_difference / 3600
                        if task['project'] not in item.keys():
                            item[task['project']] = {"total time (hrs)":0, "total tasks":0, "subprojects":{}}
                        if "total time (hrs)" not in item[task['project']].keys():
                            item[task['project']]["total time (hrs)"] = work_hours
                        else:
                            item[task['project']]["total time (hrs)"] += work_hours
                        if "total tasks" not in item[task['project']].keys():
                            item[task['project']]["total tasks"] = 1
                        else:
                            item[task['project']]["total tasks"] += 1
                        if "subprojects" not in item[task['project']].keys():
                            item[task['project']]["subprojects"] = {}
                        
                        if task['subproject'] not in item[task['project']]['subprojects'].keys():
                            item[task['project']]['subprojects'][task['subproject']] = {}
                        
                        if "time added (hrs)" not in item[task['project']]['subprojects'][task['subproject']].keys():
                            item[task['project']]['subprojects'][task['subproject']]['time added (hrs)'] = work_hours
                        else:
                            item[task['project']]['subprojects'][task['subproject']]['time added (hrs)'] += work_hours
                        
                        if "total_tasks" not in item[task['project']]['subprojects'][task['subproject']].keys():
                            item[task['project']]['subprojects'][task['subproject']]['total_tasks'] = 1
                        else:
                            item[task['project']]['subprojects'][task['subproject']]['total_tasks'] += 1
                        if "candidates" not in item[task['project']]['subprojects'][task['subproject']].keys():
                            item[task['project']]['subprojects'][task['subproject']]['candidates'] = {}
                        if candidate not in item[task['project']]['subprojects'][task['subproject']]['candidates'].keys():
                            item[task['project']]['subprojects'][task['subproject']]['candidates'][candidate]={'time added (hrs)':0,'total_tasks':0}
                        
                        if "time added (hrs)" not in item[task['project']]['subprojects'][task['subproject']]['candidates'][candidate].keys():
                            item[task['project']]['subprojects'][task['subproject']]['candidates'][candidate]['time added (hrs)'] = work_hours
                        else:
                            item[task['project']]['subprojects'][task['subproject']]['candidates'][candidate]['time added (hrs)'] += work_hours
                        
                        if "total_tasks" not in item[task['project']]['subprojects'][task['subproject']]['candidates'][candidate].keys():
                            item[task['project']]['subprojects'][task['subproject']]['candidates'][candidate]['total_tasks'] = 1
                        else:
                            item[task['project']]['subprojects'][task['subproject']]['candidates'][candidate]['total_tasks'] += 1
                    
                for k,v in item.items(): 
                    _d = {
                        "project":k,
                        "total time (hrs)":v["total time (hrs)"] if 'total time (hrs)' in v.keys() else 0,
                        "total tasks":v["total tasks"] if 'total tasks' in v.keys() else 0,
                        "subprojects":[]
                    }
                    for k1,v1 in v["subprojects"].items():
                        _d1 = {
                            "subproject":k1,
                            "time added (hrs)":v1["time added (hrs)"] if 'time added (hrs)' in v1.keys() else 0,
                            "total_tasks":v1["total_tasks"] if 'total_tasks' in v1.keys() else 0,
                            "candidates":[]
                        }
                        print(v1, "==========================")
                        if 'candidates' in v1.keys():
                            for k2, v2 in v1['candidates'].items():
                                _d2 ={
                                    "candidate":k2,
                                    "time added (hrs)":v2["time added (hrs)"] if "time added (hrs)" in v2.keys() else 0,
                                    "total_tasks": v2['total_tasks'] if 'total_tasks' in v2.keys() else 0
                                }
                                _d1['candidates'].append(_d2)
                        _d["subprojects"].append(_d1)
                    res.append(_d)
                
                api_key = API_KEY
                db_name= PROJECT_DB_NAME
                coll_name=task_created_date
                data={"date":task_created_date, 'company_id':request.GET.get("company_id"), "data":res}
                response = json.loads(datacube_add_collection(api_key,db_name,coll_name,1))
                if response['success']==True:
                    response = json.loads(datacube_data_insertion(api_key,db_name,coll_name,data))
            
        
        return Response(
            {
                "success": True,
                'message': f'successfully inserted the data ',
                
            },status=status.HTTP_200_OK)

    def handle_error(self, request,exc):
        return Response(
            {
                "success": False,
                "message": f"Specify the type -> {exc}",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

@method_decorator(csrf_exempt, name="dispatch")
class Testing_Threads(APIView):
    def get(self, request, company_id):
        # remove space
        status = request.GET.get("status")
        if status:
            field = {"current_status": status, "company_id": company_id}
        else:
            field = {"company_id": company_id}
        update_field = {}

        try:
            response = dowellconnection(
                *thread_report_module, "fetch", field, update_field
            )
            # print(response)
            threads_response = json.loads(response)

            if threads_response["isSuccess"]:
                threads_data = threads_response["data"]

                return Response(
                    {
                        "isSuccess": True,
                        "message": "List of Threads",
                        "data": threads_data,
                    }
                )
            else:
                return Response(
                    {
                        "message": "Failed to fetch",
                        "data": threads_data,
                    }
                )
        except Exception as e:
            return Response(
                {
                    "isSuccess": False,
                    "message": f"An error occurred: {str(e)}",
                    "data": [],
                }
            )

@method_decorator(csrf_exempt, name="dispatch")
class Product_Services_API(APIView):
    def get(self, request):
        field = {}
        response = json.loads(
            dowellconnection(*Product_Services, "fetch", field, update_field=None)
        )
        return Response(
            {
                "success": True,
                "data": response,
            },
            status=status.HTTP_200_OK,
        )

@method_decorator(csrf_exempt, name="dispatch")
class dashboard_services(APIView):
    def post(self, request):
        # print()
        type_request = request.GET.get("type")

        if type_request == "update_status":
            return self.update_status(request)
        elif type_request == "update_job_category":
            return self.update_job_category(request)
        elif type_request == "delete_application":
            return self.delete_application(request)
        else:
            return self.handle_error(request)

    def get(self, request):
        type_request = request.GET.get("type")

        if type_request == "total_worklogs_count":
            return self.total_worklogs_count(request)
        elif type_request == "logs_for_today":
            return self.logs_for_today(request)
        elif type_request == "logs_for_month":
            return self.logs_for_month(request)
        else:
            return self.handle_error(request)

    """Update the status of a candidate"""

    def update_status(self, request):
        candidate_id = request.GET.get("candidate_id")
        status = request.data.get("status")

        field = {"candidate_id": candidate_id, "status": status}

        serializer = DashBoardStatusSerializer(data=field)
        if serializer.is_valid():
            field = {"_id": candidate_id}
            update_field = {"status": status}
            response = json.loads(
                dowellconnection(
                    *candidate_management_reports, "update", field, update_field
                )
            )
            if response["isSuccess"]:
                return Response(
                    {"success": True, "message": "Status updated successfully"}
                )
            else:
                return Response(
                    {"success": False, "message": "Failed to update status"}
                )
        else:
            return Response(
                {
                    "success": False,
                    "message": "Posting wrong data",
                    "error": serializer.errors,
                }
            )

    """Update the jab category of a candidate"""

    def update_job_category(self, request):
        candidate_id = request.GET.get("candidate_id")
        job_category = request.data.get("job_category")

        field = {"candidate_id": candidate_id, "job_category": job_category}

        serializer = DashBoardJobCategorySerializer(data=field)
        if serializer.is_valid():
            field = {"_id": candidate_id}
            update_field = {"job_category": job_category}
            response = json.loads(
                dowellconnection(
                    *candidate_management_reports, "update", field, update_field
                )
            )
            if response["isSuccess"]:
                return Response(
                    {"success": True, "message": "Job Category updated successfully"}
                )
            else:
                return Response(
                    {"success": False, "message": "Failed to update job category"}
                )
        else:
            return Response(
                {
                    "success": False,
                    "message": "Posting wrong data",
                    "error": serializer.errors,
                }
            )

    """Toatla worklogs for the company"""

    def total_worklogs_count(self, request):
        company_id = request.GET.get("company_id")
        field = {"company_id": company_id}
        response = json.loads(
            dowellconnection(*task_details_module, "fetch", field, update_field=None)
        )
        data = response.get("data", [])
        if data is not None:
            total_worklogs = len(data)

            return Response(
                {
                    "success": True,
                    "message": "Total number of worklogs for the company",
                    "worklogs_count": total_worklogs,
                }
            )
        else:
            return Response(
                {
                    "success": False,
                    "message": "There are no worklogs for the company or company id is not correct",
                }
            )

    """HANDLE ERROR"""

    def handle_error(self, request):
        return Response(
            {"success": False, "message": "Invalid request type"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    """TOTAL WORKLOGS FOR TODAY"""

    def logs_for_today(self, request):
        company_id = request.GET.get("company_id")
        today = date.today()
        today_str = today.strftime("%Y-%m-%d")
        field = {"company_id": company_id, "task_created_date": today_str}

        # print("Today field", field)

        response = dowellconnection(
            *task_details_module, "fetch", field, update_field=None
        )
        response = json.loads(response)

        if response["isSuccess"]:
            log_counts = {}

            for item in response["data"]:
                project_name = item["project"]
                if project_name in log_counts:
                    log_counts[project_name] += 1
                else:
                    log_counts[project_name] = 1

            return Response(
                {
                    "success": True,
                    "message": "Total number of worklogs for today by project",
                    "logs_for_today": log_counts,
                }
            )
        else:
            return Response({"success": False, "message": "Failed to fetch logs"})

    """TOTAL WORKLOGS FOR MONTH"""

    def logs_for_month(self, request):
        today = date.today()
        _, number_of_days = calendar.monthrange(today.year, today.month)
        month_dates=[f"{today.year}-{today.month}-{d}" for d in range(1,number_of_days+1)]

        log_counts = {}
        def call_dowell(field):
            res=dowellconnection(*task_details_module, "fetch", field, update_field=None)
            response_str = json.loads(res)['data']
            # Process the response_str here or store it in a suitable data structure
            for item in response_str:
                if "project" in item.keys():
                    project_name = item["project"]
                    if project_name in log_counts.keys():
                        log_counts[project_name] += 1
                    else:
                        log_counts[project_name] = 1
        # Define a function to fetch data using threads
        def fetch_data_for_date(task_created_date, company_id):
            field = {"company_id": company_id, "task_created_date": task_created_date}
            try:
                call_dowell(field)
            except json.decoder.JSONDecodeError as error:
                call_dowell(field)
                
        # Create threads for each date
        threads = []
        for task_created_date in month_dates:
            thread = threading.Thread(target=fetch_data_for_date, args=(task_created_date, request.GET.get("company_id")))
            threads.append(thread)
            thread.start()
        # Wait for all threads to complete
        for thread in threads:
            thread.join()
            
        if (not i.is_alive() for i in threads):
            return Response(
                {
                    "success": True,
                    "message": "Total number of worklogs for the month",
                    "logs_for_month": log_counts,
                }
            )
        else:
            return Response({"success": False, "message": "Failed to fetch logs"})


    def delete_application(self, request):
        data = request.data
        application_id = data["application_id"]
        field = {"_id": application_id}
        update_field = {"data_type": "Archived_Data"}
        response = dowellconnection(
            *candidate_management_reports, "update", field, update_field
        )
        # print(response)
        if json.loads(response)["isSuccess"] == True:
            return Response(
                {"message": "application successfully deleted"},
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {
                    "message": "application not successfully deleted",
                    "response": json.loads(response),
                },
                status=status.HTTP_204_NO_CONTENT,
            )

@method_decorator(csrf_exempt, name="dispatch")
class candidate_leave(APIView):
    def post(self, request):
        type_request = request.GET.get("type")
        if type_request == "leave_apply":
            return self.leave_apply(request)
        elif type_request == "approved_leave":
            return self.candidate_leave_approve(request)
        elif type_request == "get_leave":
            return self.get_leave(request)       
        elif type_request == "get_all_leave_application":
            return self.get_all_leave_application(request)    
        elif type_request == "applicants_on_leave":
            return self.applicants_on_leave(request)     
        else:
            return self.handle_error(request)

    def leave_apply(self, request):
        applicant_id = request.data.get("applicant_id")
        applicant = request.data.get("applicant")
        company_id = request.data.get("company_id")
        project = request.data.get("project")
        leave_start_date = request.data.get("leave_start_date")
        leave_end_date = request.data.get("leave_end_date")
        email = request.data.get("email")

        field = {
            "applicant_id": applicant_id,
            "applicant": applicant,
            "company_id": company_id,
            "project": project,
            "leave_start_date": leave_start_date,
            "leave_end_date": leave_end_date,
            "email": email,
        }

        serializer = leaveapplyserializers(data=request.data)

        if not serializer.is_valid():
            return Response(
                {
                    "success": False,
                    "message": "posting wrog data",
                    "error": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        response = json.loads(
            datacube_data_insertion(
                API_KEY, DB_Name, collection_name=leave_report_collection, data=field
            )
        )

        if not response["success"]:
            return Response(
                {
                    "success": False,
                    "message": "Sorry your application for leave could not be submitted",
                }
            )

        return Response(
            {
                "success": True,
                "message": "Your leave application has been submitted succesfully",
                "data": response["data"],
            }
        )

    def candidate_leave_approve(self, request):
        applicant_id = request.data.get("applicant_id")
        field = {"_id": applicant_id}
        serializer = leaveapproveserializers(data=request.data)
        if not serializer.is_valid():
            return Response(
                {
                    "success": False,
                    "message": "posting wrong data",
                    "error": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        update_field = {
            "leave_start": request.data.get("leave_start"),
            "leave_end": request.data.get("leave_end"),
            "status": "Leave",
        }
        candidate_report = dowellconnection(
            *candidate_management_reports, "update", field, update_field
        )

        res = json.loads(candidate_report)

        if res["isSuccess"]:
            return Response(
                {
                    
                    "isSuccess": True,
                    "message": "candidate leave request has been approved",
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {
                    "success": False,
                    "message": "candidate leave could not be added please check the aplicant id and try again",
                    "error": res["error"],
                }
            )

    def get_leave(self, request):
        leave_id = request.GET.get('leave_id')
        limit = request.GET.get('limit')
        offset = request.GET.get('offset')

        data = {
            "_id": leave_id,
        }

        response = json.loads(datacube_data_retrival(API_KEY, DB_Name, leave_report_collection, data=data, limit=limit, offset=offset))

        if not response["success"]:
            return Response({
                "success": False,
                "message": "Failed to retrieve leave",
                "database_response": {
                    "success": response["success"],
                    "message": response["message"]
                }
            }, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            "success": True,
            "message": "Leave retrieved successfully",
            "database_response": {
                "success": response["success"],
                "message": response["message"]
            },
            "response": response["data"]
        }, status=status.HTTP_200_OK)

    def get_all_leave_application(self, request):
        limit = request.GET.get('limit')
        offset = request.GET.get('offset')

        response = json.loads(datacube_data_retrival(API_KEY, DB_Name, leave_report_collection, data={}, limit=limit, offset=offset))

        if not response["success"]:
            return Response({
                "success": False,
                "message": "Failed to retrieve leave",
                "database_response": {
                    "success": response["success"],
                    "message": response["message"]
                }
            }, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            "success": True,
            "message": "Leave retrieved successfully",
            "database_response": {
                "success": response["success"],
                "message": response["message"]
            },
            "response": response["data"]
        }, status=status.HTTP_200_OK)
        
        
    def applicants_on_leave(self, request):

            field = {"status": "Leave"}
            
            update_field={}
            
            candidate_report = dowellconnection(
                *candidate_management_reports, "fetch", field, update_field)

            res = json.loads(candidate_report)

            if res["isSuccess"]:
                return Response(
                    {   "success": True,
                        "message": "candidate who are on leave",
                        "data": res
                        
                    },
                    status=status.HTTP_201_CREATED,
                )
            else:
                return Response(
                    {
                        "success": False,
                        "message": "Could not fetch Leave reports",
                        "error": res["error"],
                    }
                )

    def handle_error(self, request):
        return Response(
            {"success": False, "message": "Invalid request type"},
            status=status.HTTP_400_BAD_REQUEST,
        )

@method_decorator(csrf_exempt, name="dispatch")
class ReportDB(APIView):
    def get_individual_report(self, request):
        payload = request.data
        if payload:
            # intializing query parameters-----------------------------------------------------
            if not payload["year"]:
                return Response(
                    {"success": False, "message": "Specify the year"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            year = payload["year"]

            # ensuring the given year is a valid year--------
            if int(year) > datetime.today().year:
                return Response(
                    {
                        "message": "You cannot get a report on a future date",
                        "error": f"{year} is bigger than current year {datetime.today().year}",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
            # -------------------------------------------------------------------------------
            coll_name = payload['username']
            query ={'username':payload['username'],
                    'year':year,
                    'company_id':payload['company_id']
                    }
            get_collection = json.loads(datacube_data_retrival(API_KEY,REPORT_DB_NAME,coll_name,query,10,1))
            
            if get_collection['success']==True:
                if len(get_collection['data'])>0:
                    return Response({"success":get_collection['success'],"message":"successfully generated individual report","data":get_collection['data'][0]},status=status.HTTP_200_OK)
                else:
                    return Response(
                        {"success": False, "message": "No data found. collection is empty"},
                        status=status.HTTP_204_NO_CONTENT,
                    )

            else:
                return Response(
                        {"success": False, "message": get_collection['message']},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
        else:
            return Response(
                {"success": False, "message": "No data found"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
    def post(self, request):
        if request.data["report_type"]:
            if request.data["report_type"] == "Individual":
                return self.get_individual_report(request)
        
        error={"success":False,"error":"Specify the type of report"}
        return Response(error,status=status.HTTP_400_BAD_REQUEST)
    
@method_decorator(csrf_exempt, name="dispatch")
class WeeklyAgenda(APIView):
    def post(self, request):
        type_request = request.GET.get("type")

        if type_request == "add_weekly_update":
            return self.add_weekly_update(request)
        elif type_request == "weekly_agenda_by_id":
            return self.weekly_agenda_by_id(request)
        elif type_request == "all_weekly_agendas":
            return self.all_weekly_agendas(request)
        elif type_request == "approve_group_lead_agenda":
            return self.approve_group_lead_agenda(request)
        elif type_request == "grouplead_agenda_check":
            return self.grouplead_agenda_check(request)
        elif type_request == "agenda_suprojects":
            return self.agenda_suprojects(request)
        else:
            return self.handle_error(request)
        
    def get(self, request):
        type_request = request.GET.get("type")

        if type_request == "agenda_status":
            return self.agenda_status(request)
        else:
            return self.handle_error(request)

    def add_weekly_update(self, request):
        project = request.data.get("project")
        sub_project = request.data.get("sub_project")
        lead_name = request.data.get("lead_name")
        agenda_title = request.data.get("agenda_title")
        total_time = request.data.get("total_time")
        agenda_description = request.data.get("agenda_description")
        week_start = request.data.get("week_start")
        week_end = request.data.get("week_end")
        company_id = request.data.get("company_id")
        timeline = request.data.get("timeline")
        aggregate_agenda = request.data.get("aggregate_agenda")

        field = {
            "project": project,
            "lead_name": lead_name,
            "agenda_title": agenda_title,
            "agenda_description": agenda_description,
            "week_start": week_start,
            "week_end": week_end,
            "company_id": company_id,
            "timeline": timeline,
            "sub_project": sub_project,
            "total_time": total_time,
            "aggregate_agenda": aggregate_agenda,
        }

        serializer = GroupLeadAgendaSerializer(data=field)
        if not serializer.is_valid():
            return Response(
                {
                    "success": False,
                    "message": "Posting wrong data",
                    "error": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        verify_time = field.get("timeline")
        total_time_timeline = sum(
            int(task.get("hours").replace("Hr", "")) for task in verify_time
        )
        total_time_specified = int(field.get("total_time").replace("Hr", ""))

        if total_time_timeline != total_time_specified:
            return Response(
                {
                    "success": False,
                    "message": "Total time does not match with the specified timeline",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        evaluator_response = True
        evaluator_response = json.loads(
            samanta_content_evaluator(API_KEY, agenda_title, aggregate_agenda)
        )
        if not evaluator_response["success"]:
            return Response(
                {
                    "success": False,
                    "message": "Failed to evaluate agenda",
                    "evaluator_response": {
                        "success": evaluator_response["success"],
                        "message": evaluator_response["message"],
                    },
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        data = {
            "lead_name": lead_name,
            "agenda_title": agenda_title,
            "agenda_description": agenda_description,
            "week_start": week_start,
            "week_end": week_end,
            "company_id": company_id,
            "active": True,
            "status": True,
            "lead_approval": False,
            "project": project,
            "sub_project": sub_project,
            "timeline": timeline,
            "aggregate_agenda": aggregate_agenda,
            "total_time": total_time,
            "evaluator_response": evaluator_response,
            "records": [{"record": "1", "type": "overall"}],
        }
        response = json.loads(
            datacube_data_insertion(API_KEY, DB_Name, sub_project, data)
        )
        if not response["success"]:
            return Response(
                {
                    "success": False,
                    "message": "Failed to create weekly agenda",
                    "database_response": {
                        "success": response["success"],
                        "message": response["message"],
                        "data": response,
                    },
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {
                "success": True,
                "message": "Weekly agenda was successfully created",
                "database_response": {
                    "success": response["success"],
                    "message": response["message"],
                    "inserted_id": response["data"]["inserted_id"],
                },
                "evaluator_response": {
                    "success": evaluator_response["success"],
                    "message": evaluator_response["message"],
                    **{
                        key: evaluator_response.get(key, None)
                        for key in [
                            "Confidence level created by AI",
                            "Confidence level created by Human",
                            "AI Check",
                            "Plagiarised",
                            "Creative",
                            "Total characters",
                            "Total sentences",
                        ]
                    },
                },
                "weekly_agenda_details": data,
            },
            status=status.HTTP_201_CREATED,
        )

    def weekly_agenda_by_id(self, request):
        document_id = request.GET.get("document_id")
        limit = request.GET.get("limit")
        offset = request.GET.get("offset")
        sub_project = request.GET.get("sub_project")

        field = {
            "document_id": document_id,
            "limit": limit,
            "offset": offset,
            "sub_project": sub_project,
        }

        serializer = GetWeeklyAgendaByIdSerializer(data=field)
        if not serializer.is_valid():
            return Response(
                {
                    "success": False,
                    "message": "Posting wrong data",
                    "error": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        data = {
            "_id": document_id,
        }
        response = json.loads(
            datacube_data_retrival(API_KEY, DB_Name, sub_project, data, limit, offset)
        )
        # response2 = json.loads(datacube_data_retrival(API_KEY,"MetaDataTest","agenda_subtask",data,limit,offset))

        if not response["success"]:
            return Response(
                {
                    "success": False,
                    "message": "Failed to retrieve weekly agenda",
                    "database_response": {
                        "success": response["success"],
                        "message": response["message"],
                    },
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {
                "success": True,
                "message": "Weekly agenda was retrived successfully",
                "database_response": {
                    "success": response["success"],
                    "message": response["message"],
                },
                "response": response["data"],
            },
            status=status.HTTP_200_OK,
        )

    def all_weekly_agendas(self, request):
        limit = request.GET.get("limit")
        offset = request.GET.get("offset")
        project = request.GET.get("project")
        sub_project = request.GET.get("sub_project")
        if project:
            data = {"project": project}
        else:
            data = {}
        field = {
            "limit": limit,
            "offset": offset,
            # "project": project,
            "sub_project": sub_project,
        }

        # project=sub_project

        serializer = GetWeeklyAgendasSerializer(data=field)
        if not serializer.is_valid():
            return Response(
                {
                    "success": False,
                    "message": "Posting wrong data",
                    "error": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # data={}
        response = json.loads(
            datacube_data_retrival(API_KEY, DB_Name, sub_project, data, limit, offset)
        )
        if not response["success"]:
            return Response(
                {
                    "success": False,
                    "message": "Failed to retrieve weekly agenda",
                    "database_response": {
                        "success": response["success"],
                        "message": response["message"],
                    },
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {
                "success": True,
                "message": "Weekly agenda was retrived successfully",
                "database_response": {
                    "success": response["success"],
                    "message": response["message"],
                },
                "response": response["data"],
            },
            status=status.HTTP_200_OK,
        )

    def approve_group_lead_agenda(self, request):
        agenda_id = request.GET.get("agenda_id")
        sub_project = request.GET.get("sub_project")
        # print(sub_project)
        # print(agenda_id)

        data = {"agenda_id": agenda_id, "sub_project": sub_project}

        field = {
            "_id": agenda_id,
        }

        update_data = {
            "lead_approval": "True",
        }

        serializer = agendaapproveserializer(data=data)
        if not serializer.is_valid():
            return Response(
                {
                    "success": False,
                    "message": "posting invalid data",
                    "errors": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        response = json.loads(
            datacube_data_retrival(
                API_KEY, DB_Name, sub_project, data=field, limit=40, offset=0
            )
        )

        if response["data"][0]["lead_approval"]:
            return Response(
                {"success": False, "message": "Lead agenda is already approved"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        datacube_response = json.loads(
            datacube_data_update(
                API_KEY,
                DB_Name,
                coll_name=sub_project,
                query=field,
                update_data=update_data,
            )
        )

        if not datacube_response["success"]:
            return Response(
                {
                    "success": False,
                    "message": "Failed to approve the group lead agenda",
                    "database_response": {
                        "success": datacube_response["success"],
                        "message": datacube_response["message"],
                    },
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {
                "success": True,
                "message": "Weekly agenda was approved successfully",
                "database_response": {
                    "success": datacube_response["success"],
                    "message": datacube_response["message"],
                },
                "response": datacube_response["data"],
            },
            status=status.HTTP_200_OK,
        )

    def grouplead_agenda_check(self, request):

        project=request.data.get("project")
        company_id=request.GET.get("company_id")
        limit=request.GET.get("limit")
        offset=request.GET.get("offset")        
        unique_subprojects = set()
        collection_name="All_Projects"

        data={
            "parent_project":project
        }

        subproject_response=json.loads(datacube_data_retrival(API_KEY,DB_Name,collection_name,data,limit,offset))

        for subproject in subproject_response['data']:
            if subproject['parent_project'] == project and subproject['company_id'] == company_id:
                unique_subprojects.update(subproject["sub_project_list"])
        
        subproject_list = list(unique_subprojects)

        subproject_agenda = []
        subproject_without_agenda = []

        data={
            "company_id":company_id
        }
        
        for subproject in subproject_list:
            subprojectcheck=json.loads(datacube_data_retrival(API_KEY,DB_Name,subproject,data,limit,offset))
            if subprojectcheck["success"]:
                if len(subprojectcheck["data"]) > 0:
                    subproject_agenda.append(
                        {
                            "subproject_name": subproject,
                            "data_present": len(subprojectcheck["data"]),
                            "agenda": subprojectcheck["data"],
                        }
                    )
                else:
                    subproject_without_agenda.append(subproject)

        return Response(
            {
                "success": True,
                "message": "Report for group lead agenda created successfully",
                "data": {
                    "project": project,
                    "subprojects_list": unique_subprojects,
                    "subproject_without_agenda": subproject_without_agenda,
                    "agenda": subproject_agenda,
                },
            },
            status=status.HTTP_200_OK,
        )

    
    def agenda_suprojects(self, request):
        data=request.GET
        project=request.data.get("project")
        company_id=data.get("company_id")
        collection_name="All_Projects"       


        data={
            "parent_project":project,
            "company_id":company_id
        }

        serializer=SubprojectSerializer(data=data)
        
        if not serializer.is_valid():       
            return Response({
                "success":False,
                "message":"posting invaid data",
                'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        response=json.loads(datacube_data_retrival(API_KEY,DB_Name,collection_name=collection_name,data=data,limit=0,offset=0))

        if not response["success"]:
            return Response({
            "success":False,
            "message":"Subprojects could not retrieved successfullly",
            "error":response
            },status=status.HTTP_400_BAD_REQUEST)
        
        sub_project=response["data"]

        return Response({
            "success":True,
            "message":response["message"],
            "subprojects_list":sub_project
        },status=status.HTTP_200_OK)

    """HANDLE ERROR"""
    def handle_error(self, request): 
        return Response({
            "success": False,
            "message": "Invalid request type"
        }, status=status.HTTP_400_BAD_REQUEST)
    

    def agenda_status(self,request):
        lead_name = request.GET.get('lead_name')
        subproject = request.GET.get('subproject')
        field = {
            "lead_name": lead_name,
            "subproject": subproject
        }

        response = json.loads(
            dowellconnection(*task_details_module, "fetch", field, update_field=None)
        )
        data = response.get("data", [])
        if data:
            # Separate leads into two lists based on agenda submission
            updated_leads = [
                {
                    "lead_name": worklog.get("group_leads"),
                    "subproject": worklog.get("subproject"),
                    "assignee": worklog.get(
                        "assignee"
                    ),  # Replace with the actual field name
                }
                for worklog in data
                if worklog.get("success")
            ]

            not_updated_leads = [
                {
                    "lead_name": worklog.get("group_leads"),
                    "subproject": worklog.get("subproject"),
                    "assignee": worklog.get(
                        "assignee"
                    ),  # Replace with the actual field name
                }
                for worklog in data
                if not worklog.get("success")
            ]
            print(data)
            response_data = {
                "updated_leads": updated_leads,
                "not_updated_leads": not_updated_leads,
            }

            return Response(
                {
                    "success": True,
                    "message": "Agenda submission status for leads",
                    "data": response_data,
                }
            )
        else:
            return Response(
                {
                    "success": False,
                    "message": "There are no worklogs for the given lead and subproject",
                    "data": {"updated_leads": [], "not_updated_leads": []},
                }
            )

        
    def handle_error(self, request):
        return Response(
            {"success": False, "message": "Invalid request type"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    
@method_decorator(csrf_exempt, name='dispatch')
class Datacube_operations(APIView):
    def post(self,request):
        if request.data["type"] == "add_collection":
            return self.add_collection(request)
        elif request.data["type"] == "get_collection":
                return self.get_collection(request)
        elif request.data["type"] == "create_individual_collections":
                return self.create_individual_collections(request)
        else:
            return self.handle_error(request)

    def add_collection(Self, request):
        coll_names = request.data.get("coll_names")
        num_collections = request.data.get("num_collections")

        field = {
            "db_name": DB_Name,
            "api_key": API_KEY,
            "coll_names": coll_names,
            "num_collections": num_collections,
        }
        #print(field)

        serializer = AddCollectionSerializer(data=field)

        if not serializer.is_valid():
            return Response(
                {"success": False, "error": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

        response = json.loads(
            datacube_add_collection(API_KEY, DB_Name, coll_names, num_collections)
        )

        if not response["success"]:
            return Response({
                "success":False,
                "message":"new collection could not be added",
                "message":response["message"]
            },status=status.HTTP_201_CREATED)
        
        return Response({
                "success":True,
                "message":"new collection has been added",
                "data":response["data"]
            },status=status.HTTP_201_CREATED)

    def get_collection(self,request):
        data = request.data
        if data:
            coll_name = data['coll_name']
            db_name= data['db_name']
            get_collection = json.loads(datacube_data_retrival(API_KEY,db_name,coll_name,{},10,1))
            if get_collection['success']==True:
                return Response({"success":get_collection['success'],"message":get_collection['message'],"number_of_data_in_collection":len(get_collection['data']), "data":get_collection['data']},status=status.HTTP_200_OK)
            else:
                return Response({"success":get_collection['success'],"message":get_collection['message']},status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(
                {"success": False, "message": "No data found"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def create_individual_collections(self,request):
        data = request.data
        api_key = API_KEY
        db_name= REPORT_DB_NAME
        info=dowellconnection(*candidate_management_reports, "fetch", {}, update_field=None)
        if len(json.loads(info)["data"])>0:
            info=json.loads(info)["data"]
            count=1
            success=1
            for _c in info:
                _c["application_id"] = _c.pop('_id')
                _c["year"]=str(datetime.today().year)
                coll_name =_c["username"]
                query={"username":_c["username"],
                        "year":_c["year"]}
                get_collection = json.loads(datacube_data_retrival(api_key,db_name,coll_name,query,10,1))
                #print(get_collection,"--"*10)
                _d={}
                for month in calendar.month_name[1:]:
                    _d[month]={
                        "task_added": 0,
                        "tasks_completed": 0,
                        "tasks_uncompleted": 0,
                        "tasks_approved": 0,
                        "percentage_tasks_completed": 0.0,
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
                        "team_tasks_comments_added": 0
                    }
                            
                if get_collection['success']==False:
                    if coll_name in get_collection['message']:
                        print(get_collection['message'])
                        #creating collection------------------------------
                        create_collection = json.loads(datacube_add_collection(api_key,db_name,coll_name,1))
                        if create_collection['success']==True:
                            print(f'successfully created the collection-{coll_name}')
                            #inserting data into the collection------------------------------
                            data=_c
                            data["task_report"]={}
                            data["data"]=_d
                            insert_collection = json.loads(datacube_data_insertion(api_key,db_name,coll_name,data))
                            if insert_collection['success']==True:
                                print(f'successfully inserted the data the collection-{coll_name}')
                            else:
                                print(f"failed to insert datafor the collection-{coll_name}")
                        else:
                            print(f"failed to create collection for {coll_name}")
                    
                    else:
                        return Response(
                                        get_collection,
                                        status=status.HTTP_404_NOT_FOUND,
                                    )
                
                else:
                    #print(f'collection-{coll_name} exists')
                    if len(get_collection['data'])<=0:
                        print(f'collection-{coll_name} is empty... inserting data')
                        data=_c
                        data["task_report"]={}
                        data["data"]=_d
                        insert_collection = json.loads(datacube_data_insertion(api_key,db_name,coll_name,data))
                        if insert_collection['success']==True:
                            print(f'successfully inserted the data the collection- {coll_name}')
                        else:
                            print(f'failed to insert the data into the collection- {coll_name}')
                        
                    else:
                        if len(get_collection['data'][0]['data'])<=0:
                            print(f'collection-{coll_name} task data field is empty.. updating')
                            #update collection------------------------------
                            query={"application_id":_c["application_id"]}
                            
                            update_data={"data":_d}
                            update_collection = json.loads(datacube_data_update(api_key,db_name,coll_name,query,update_data))
                            if update_collection['success']==True:
                                print(f'successfully updated the collection-{coll_name}')
                            else:
                                print(f'failed to update the collection-{coll_name}')
                        
            return Response({"success":True,"message":f"{count} Collections created successfully"},status=status.HTTP_200_OK)
        else:
            return Response(
                {"success": False, "message": "No data found"},
                status=status.HTTP_400_BAD_REQUEST,
            )
@method_decorator(csrf_exempt, name='dispatch')
class test(APIView):
    def get(self, request):

        return Response({
            "api key":API_KEY,
            "db name":DB_Name,
        })

@method_decorator(csrf_exempt, name="dispatch")
class candidate_attendance(APIView):
    def post(self,request):
       request_type=request.GET.get("type")
       if not request_type:
           return Response({"success":False,
                            "message":"Request type should be sent in query as params"},
                           status=status.HTTP_400_BAD_REQUEST
                           )
       if request_type=="add_attendance":
           return self.add_attendance(request) 
       if request_type=="get_attendance":
           return self.get_attendance(request) 
       else:
           self.handle_error(request)
        
    
    def add_attendance(self,request):
        applicant_usernames=request.data.get("applicant_usernames")
        start_date=request.data.get("start_date")
        end_date=request.data.get("end_date")
        company_id=request.data.get("company_id")
        meeting=request.data.get("meeting")

        unsuccessfull_attendance=[]
        successfull_attendance=[]

        serializer=AttendanceSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response({
                "success":False,
                "message":"Posting Invalid Data",
                "error":serializer.errors
                
            })
            
        for username in applicant_usernames:
            print(username)
            collection=start_date+"_"+end_date+"_"+username
            print(collection)
            data={
                "username":username,
                "date":str(date.today()),
                "company_id":company_id,
                "meeting":meeting,
                "attendance":True
            }
            try:
                insert_attendance = json.loads(
                    datacube_data_insertion(API_KEY,DB_Name,collection, data)
                )

                if insert_attendance["success"]==True:
                    successfull_attendance.append(username)
                else:
                    unsuccessfull_attendance.append({
                        "username":username,
                        "error":insert_attendance["message"]
                        })  
            except: 
                    unsuccessfull_attendance.append({
                        "username":username,
                        "error":insert_attendance
                        })  
        return Response({
            "success":True,
            "message":"Attendance has been successfully recorded",
            "response":{
                "successfull_attendance":successfull_attendance,
                "unsuccessfull_attendance":unsuccessfull_attendance
            }
        },status=status.HTTP_201_CREATED)
    
    def get_attendance(self,request):
        start_date=request.data.get("start_date")
        end_date=request.data.get("end_date")
        username=request.data.get("applicant_username")
        collection=start_date+"_"+end_date+"_"+username
        attendance_date=request.data.get("attendance_date")
        limit=request.data.get("limit")
        offset=request.data.get("offset")

        data={}
        if attendance_date:
            data={
                "date":attendance_date
            }

        try:
            attendance_report=json.loads(datacube_data_retrival(API_KEY,DB_Name,collection,data,limit,offset))
            if attendance_report["success"]==True:
                return Response({
                    "success":True,
                    "response":attendance_report["message"],
                    "data":attendance_report},status=status.HTTP_200_OK)
            
            return Response({"success":False,"message":attendance_report["message"]},status=status.HTTP_400_BAD_REQUEST )
            
        except:
            return Response({
                "success":False,
                "error":"datacube database not responding"
            })
    
    def handle_error(self,request):
        return Response({
            "success":False,
            "error":"Invalid request type"
        },status=status.HTTP_400_BAD_REQUEST)
    

@method_decorator(csrf_exempt, name="dispatch")
class speed_test(APIView):
    def get(self, request,email):
        if not email:
            return Response({
                "success": False,
                "message": "Kindly provide email"
            })
        response = get_speed_test_result(email)
        return Response({
            "success": True,
            "message": "Speed test data retrived successfully",
            "response": response
        })