from datetime import datetime, timedelta
import json
import requests
import calendar
api_key = "1b834e07-c68b-4bf6-96dd-ab7cdc62f07f"
db_name= "Reports"
num_collections = 1


def datacube_data_insertion(api_key,database_name,collection_name,data):
    url = "https://datacube.uxlivinglab.online/db_api/crud/"

    data = {
        "api_key": api_key,
        "db_name": database_name,
        "coll_name": collection_name,
        "operation": "insert",
        "data":data
    }
    response = requests.post(url, json=data)
    return response.text

def datacube_data_retrival(api_key,database_name,collection_name,data,limit,offset):
    url = "https://datacube.uxlivinglab.online/db_api/get_data/"
    data = {
        "api_key": api_key,
        "db_name": database_name,
        "coll_name": collection_name,
        "operation": "fetch",
        "filters":data,
        "limit": limit,
        "offset": offset     
    }

    response = requests.post(url, json=data)
    return response.text

def datacube_data_update(api_key,db_name,coll_name,query,update_data):
    url = "https://datacube.uxlivinglab.online/db_api/crud/"
    data = {
        "api_key": api_key,
        "db_name": db_name,
        "coll_name": coll_name,
        "operation": "update",
        "query" : query,
        "update_data":update_data
    }

    response = requests.put(url, json=data)
    return response.text

def set_date_format(date):
    try:
        iso_format = datetime.datetime.strptime(date, "%m/%d/%Y %H:%M:%S").strftime(
            "%m/%d/%Y %H:%M:%S"
        )
        return iso_format
    except Exception:
        try:
            iso_format = datetime.datetime.strptime(
                date, "%Y-%m-%d %H:%M:%S.%f"
            ).strftime("%m/%d/%Y %H:%M:%S")
            return iso_format
        except Exception:
            try:
                iso_format = datetime.datetime.strptime(
                    date, "%Y-%m-%dT%H:%M:%S.%fZ"
                ).strftime("%m/%d/%Y %H:%M:%S")
                return iso_format
            except Exception:
                try:
                    iso_format = datetime.datetime.strptime(date, "%m/%d/%Y").strftime(
                        "%m/%d/%Y %H:%M:%S"
                    )
                    return iso_format
                except Exception:
                    try:
                        date_string = date.replace(
                            "(West Africa Standard Time)", ""
                        ).rstrip()
                        iso_format = datetime.datetime.strptime(
                            date_string, "%a %b %d %Y %H:%M:%S %Z%z"
                        ).strftime("%m/%d/%Y %H:%M:%S")
                        return iso_format
                    except Exception:
                        try:
                            iso_format = datetime.datetime.strptime(
                                date, "%d/%m/%Y"
                            ).strftime("%m/%d/%Y %H:%M:%S")
                            return iso_format
                        except Exception:
                            try:
                                iso_format = datetime.datetime.strptime(
                                    date, "%d/%m/%Y %H:%M:%S"
                                ).strftime("%m/%d/%Y %H:%M:%S")
                                return iso_format
                            except Exception:
                                try:
                                    iso_format = datetime.datetime.strptime(
                                        date, "%Y-%m-%d"
                                    ).strftime("%m/%d/%Y %H:%M:%S")
                                    return iso_format
                                except Exception as e:
                                    try:
                                        iso_format = datetime.datetime.strptime(
                                            date, "%d/%m/%Y  %H:%M:%S"
                                        ).strftime("%m/%d/%Y %H:%M:%S")
                                        return iso_format
                                    except Exception:
                                        return ""

def get_month_details(date):
    month_list = calendar.month_name
    months = []
    datime = datetime.datetime.strptime(set_date_format(date), "%m/%d/%Y %H:%M:%S")
    month_name = month_list[datime.month]

    months.append(month_name)

    return (str(datime.year),month_name,months.count(month_name))

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
candidate_management_reports = [
    "jobportal",
    "jobportal",
    "candidate_reports",
    "candidate_report",
    "100098002",
    "ABCDE",
]
 
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

def update_report_database(task_created_date,search_year,company_id):
    field = {
            "task_created_date": task_created_date,
            "company_id": company_id
        }
    """fetch all of yesterdays tasks"""
    daily_tasks = json.loads(dowellconnection(*task_management_reports,"fetch",field,update_field=None))["data"]
    for _t in daily_tasks:
        tasks = json.loads(dowellconnection(*task_details_module, "fetch", field, update_field=None))
        for task in tasks['data']:
            if task['task_id']==_t["_id"]:
                """getting the candidates details"""
                info=json.loads(dowellconnection(*candidate_management_reports, "fetch", {'username':_t['task_added_by']}, update_field=None))['data'][0]
                info["application_id"] = info.pop('_id')
                info["year"]=str(datetime.today().year)

                """checking if the candidates details exists in the database"""
                coll_name =info["application_id"]
                filter_param={"year":str(datetime.today().year)}
                query={"application_id":info["application_id"],
                           "year":info["year"]}
                get_collection = json.loads(datacube_data_retrival(api_key,db_name,coll_name,query,10,1))
                print(get_collection)

                if get_collection['success']==False:
                    print(f'collection-{coll_name} for {filter_param["year"]} not found')
                    #inserting data collection-------------------------------------- 
                    _d={}
                    for month in calendar.month_name[1:]:
                        _d[month]={
                            "task_added": 1,
                            "tasks_completed": 1 if (
                                    task["status"] == "Completed"
                                    or task["status"] == "Complete"
                                    or task["status"] == "completed"
                                    or task["status"] == "complete"
                                    or task["status"] == "Mark as complete"
                                ) else 0,
                            "tasks_uncompleted": 1 if (
                                    task["status"] == "Incomplete" 
                                    or task["status"] == "Incompleted" 
                                    or task["status"] == "incomplete" 
                                    or task["status"] == "Incompleted") else 0,
                            "tasks_approved": 1 if (("approved" in task.keys() and task["approved"] == True) or ("approval" in task.keys() and task["approval"] == True)) else 0,
                            "percentage_tasks_completed": 0.0,
                            "tasks_you_approved": 1 if (("task_approved_by" in task.keys()
                                                            and task["task_approved_by"] == _t['task_added_by'])) else 0,
                            "tasks_you_marked_as_complete": 1 if (("task_approved_by" in task.keys() and task["task_approved_by"] == _t['task_added_by'])
                                                                  and (task["status"] == "Completed"
                                                                        or task["status"] == "Complete"
                                                                        or task["status"] == "completed"
                                                                        or task["status"] == "complete"
                                                                        or task["status"] == "Mark as complete")) else 0,
                            "tasks_you_marked_as_incomplete": 1 if (("task_approved_by" in task.keys() and task["task_approved_by"] == _t['task_added_by'])
                                                                  and (task["status"] == "Incomplete" 
                                                                        or task["status"] == "Incompleted" 
                                                                        or task["status"] == "incomplete" 
                                                                        or task["status"] == "Incompleted")) else 0,
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
                    
                    data =info
                    data['data':_d]
                    #insert_collection = datacube_data_insertion(api_key,db_name,coll_name,data):
                    
                else:
                    #update collection------------------------------
                    _year,_monthname,_monthcnt=get_month_details(task_created_date)
                    query={"application_id":info["application_id"],
                           "year":_year}
                    _task_data={}
                    update_data=get_collection['data'][0]['data'][_monthname] #"""incomplete---"""
                    update_collection = json.loads(datacube_data_update(api_key,db_name,coll_name,query,update_data))
                    if update_collection['success']==True:
                        success+=1

if __name__ == "__main__":
    company_id = "6385c0f18eca0fb652c94561"
    year1 = datetime.today().date() - timedelta(days=1)
    year1 = str(year1.year)
    
    year2 = str(datetime.today().year)
    print(year1,"====", year2)
    """search_date=datetime.today().date() - timedelta(days=1))
        search_year = str(search_date.year)
        search_date = str(search_date)
    
    update_report_database(search_date, search_year,company_id)"""