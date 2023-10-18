from datetime import datetime, timedelta
import json
from app.helper import dowellconnection
from .constant import *

def get_total_time(project_name,company_id):
    task_field = {
        "project": project_name,
        "company_id":company_id
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

    return total_duration_str