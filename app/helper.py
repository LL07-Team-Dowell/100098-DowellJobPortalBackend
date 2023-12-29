import json
import requests
import pprint
import os
import bson
import calendar
from datetime import datetime, timedelta
import datetime
import base64
from rest_framework.response import Response
from rest_framework import status
from discord.ext import commands
from discord import Intents
from .constant import *
from .models import MonthlyTaskData, PersonalInfo, TaskReportdata


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

def get_event_id():
    url = "https://uxlivinglab.pythonanywhere.com/create_event"

    data = {
        "platformcode": "FB",
        "citycode": "101",
        "daycode": "0",
        "dbcode": "pfm",
        "ip_address": "192.168.0.41",  # get from dowell track my ip function
        "login_id": "lav",  # get from login function
        "session_id": "new",  # get from login function
        "processcode": "1",
        "location": "22446576",  # get from dowell track my ip function
        "objectcode": "1",
        "instancecode": "100051",
        "context": "afdafa ",
        "document_id": "3004",
        "rules": "some rules",
        "status": "work",
        "data_type": "learn",
        "purpose_of_usage": "add",
        "colour": "color value",
        "hashtags": "hash tag alue",
        "mentions": "mentions value",
        "emojis": "emojis",
        "bookmarks": "a book marks",
    }

    r = requests.post(url, json=data)

    if r.status_code == 201:
        # print("r->", r.text,json.loads(r.text))
        return json.loads(r.text)
    else:
        # print("r---->", r.text,json.loads(r.text))
        return json.loads(r.text)["error"]

### for notification api----------------------------
def call_notification(url, request_type, data):  ## calling  notification api
    if request_type == "post":
        notification = requests.post(url, data)
        details = notification.json()
        return details
    elif request_type == "get":
        notification = requests.get(url)
        details = notification.json()
        return details
    elif request_type == "patch":
        notification = requests.patch(url, data)
        details = notification.json()
        return details


### for settings api----------------------------
def update_number(string):
    updated_string = ""
    for char in string:
        if char.isdigit():
            updated_string += f"C{str(int(char) + 1)}"
    return updated_string


def update_string(string):
    new_str = ""
    for char in string:
        if char == "C":
            new_str = string.replace("C", "O")
    return new_str


### calling the discord api----------------------------
# generate discord invite link
def discord_invite(server_owner_ids, guild_id, token):
    invite_link = []
    client = commands.Bot(
        command_prefix="?", owner_ids=server_owner_ids, intents=Intents.default()
    )
    # print("running bot...")

    # Close the bot
    @client.command()
    @commands.is_owner()
    async def shutdown(context):
        # print("bot is shut down")
        await context.close()

    @client.event
    async def on_ready():  # gets the invite link when the bot is ready
        # print("bot is ready...")
        discord_link = await client.get_guild(guild_id).text_channels[0].create_invite()
        # print(discord_link, "==============")
        invite_link.append(discord_link)
        await shutdown(client)

    # with open(os.getcwd()+"/app/token", "r", encoding="utf-8") as t:
    #    token = t.read()
    # token file is the token for the bot created
    client.run(token=token)
    return invite_link
    # get the channels in the server


def get_guild_channels(guildid, token):
    """with open(os.getcwd()+"/app/token", "r", encoding="utf-8") as t:
    token = t.read()"""
    headers = {"Content-Type": "application/json", "authorization": f"Bot {token}"}
    url = f"https://discord.com/api/v9/guilds/{guildid}/channels"  # /{userid}"
    response = requests.request("GET", url=url, headers=headers)
    res = json.loads(response.text)
    return res


def get_guild_members(guildid, token):
    """with open(os.getcwd()+"/app/token", "r", encoding="utf-8") as t:
    token = t.read()"""
    headers = {"Content-Type": "application/json", "authorization": f"Bot {token}"}
    url = f"https://discord.com/api/v9/guilds/{guildid}/members"
    response = requests.request("GET", url=url, headers=headers)
    res = json.loads(response.text)

    return res


def create_master_link(company_id, links, job_name):
    url = "https://www.qrcodereviews.uxlivinglab.online/api/v3/qr-code/"

    payload = {
        "qrcode_type": "Link",
        "quantity": 1,
        "company_id": company_id,
        "links": links,
        "document_name": job_name,
    }
    response = requests.post(url, json=payload)

    return response.text


def send_mail(toname, toemail, subject, job_role, link):
    url = "https://100085.pythonanywhere.com/api/hr-invitation/"
    payload = {
        "toname": toname,
        "toemail": toemail,
        "subject": subject,
        "job_role": job_role,
        "link": link,
    }
    response = requests.post(url, json=payload)
    return response.text


def interview_email(toname, toemail, subject, email_content):
    url = "https://100085.pythonanywhere.com/api/email/"
    payload = {
        "toname": toname,
        "toemail": toemail,
        "subject": subject,
        "email_content": email_content,
    }
    response = requests.post(url, json=payload)
    return response.text


def set_finalize(linkid):
    # print(linkid)
    url = f"https://www.qrcodereviews.uxlivinglab.online/api/v3/masterlink/?link_id={linkid}"
    payload = {
        "is_finalized": True,
    }
    response = requests.put(url, json=payload)
    # print(response)
    # print(response.text)
    return response.text


def save_image(image):
    url = "https://dowellfileuploader.uxlivinglab.online/uploadfiles/upload-hr-image/"
    payload = {"image": image}  # Read the binary data from the file object
    # print(payload)
    response = requests.post(url, files=payload)  # Use 'files' instead of 'json'
    # print(response.text)
    return response.text


def period_check(start_dt, end_dt, data_list, key):
    start_date = datetime.datetime.strptime(start_dt, "%m/%d/%Y %H:%M:%S")
    end_date = datetime.datetime.strptime(end_dt, "%m/%d/%Y %H:%M:%S")
    items = []
    items_ids = []

    for l in data_list:
        if key == "_id":
            items.append(l)
            items_ids.append(l["_id"])
        else:
            try:
                custom_time = datetime.datetime.strptime(l[key], "%Y-%m-%d %H:%M:%S.%f")
                if custom_time >= start_date and custom_time <= end_date:
                    items.append(l)
                    items_ids.append(l["_id"])
            except Exception:
                try:
                    custom_time = datetime.datetime.strptime(
                        l[key], "%Y-%m-%d %H:%M:%S.%fZ"
                    )
                    if custom_time >= start_date and custom_time <= end_date:
                        items.append(l)
                        items_ids.append(l["_id"])
                except Exception:
                    try:
                        custom_time = datetime.datetime.strptime(
                            l[key], "%Y-%m-%dT%H:%M:%S.%fZ"
                        )
                        if custom_time >= start_date and custom_time <= end_date:
                            items.append(l)
                            items_ids.append(l["_id"])
                    except Exception:
                        try:
                            custom_time = datetime.datetime.strptime(l[key], "%m/%d/%Y")
                            if custom_time >= start_date and custom_time <= end_date:
                                items.append(l)
                                items_ids.append(l["_id"])
                        except Exception:
                            try:
                                date_string = (
                                    l[key]
                                    .replace("(West Africa Standard Time)", "")
                                    .rstrip()
                                )
                                date_object = datetime.datetime.strptime(
                                    date_string, "%a %b %d %Y %H:%M:%S %Z%z"
                                ).strftime("%m/%d/%Y %H:%M:%S")
                                custom_time = datetime.datetime.strptime(
                                    date_object, "%m/%d/%Y %H:%M:%S"
                                )
                                if (
                                    custom_time >= start_date
                                    and custom_time <= end_date
                                ):
                                    items.append(l)
                                    items_ids.append(l["_id"])
                            except Exception:
                                try:
                                    custom_time = datetime.datetime.strptime(
                                        l[key], "%m/%d/%Y %H:%M:%S"
                                    )
                                    if (
                                        custom_time >= start_date
                                        and custom_time <= end_date
                                    ):
                                        items.append(l)
                                        items_ids.append(l["_id"])
                                except Exception:
                                    try:
                                        custom_time = datetime.datetime.strptime(
                                            l[key], "%Y-%m-%d"
                                        )
                                        if (
                                            custom_time >= start_date
                                            and custom_time <= end_date
                                        ):
                                            items.append(l)
                                            items_ids.append(l["_id"])
                                    except Exception:
                                        try:
                                            custom_time = datetime.datetime.strptime(
                                                l[key], "%d/%m/%Y"
                                            )
                                            if (
                                                custom_time >= start_date
                                                and custom_time <= end_date
                                            ):
                                                items.append(l)
                                                items_ids.append(l["_id"])
                                        except Exception:
                                            pass
    return items, len(items), items_ids, len(items_ids)

def valid_period(start_dt, end_dt):
    start_date = datetime.datetime.strptime(start_dt, "%m/%d/%Y %H:%M:%S")
    end_date = datetime.datetime.strptime(end_dt, "%m/%d/%Y %H:%M:%S")
    if end_date > start_date:
        return True
    else:
        return False

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

def targeted_population(
    database, collection, fields, period, column_name, start_point, end_point
):
    url = "https://100032.pythonanywhere.com/api/targeted_population/"

    database_details = {
        "database_name": "mongodb",
        "collection": collection,
        "database": database,
        "fields": fields,
    }
    # number of variables for sampling rule
    number_of_variables = 1
    """
        period can be 'custom' or 'last_1_day' or 'last_30_days' or 'last_90_days' or 'last_180_days' or 'last_1_year' or 'life_time'
        if custom is given then need to specify start_point and end_point
        for others datatpe 'm_or_A_selction' can be 'maximum_point' or 'population_average'
        the the value of that selection in 'm_or_A_value'
        error is the error allowed in percentage
    """
    time_input = {
        "period": period,
        "start_point": start_point,
        "end_point": end_point,
        "split": "week",
        "time_type_in_db": "iso",  # iso|eventID|dowell_time
        "column_name": column_name,  # eg'created_on','application_submitted_on','eventId', etc
    }

    stage_input_list = []

    distribution_input = {"normal": 1, "poisson": 0, "binomial": 0, "bernoulli": 0}

    request_data = {
        "database_details": database_details,
        "distribution_input": distribution_input,
        "number_of_variable": number_of_variables,
        "stages": stage_input_list,
        "time_input": time_input,
    }

    headers = {"content-type": "application/json"}

    response = requests.post(url, json=request_data, headers=headers)
    return response.text

class CustomValidationError(Exception):
    pass

def validate_and_generate_times(
    task_type, task_created_date, start_time=None, end_time=None
):
    date_format = "%m/%d/%Y %H:%M:%S"
    if task_type == "Day":
        start_time_dt = datetime.datetime.strptime(task_created_date, date_format)
        end_time_dt = start_time_dt + timedelta(days=1)
    elif task_type == "Custom":
        if start_time is None or end_time is None:
            raise CustomValidationError(
                "For custom task_type, both start_time and end_time are required."
            )

        start_time_dt = datetime.datetime.strptime(start_time, date_format)
        end_time_dt = datetime.datetime.strptime(end_time, date_format)

        if end_time_dt > start_time_dt + timedelta(minutes=15):
            raise CustomValidationError(
                "For custom task_type, end_time must be within 15 minutes of start_time."
            )
    else:
        raise CustomValidationError(
            "Invalid task_type. Please provide a valid task_type."
        )

    return start_time_dt.strftime(date_format), end_time_dt.strftime(date_format)

def update_task_status(self, current_task_id, is_active):
    field = {"_id": current_task_id}
    update_field = {"is_active": is_active}
    response = json.loads(
        dowellconnection(*task_details_module, "update", field, update_field)
    )
    return response.get("isSuccess", False)

def validate_id(id):
    try:
        if bson.objectid.ObjectId.is_valid(id):
            return True
        else:
            return None
    except:
        return None

def get_positions(serializer_data):
    teamleads = []
    accountleads =[]
    hrs=[]
    subadmins=[]
    groupleads=[]
    superadmins=[]
    candidates=[]
    viewers=[]
    projectlead=[]
    leaders=[]
    for user in serializer_data:
        for d in user["profile_info"]:
            if "profile_title" in d.keys():
                leaders.append(d["profile_title"])
                if "Role" in d.keys():
                    if d["Role"] == "Proj_Lead":
                        teamleads.append(d["profile_title"])
                    if d["Role"] == "Dept_Lead":
                        accountleads.append(d["profile_title"])
                    if d["Role"] == "Hr":
                        hrs.append(d["profile_title"])
                    if d["Role"] == "sub_admin":
                        subadmins.append(d["profile_title"])
                    if d["Role"] == "group_lead":
                        groupleads.append(d["profile_title"])
                    if d["Role"] == "super_admin":
                        superadmins.append(d["profile_title"])
                    if d["Role"] == "candidate":
                        candidates.append(d["profile_title"])
                    if d["Role"] == "Project_Lead":
                        projectlead.append(d["profile_title"])
                    if d["Role"] == "Viewer":
                        viewers.append(d["profile_title"])
    positions={
        "leaders":leaders,
        "teamleads":teamleads,
        "accountleads":accountleads,
        "hrs":hrs,
        "subadmins":subadmins,
        "groupleads":groupleads,
        "superadmins":superadmins,
        "candidates":candidates,
        "projectlead":projectlead,
        "viewers":viewers
    }
    return positions
def get_month_details(date):
    month_list = calendar.month_name
    months = []
    datime = datetime.datetime.strptime(set_date_format(date), "%m/%d/%Y %H:%M:%S")
    month_name = month_list[datime.month]

    months.append(month_name)

    return (str(datime.year),month_name,months.count(month_name))

def datacube_data_insertion(api_key,database_name,collection_name,data):
    url = "https://datacube.uxlivinglab.online/db_api/crud/"

    data = {
        "api_key": api_key,
        "db_name": database_name,
        "coll_name": collection_name,
        "operation": "insert",
        "data":data
    }
    print(data)
    response = requests.post(url, json=data)
    print(response.text)
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
    print(response.text)
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

def samanta_content_evaluator(api_key,title,description):
    url=f"https://100085.pythonanywhere.com/uxlivinglab/v1/content-scan/{api_key}/"
    payload={
        "title":title,
        "content":description
    }
    response = requests.post(url, json=payload)
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

def get_subproject():
    url = "https://100098.pythonanywhere.com/settingusersubproject/"

    try:
        response = requests.get(url)
        response.raise_for_status()  
        data = response.json()  
        return data
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        return None
    
def get_speed_test_data(email):
    try:
        url = f"https://dowellresearch.com/livinglab/api.php?email={email}"
        response = requests.get(url)
        if response.status_code == 200:
            return response.json()[0]
        else:
            return None
    except requests.RequestException as e:
        print(f"Request failed: {e}")
        return None

def speed_test_condition(upload, download, jitter, latency):
    conditions_met = (upload >= 100) + (download >= 100) + (jitter <= 30) + (latency <= 50)
    return conditions_met >= 2
def date_time_operation(date_string):
    date_info = date_string.split(" GMT")[0]
    parsed_date = datetime.datetime.strptime(date_info, "%a %b %d %Y %H:%M:%S")
    formatted_date = parsed_date.strftime("%d-%m-%Y")
    today = datetime.date.today().strftime("%d-%m-%Y")
    print(today)
    if today == formatted_date:
        return True
    else:
        return False
def check_speed_test(applicant_email):
        speed_test_result = get_speed_test_data(applicant_email)
        if not speed_test_result:
            return {"success":False,"message":f"Speed test has not been completed yet for {applicant_email}"}
        download_speed = float(speed_test_result.get("DOWNLOAD").split()[0])  
        upload_speed = float(speed_test_result.get("UPLOAD").split()[0]) 
        latency = float(speed_test_result.get("LATENCY").split()[0]) 
        jitter = float(speed_test_result.get("JITTER").split()[0]) 
        device_type = speed_test_result.get("DEVICE")
        if device_type != "Laptop":
            return {'success':False,"message":"Device not recognized as a Laptop"}
        elif not speed_test_condition(download_speed,upload_speed,latency,jitter):
            return {'success':False,"message":f"Speed test result less for {applicant_email} - Download Speed: {download_speed} Mbps, Upload Speed: {upload_speed} Mbps , Latency: {latency} MS , Jitter: {jitter} MS"}
        else:
            date_to_match = date_time_operation(speed_test_result.get("DATETIME"))
            if date_to_match:
                return {'success':True,"internet_speed":download_speed}
            else:
                return {"success":False,"message":f"Speed test has not been completed yet for {applicant_email}"}
            

def get_projects():
    p_url ="https://100098.pythonanywhere.com/settinguserproject/"
    sp_url ="https://100098.pythonanywhere.com/settingusersubproject/"

    headers = {"Content-Type": "application/json"}

    proj_response = json.loads(requests.request("GET", p_url, headers=headers).text)
    _projects =[]
    proj_list = [i["project_list"] for i in proj_response if "project_list" in i.keys()]
    for proj in proj_list:
        for p in proj:
            if type(p)== str:
                _projects.append(p)

    sproj_response = json.loads(requests.request("GET", sp_url, headers=headers).text)['data']
    data={}
    for i in sproj_response:
        if ("parent_project" in i.keys() and i["parent_project"] in _projects):
            if i["parent_project"] not in data.keys():
                data[i["parent_project"]]=i["sub_project_list"]
            else:
                data[i["parent_project"]]+=i["sub_project_list"]
    
    return data           