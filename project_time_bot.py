import json
from datetime import datetime, timedelta, date
import requests
import threading

task_management_reports = [
    "jobportal",
    "jobportal",
    "task_reports",
    "task_reports",
    "100098007",
    "ABCDE",
]
task_details_module = [
    "jobportal",
    "jobportal",
    "task_details",
    "task_details",
    "1000981019",
    "ABCDE",
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
"""ensuring the date time format is always valid"""
def set_date_format(date):
    try:
        iso_format = datetime.strptime(date, "%m/%d/%Y %H:%M:%S").strftime(
            "%m/%d/%Y %H:%M:%S"
        )
        return iso_format
    except Exception:
        try:
            iso_format = datetime.strptime(
                date, "%Y-%m-%d %H:%M:%S.%f"
            ).strftime("%m/%d/%Y %H:%M:%S")
            return iso_format
        except Exception:
            try:
                iso_format = datetime.strptime(
                    date, "%Y-%m-%dT%H:%M:%S.%fZ"
                ).strftime("%m/%d/%Y %H:%M:%S")
                return iso_format
            except Exception:
                try:
                    iso_format = datetime.strptime(date, "%m/%d/%Y").strftime(
                        "%m/%d/%Y %H:%M:%S"
                    )
                    return iso_format
                except Exception:
                    try:
                        date_string = date.replace(
                            "(West Africa Standard Time)", ""
                        ).rstrip()
                        iso_format = datetime.strptime(
                            date_string, "%a %b %d %Y %H:%M:%S %Z%z"
                        ).strftime("%m/%d/%Y %H:%M:%S")
                        return iso_format
                    except Exception:
                        try:
                            iso_format = datetime.strptime(
                                date, "%d/%m/%Y"
                            ).strftime("%m/%d/%Y %H:%M:%S")
                            return iso_format
                        except Exception:
                            try:
                                iso_format = datetime.strptime(
                                    date, "%d/%m/%Y %H:%M:%S"
                                ).strftime("%m/%d/%Y %H:%M:%S")
                                return iso_format
                            except Exception:
                                try:
                                    iso_format = datetime.strptime(
                                        date, "%Y-%m-%d"
                                    ).strftime("%m/%d/%Y %H:%M:%S")
                                    return iso_format
                                except Exception as e:
                                    try:
                                        iso_format = datetime.strptime(
                                            date, "%d/%m/%Y  %H:%M:%S"
                                        ).strftime("%m/%d/%Y %H:%M:%S")
                                        return iso_format
                                    except Exception:
                                        return ""

def get_projects_spent_total_time(company_id, search_date):
    data={}
    task_field = {
        "company_id":company_id,
        "task_created_date":search_date
    }
    print("-----------------------------------")
    print("----------Processing total time spent for projects (Started)----------")
    task_details = json.loads(dowellconnection(*task_details_module, "fetch", task_field, update_field=None))["data"]
    count=1
    for task in task_details:
        print(f"--checking task--{count}--of--{len(task_details)}--")
        if "task_created_date" in task.keys() and set_date_format(task["task_created_date"]) != "":
            try:                  
                if "start_time" in task.keys() and "end_time" in task.keys():
                    try:
                        start_time = datetime.strptime(task["start_time"], "%H:%M")
                    except ValueError:
                        start_time = datetime.strptime(task["start_time"], "%H:%M:%S")
                    try:
                        end_time = datetime.strptime(task["end_time"], "%H:%M")
                    except ValueError:
                        end_time = datetime.strptime(task["end_time"], "%H:%M:%S")
                    duration = end_time - start_time
                    dur_secs = (duration).total_seconds()
                    dur_mins = dur_secs / 60
                    dur_hrs = dur_mins / 60
                    
                    if task["project"] in data.keys():
                        data[task["project"]]+=dur_hrs  
                    else:
                        data[task["project"]]=dur_hrs
            except Exception as error:
                print(error)
                pass
            print(f"--retrieved project time--of--{task['_id']}--")
        count+=1
    print("----------Processing total time spent for projects (Done)----------")
    return data

def update_spent_time(project,company_id, spent_time):
    url="https://100098.pythonanywhere.com/update_project_spent_time/"
    payload = json.dumps(
            {
                "project":project,
                "company_id":company_id,
                "spent_time": spent_time
            }
        )
    headers = {"Content-Type": "application/json"}

    response = requests.request("PATCH", url, headers=headers, data=payload)
    res = json.loads(response.text)

    return res 

def update_project_time(company_id,_date):
    spent_time = get_projects_spent_total_time(company_id, search_date=_date)
    for s in spent_time:
        response = update_spent_time(project=s,company_id=company_id, spent_time=spent_time[s])
        print(response,"--------------------------------")
    return True

def main():
    print("-----------------------------------")
    print("----------Process started----------")

    company_id='6385c0f18eca0fb652c94561'
    _date = datetime.today().date()-timedelta(days=1)
    _date = _date.strftime("%Y-%m-%d")

    """project time"""
    project_time = update_project_time(company_id=company_id,_date=_date)

    print("----------Process done-------------")
    print("-----------------------------------")
      
if __name__ == "__main__":
    ##call main-----
    main()