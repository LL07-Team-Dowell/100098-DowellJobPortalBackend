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
if os.getenv("DB_PAYMENT_RECORDS"):
    DB_PAYMENT_RECORDS = str(os.getenv("DB_PAYMENT_RECORDS"))


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
    DB_PAYMENT_RECORDS = str(os.getenv("DB_PAYMENT_RECORDS"))

# Create your views here.


class Invoice_module(APIView):
    def post(self, request):
        type_request = request.GET.get("type")
        company_id = request.GET.get("company_id")

        if type_request == "get-payment-records":  # for user
            return self.get_payment_records(request)
        elif type_request == "save-payment-records":
            return self.save_payment_records(request)
        elif type_request == "update-payment-records":
            return self.update_payment_records(request)
        elif type_request == "process-payment":
            return self.process_payment(request)
        elif type_request == "get-invoice":
            return self.invoice(request)
        elif type_request == "update-payment-status":
            return self.update_payment_status(request)
        else:
            return self.handle_error(request)

    def get_payment_records(self, request):
        user_id = request.data.get("user_id")
        company_id = request.data.get("company_id")

        fetch_data = {"db_record_type": "payment_record"}
        result = datacube_data_retrival(
            api_key=API_KEY,
            database_name=DB_PAYMENT_RECORDS,
            collection_name=user_id,
            data=fetch_data,
            limit=1,
            offset=0,
        )

        try:
            result_dict = json.loads(result)
        except json.JSONDecodeError:
            # Handle the case where the string is not valid JSON
            result_dict = {}

        if result_dict.get("success", True):
            payment_details = result_dict.get("data", [])
            if payment_details:
                return Response(
                    {
                        "message": f"Payment details for user_id {user_id}",
                        "data": payment_details[0],
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {"message": f"No payment details found for {user_id}"},
                    status=status.HTTP_404_NOT_FOUND,
                )
        else:
            return Response(
                {"message": "Failed to fetch payment details", "response": result_dict},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def save_payment_records(self, request):
        user_id = request.data.get("user_id")
        company_id = request.data.get("company_id")
        weekly_payment_amount = request.data.get("weekly_payment_amount")
        payment_currency = request.data.get("currency")

        if not (user_id and company_id and weekly_payment_amount and payment_currency):
            return Response(
                {
                    "message": "user_id, company_id, weekly_payment_amount, and currency are required"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Check if the collection exists for the user_id in the Payment Records database
        fetch_data = {"company_id": company_id, "user_id": user_id}
        response = datacube_data_retrival(
            api_key=API_KEY,
            database_name=DB_PAYMENT_RECORDS,
            collection_name=user_id,
            data=fetch_data,
            limit=1,
            offset=0,
        )
        parsed_response = json.loads(response)

        if parsed_response.get("data"):
            # Records already exist in the collection, return a message
            return Response(
                {"message": "Records already exist in the collection"},
                status=status.HTTP_409_CONFLICT,
            )
        else:
            # Collection doesn't exist, create a new collection first and then save records
            data_to_add = datacube_add_collection(
                api_key=API_KEY,
                db_name=DB_PAYMENT_RECORDS,
                coll_names=user_id,
                num_collections=1,
            )

            if "success" in data_to_add:
                print(f"Collection created for user_id: {user_id}")
                # Now save records in the newly created collection
                data_to_insert = {
                    "company_id": company_id,
                    "user_id": user_id,
                    "weekly_payment_amount": weekly_payment_amount,
                    "payment_currency": payment_currency,
                    "db_record_type": "payment_record",
                    "previous_weekly_amounts": [],
                    "last_payment_date": "",
                }
                response = datacube_data_insertion(
                    api_key=API_KEY,
                    database_name=DB_PAYMENT_RECORDS,
                    collection_name=user_id,
                    data=data_to_insert,
                )
                return Response(response, status=status.HTTP_200_OK)
            else:
                return Response(
                    {"message": f"Failed to create collection for user_id: {user_id}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

    def update_payment_records(self, request):
        user_id = request.data.get("username")
        company_id = request.data.get("company_id")
        weekly_payment_amount = request.data.get("weekly_payment_amount")
        payment_currency = request.data.get("currency")

        if not (user_id and company_id and weekly_payment_amount and payment_currency):
            return Response(
                {
                    "message": "Username, weekly_payment_amount, and currency are required"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Fetch data using the provided function
        fetch_data = {"db_record_type": "payment_record"}
        response_data = datacube_data_retrival(
            api_key=API_KEY,
            database_name=DB_PAYMENT_RECORDS,
            collection_name=user_id,
            data=fetch_data,
            limit=1,
            offset=0,
        )

        try:
            response_data_dict = json.loads(response_data)
        except json.JSONDecodeError:

            print(response_data_dict)

        # Check if "data" key exists.
        if response_data_dict.get("data", []):
            existing_record = response_data_dict["data"][0]
            previous_weekly_amounts = existing_record.get("previous_weekly_amounts", [])

            # Concatenate the previous amount and currency into a string
            previous_amount_currency = f"{existing_record.get('weekly_payment_amount', '')}{existing_record.get('payment_currency', '')}"

            # Append the new payment to previous weekly amounts
            new_payment = f"{weekly_payment_amount}{payment_currency}"
            previous_weekly_amounts.append(previous_amount_currency)

            # Send the update request
            update_query = {"_id": existing_record["_id"]}
            update_data = {
                "company_id": company_id,
                "weekly_payment_amount": weekly_payment_amount,
                "payment_currency": payment_currency,
                "db_record_type": "payment_record",
                "previous_weekly_amounts": previous_weekly_amounts,
                "last_payment_date": "",
            }
            update_response = datacube_data_update(
                api_key=API_KEY,
                db_name=DB_PAYMENT_RECORDS,
                coll_name=user_id,
                query=update_query,
                update_data=update_data,
            )

            return Response(update_response, status=status.HTTP_200_OK)

        else:
            return Response(
                {"message": "Data does not exist, you need to save first"},
                status=status.HTTP_404_NOT_FOUND,
            )

    def process_payment(self, request):
        user_id = request.data.get("user_id")
        company_id = request.data.get("company_id")
        payment_month = request.data.get("payment_month")
        payment_year = request.data.get("payment_year")
        number_of_leave_days = request.data.get("number_of_leave_days")
        approved_logs_count = request.data.get("approved_logs_count")
        total_logs_required = request.data.get("total_logs_required")

        url = "https://datacube.uxlivinglab.online/db_api/get_data/"
        data_1 = {
            "api_key": API_KEY,
            "db_name": DB_PAYMENT_RECORDS,
            "coll_name": user_id,
            "operation": "fetch",
            "filters": {
                "db_record_type": "payment_detail",
                "payment_month": payment_month,
                "payment_year": payment_year,
            },
        }

        data_2 = {
            "api_key": API_KEY,
            "db_name": DB_PAYMENT_RECORDS,
            "coll_name": user_id,
            "operation": "fetch",
            "filters": {
                "db_record_type": "payment_record",
            },
        }

        response_1 = requests.post(url, json=data_1)
        existing_payment_detail = response_1.json()["data"]

        response_2 = requests.post(url, json=data_2)
        existing_payment_record = response_2.json()["data"]

        if existing_payment_detail:
            return Response(
                {
                    "message": f"Payment already processed for {payment_month} {payment_year}"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not existing_payment_record:
            return Response(
                {"message": "user does not have a payment record yet"},
                status=status.HTTP_404_BAD_REQUEST,
            )

        else:
            weeks_per_month = 4
            weekly_payment_amount = existing_payment_record[0].get(
                "weekly_payment_amount", 0
            )
            currency_paid = existing_payment_record[0].get("payment_currency", 0)
            monthly_payment = weekly_payment_amount * weeks_per_month

            daily_payment = weekly_payment_amount / 5
            amount_to_pay = monthly_payment

            if approved_logs_count < total_logs_required:
                logs_ratio = approved_logs_count / total_logs_required
                amount_to_pay *= logs_ratio

            if number_of_leave_days > 0:
                leave_adjustment = daily_payment * number_of_leave_days
                amount_to_pay -= leave_adjustment

            if amount_to_pay < 0:
                amount_to_pay = 0

            save_url = "https://datacube.uxlivinglab.online/db_api/crud/"
            save_data = {
                "api_key": API_KEY,
                "db_name": DB_PAYMENT_RECORDS,
                "coll_name": user_id,
                "operation": "insert",
                "data": {
                    "db_record_type": "payment_detail",
                    "payment_month": payment_month,
                    "payment_year": payment_year,
                    "amount_paid": amount_to_pay,
                    "currency_paid": currency_paid,
                    "actual_monthly_pay": monthly_payment,
                    "approved_logs_count": approved_logs_count,
                    "requried_logs_count": total_logs_required,
                    "leave_days": number_of_leave_days,
                    "payment_approved": False,
                    "paymentmade_on": " ",
                },
            }

            save_response = requests.post(save_url, json=save_data)

            update_date = datetime.now().isoformat()
            update_url = "https://datacube.uxlivinglab.online/db_api/crud/"
            update_data = {
                "api_key": API_KEY,
                "db_name": DB_PAYMENT_RECORDS,
                "coll_name": user_id,
                "operation": "update",
                "query": {"_id": existing_payment_record[0].get("_id", 0)},
                "update_data": {
                    "last_payment_date": update_date,
                },
            }

            update_response = requests.put(update_url, json=update_data)

            if update_response.status_code not in [200, 201]:
                return Response(
                    {"message": "Failed to update last_payment_date"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

            if save_response.status_code in [200, 201]:
                inserted_data = save_response.json()["data"]
                success_message = f"Payment processed successfully for {payment_month} {payment_year}. Inserted ID: {inserted_data['inserted_id']}"

                return Response(
                    {"message": success_message},
                    status=status.HTTP_200_OK,
                )

            else:
                return Response(
                    {"message": "Failed to save payment details"},
                    status=status.HTTP_404_NOT_FOUND,
                )

    def invoice(self, request):
        user_id = request.data.get("user_id")
        company_id = request.data.get("company_id")
        payment_year = request.data.get("payment_year")

        fetch_data = {"payment_year": payment_year}
        result = datacube_data_retrival(
            api_key=API_KEY,
            database_name=DB_PAYMENT_RECORDS,
            collection_name=user_id,
            data=fetch_data,
            limit=0,
            offset=0,
        )

        try:
            result_dict = json.loads(result)
        except json.JSONDecodeError:
            # Handle the case where the string is not valid JSON
            result_dict = {}

        if result_dict.get("success", False):
            payment_details = result_dict.get("data", [])
            if payment_details:
                return Response(
                    {
                        "message": f"Payment details for {payment_year} and user_id {user_id}",
                        "data": payment_details,
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {"message": f"No payment details found for {payment_year}"},
                    status=status.HTTP_404_NOT_FOUND,
                )
        else:
            return Response(
                {"message": "Failed to fetch payment details", "response": result_dict},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def handle_error(self, request):
        return Response(
            {"success": False, "message": "Invalid request type"},
            status=status.HTTP_400_BAD_REQUEST,
        )
