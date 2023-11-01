import requests
from datetime import datetime, timedelta
import json
import threading

Product_Services = [
    "api_key", 
    "api_key", 
    "ProductServices",
    "ProductServices", 
    "100105004", 
    "ABCDE"
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

REMOVAL_MAIL = """
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;300;400;500;600&display=swap"
      rel="stylesheet"
    />
    <title>Issue Update</title>
  </head>
  <body
    {},{}
    </div>
  </body>
</html>
"""

def send_mail_func(toname, toemail, subject, email_content):
    url = "https://100085.pythonanywhere.com/api/email/"
    payload = {
        "toname": toname,
        "toemail": toemail,
        "subject": subject,
        "email_content": email_content,
    }
    response = requests.post(url, json=payload)
    return response.text


def thread_mail(applicant_name, applicant_email):
    def send_mail(*args):
        print("sent thread for--"*args)
        #d = send_mail_func(*args)

    email_content = REMOVAL_MAIL.format(
        applicant_name, applicant_email
    )
    send_mail_thread = threading.Thread(
        target=send_mail,
        args=(
            applicant_name,
            applicant_email,
            "Notification.",
            email_content,
        ),
    )
    send_mail_thread.start()
    send_mail_thread.join()


def fetch_from_db(candidates_url, company_id, start_date, end_date):
    response = requests.get(candidates_url)
    settings_response = requests.get("https://100098.pythonanywhere.com/settinguserprofileinfo/").json()
    details={
        "num_of_candidates":0,
        "total_details":{}
    }
    if "response" in response.json():
        if "data" in response.json()["response"]:
            data = response.json()["response"]["data"]
            details["num_of_candidates"]=len(data)
            #print(data,"===")
            #----get user data-----------------------------------------------------------------
            total_details ={}  
            for candidate in data[0:20]:
                username = candidate["username"]
                applicant_name = candidate["applicant"]
                applicant_email = candidate["applicant_email"]
                portfolio_name = candidate["portfolio_name"]
                total_details[username]={"tasks":0,"total_hours":0.0,"status":"defaulter"}

                #getting tasks and time for each candidate--------------------------------------------------------------------

                daily_tasks = json.loads(dowellconnection(*task_management_reports,"fetch",field={"task_added_by": username},update_field=None))["data"]
                for t in daily_tasks:
                    task_details = json.loads(dowellconnection(*task_details_module, "fetch", {"task_id":t["_id"]}, update_field=None))["data"]
                    for task in task_details:
                        if "task_created_date" in task.keys() and set_date_format(task["task_created_date"]) != "":
                            try:
                                task_created_date = datetime.strptime(set_date_format(task["task_created_date"]), "%m/%d/%Y %H:%M:%S")
                                
                                print("running ...",username,"..",total_details[username]["tasks"])
                                if task_created_date >= start_date and task_created_date <= end_date:
                                    total_details[username]["tasks"]+=1
                                    print(total_details[username]["tasks"])
                                    if "start_time" in task.keys() and "end_time" in task.keys():
                                        try:
                                            start_time = datetime.strptime(task["start_time"], "%H:%M")
                                        except ValueError:
                                            start_time = datetime.strptime(task["start_time"], "%H:%M:%S"
                                            )
                                        try:
                                            end_time = datetime.strptime(task["end_time"], "%H:%M")
                                        except ValueError:
                                            end_time = datetime.strptime(task["end_time"], "%H:%M:%S")
                                        duration = end_time - start_time
                                        dur_secs = (duration).total_seconds()
                                        dur_mins = dur_secs / 60
                                        dur_hrs = dur_mins / 60
                                        
                                        total_details[username]["total_hours"]+= dur_hrs
                            except ValueError:
                                pass

                teamleads=[]
                groupleads=[]
                freelancers=[]
                for _sett in settings_response:
                    for info in _sett["profile_info"]:
                        if "profile_title" in info.keys() and "Role" in info.keys():
                            if info["Role"] == "Proj_Lead":
                                teamleads.append(info["profile_title"])
                            if info["Role"] =="group_lead":
                                groupleads.append(info["profile_title"])
                        else: 
                            freelancers.append(portfolio_name)
                if portfolio_name in teamleads:
                    print(portfolio_name,"========================")
                    if total_details[username]["tasks"]>=80 and total_details[username]["total_hours"]>=40:
                        total_details[username]["status"]="passed"
                    else:
                        pass
                        #thread_mail(applicant_name, applicant_email)#send email--------------
                if portfolio_name in groupleads:
                    if total_details[username]["tasks"]>=160 and total_details[username]["total_hours"]>=40:
                        total_details[username]["status"]="passed"
                    else:
                        pass
                        #thread_mail(applicant_name, applicant_email)#send email-------------
                
                if portfolio_name in freelancers:
                    if total_details[username]["tasks"]>=80 and total_details[username]["total_hours"]>=20:
                        total_details[username]["status"]="passed"
                    else:
                        pass
                        #thread_mail(applicant_name, applicant_email)#send email-------------
                
            details["total_details"]=total_details

    print(details)##this prints out the result

def main():
    
    
    today = datetime.today()
    start_date = today - timedelta(days=today.weekday())-timedelta(days=1)#the date of the day the script will be run-----sundays
    #timedelta(days=today.weekday())    ----> monday
    #timedelta(days=today.weekday())-timedelta(days=1)  ---> sunday
    #print(start_date,"===============")

    end_date = start_date - timedelta(days=6)#-----the start date minus 7 days ago which is the upper monday
    #print(end_date,"===============")
    company_id = "6385c0f18eca0fb652c94561"
    url = f"https://100098.pythonanywhere.com/get_all_onboarded_candidate/{company_id}/"

    fetch_from_db(url, company_id, start_date, end_date)
if __name__ == "__main__":
    ##call main-----
    main()