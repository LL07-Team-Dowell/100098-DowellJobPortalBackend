from datetime import datetime, timedelta
import json
import requests

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
   
task_details_module = [
    "jobportal",
    "jobportal",
    "task_details",
    "task_details",
    "1000981019",
    "ABCDE",
]
time_detail_module = [
    "jobportal",
    "jobportal",
    "ProjectTarget",
    "ProjectTarget",
    "1248001",
    "ABCDE",
]

def get_project_details():
    url = "https://100098.pythonanywhere.com/project_deadline/?type=get_project_hours_details&company_id=ABCD12345"
    url = "https://100098.pythonanywhere.com/get_all_project_task_time/?company_id=63a2b3fb2be81449d3a30d3f"
    response = requests.get(url)
    data = response.json()

    project_details = []
    
    if data['success'] and 'response' in data:
        for item in data['response']:
            _id = item['_id']
            project_name = item['project']
            total_time = item['total_time']
            lead_name = item["lead_name"]
            project_details.append({"_id": _id, "project_name": project_name, "total_time": total_time,"lead_name":lead_name})
    
    for project in project_details:
        project_name = project.get('project_name')
        task_field = {
            "project": project_name,
            "company_id": "6385c0f18eca0fb652c94561"
        }
        task_response = json.loads(
            dowellconnection(*task_details_module, "fetch", task_field, update_field=None)
        )

        total_duration = timedelta()

        for task in task_response["data"]:
            start_time_str = task["start_time"]
            end_time_str = task["end_time"]

            start_time = datetime.strptime(start_time_str, "%H:%M")
            end_time = datetime.strptime(end_time_str, "%H:%M")

            task_duration = end_time - start_time
            total_duration += task_duration

        total_duration_str = str(total_duration)

        update_field = {
            "project": project_name,
            "company_id": "6385c0f18eca0fb652c94561",
            "total_time": total_time,
            "lead_name": lead_name,
            "enable_modification": False,
            "left_time": total_time.total_seconds() - total_duration.total_seconds()
        }
        response = json.loads(
            dowellconnection(*time_detail_module, "update", field=None, update_field=update_field)
        )

        return total_duration_str