import requests
from datetime import datetime, timedelta, date
import json
import threading
from .helper import set_date_format, dowellconnection
from .constant import task_details_module, task_management_reports


def get_projects_spent_total_time(company_id, search_date):
    datetime_obj = datetime.strptime(search_date, '%Y-%m-%d')

    start_date = datetime_obj.date() 
    end_date = start_date + timedelta(days=1)#-----the start date minus 7 days ago which is the upper monday

    data={}
    task_field = {
        "company_id":company_id
    }
    task_details = json.loads(dowellconnection(*task_details_module, "fetch", task_field, update_field=None))["data"]
    for task in task_details:
        if "task_created_date" in task.keys() and set_date_format(task["task_created_date"]) != "":
            if str(start_date) in task["task_created_date"]:
                try:
                    task_created_date = datetime.strptime(set_date_format(task["task_created_date"]), "%m/%d/%Y %H:%M:%S").date()
                    #print(task_created_date,start_date, end_date)                   
                    if task_created_date >= start_date and task_created_date <= end_date:                     
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
                except ValueError:
                    pass
    print("total hours used by each projects\n",data)
    return data

def main():

    #get time spent------------------------------
    company_id = "6385c0f18eca0fb652c94561"
    search_date='2023-11-14'
    get_projects_spent_total_time(company_id, search_date=search_date)

    #get total project time------------------------------
    #get_projects_time()
if __name__ == "__main__":
    ##call main-----
    main()
