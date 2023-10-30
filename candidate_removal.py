import requests
from datetime import datetime, timedelta
import json

Product_Services = [
    "api_key", 
    "api_key", 
    "ProductServices",
    "ProductServices", 
    "100105004", 
    "ABCDE"
]

"""Dowell Connection"""
def dowellconnection(cluster,database,collection,document,team_member_ID,function_ID,command,field,update_field):
    url = "http://uxlivinglab.pythonanywhere.com"
    # url = "http://100002.pythonanywhere.com/"
    payload = json.dumps({
        "cluster": cluster,
        "database": database,
        "collection": collection,
        "document": document,
        "team_member_ID": team_member_ID,
        "function_ID": function_ID,
        "command": command,
        "field": field,
        "update_field": update_field,
        "platform": "bangalore"
        })
    headers = {
        'Content-Type': 'application/json'
        }

    response = requests.request("POST", url, headers=headers, data=payload)
    res= json.loads(response.text)

    return res

def insert_user_data_to_db(all_candidates_url, company_id, start_date, end_date):
    response_candidates = requests.get(all_candidates_url)
    data_candidates = response_candidates.json()

    if "response" in data_candidates and "data" in data_candidates["response"]:
        candidates = data_candidates["response"]["data"]

        print("----------------------------------------------------------------")

        for candidate in candidates:
            username = candidate.get("username")
            applicant_name = candidate.get("applicant")
            applicant_email = candidate.get("applicant_email")
            portfolio_name = candidate.get("portfolio_name")

            report_url = "https://100098.pythonanywhere.com/generate_report/"
            payload = {
                "report_type": "Individual Task",
                "company_id": company_id,
                "username": username
            }
            response = requests.post(report_url, json=payload)
            data = response.json()

            tasks = data["response"][0]["tasks"]
            number_of_tasks = 0
            for task in tasks:
                task_created_date = datetime.strptime(task["task_created_date"], "%Y-%m-%d")
                if start_date <= task_created_date <= end_date:
                    number_of_tasks += 1

            total_time = 0

            for item in data["response"]:

                for task in item["tasks"]:
                    task_created_date = datetime.strptime(task["task_created_date"], "%Y-%m-%d")

                    if start_date <= task_created_date <= end_date:
                        start_time = datetime.strptime(task["start_time"], "%H:%M")
                        end_time = datetime.strptime(task["end_time"], "%H:%M")
                        task_duration = (end_time - start_time).total_seconds() / 3600  

                        total_time += task_duration
            print("----------------------------------------------------------------")
            user_data = {
                "username": username,
                "applicant_name": applicant_name,
                "applicant_email": applicant_email,
                "portfolio_name": portfolio_name,
                "total_time": total_time,
                "total_tasks_last_one_week": number_of_tasks
            }
            print(user_data)
            print("-------------------------------")
            response = json.loads(dowellconnection(*Product_Services,"insert",field=user_data,update_field=None))
            print(response)
            print("-------------------------------")


start_date = datetime(2023, 10, 23)
end_date = datetime(2023, 10, 29)
company_id = "6385c0f18eca0fb652c94561"
all_candidates_url = "https://100098.pythonanywhere.com/get_all_onboarded_candidate/6385c0f18eca0fb652c94561/"

insert_user_data_to_db(all_candidates_url, company_id, start_date, end_date)
