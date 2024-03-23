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

"""updating the task details"""
def update_project_details(company_id,_date):
    print("------------checking paramaters------------")
    if not _date:
        print("------------date is required------------")
        return {'success': False,'message': 'date is required'}
    if not company_id:
        print("------------company id is required------------")
        return {'success': False,'message': 'company id is required'}
    
    res=[]
    item={}
    
    _date = datetime.strptime(_date, "%Y-%m-%d").date()
    task_created_date=str(_date)
    print(f"---the date is {_date}------",task_created_date)
    if _date >= datetime.today().date():
        print(f"------------date should be less than today------------")
        return {'success': False,'message': 'date should be less than today'}
    
    field={"company_id":company_id, "task_created_date":task_created_date}
    tasks = json.loads(dowellconnection(*task_details_module, "fetch", field, update_field=None))
    
    if (tasks['isSuccess'] == True):
        print("tasks exists, processing projects details-------------------",len(tasks['data']))
        for i,task in enumerate(tasks['data']):
            print(f"----------processing details for task {i+1}/{len(tasks['data'])} by {task['project']+'-('+task['subproject']})----------")
            if 'task_id' in task.keys():
                c=json.loads(dowellconnection(*task_management_reports, "fetch", {"task_created_date":task_created_date, "_id":task["task_id"]}, update_field=None))['data']
                if len(c) > 0:
                    candidate=c[0]['task_added_by']
                else:
                    candidate='None'
            if ('project' in task.keys() and 'subproject' in task.keys() ):
                """print(t,"======")"""
                try:
                    start_time = datetime.strptime(task['start_time'], "%H:%M")
                    end_time = datetime.strptime(task['end_time'], "%H:%M")
                except Exception:
                    start_time = datetime.strptime(task['start_time'], "%H:%M:%S")
                    end_time = datetime.strptime(task['end_time'], "%H:%M:%S")
                time_difference = (end_time - start_time).total_seconds()
                work_hours = time_difference / 3600
                if task['project'] not in item.keys():
                    item[task['project']] = {"total time (hrs)":0, "total tasks":0, "subprojects":{}}
                if "total time (hrs)" not in item[task['project']].keys():
                    item[task['project']]["total time (hrs)"] = work_hours
                else:
                    item[task['project']]["total time (hrs)"] += work_hours
                if "total tasks" not in item[task['project']].keys():
                    item[task['project']]["total tasks"] = 1
                else:
                    item[task['project']]["total tasks"] += 1
                if "subprojects" not in item[task['project']].keys():
                    item[task['project']]["subprojects"] = {}
                
                if task['subproject'] not in item[task['project']]['subprojects'].keys():
                    item[task['project']]['subprojects'][task['subproject']] = {}
                
                if "time added (hrs)" not in item[task['project']]['subprojects'][task['subproject']].keys():
                    item[task['project']]['subprojects'][task['subproject']]['time added (hrs)'] = work_hours
                else:
                    item[task['project']]['subprojects'][task['subproject']]['time added (hrs)'] += work_hours
                
                if "total_tasks" not in item[task['project']]['subprojects'][task['subproject']].keys():
                    item[task['project']]['subprojects'][task['subproject']]['total_tasks'] = 1
                else:
                    item[task['project']]['subprojects'][task['subproject']]['total_tasks'] += 1
                if "candidates" not in item[task['project']]['subprojects'][task['subproject']].keys():
                    item[task['project']]['subprojects'][task['subproject']]['candidates'] = {}
                if candidate not in item[task['project']]['subprojects'][task['subproject']]['candidates'].keys():
                    item[task['project']]['subprojects'][task['subproject']]['candidates'][candidate]={'time added (hrs)':0,'total_tasks':0}
                
                if "time added (hrs)" not in item[task['project']]['subprojects'][task['subproject']]['candidates'][candidate].keys():
                    item[task['project']]['subprojects'][task['subproject']]['candidates'][candidate]['time added (hrs)'] = work_hours
                else:
                    item[task['project']]['subprojects'][task['subproject']]['candidates'][candidate]['time added (hrs)'] += work_hours
                
                if "total_tasks" not in item[task['project']]['subprojects'][task['subproject']]['candidates'][candidate].keys():
                    item[task['project']]['subprojects'][task['subproject']]['candidates'][candidate]['total_tasks'] = 1
                else:
                    item[task['project']]['subprojects'][task['subproject']]['candidates'][candidate]['total_tasks'] += 1
                
        for k,v in item.items(): 
            _d = {
                "project":k,
                "total time (hrs)":v["total time (hrs)"] if 'total time (hrs)' in v.keys() else 0,
                "total tasks":v["total tasks"] if 'total tasks' in v.keys() else 0,
                "subprojects":[]
            }
            for k1,v1 in v["subprojects"].items():
                _d1 = {
                    "subproject":k1,
                    "time added (hrs)":v1["time added (hrs)"] if 'time added (hrs)' in v1.keys() else 0,
                    "total_tasks":v1["total_tasks"] if 'total_tasks' in v1.keys() else 0,
                    "candidates":[]
                }
                if 'candidates' in v1.keys():
                    for k2, v2 in v1['candidates'].items():
                        _d2 ={
                            "candidate":k2,
                            "time added (hrs)":v2["time added (hrs)"] if "time added (hrs)" in v2.keys() else 0,
                            "total_tasks": v2['total_tasks'] if 'total_tasks' in v2.keys() else 0
                        }
                        _d1['candidates'].append(_d2)
                _d["subprojects"].append(_d1)
            res.append(_d)
        
        api_key = "1b834e07-c68b-4bf6-96dd-ab7cdc62f07f"
        db_name= "Project_Details"
        coll_name=f"{_date.year}-{_date.month}-{_date.day}"
        data={"date":task_created_date, 'company_id':company_id, "data":res}
        response = json.loads(datacube_add_collection(api_key,db_name,coll_name,1))
        if response['success']==True:
            print(f'successfully created the collection-{coll_name}-------------')
            #inserting data into the collection------------------------------
            
            response = json.loads(datacube_data_insertion(api_key,db_name,coll_name,data))
            if response['success']==True:
                print(f'successfully inserted the data the collection-{coll_name}---------------')
                return {
                        "success": True,
                        'message': f'successfully inserted the data the collection-{coll_name}',
                        "data": data,
                    }
        elif response['message'] == f"Collection `{coll_name}` already exists in Database 'Project_Details'":
            query={"company_id":company_id, "date":f"{_date.year}-{_date.month}-{_date.day}"}
            update_data=data
            response =json.loads(datacube_data_update(api_key,db_name,coll_name, query,update_data))
            if response['success']==True:
                print(f'successfully updated the data the collection-{coll_name}---------------')
                return {
                        "success": True,
                        'message': f'successfully updated the data the collection-{coll_name}',
                        "data": data,
                    }
        else:
            print(f"error in inserting the data -> {response['message']}--------------------")
            return {"success": False, "message": response['message']}
    
def main():
    print("-----------------------------------")
    print("----------Process started----------")

    company_id='6385c0f18eca0fb652c94561'
    _date = datetime.today().date()-timedelta(days=1)
    _date = _date.strftime("%Y-%m-%d")

    """project details"""
    response =update_project_details(company_id=company_id,_date=_date)
    print("\n")
    print("----------Process done-------------")
    print("-----------------------------------")
      
if __name__ == "__main__":
    ##call main-----
    main()