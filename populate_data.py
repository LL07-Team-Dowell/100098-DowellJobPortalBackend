from datetime import datetime, timedelta
import json
import requests
import calendar
api_key = "1b834e07-c68b-4bf6-96dd-ab7cdc62f07f"
db_name= "Reports"
num_collections = 1

def datacube_add_collection(api_key,db_name,coll_names,num_collections):

    url = "https://datacube.uxlivinglab.online/db_api/add_collection/"

    data = {
        "api_key": api_key,
        "db_name": db_name,
        "coll_names": coll_names,
        "num_collections": num_collections,
    }

    response = requests.post(url, json=data)
    return response.text

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

def datacube_data_retrival_function(api_key,database_name,collection_name,data,limit,offset,payment):

    url = "https://datacube.uxlivinglab.online/db_api/get_data/"

    data = {
        "api_key": api_key,
        "db_name": database_name,
        "coll_name": collection_name,
        "operation": "fetch",
        "filters":data,
        "limit": limit,
        "offset": offset,
        "payment":payment
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
        iso_format = datetime.strptime(
            date, "%Y-%m-%d"
        ).strftime("%m/%d/%Y %H:%M:%S")
        return iso_format
    except Exception as e:
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
                                            date, "%d/%m/%Y  %H:%M:%S"
                                        ).strftime("%m/%d/%Y %H:%M:%S")
                                        return iso_format
                                    except Exception:
                                        return ""

def get_month_details(date):
    month_list = calendar.month_name
    months = []
    datime = datetime.strptime(set_date_format(date), "%m/%d/%Y %H:%M:%S")
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
team_management_modules = [
    "jobportal",
    "jobportal",
    "team_management_report",
    "team_management_report",
    "1201001",
    "ABCDE",
]
thread_report_module = [
    "jobportal",
    "jobportal",
    "ThreadReport",
    "ThreadReport",
    "1000981016",
    "ABCDE",
]

comment_report_module = [
    "jobportal",
    "jobportal",
    "ThreadCommentReport",
    "ThreadCommentReport",
    "1000981017",
    "ABCDE",
]

def update_report_database(task_created_date,company_id):
    field = {
            "task_created_date": task_created_date,
            "company_id": company_id
        }
    year,_monthname,_monthcnt=get_month_details(task_created_date)
    """fetch all of yesterdays tasks"""
    
    daily_tasks = json.loads(dowellconnection(*task_management_reports,"fetch",field,update_field=None))["data"]
    for _t in daily_tasks:
        field['task_id']=_t["_id"]
        tasks = json.loads(dowellconnection(*task_details_module, "fetch", field, update_field=None))
        for i,task in enumerate(tasks['data']):
            print(f"----------processing details for task {i+1}/{len(tasks['data'])}----------")
            query={"report_record_month": _monthname,
                    "report_record_year": year,
                    "db_report_type": "report"}
            coll_name = _t['task_added_by']
            print(f"----------retrieving data from collection {coll_name} for {_monthname}, {year}----------")
            get_collection = json.loads(datacube_data_retrival_function(api_key,db_name,coll_name,query,10,0, False))
            #print(get_collection,"==",coll_name)
            
            if get_collection['success']==False:
                print(f'-------collection-{coll_name} not found----------')
                print(f'-------creating collection-{coll_name} ----------')
                #inserting data collection-------------------------------------- 
                #creating collection------------------------------
                create_collection = json.loads(datacube_add_collection(api_key,db_name,coll_name,1))
                if create_collection['success']==True:
                    print(f'successfully created the collection-{coll_name}')
                    #inserting data into the collection------------------------------
                    
                    task_added = 1
                    tasks_completed =0 
                    tasks_uncompleted =0
                    if ("status" in task.keys()) and(task["status"] == "Completed" or task["status"] == "Complete" or task["status"] == "completed" or task["status"] == "complete" or task["status"] == "Mark as complete"):
                        tasks_completed=1
                    else:
                        tasks_uncompleted=1
                    percentage_tasks_completed=(tasks_completed/task_added)*100
                    tasks_approved = 0
                    if (("approved" in task.keys() and task["approved"] == True) or ("approval" in task.keys() and task["approval"] == True)):
                        tasks_approved=1

                    tasks_you_approved=0
                    tasks_you_marked_as_complete=0
                    tasks_you_marked_as_uncomplete=0
                    if (("task_approved_by" in task.keys() and task["task_approved_by"] == _t['task_added_by'])):
                        tasks_you_approved=1
                        if (tasks_completed>0):
                            tasks_you_marked_as_complete=1
                        else:
                            tasks_you_marked_as_uncomplete+=1
                    
                    '''checking for teams============================================='''
                    teams= 0
                    team_tasks=0
                    team_tasks_completed= 0
                    team_tasks_uncompleted= 0
                    percentage_team_tasks_completed= 0.0
                    team_tasks_approved= 0
                    team_tasks_issues_raised= 0
                    team_tasks_issues_resolved= 0
                    team_tasks_comments_added= 0
                    
                    for team in json.loads(dowellconnection(*team_management_modules, "fetch", {"date_created":task_created_date,'task_id':_t['_id']}, update_field=None))['data']:
                        if 'members' in team.keys():
                            if _t['task_added_by'] in team['members']:
                                teams+=1
                                if 'team_id' in task.keys():
                                    if (task['team_id']==team['_id']):    
                                        team_tasks+=1
                                        if (task["status"] == "Completed" or task["status"] == "Complete" or task["status"] == "completed" or task["status"] == "complete" or task["status"] == "Mark as complete"):
                                            team_tasks_completed+=1
                                        else:
                                            team_tasks_uncompleted+=1  
                                        percentage_team_tasks_completed =  (team_tasks_completed/team_tasks)*100
                                        if ('approved' in task.keys() and task['approved']==True):
                                            team_tasks_approved+=1
                                        for issue in json.loads(dowellconnection(*thread_report_module, "fetch", {'team_id':team['_id'],"created_date":task_created_date,'created_by':_t['task_added_by']}, update_field=None))['data']:
                                            team_tasks_issues_raised+=1
                                            if issue["current_status"]=="Resolved" or 'Resolved' in issue["previous_status"]:
                                                team_tasks_issues_resolved+=1
                                            for comment in json.loads(dowellconnection(*thread_report_module, "fetch", {"thread_id":issue['_id'],"created_date":task_created_date,'created_by':_t['task_added_by']}, update_field=None))['data']:
                                                team_tasks_comments_added+=1
                
                    data={
                        "task_added": task_added,
                        "tasks_completed": tasks_completed,
                        "tasks_uncompleted": tasks_uncompleted,
                        "tasks_approved": tasks_approved,
                        "percentage_tasks_completed": percentage_tasks_completed,
                        "tasks_you_approved": tasks_you_approved,
                        "tasks_you_marked_as_complete": tasks_you_marked_as_complete,
                        "tasks_you_marked_as_incomplete": tasks_you_marked_as_uncomplete,
                        "teams": teams,
                        "team_tasks": team_tasks,
                        "team_tasks_completed": team_tasks_completed,
                        "team_tasks_uncompleted": team_tasks_uncompleted,
                        "percentage_team_tasks_completed": percentage_team_tasks_completed,
                        "team_tasks_approved": team_tasks_approved,
                        "team_tasks_issues_raised": team_tasks_issues_raised,
                        "team_tasks_issues_resolved": team_tasks_issues_resolved,
                        "team_tasks_comments_added": team_tasks_comments_added,
                        "report_record_month": _monthname,
                        "report_record_year": year,
                        "db_report_type": "report"
                    }
                    update_data =data
                    try:
                        update_collection = json.loads(datacube_data_update(api_key,db_name,coll_name,query,update_data))
                        if update_collection['success']==True:
                            print(f"------successfully updated the data the collection- {coll_name}------")
                        else:
                            print(f"------failed to update the data the collection- {coll_name}----{update_collection['message']}")
                    except json.decoder.JSONDecodeError:
                        update_collection = json.loads(datacube_data_update(api_key,db_name,coll_name,query,update_data))
                        if update_collection['success']==True:
                            print(f"------successfully updated the data the collection- {coll_name}------")
                        else:
                            print(f"------failed to update the data the collection- {coll_name}----{update_collection['message']}")
 
                else:
                    print(create_collection)
            else:
                if len(get_collection['data']) > 0:
                    print(f'\n-------collection-{coll_name} found--------------------')
                    print(f'-------updating the collection- {coll_name}--------------')
                    task_added = get_collection['data'][0]["task_added"]+1
                    tasks_completed = get_collection['data'][0]["tasks_completed"]
                    tasks_uncompleted = get_collection['data'][0]["tasks_uncompleted"]
                    if (task["status"] == "Completed" or task["status"] == "Complete" or task["status"] == "completed" or task["status"] == "complete" or task["status"] == "Mark as complete"):
                        tasks_completed +=1
                    else:
                        tasks_uncompleted +=1
                    percentage_tasks_completed  = (tasks_completed/task_added)*100

                    tasks_approved = get_collection['data'][0]["tasks_approved"]
                    if (("approved" in task.keys() and task["approved"] == True) or ("approval" in task.keys() and task["approval"] == True)):
                        tasks_approved +=1

                    tasks_you_approved = get_collection['data'][0]["tasks_you_approved"]
                    tasks_you_marked_as_complete = get_collection['data'][0]["tasks_you_marked_as_complete"]
                    tasks_you_marked_as_uncomplete = get_collection['data'][0]["tasks_you_marked_as_incomplete"]
                        
                    if (("task_approved_by" in task.keys() and task["task_approved_by"] == _t['task_added_by'])):
                        tasks_you_approved+=1
                        if (tasks_completed>get_collection['data'][0]["tasks_completed"]):
                            tasks_you_marked_as_complete+=1
                        else:
                            tasks_you_marked_as_uncomplete+=1

                    '''checking for teams============================================='''
                    teams= get_collection['data'][0]["teams"]
                    team_tasks=get_collection['data'][0]["team_tasks"]
                    team_tasks_completed= get_collection['data'][0]["team_tasks_completed"]
                    team_tasks_uncompleted= get_collection['data'][0]["team_tasks_uncompleted"]
                    percentage_team_tasks_completed= get_collection['data'][0]["percentage_team_tasks_completed"]
                    team_tasks_approved= get_collection['data'][0]["team_tasks_approved"]
                    team_tasks_issues_raised= get_collection['data'][0]["team_tasks_issues_raised"]
                    team_tasks_issues_resolved= get_collection['data'][0]["team_tasks_issues_resolved"]
                    team_tasks_comments_added= get_collection['data'][0]["team_tasks_comments_added"]
                    
                    for team in json.loads(dowellconnection(*team_management_modules, "fetch", {"date_created":task_created_date,'task_id':_t['_id']}, update_field=None))['data']:
                        if 'members' in team.keys():
                            if _t['task_added_by'] in team['members']:
                                teams+=1
                                
                                if 'team_id' in task.keys():
                                    if (task['team_id']==team['_id']):    
                                        team_tasks+=1
                                        if (task["status"] == "Completed" or task["status"] == "Complete" or task["status"] == "completed" or task["status"] == "complete" or task["status"] == "Mark as complete"):
                                            team_tasks_completed+=1
                                        else:
                                            team_tasks_uncompleted+=1  
                                        percentage_team_tasks_completed =  (team_tasks_completed/team_tasks)*100
                                        if ('approved' in task.keys() and task['approved']==True):
                                            team_tasks_approved+=1
                                        for issue in json.loads(dowellconnection(*thread_report_module, "fetch", {'team_id':team['_id'],"created_date":task_created_date,'created_by':_t['task_added_by']}, update_field=None))['data']:
                                            team_tasks_issues_raised+=1
                                            if issue["current_status"]=="Resolved" or 'Resolved' in issue["previous_status"]:
                                                team_tasks_issues_resolved+=1
                                            for comment in json.loads(dowellconnection(*thread_report_module, "fetch", {"thread_id":issue['_id'],"created_date":task_created_date,'created_by':_t['task_added_by']}, update_field=None))['data']:
                                                team_tasks_comments_added+=1
                    
                    data={
                        "task_added": task_added,
                        "tasks_completed": tasks_completed,
                        "tasks_uncompleted": tasks_uncompleted,
                        "tasks_approved": tasks_approved,
                        "percentage_tasks_completed": percentage_tasks_completed,
                        "tasks_you_approved": tasks_you_approved,
                        "tasks_you_marked_as_complete": tasks_you_marked_as_complete,
                        "tasks_you_marked_as_incomplete": tasks_you_marked_as_uncomplete,
                        "teams": teams,
                        "team_tasks": team_tasks,
                        "team_tasks_completed": team_tasks_completed,
                        "team_tasks_uncompleted": team_tasks_uncompleted,
                        "percentage_team_tasks_completed": percentage_team_tasks_completed,
                        "team_tasks_approved": team_tasks_approved,
                        "team_tasks_issues_raised": team_tasks_issues_raised,
                        "team_tasks_issues_resolved": team_tasks_issues_resolved,
                        "team_tasks_comments_added": team_tasks_comments_added,
                        "report_record_month": _monthname, 
                        "report_record_year": year, 
                        "db_report_type": "report"
                    }
                    
                    update_data=data #'''incomplete---'''
                    update_collection = json.loads(datacube_data_update(api_key,db_name,coll_name,query,update_data))
                    if update_collection['success']==True:
                        print(f"------successfully updated the data the collection- {coll_name}------")
                    else:
                        print(f"------failed to update the data the collection- {coll_name}----{update_collection['message']}")

                else:
                    print(f'-------collection-{coll_name} is empty ------------------')
                    print(f'-------inserting data into empty collection --------------')
                    task_added = 1
                    tasks_completed =0 
                    tasks_uncompleted =0
                    if (task["status"] == "Completed" or task["status"] == "Complete" or task["status"] == "completed" or task["status"] == "complete" or task["status"] == "Mark as complete"):
                        tasks_completed=1
                    else:
                        tasks_uncompleted=1
                    percentage_tasks_completed=(tasks_completed/task_added)*100
                    tasks_approved = 0
                    if (("approved" in task.keys() and task["approved"] == True) or ("approval" in task.keys() and task["approval"] == True)):
                        tasks_approved=1

                    tasks_you_approved=0
                    tasks_you_marked_as_complete=0
                    tasks_you_marked_as_uncomplete=0
                    if (("task_approved_by" in task.keys() and task["task_approved_by"] == _t['task_added_by'])):
                        tasks_you_approved=1
                        if (tasks_completed>0):
                            tasks_you_marked_as_complete=1
                        else:
                            tasks_you_marked_as_uncomplete+=1
                    
                    '''checking for teams============================================='''
                    teams= 0
                    team_tasks=0
                    team_tasks_completed= 0
                    team_tasks_uncompleted= 0
                    percentage_team_tasks_completed= 0.0
                    team_tasks_approved= 0
                    team_tasks_issues_raised= 0
                    team_tasks_issues_resolved= 0
                    team_tasks_comments_added= 0
                    
                    for team in json.loads(dowellconnection(*team_management_modules, "fetch", {"date_created":task_created_date,'task_id':_t['_id']}, update_field=None))['data']:
                        if 'members' in team.keys():
                            if _t['task_added_by'] in team['members']:
                                teams+=1
                                if 'team_id' in task.keys():
                                    if (task['team_id']==team['_id']):    
                                        team_tasks+=1
                                        if (task["status"] == "Completed" or task["status"] == "Complete" or task["status"] == "completed" or task["status"] == "complete" or task["status"] == "Mark as complete"):
                                            team_tasks_completed+=1
                                        else:
                                            team_tasks_uncompleted+=1  
                                        percentage_team_tasks_completed =  (team_tasks_completed/team_tasks)*100
                                        if ('approved' in task.keys() and task['approved']==True):
                                            team_tasks_approved+=1
                                        for issue in json.loads(dowellconnection(*thread_report_module, "fetch", {'team_id':team['_id'],"created_date":task_created_date,'created_by':_t['task_added_by']}, update_field=None))['data']:
                                            team_tasks_issues_raised+=1
                                            if issue["current_status"]=="Resolved" or 'Resolved' in issue["previous_status"]:
                                                team_tasks_issues_resolved+=1
                                            for comment in json.loads(dowellconnection(*thread_report_module, "fetch", {"thread_id":issue['_id'],"created_date":task_created_date,'created_by':_t['task_added_by']}, update_field=None))['data']:
                                                team_tasks_comments_added+=1
                
                    data={
                        "task_added": task_added,
                        "tasks_completed": tasks_completed,
                        "tasks_uncompleted": tasks_uncompleted,
                        "tasks_approved": tasks_approved,
                        "percentage_tasks_completed": percentage_tasks_completed,
                        "tasks_you_approved": tasks_you_approved,
                        "tasks_you_marked_as_complete": tasks_you_marked_as_complete,
                        "tasks_you_marked_as_incomplete": tasks_you_marked_as_uncomplete,
                        "teams": teams,
                        "team_tasks": team_tasks,
                        "team_tasks_completed": team_tasks_completed,
                        "team_tasks_uncompleted": team_tasks_uncompleted,
                        "percentage_team_tasks_completed": percentage_team_tasks_completed,
                        "team_tasks_approved": team_tasks_approved,
                        "team_tasks_issues_raised": team_tasks_issues_raised,
                        "team_tasks_issues_resolved": team_tasks_issues_resolved,
                        "team_tasks_comments_added": team_tasks_comments_added,
                        "report_record_month": _monthname,
                        "report_record_year": year,
                        "db_report_type": "report"
                    }
                    insert_collection = json.loads(datacube_data_insertion(api_key,db_name,coll_name,data))
                    if insert_collection['success']==True:
                        print(f'successfully inserted the data into the empty collection- {coll_name}')
                        print(insert_collection)
                    else:
                        print(insert_collection)     

if __name__ == "__main__":
    company_id = "6385c0f18eca0fb652c94561"

    search_date=datetime.today().date() - timedelta(days=1) # e.g 2024-01-12
    search_date = str(search_date)

    year =2024
    month_number =1
    _, number_of_days = calendar.monthrange(year, month_number)
    _month_dates = [f"{year}-"+"{:02d}".format(month_number)+"-"+"{:02d}".format(d) for d in range(1, number_of_days + 1)]
    #print(_month_dates)
    #['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05', '2024-01-06', '2024-01-07', '2024-01-08', '2024-01-09', '2024-01-10', '2024-01-11', '2024-01-12', '2024-01-13', '2024-01-14', '2024-01-15', '2024-01-16', '2024-01-17', '2024-01-18', '2024-01-19', '2024-01-20', '2024-01-21', '2024-01-22', '2024-01-23', '2024-01-24', '2024-01-25', '2024-01-26', '2024-01-27', '2024-01-28', '2024-01-29', '2024-01-30', '2024-01-31']
    """first week of jan 2024-----------------------------"""
    print("---first week of jan 2024-----------------------------")
    
    for day in _month_dates:
        if day == "2024-01-08":
            break
        else:
            print(f"---------updating for {day}------------------")
            update_report_database(search_date,company_id)
            print(f"---------successfully updated for {day}------")