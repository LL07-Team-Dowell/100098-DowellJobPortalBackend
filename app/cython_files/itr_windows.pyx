import json, calendar, requests
from datetime import datetime, timedelta

task_details_module = [
    "jobportal",
    "jobportal",
    "task_details",
    "task_details",
    "1000981019",
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
team_management_modules = [
    "jobportal",
    "jobportal",
    "team_management_report",
    "team_management_report",
    "1201001",
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

def get_month_details(date):
    month_list = calendar.month_name
    months = []
    datime = datetime.strptime(set_date_format(date), "%m/%d/%Y %H:%M:%S")
    month_name = month_list[datime.month]

    months.append(month_name)

    return (str(datime.year), month_name, months.count(month_name))

def itr_function(user_id,username, company_id, year):
        # Initialize the data dictionary
        data = {'tasks_details': {}}

        # Iterate over the months
        for month in list(calendar.month_name)[1:]:
            # Initialize data for the month
            data['tasks_details'][month] = {
                "task_added": 0,
                "tasks_completed": 0,
                "tasks_uncompleted": 0,
                "tasks_approved": 0,
                "percentage_tasks_completed": 0.0,
                "tasks_you_approved": 0,
                "tasks_you_marked_as_complete": 0,
                "tasks_you_marked_as_incomplete": 0,
                "teams": 0,
                "issues_raised": 0,
                "issues_resolved": 0,   
                "comments_added": 0,
            }
        
        field = {"user_id": user_id, "company_id": company_id}
        """task_management = json.loads(dowellconnection(
            *task_management_reports, "fetch", field, update_field=None
        ))["data"]
        print(task_management)"""
        task_details = json.loads(dowellconnection(
            *task_details_module, "fetch", field, update_field=None
        ))["data"]
        today = datetime.today()
        st = today - timedelta(days=today.weekday())
        
        start = datetime.strptime(str(st), "%Y-%m-%d %H:%M:%S.%f")
        end = datetime.strptime(str(st + timedelta(days=6)), "%Y-%m-%d %H:%M:%S.%f")

        projects={}
        week_details,total_tasks_last_one_day,total_tasks_last_one_week = [],[],[]
        task_added=0
        tasks_completed =0
        tasks_uncompleted=0
        tasks_you_approved=0
        tasks_you_marked_as_complete=0
        tasks_you_marked_as_incomplete=0
        for task in task_details:
            if "task_created_date" in task.keys():
                task_created_date = datetime.strptime(set_date_format(task["task_created_date"]), "%m/%d/%Y %H:%M:%S")
                _year, month, mcnt = get_month_details(task["task_created_date"])
                if _year == year:
                    task_added+=1
                    complete =["Completed","completed", 'Complete', 'complete', True, "true", "True"]
                    if (("status" in task.keys() and task['status'] in complete ) or (("completed" in task.keys() and task["completed"] in complete ) or ("Completed" in task.keys() and task["Completed"] in complete ) or ("Complete" in task.keys() and task["Complete"] in complete ) or("complete" in task.keys() and task["complete"] in complete )) ):
                        tasks_completed+=1
                        if ("approved_by" in task.keys() and task["approved_by"]==username):
                            tasks_you_approved+=1
                            tasks_you_marked_as_complete+=1
                    else:
                        tasks_uncompleted+=1
                        if ("approved_by" in task.keys() and task["approved_by"]==username):
                            tasks_you_approved+=1
                            tasks_you_marked_as_incomplete+=1
                    #incomplete=["Incomplete", "incomplete", 'Incompleted', 'incompleted']
                        
                    
                    data["tasks_details"][month]["task_added"] =task_added
                    data['tasks_details'][month]["tasks_completed"]= tasks_completed
                    data['tasks_details'][month]["tasks_uncompleted"]= tasks_uncompleted
                    data['tasks_details'][month]["tasks_approved"]+= 1 if ("approved" in task.keys() and task['approved']==True) else 0
                    data["tasks_details"][month]["percentage_tasks_completed"]=(tasks_completed/task_added)*100
                    data["tasks_details"][month]["tasks_you_approved"] = tasks_you_approved
                    data["tasks_details"][month]["tasks_you_marked_as_complete"] = tasks_you_marked_as_complete
                    data["tasks_details"][month]["tasks_you_marked_as_incomplete"] = tasks_you_marked_as_incomplete
                    if task_created_date >= start and task_created_date <= end:
                        week_details.append(task["project"])

                    if task_created_date >= today - timedelta(days=1):
                        total_tasks_last_one_day.append(task["project"])

                    if task_created_date >= today - timedelta(days=7):
                        total_tasks_last_one_week.append(task["project"])
                    start_time = datetime.strptime(task["start_time"], "%H:%M") if len(task["start_time"]) == 5 else datetime.strptime(task["start_time"], "%H:%M:%S")
                    end_time = datetime.strptime(task["end_time"], "%H:%M") if len(task["end_time"]) == 5 else datetime.strptime(task["end_time"], "%H:%M:%S")
                    duration = end_time - start_time
                    dur_secs = (duration).total_seconds()
                    dur_mins = dur_secs / 60
                    dur_hrs = dur_mins / 60

                    if 'subproject' in task.keys():
                        subproject = task['subproject']
                    else:
                        subproject = "None"
                    
                    if task["project"] not in projects:
                        projects[task["project"]] = {
                            'project': task["project"], 
                            'subprojects': {subproject: 1}, 
                            'total_hours': dur_hrs, 
                            'total_min': dur_mins, 
                            'total_secs': dur_secs, 
                            'tasks_uploaded_this_week': week_details.count(task["project"]), 
                            'total_tasks_last_one_day': total_tasks_last_one_day.count(task["project"]), 
                            'total_tasks_last_one_week': total_tasks_last_one_week.count(task["project"]),
                            'total_tasks': 1, 
                            'tasks': [task]}
                    else:
                        projects[task["project"]]['subprojects'][subproject] = projects[task["project"]]['subprojects'].get(subproject, 0) + 1
                        projects[task["project"]]['total_hours'] += dur_hrs
                        projects[task["project"]]['total_min'] += dur_mins
                        projects[task["project"]]['total_secs'] += dur_secs
                        projects[task["project"]]['tasks_uploaded_this_week'] = week_details.count(task["project"])
                        projects[task["project"]]['total_tasks_last_one_day'] = total_tasks_last_one_day.count(task["project"])
                        projects[task["project"]]['total_tasks_last_one_week'] = total_tasks_last_one_week.count(task["project"])
                        projects[task["project"]]['total_tasks'] += 1
                        projects[task["project"]]['tasks'].append(task)
                        
        data['task_report'] = [i for i in projects.values()]
        return data
