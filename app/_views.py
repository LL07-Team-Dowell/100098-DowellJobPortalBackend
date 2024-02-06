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
    get_speed_test_result,
    datacube_data_retrival_function,
    get_current_week_start_end_date,
    speed_test_condition,
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
    AttendanceSerializer,
    Project_Update_Serializer,
    WeeklyAgendaDateReportSerializer,
    CompanyStructureAddCeoSerializer,
    CompanyStructureUpdateCeoSerializer,
    CompanyStructureAddProjectLeadSerializer,
    CompanyStructureUpdateProjectLeadSerializer,
    CompanyStructureProjectsSerializer,
    WorklogsDateSerializer,
    UpdateUserIdSerializer,
    InsertPaymentInformation,
)
from .authorization import (
    verify_user_token,
    sign_token,
)
from .models import UsersubProject
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
if os.getenv("COMPANY_STRUCTURE_DB_NAME"):
    COMPANY_STRUCTURE_DB_NAME = str(os.getenv("COMPANY_STRUCTURE_DB_NAME"))

else:
    """for windows local"""
    load_dotenv(f"{os.getcwd()}/.env")
    API_KEY = str(os.getenv("API_KEY"))
    DB_Name = str(os.getenv("DB_Name"))
    REPORT_DB_NAME = str(os.getenv("REPORT_DB_NAME"))
    PROJECT_DB_NAME = str(os.getenv("PROJECT_DB_NAME"))
    leave_report_collection = str(os.getenv("LEAVE_REPORT_COLLECTION"))
    COMPANY_STRUCTURE_DB_NAME = str(os.getenv("COMPANY_STRUCTURE_DB_NAME"))
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


class Invoice_module(APIView):
    def post(self, request):
        type_request = request.GET.get("type")
        company_id = request.GET.get("company_id")

        if type_request == "create-collection":
            return self.create_collection(request, company_id)
        elif type_request == "save-payment-records":
            return self.save_payment_records(request)
        elif type_request == "update-payment-records":
            return self.update_payment_records(request)
        else:
            return self.handle_error(request)

    def create_collection(self, request, company_id):
        if company_id:
            field = {"company_id": company_id, "status": "hired"}
            response = dowellconnection(
                *candidate_management_reports, "fetch", field, update_field=None
            )
            parsed_response = json.loads(response)

            if parsed_response.get("isSuccess", False):
                onboarded_candidates = parsed_response.get("data", [])

                if not onboarded_candidates:
                    return Response(
                        {
                            "message": f"There are no onboarded candidates with this company id",
                            "response": parsed_response,
                        },
                        status=status.HTTP_204_NO_CONTENT,
                    )

                for candidate in onboarded_candidates:
                    user_id = candidate.get("user_id")

                    # Check if user_id is present
                    if user_id:
                        # Create a collection for each username
                        url = (
                            "https://datacube.uxlivinglab.online/db_api/add_collection/"
                        )
                        data_to_add = {
                            "api_key": "1b834e07-c68b-4bf6-96dd-ab7cdc62f07f",
                            "db_name": "Payment_Records",
                            "coll_names": user_id,
                            "num_collections": 1,
                        }
                        response = requests.post(url, json=data_to_add)

                        if response.status_code == 200:
                            print(f"Collection created for user_id: {user_id}")
                        else:
                            print(f"Failed to create collection for user_id: {user_id}")

                return Response(
                    {
                        "message": "Collections created successfully",
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {
                        "message": "Failed to fetch onboarded candidates",
                        "response": parsed_response,
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
        else:
            return Response(
                {"message": "Company ID is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def save_payment_records(self, request):
        user_id = request.data.get("username")
        weekly_payment_amount = request.data.get("weekly_payment_amount")
        payment_currency = request.data.get("currency")

        if not (user_id and weekly_payment_amount and payment_currency):
            return Response(
                {
                    "message": "Username, weekly_payment_amount, and currency are required"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        url = "https://datacube.uxlivinglab.online/db_api/get_data/"

        data = {
            "api_key": "1b834e07-c68b-4bf6-96dd-ab7cdc62f07f",
            "db_name": "Payment_Records",
            "coll_name": user_id,
            "operation": "fetch",
            "data": {"db_record_type": "payment_records"},
        }
        response = requests.post(url, json=data)
        response_data = response.json()

        # Handle the API response appropriately
        if response_data["data"] == []:
            url = "https://datacube.uxlivinglab.online/db_api/crud/"
            data = {
                "api_key": "1b834e07-c68b-4bf6-96dd-ab7cdc62f07f",
                "db_name": "Payment_Records",
                "coll_name": user_id,
                "operation": "insert",
                "data": {
                    "weekly_payment_amount": weekly_payment_amount,
                    "payment_currency": payment_currency,
                    "db_record_type": "payment_record",
                    "previous_weekly_amounts": [],
                    "last_payment_date": "",
                },
            }
            response = requests.post(url, json=data)
            return Response(response.json(), status=status.HTTP_200_OK)
        else:
            return Response(
                {"message": "Record already saved"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def update_payment_records(self, request):
        user_id = request.data.get("username")
        weekly_payment_amount = request.data.get("weekly_payment_amount")
        payment_currency = request.data.get("currency")

        if not (user_id and weekly_payment_amount and payment_currency):
            return Response(
                {
                    "message": "Username, weekly_payment_amount, and currency are required"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Fetch data from the API to get the existing record
        url = "https://datacube.uxlivinglab.online/db_api/get_data/"
        data = {
            "api_key": "1b834e07-c68b-4bf6-96dd-ab7cdc62f07f",
            "db_name": "Payment_Records",
            "coll_name": user_id,
            "operation": "fetch",
            "data": {"db_record_type": "payment_records"},
        }
        response = requests.post(url, json=data)
        existing_data = response.json()["data"]

        # Check if data exists
        if existing_data:
            previous_weekly_amounts = existing_data[0].get(
                "previous_weekly_amounts", []
            )

            # Concatenate the previous amount and currency into a string
            previous_amount_currency = f"{existing_data[0].get('weekly_payment_amount', '')}{existing_data[0].get('payment_currency', '')}"

            # Append the new payment to previous weekly amounts
            new_payment = f"{weekly_payment_amount}{payment_currency}"
            previous_weekly_amounts.append(previous_amount_currency)

            # Send the update request to the API
            update_url = "https://datacube.uxlivinglab.online/db_api/crud/"
            update_data = {
                "api_key": "1b834e07-c68b-4bf6-96dd-ab7cdc62f07f",
                "db_name": "Payment_Records",
                "coll_name": user_id,
                "operation": "update",
                "update_data": {
                    "weekly_payment_amount": weekly_payment_amount,
                    "payment_currency": payment_currency,
                    "db_record_type": "payment_record",
                    "previous_weekly_amounts": previous_weekly_amounts,
                    "last_payment_date": "",
                },
            }
            update_response = requests.put(update_url, json=update_data)

            return Response(update_response.json(), status=update_response.status_code)

        else:
            return Response(
                {"message": "Data does not exist, you need to save first"},
                status=status.HTTP_404_NOT_FOUND,
            )

    def handle_error(self, request):
        return Response(
            {"success": False, "message": "Invalid request type"},
            status=status.HTTP_400_BAD_REQUEST,
        )
