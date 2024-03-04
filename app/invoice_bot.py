from datetime import datetime, timedelta
import threading
import os
import json
import requests


API_KEY = str(os.getenv("API_KEY"))
ATTENDANCE_DB = str(os.getenv("ATTENDANCE_DB"))


def dowellconnection(
    cluster,
    database,
    collection,
    document,
    team_member_ID,
    function_ID,
    command,
    field,
    update_field,
):
    url = "http://uxlivinglab.pythonanywhere.com"
    # url = "http://100002.pythonanywhere.com/"
    payload = json.dumps(
        {
            "cluster": cluster,
            "database": database,
            "collection": collection,
            "document": document,
            "team_member_ID": team_member_ID,
            "function_ID": function_ID,
            "command": command,
            "field": field,
            "update_field": update_field,
            "platform": "bangalore",
        }
    )
    headers = {"Content-Type": "application/json"}

    response = requests.request("POST", url, headers=headers, data=payload)
    res = json.loads(response.text)

    return res


def getPreviousWeekDates():
    current_date = datetime.now()
    weekday = current_date.weekday()
    monday = current_date - timedelta(days=weekday, weeks=1)
    friday = monday + timedelta(days=4)
    sunday = monday + timedelta(days=6)

    return {
        "Monday": monday.strftime("%Y-%m-%d"),
        "Friday": friday.strftime("%Y-%m-%d"),
        "Sunday": sunday.strftime("%Y-%m-%d"),
    }


def get_all_onboarded_candidate(company_id):
    url = f"https://100098.pythonanywhere.com/get_all_onboarded_candidate/{company_id}"
    payload = json.dumps({})
    headers = {"Content-Type": "application/json"}

    response = requests.request("GET", url, headers=headers, data=payload)
    res = json.loads(response.text)
    return res


def get_all_task_details(
    monday_of_previous_week, sunday_of_previous_week, company_id, user_id
):

    url = f"https://100098.pythonanywhere.com/task_module/?type=task_details"
    payload = json.dumps(
        {
            "start_date": monday_of_previous_week,
            "end_date": sunday_of_previous_week,
            "company_id": company_id,
            "user_id": user_id,
        }
    )
    headers = {"Content-Type": "application/json"}
    response = requests.request("POST", url, headers=headers, data=payload)
    res = json.loads(response.text)
    return res


def calculate_hours(worklogs):
    total_hours = 0
    for log in worklogs:
        start_time = datetime.strptime(log["start_time"], "%H:%M")
        end_time = datetime.strptime(log["end_time"], "%H:%M")
        time_diff = end_time - start_time
        total_hours += time_diff.total_seconds() / 3600  # convert seconds to hours
    return total_hours


def create_invoice_bot():
    # Get previous week dates
    previous_week_dates = getPreviousWeekDates()
    monday_of_previous_week = previous_week_dates["Monday"]
    friday_of_previous_week = previous_week_dates["Friday"]
    sunday_of_previous_week = previous_week_dates["Sunday"]
    company_id = "6385c0f18eca0fb652c94561"

    # Fetch all applications that have a user_id and data_type of 'Real_Data'
    all_applications = get_all_onboarded_candidate(company_id=company_id)
    applications = all_applications.get("response")["data"]
    # Loop through all the applications
    for application in applications:
        user_id = application["user_id"]
        # Get all logs between Monday and Sunday
        user_approved_logs = get_all_task_details(
            monday_of_previous_week,
            sunday_of_previous_week,
            company_id,
            user_id,
        )
        logs = user_approved_logs.get("task_details")
        # Filter only approved logs
        user_approved_logs = [log for log in logs if log["approved"] == True]

        # Calculate hours
        hours = calculate_hours(user_approved_logs)
        print(application["username"], company_id)
        # Check user role
        user_role = "Team Lead"
        # check_position(application["username"], company_id)
        print(user_role)
        if user_role in ["Group lead", "Team Lead"]:
            if hours < 40:
                print(
                    f'Invoice not created for {application["username"]} because hours did not meet requirements'
                )
                continue

            # Check user attendance
            user_present_at_least_once = True
            # get_user_wise_attendance(
            #     application["username"],
            #     application["project"],
            #     monday_of_previous_week,
            #     friday_of_previous_week,
            # )

            # Process payment if user was present at least once
            if user_present_at_least_once:
                # process_payment(application["username"])
                pass
            else:
                print(
                    f'Invoice not created for {application["username"]} because user was not present for at least one meeting last week'
                )
                continue
        else:
            if hours < 20:
                print(
                    f'Invoice not created for {application["username"]} because hours did not meet requirements'
                )
                continue


fun = create_invoice_bot()


# def get_user_wise_attendance(self, request):
#     def add_user_attendance(user_attendance, event_id, date, is_present):
#         for user_record in user_attendance:
#             if user_record["event_id"] == event_id:
#                 if is_present:
#                     user_record["dates_present"].append(date)
#                 else:
#                     user_record["dates_absent"].append(date)

#     start_date = request.data.get("start_date")
#     end_date = request.data.get("end_date")
#     usernames = request.data.get("usernames")
#     company_id = request.data.get("company_id")
#     project = request.data.get("project")
#     collection = str(start_date) + "_to_" + str(end_date)
#     limit = request.data.get("limit")
#     offset = request.data.get("offset")
#     data = {"company_id": company_id, "project": project}

#     event_query = {"company_id": company_id}

#     serializer = IndividualAttendanceRetrievalSerializer(data=request.data)

#     if not serializer.is_valid():
#         return Response(
#             {"success": False, "error": serializer.errors},
#             status=status.HTTP_400_BAD_REQUEST,
#         )

#     def fetch_data(api_key, db, collection, data, limit, offset, result_container):
#         result_container["data"] = json.loads(
#             datacube_data_retrival(api_key, db, collection, data, limit, offset)
#         )

#     try:

#         attendance_report = {}
#         fetch_events = {}

#         attendance_thread = threading.Thread(
#             target=fetch_data,
#             args=(
#                 API_KEY,
#                 ATTENDANCE_DB,
#                 collection,
#                 data,
#                 limit,
#                 offset,
#                 attendance_report,
#             ),
#         )
#         events_thread = threading.Thread(
#             target=fetch_data,
#             args=(
#                 API_KEY,
#                 ATTENDANCE_DB,
#                 Events_collection,
#                 event_query,
#                 limit,
#                 offset,
#                 fetch_events,
#             ),
#         )

#         attendance_thread.start()
#         events_thread.start()
#         attendance_thread.join()
#         events_thread.join()

#         attendance_report = attendance_report["data"]
#         fetch_events = fetch_events["data"]

#     except Exception as e:
#         return Response(
#             {"success": False, "error": f"Datacube is not responding, {e}"},
#             status=status.HTTP_500_INTERNAL_SERVER_ERROR,
#         )

#     events_list = {
#         events["_id"]: events["event_name"] for events in fetch_events.get("data", [])
#     }
#     dates = get_dates_between(start_date, end_date)

#     attendance_with_users = {user: [] for user in usernames}

#     if attendance_report.get("success"):
#         for user in usernames:
#             for event_id, event_name in events_list.items():
#                 user_attendance_record = {
#                     "event_id": event_id,
#                     "event": event_name,
#                     "dates_present": [],
#                     "dates_absent": [],
#                     "project": project,
#                 }
#                 attendance_with_users[user].append(user_attendance_record)

#                 for date in dates:
#                     is_user_present = any(
#                         record.get("date_taken") == date
#                         and user in record.get("user_present", [])
#                         and record.get("event_id") == event_id
#                         for record in attendance_report.get("data", [])
#                     )
#                     add_user_attendance(
#                         attendance_with_users[user], event_id, date, is_user_present
#                     )  # attendance_with_users[user] conatins all the events of the week with teh key user
#         return Response(
#             {
#                 "success": True,
#                 "message": "Attendance records have been successfully retrieved",
#                 "data": attendance_with_users,
#             },
#             status=status.HTTP_200_OK,
#         )
#     else:
#         return Response(
#             {"success": False, "error": "Failed to retrieve attendance records."},
#             status=status.HTTP_500_INTERNAL_SERVER_ERROR,
#         )


# def process_payment(self, request):
# user_id = request.data.get("user_id")
# payment_month = request.data.get("payment_month")
# payment_year = request.data.get("payment_year")
# user_was_on_leave = request.data.get("user_was_on_leave")
# approved_logs_count = request.data.get("approved_logs_count")
# total_logs_required = request.data.get("total_logs_required")
# payment_from = request.data.get("payment_from")
# payment_to = request.data.get("payment_to")

# serializer = PaymentProcessSerializer(data=request.data)
# if not serializer.is_valid():
#     return Response(
#         {
#             "success": False,
#             "message": "Invalid data",
#             "response": serializer.errors,
#         }
#     )

# data_1 = {
#     "db_record_type": "payment_detail",
#     "payment_month": payment_month,
#     "payment_year": payment_year,
#     "payment_from": payment_from,
#     "payment_to": payment_to,
# }
# existing_payment_detail = datacube_data_retrival(
#     api_key=API_KEY,
#     database_name=DB_PAYMENT_RECORDS,
#     collection_name=user_id,
#     data=data_1,
#     limit=1,
#     offset=0,
# )
# json_existing_payment_detail = json.loads(existing_payment_detail)

# data_2 = {"db_record_type": "payment_record"}
# existing_payment_record = datacube_data_retrival(
#     api_key=API_KEY,
#     database_name=DB_PAYMENT_RECORDS,
#     collection_name=user_id,
#     data=data_2,
#     limit=1,
#     offset=0,
# )

# json_existing_payment_record = json.loads(existing_payment_record)
# record_data = json_existing_payment_record.get("data")

# if json_existing_payment_detail.get("data") != []:
#     return Response(
#         {
#             "success": False,
#             "message": f"Payment already processed for {payment_month} {payment_year}",
#         },
#         status=status.HTTP_400_BAD_REQUEST,
#     )

# if not json_existing_payment_record:
#     return Response(
#         {
#             "success": False,
#             "message": "User does not have a payment record yet",
#         },
#         status=status.HTTP_400_BAD_REQUEST,
#     )

# else:
#     weekly_payment_amount = json_existing_payment_record["data"][0][
#         "weekly_payment_amount"
#     ]
#     currency_paid = json_existing_payment_record["data"][0]["payment_currency"]
#     amount_to_pay = weekly_payment_amount

#     if approved_logs_count < total_logs_required:
#         logs_ratio = approved_logs_count / total_logs_required
#         amount_to_pay *= logs_ratio

#     if user_was_on_leave:
#         amount_to_pay = 0

#     insert_data = {
#         "db_record_type": "payment_detail",
#         "payment_month": payment_month,
#         "payment_year": payment_year,
#         "amount_paid": amount_to_pay,
#         "currency_paid": currency_paid,
#         "weekly_payment_amount": weekly_payment_amount,
#         "approved_logs_count": approved_logs_count,
#         "requried_logs_count": total_logs_required,
#         "user_was_on_leave": user_was_on_leave,
#         "payment_approved": False,
#         "payment_approved_on": None,
#         "payment_from": payment_from,
#         "payment_to": payment_to,
#     }
#     data_insert = datacube_data_insertion(
#         api_key=API_KEY,
#         database_name=DB_PAYMENT_RECORDS,
#         collection_name=user_id,
#         data=insert_data,
#     )
#     response_data = json.loads(data_insert)

#     update_date = datetime.now().isoformat()
#     insert_query = {"_id": record_data[0]["_id"]}
#     update_date = {"last_payment_date": update_date}
#     update_data = datacube_data_update(
#         api_key=API_KEY,
#         db_name=DB_PAYMENT_RECORDS,
#         coll_name=user_id,
#         query=insert_query,
#         update_data=update_date,
#     )
#     json_update_data = json.loads(update_data)

#     if json_update_data.get("success") == False:
#         return Response(
#             {
#                 "success": False,
#                 "message": "Failed to update last_payment_date",
#                 "database_response": False,
#                 "response": "",
#             },
#             status=status.HTTP_400_BAD_REQUEST,
#         )

#     if response_data.get("success") == True:
#         inserted_data = datacube_data_retrival(
#             api_key=API_KEY,
#             database_name=DB_PAYMENT_RECORDS,
#             collection_name=user_id,
#             data={"_id": response_data["data"]["inserted_id"]},
#             limit=1,
#             offset=0,
#         )
#         json_inserted_response_data = json.loads(inserted_data)
#         if json_inserted_response_data.get("success") == True:
#             inserted_data = json_inserted_response_data.get("data")[0]

#             response = {
#                 "success": True,
#                 "message": f"Payment processed successfully for {payment_month} {payment_year}.",
#                 "database_response": True,
#                 "response": inserted_data,
#             }

#             return Response(response, status=status.HTTP_200_OK)
#         else:
#             return Response(
#                 {
#                     "success": False,
#                     "message": "Failed to retrieve inserted data",
#                     "database_response": False,
#                     "response": "",
#                 },
#                 status=status.HTTP_400_BAD_REQUEST,
#             )
#     else:
#         return Response(
#             {
#                 "success": False,
#                 "message": "Failed to save payment details",
#                 "database_response": False,
#                 "response": "",
#             },
#             status=status.HTTP_404_NOT_FOUND,
#         )
