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
    datacube_data_insertion,
    datacube_data_retrival,
    datacube_add_collection,
    datacube_data_update,
    datacube_data_retrival_function,
)
from .serializers import (
    PaymentProcessSerializer,
    InvoiceRequestSerializer
    
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
if os.getenv("REPORT_UUID"):
    REPORT_UUID = str(os.getenv("REPORT_UUID"))
if os.getenv("PROJECT_DB_NAME"):
    PROJECT_DB_NAME = str(os.getenv("PROJECT_DB_NAME"))
if os.getenv("ATTENDANCE_DB"):
    ATTENDANCE_DB = str(os.getenv("ATTENDANCE_DB"))
if os.getenv("COMPANY_STRUCTURE_DB_NAME"):
    COMPANY_STRUCTURE_DB_NAME = str(os.getenv("COMPANY_STRUCTURE_DB_NAME"))
if os.getenv("Events_collection"):
    Events_collection = str(os.getenv("Events_collection"))
if os.getenv("LEAVE_REPORT_COLLECTION"):
    leave_report_collection = str(os.getenv("LEAVE_REPORT_COLLECTION"))
if os.getenv("LEAVE_DB_NAME"):
    LEAVE_DB = str(os.getenv("LEAVE_DB_NAME"))
if os.getenv("DB_PAYMENT_RECORDS"):
    DB_PAYMENT_RECORDS = str(os.getenv("DB_PAYMENT_RECORDS"))

else:
    """for windows local"""
    load_dotenv(f"{os.getcwd()}/.env")
    API_KEY = str(os.getenv("API_KEY"))
    DB_Name = str(os.getenv("DB_Name"))
    REPORT_DB_NAME = str(os.getenv("REPORT_DB_NAME"))
    REPORT_UUID = str(os.getenv("REPORT_UUID"))
    PROJECT_DB_NAME = str(os.getenv("PROJECT_DB_NAME"))
    leave_report_collection = str(os.getenv("LEAVE_REPORT_COLLECTION"))
    COMPANY_STRUCTURE_DB_NAME = str(os.getenv("COMPANY_STRUCTURE_DB_NAME"))
    ATTENDANCE_DB = str(os.getenv("ATTENDANCE_DB"))
    Events_collection = str(os.getenv("Events_collection"))
    LEAVE_DB = str(os.getenv("LEAVE_DB_NAME"))
    DB_PAYMENT_RECORDS = str(os.getenv("DB_PAYMENT_RECORDS"))

# Create your views here.


class Invoice_module(APIView):
    def get(self, request):
        type_request = request.GET.get("type")
        if type_request == "get-payment-records":
            return self.get_payment_records(request)
        elif type_request == "get-invoice":
            return self.invoice(request)
        elif type_request == "get-requests":
            return self.get_requests(request)
        else:
            return self.handle_error(request)

    def post(self, request):
        type_request = request.GET.get("type")

        if type_request == "save-payment-records":
            return self.save_payment_records(request)
        elif type_request == "process-payment":
            return self.process_payment(request)
        elif type_request == "create-new-request":
            return self.create_new_request(request)
        else:
            return self.handle_error(request)

    def patch(self, request):
        type_request = request.GET.get("type")

        if type_request == "update-payment-records":
            return self.update_payment_records(request)
        elif type_request == "update-payment-status":
            return self.update_payment_status(request)
        else:
            return self.handle_error(request)

    def get_payment_records(self, request):
        user_id = request.GET.get("user_id")

        fetch_data = {"db_record_type": "payment_record"}
        result = datacube_data_retrival_function(
            api_key=API_KEY,
            database_name=DB_PAYMENT_RECORDS,
            collection_name=user_id,
            data=fetch_data,
            limit=1,
            offset=0,
            payment=False,
        )

        try:
            result_dict = json.loads(result)
        except json.Exception as e:
            result_dict = {}

        if result_dict.get("success", True):
            payment_details = result_dict.get("data", [])
            if payment_details:
                return Response(
                    {
                        "success": True,
                        "message": f"Payment details for user_id {user_id}",
                        "database_response": True,
                        "response": payment_details[0],
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {
                        "success": False,
                        "message": f"No payment details found for {user_id}",
                        "database_response": False,
                        "response": "",
                    },
                    status=status.HTTP_204_NO_CONTENT,
                )
        else:
            return Response(
                {
                    "success": False,
                    "message": "Failed to fetch payment details",
                    "database_response": False,
                    "response": "",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

    def save_payment_records(self, request):
        user_id = request.data.get("user_id")
        company_id = request.data.get("company_id")
        weekly_payment_amount = request.data.get("weekly_payment_amount")
        payment_method = request.data.get("payment_method")
        payment_currency = request.data.get("currency")

        if not (user_id and company_id and weekly_payment_amount and payment_currency):
            return Response(
                {
                    "success": False,
                    "message": "user_id, company_id, weekly_payment_amount, and currency are required",
                    "database_response": False,
                    "response": "",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        fetch_data = {"company_id": company_id, "user_id": user_id}
        response = datacube_data_retrival_function(
            api_key=API_KEY,
            database_name=DB_PAYMENT_RECORDS,
            collection_name=user_id,
            data=fetch_data,
            limit=1,
            offset=0,
            payment=False,
        )
        parsed_response = json.loads(response)

        if parsed_response.get("data"):
            return Response(
                {
                    "success": False,
                    "message": "Records already exist in the collection",
                    "database_response": False,
                    "response": "",
                },
                status=status.HTTP_204_NO_CONTENT,
            )
        else:
            data_to_add = datacube_add_collection(
                api_key=API_KEY,
                db_name=DB_PAYMENT_RECORDS,
                coll_names=user_id,
                num_collections=1,
            )

            if "success" in data_to_add:
                print(f"Collection created for user_id: {user_id}")
                data_to_insert = {
                    "company_id": company_id,
                    "user_id": user_id,
                    "weekly_payment_amount": weekly_payment_amount,
                    "payment_currency": payment_currency,
                    "db_record_type": "payment_record",
                    "previous_weekly_amounts": [],
                    "last_payment_date": "",
                    "payment_method": payment_method,
                }
                response = datacube_data_insertion(
                    api_key=API_KEY,
                    database_name=DB_PAYMENT_RECORDS,
                    collection_name=user_id,
                    data=data_to_insert,
                )
                return Response(
                    {
                        "success": True,
                        "message": "data inserted successfully",
                        "database_response": True,
                        "response": response,
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {
                        "success": False,
                        "message": f"Failed to create collection for user_id: {user_id}",
                        "database_response": False,
                        "response": "",
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

    def update_payment_records(self, request):
        user_id = request.data.get("user_id")
        company_id = request.data.get("company_id")
        weekly_payment_amount = request.data.get("weekly_payment_amount")
        payment_method = request.data.get("payment_method")
        payment_currency = request.data.get("currency")

        if not (user_id and company_id and weekly_payment_amount and payment_currency):
            return Response(
                {
                    "success": False,
                    "message": "user_id, company_id, weekly_payment_amount, and currency are required",
                    "database_response": False,
                    "response": "",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        fetch_data = {"db_record_type": "payment_record"}
        response_data = datacube_data_retrival_function(
            api_key=API_KEY,
            database_name=DB_PAYMENT_RECORDS,
            collection_name=user_id,
            data=fetch_data,
            limit=1,
            offset=0,
            payment=False,
        )

        try:
            response_data_dict = json.loads(response_data)
        except json.Exception as e:
            result_dict = {}

        if response_data_dict.get("data", []):
            existing_record = response_data_dict["data"][0]
            previous_weekly_amounts = existing_record.get("previous_weekly_amounts", [])

            previous_amount_currency = f"{existing_record.get('weekly_payment_amount', '')}{existing_record.get('payment_currency', '')}"

            new_payment = f"{weekly_payment_amount}{payment_currency}"
            previous_weekly_amounts.append(previous_amount_currency)

            update_query = {"_id": existing_record["_id"]}
            update_data = {
                "company_id": company_id,
                "weekly_payment_amount": weekly_payment_amount,
                "payment_currency": payment_currency,
                "payment_method": payment_method,
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

            return Response(
                {
                    "success": True,
                    "message": "Data Update successfully",
                    "database_response": True,
                    "response": update_response,
                },
                status=status.HTTP_200_OK,
            )

        else:
            return Response(
                {
                    "success": False,
                    "message": "Data does not exist, you need to save first",
                    "database_response": False,
                    "response": "",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

    def process_payment(self, request):
        company_id = request.data.get("company_id")
        company_name = request.data.get("company_name")
        created_by = request.data.get("created_by")
        portfolio = request.data.get("portfolio")
        data_type = request.data.get("data_type")
        user_id = request.data.get("user_id")
        payment_month = request.data.get("payment_month")
        payment_year = request.data.get("payment_year")
        user_was_on_leave = request.data.get("user_was_on_leave")
        approved_logs_count = request.data.get("approved_logs_count")
        total_logs_required = request.data.get("total_logs_required")
        payment_from = request.data.get("payment_from")
        payment_to = request.data.get("payment_to")

        template_id = "663fa0b34732cb33c75856ce"
        hr_username = "ZoyaDowell_4849"
        hr_portfolio = "Dowell_ZoyaaaRasheed "
        accounts_username = "gokuljayanthan"
        accounts_portfolio = "Dowell_Gokul"
        step_document_map = {
            'step_one': [
                {"content": "t1", "required": False, "page": 1},
                {"content": "t2", "required": False, "page": 1},
                {"content": "t3", "required": False, "page": 1},
                {"content": "t4", "required": False, "page": 1},
                {"content": "t5", "required": False, "page": 1},
                {"content": "t6", "required": False, "page": 1},
                {"content": "s1", "required": False, "page": 1},
                {"content": "d1", "required": False, "page": 1},
                {"content": "d2", "required": False, "page": 1},
                {"content": "d3", "required": False, "page": 1},
            ],
            'step_two': [
                {"content": "d4", "required": False, "page": 2},
                {"content": "s2", "required": False, "page": 2},
            ],
            'step_three': [
                {"content": "d5", "required": False, "page": 2},
                {"content": "s3", "required": False, "page": 2},
            ],
        }


        serializer = PaymentProcessSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {
                    "success": False,
                    "message": "Invalid data",
                    "response": serializer.errors,
                }
            )

        data_1 = {
            "db_record_type": "payment_detail",
            "payment_month": payment_month,
            "payment_year": payment_year,
            "payment_from": payment_from,
            "payment_to": payment_to,
        }
        existing_payment_detail = datacube_data_retrival(
            api_key=API_KEY,
            database_name=DB_PAYMENT_RECORDS,
            collection_name=user_id,
            data=data_1,
            limit=1,
            offset=0,
        )
        json_existing_payment_detail = json.loads(existing_payment_detail)

        data_2 = {"db_record_type": "payment_record"}
        existing_payment_record = datacube_data_retrival(
            api_key=API_KEY,
            database_name=DB_PAYMENT_RECORDS,
            collection_name=user_id,
            data=data_2,
            limit=1,
            offset=0,
        )

        json_existing_payment_record = json.loads(existing_payment_record)
        record_data = json_existing_payment_record.get("data")

        if json_existing_payment_detail.get("data") != []:
            return Response(
                {
                    "success": False,
                    "message": f"Payment already processed for {payment_month} {payment_year}",
                },
                status=status.HTTP_409_CONFLICT,
            )

        if len(json_existing_payment_record.get("data")) < 1:
            return Response(
                {
                    "success": False,
                    "message": "User does not have a payment record yet",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        else:
            weekly_payment_amount = json_existing_payment_record["data"][0][
                "weekly_payment_amount"
            ]
            currency_paid = json_existing_payment_record["data"][0]["payment_currency"]
            amount_to_pay = weekly_payment_amount
            records_last_payment_date = json_existing_payment_record["data"][0]["last_payment_date"]
            records_last_payment_date_iso = None
            
            if len(records_last_payment_date) > 0:
                try:
                    records_last_payment_date_iso = datetime.strptime(
                        records_last_payment_date, "%Y-%m-%dT%H:%M:%S.%f"
                    ).isoformat()
                except ValueError:
                    try:
                        records_last_payment_date_iso = datetime.strptime(
                            records_last_payment_date, "%Y-%m-%dT%H:%M:%S"
                        ).isoformat()
                    except ValueError:
                        print('Last records date could not be parsed: ', records_last_payment_date)

            if approved_logs_count < total_logs_required:
                return Response(
                {
                    "success": False,
                    "message": "Invoice creation failed. User does not have up to the required number of approved logs",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

            if user_was_on_leave:
                amount_to_pay = 0

            def processes(company_id, company_name, template_id, created_by, portfolio, data_type, payment_month,payment_year,hr_username,hr_portfolio,accounts_username,accounts_portfolio, step_document_map):
                url = "https://100094.pythonanywhere.com/v2/processes/invoice/"
                payload = {
                    "company_id": company_id,
                    "company_name":company_name,
                    "template_id": template_id,
                    "created_by": created_by,
                    "portfolio": portfolio,
                    "data_type":data_type,
                    "payment_month": payment_month,
                    "payment_year": payment_year,
                    "hr_username": hr_username,
                    "hr_portfolio": hr_portfolio,
                    "accounts_username": accounts_username,
                    "accounts_portfolio":accounts_portfolio,
                    "step_document_map": step_document_map,
                }
                headers = {"Content-Type": "application/json"}
                response = requests.post(url, headers=headers, json=payload)
                return response.json()
            
            masterlink_response = processes(company_id, company_name, template_id, created_by, portfolio, data_type, payment_month, payment_year, hr_username, hr_portfolio, accounts_username, accounts_portfolio, step_document_map)
            created_process = masterlink_response.get('created_process', {})
            master_link = created_process.get('master_link')
            master_code = created_process.get('master_code')
 
            insert_data = {
                "db_record_type": "payment_detail",
                "company_id": company_id,
                "data_type": data_type,
                "payment_month": payment_month,
                "payment_year": payment_year,
                "amount_paid": amount_to_pay,
                "currency_paid": currency_paid,
                "weekly_payment_amount": weekly_payment_amount,
                "approved_logs_count": approved_logs_count,
                "requried_logs_count": total_logs_required,
                "user_was_on_leave": user_was_on_leave,
                "payment_approved": False,
                "payment_approved_on": None,
                "payment_from": payment_from,
                "payment_to": payment_to,
                "master_link": master_link,
                "master_code": master_code,
            }
            data_insert = datacube_data_insertion(
                api_key=API_KEY,
                database_name=DB_PAYMENT_RECORDS,
                collection_name=user_id,
                data=insert_data,
            )
            response_data = json.loads(data_insert)

            # update_date = datetime.now().isoformat()
            last_payment_date = datetime.strptime(payment_to, "%Y-%m-%d").isoformat()
            insert_query = {"_id": record_data[0]["_id"]}
            update_date = {}

            if not records_last_payment_date_iso or (records_last_payment_date_iso is not None and records_last_payment_date_iso < last_payment_date):
                update_date = {
                    "last_payment_date": last_payment_date
                }
            
            update_data = datacube_data_update(
                api_key=API_KEY,
                db_name=DB_PAYMENT_RECORDS,
                coll_name=user_id,
                query=insert_query,
                update_data=update_date,
            )
            json_update_data = json.loads(update_data)

            if json_update_data.get("success") == False:
                return Response(
                    {
                        "success": False,
                        "message": "Failed to update last_payment_date",
                        "database_response": False,
                        "response": "",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if response_data.get("success") == True:
                inserted_data = datacube_data_retrival(
                    api_key=API_KEY,
                    database_name=DB_PAYMENT_RECORDS,
                    collection_name=user_id,
                    data={"_id": response_data["data"]["inserted_id"]},
                    limit=1,
                    offset=0,
                )
                json_inserted_response_data = json.loads(inserted_data)
                if json_inserted_response_data.get("success") == True:
                    inserted_data = json_inserted_response_data.get("data")[0]

                    response = {
                        "success": True,
                        "message": f"Payment processed successfully for {payment_month} {payment_year}.",
                        "database_response": True,
                        "response": inserted_data,
                    }

                    return Response(response, status=status.HTTP_200_OK)
                else:
                    return Response(
                        {
                            "success": False,
                            "message": "Failed to retrieve inserted data",
                            "database_response": False,
                            "response": "",
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )
            else:
                return Response(
                    {
                        "success": False,
                        "message": "Failed to save payment details",
                        "database_response": False,
                        "response": "",
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

    def invoice(self, request):
        user_id = request.GET.get("user_id")
        payment_year = request.GET.get("payment_year")
        payment_month = request.GET.get("payment_month")

        fetch_data = {"db_record_type": "payment_detail","payment_year": int(payment_year)}


        if payment_month:
            fetch_data["payment_month"] = payment_month

        result = datacube_data_retrival_function(
            api_key=API_KEY,
            database_name=DB_PAYMENT_RECORDS,
            collection_name=user_id,
            data=fetch_data,
            limit=1000,
            offset=0,
            payment=False,
        )

        try:
            result_dict = json.loads(result)
        except json.Exception as e:
            result_dict = {}

        if result_dict.get("success", False):
            payment_details = result_dict.get("data", [])
            if payment_details:
                return Response(
                    {
                        "success": True,
                        "message": f"Payment details for {payment_year} and {payment_month if payment_month else 'all months'} for user_id {user_id}",
                        "database_response": True,
                        "response": payment_details,
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {
                        "success": False,
                        "message": f"No payment details found for {payment_year}",
                        "database_response": False,
                        "response": "",
                    },
                    status=status.HTTP_404_NOT_FOUND,
                )
        else:
            return Response(
                {
                    "success": False,
                    "message": "Failed to fetch payment details",
                    "database_response": False,
                    "response": "",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

    def update_payment_status(self, request):
        _id = request.data.get("_id")
        user_id = request.data.get("user_id")

        if not (_id and user_id):
            return Response(
                {
                    "success": False,
                    "message": "User ID and record ID are required",
                    "database_response": False,
                    "response": "",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        fetch_data = {"db_record_type": "payment_detail", "_id": _id}
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
        except json.Exception as e:
            return Response(
                {"message": "Failed to fetch payment details"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        if response_data_dict.get("data", []):

            existing_record = response_data_dict["data"][0]
            existing_record["payment_approved"] = True
            existing_record["payment_approved_on"] = datetime.now().isoformat()

            update_data = {
                "payment_approved": True,
                "payment_approved_on": existing_record["payment_approved_on"],
            }

            response = datacube_data_update(
                api_key=API_KEY,
                db_name=DB_PAYMENT_RECORDS,
                coll_name=user_id,
                query={"_id": existing_record["_id"]},
                update_data=update_data,
            )

            try:
                response_json = json.loads(response)
            except Exception as e:
                return Response(
                    {"message": "Failed to parse response JSON"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

            if response_json.get("success", False):
                return Response(
                    {
                        "success": True,
                        "message": "Payment details updated successfully",
                        "database_response": True,
                        "response": response_json,
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {
                        "success": False,
                        "message": "Failed to update payment details",
                        "database_response": False,
                        "response": "",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
        else:
            return Response(
                {
                    "success": False,
                    "message": "Payment detail record not found",
                    "database_response": False,
                    "response": "",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        

    def create_new_request(self, request):
        serializer = InvoiceRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {
                    "success": False,
                    "message": "Invalid data",
                    "response": serializer.errors,
                }
            )
        username = request.data.get("username")
        portfolio_name = request.data.get("portfolio_name")
        user_id = request.data.get("user_id")
        company_id = request.data.get("company_id")
        data_type = request.data.get("data_type")  
        payment_month = request.data.get("payment_month")
        payment_year = request.data.get("payment_year")
        payment_from = request.data.get("payment_from")
        payment_to = request.data.get("payment_to")

        data = {
            "username": username,
            "portfolio_name": portfolio_name,
            "user_id": user_id,
            "company_id": company_id,
            "data_type": data_type,
            "payment_month": payment_month,
            "payment_year": payment_year,
            "payment_from": payment_from,
            "payment_to": payment_to,
        }

        existing_record = datacube_data_retrival(
            api_key=API_KEY,
            database_name=DB_PAYMENT_RECORDS,
            collection_name="invoice_requests",
            data=data,
            limit=1,
            offset=0,
        )

        json_existing_record = json.loads(existing_record)
        record_data = json_existing_record.get("data")

        if record_data != []:
            return Response(
                {
                    "success": False,
                    "message": f"Request has already been created for {username} in {payment_month} {payment_year} for this period: {payment_from} to {payment_to}",
                },
                status=status.HTTP_409_CONFLICT,
            )
        
        else:
            insert_data = {
                "username": username,
                "portfolio_name": portfolio_name,
                "user_id": user_id,
                "company_id": company_id,
                "payment_month": payment_month,
                "data_type": data_type,
                "payment_year": payment_year,
                "payment_from": payment_from,
                "payment_to": payment_to,
            }
            data_insert = datacube_data_insertion(
                api_key=API_KEY,
                database_name=DB_PAYMENT_RECORDS,
                collection_name="invoice_requests",
                data=insert_data,
            )
            response_data = json.loads(data_insert)
            if response_data.get("success") == True:
                inserted_data_id = response_data["data"]["inserted_id"]
                inserted_data = datacube_data_retrival(
                    api_key=API_KEY,
                    database_name=DB_PAYMENT_RECORDS,
                    collection_name="invoice_requests",
                    data={"_id": inserted_data_id},
                    limit=1,
                    offset=0,
                )
                json_inserted_data = json.loads(inserted_data)
                inserted_record_data = json_inserted_data.get("data")[0]
                
                return Response(
                    {
                        "success": True,
                        "message": "invoice record created",
                        "database_response": True,
                        "inserted_data": inserted_record_data
                    },
                    status=status.HTTP_201_CREATED,
                )
            else:
                return Response(
                    {
                        "success": False,
                        "message": "Failed to create invoice record",
                        "database_response": False,
                        "response": "",
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
            
    def get_requests(self, request):
        company_id = request.GET.get("company_id")

        fetch_data = {"company_id": company_id}

        result = datacube_data_retrival_function(
            api_key=API_KEY,
            database_name=DB_PAYMENT_RECORDS,
            collection_name="invoice_requests",
            data=fetch_data,
            limit=0,
            offset=0,
            payment=False,
        )

        result_dict = json.loads(result)

        if result_dict.get("success", False):
            records = result_dict.get("data", [])
            if records:
                return Response(
                    {
                        "success": True,
                        "message": f"invoice requests for {company_id}",
                        "database_response": True,
                        "response": records,
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {
                        "success": False,
                        "message": f"No invoice requests found for {company_id}",
                        "database_response": False,
                        "response": "",
                    },
                    status=status.HTTP_404_NOT_FOUND,
                )
        else:
            return Response(
                {
                    "success": False,
                    "message": "Failed to fetch invoice requests",
                    "database_response": False,
                    "response": "",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        

    def handle_error(self, request):
        return Response(
            {"success": False, "message": "Invalid request type"},
            status=status.HTTP_400_BAD_REQUEST,
        )
