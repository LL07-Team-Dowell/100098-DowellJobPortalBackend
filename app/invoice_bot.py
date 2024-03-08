from datetime import datetime, timedelta
import threading
from rest_framework import status
import os
import json
import requests
from rest_framework.response import Response


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
    monday = current_date - timedelta(days=weekday+7)
    sunday = monday + timedelta(days=6)
    friday = sunday - timedelta(days=2)
    
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

def settinguserposition(username, company_id):
    url = "https://100098.pythonanywhere.com/settinguserposition/"
    payload = {
        "username": username,
        "company_id": company_id,
    }
    headers = {"Content-Type": "application/json"}
    response = requests.post(url, headers=headers, json=payload)
    if response.status_code == 200:
        return response.json().get('data', {}).get('role')
    else:
        print("Failed to set user position. HTTP status code:", response.status_code)
        return None

def get_userwise_attendance( username,monday_of_previous_week, friday_of_previous_week,company_id, project):
    url = "https://100098.pythonanywhere.com/attendance/?type=get_user_wise_attendance"
    payload = {
        "usernames": [username],
        "start_date": monday_of_previous_week,
        "end_date": friday_of_previous_week,
        "company_id": company_id,
        "limit": "0",
        "offset": "0",
        "project": project,
    }
    headers = {"Content-Type": "application/json"}
    response = requests.post(url, headers=headers, json=payload)
    res = response.json()
    return res.get('data', {}).get(username, [])

def process_payment(
    user_id, payment_month, payment_year, approved_logs_count, total_logs_required, payment_from, payment_to
):
    url = "https://100098.pythonanywhere.com/invoice_module/?type=process-payment"
    payload = {
        "user_id": user_id,
        "payment_month": payment_month,
        "payment_year": payment_year,
        "approved_logs_count": approved_logs_count,
        "total_logs_required": total_logs_required,
        "payment_from": payment_from,
        "payment_to": payment_to,
        "user_was_on_leave": False
    }
    headers = {"Content-Type": "application/json"}
    response = requests.request("POST", url, headers=headers, json=payload)
    res = json.loads(response.text)
    return res


def calculate_hours(worklogs):
    total_hours = 0
    for log in worklogs:
        start_time = datetime.strptime(log["start_time"], "%H:%M")
        end_time = datetime.strptime(log["end_time"], "%H:%M")
        time_diff = end_time - start_time
        total_hours += time_diff.total_seconds() / 3600 
    return total_hours


def create_invoice_bot():
    previous_week_dates = getPreviousWeekDates()
    monday_of_previous_week = previous_week_dates["Monday"]
    friday_of_previous_week = previous_week_dates["Friday"]
    sunday_of_previous_week = previous_week_dates["Sunday"]
    company_id = "6385c0f18eca0fb652c94561"
    


    all_applications = get_all_onboarded_candidate(company_id=company_id)
    applications = all_applications.get("response")["data"]

    for application in applications:
        user_id = application["user_id"]

        user_approved_logs = get_all_task_details(
            monday_of_previous_week,
            sunday_of_previous_week,    
            company_id,
            user_id,
        )
        logs = user_approved_logs.get("task_details")
        
        user_approved_logs = [log for log in logs if log.get("approval") == True or log.get("approved") == True]
        
        hours = calculate_hours(user_approved_logs)      
        
        user_role = settinguserposition(application["username"], company_id)
        

        if user_role in ["Group lead", "Team Lead"]:
            if hours < 40:
                print(
                    f'Invoice not created for {application["username"]} because user did not meet 40 hours requirements'
                )
                continue

            user_present_at_least_once = False  

            for project in application['project']:
                if user_present_at_least_once == True:
                    continue

                sample_attendance_res = get_userwise_attendance(
                        application["username"],
                        monday_of_previous_week,
                        friday_of_previous_week,
                        company_id,
                        project
                    )
                     
                user_present_at_least_once = any('dates_present' in attendance_detail and len(attendance_detail['dates_present']) > 0 for attendance_detail in sample_attendance_res)

            if user_present_at_least_once:
                sunday_of_previous_week_datetime = datetime.strptime(sunday_of_previous_week, "%Y-%m-%d")
                payment_month = sunday_of_previous_week_datetime.strftime("%B")
                payment_year = sunday_of_previous_week_datetime.year

                if user_role == "Group lead":
                    total_logs_required = 160
                else:
                    total_logs_required = 80

                result = process_payment(
                    user_id,
                    payment_month,
                    payment_year,
                    len(user_approved_logs),
                    total_logs_required,
                    monday_of_previous_week,
                    sunday_of_previous_week
                )
                print(f"Status of invoice created for {application['username']}: status={status.HTTP_201_CREATED}")
                print(result)  
            else:
                print('Invoice not created because user was not present for at least one meeting last week') 
        else:   
            if hours < 20:
                print(
                    f'Invoice not created for {application["username"]} because user did not meet 20 hours requirements'
                )
                continue

            user_present_at_least_once = False  

            for project in application['project']:
                if user_present_at_least_once == True:
                    continue
                sample_attendance_res = get_userwise_attendance(
                        application["username"],
                        monday_of_previous_week,
                        friday_of_previous_week,
                        company_id,
                        project
                    )
                            
                user_present_at_least_once = any('dates_present' in attendance_detail and len(attendance_detail['dates_present']) > 0 for attendance_detail in sample_attendance_res)
                   
            if user_present_at_least_once:
                sunday_of_previous_week_datetime = datetime.strptime(sunday_of_previous_week, "%Y-%m-%d")
                payment_month = sunday_of_previous_week_datetime.strftime("%B")
                payment_year = sunday_of_previous_week_datetime.year

                result = process_payment(
                    user_id,
                    payment_month,
                    payment_year,
                    len(user_approved_logs),
                    80,
                    monday_of_previous_week,
                    sunday_of_previous_week
                )
                print(result)
                print(f"Status of invoice created for {application['username']}: status={status.HTTP_201_CREATED}")
            else:
                print('Invoice not created because user was not present for at least one meeting last week')
    
fun = create_invoice_bot()


