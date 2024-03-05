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
from .models import SettingUserProfileInfo
from .serializers import SettingUserProfileInfoSerializer


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


def dowell_time(timezone):
    url = "https://100009.pythonanywhere.com/dowellclock/"
    payload = json.dumps(
        {
            "timezone": timezone,  # eg "Asia/Calcutta"
        }
    )
    headers = {"Content-Type": "application/json"}

    response = requests.request("POST", url, headers=headers, data=payload)
    res = json.loads(response.text)

    return res


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
    accountleads = []
    hrs = []
    subadmins = []
    groupleads = []
    superadmins = []
    candidates = []
    viewers = []
    projectlead = []
    leaders = []
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
    positions = {
        "leaders": leaders,
        "teamleads": teamleads,
        "accountleads": accountleads,
        "hrs": hrs,
        "subadmins": subadmins,
        "groupleads": groupleads,
        "superadmins": superadmins,
        "candidates": candidates,
        "projectlead": projectlead,
        "viewers": viewers,
    }
    return positions


def get_month_details(date):
    month_list = calendar.month_name
    months = []
    datime = datetime.datetime.strptime(set_date_format(date), "%m/%d/%Y %H:%M:%S")
    month_name = month_list[datime.month]

    months.append(month_name)

    return (str(datime.year), month_name, months.count(month_name))


def datacube_data_insertion(api_key, database_name, collection_name, data):
    url = "https://datacube.uxlivinglab.online/db_api/crud/"

    data = {
        "api_key": api_key,
        "db_name": database_name,
        "coll_name": collection_name,
        "operation": "insert",
        "data": data,
    }

    response = requests.post(url, json=data)

    return response.text


def datacube_data_retrival(
    api_key, database_name, collection_name, data, limit, offset
):
    url = "https://datacube.uxlivinglab.online/db_api/get_data/"
    field = {
        "api_key": api_key,
        "db_name": database_name,
        "coll_name": collection_name,
        "operation": "fetch",
        "filters": data,
        "limit": limit,
        "offset": offset,
    }

    response = requests.post(url, json=data)

    response = requests.post(url, json=field)

    return response.text


def datacube_data_update(api_key, db_name, coll_name, query, update_data):
    url = "https://datacube.uxlivinglab.online/db_api/crud/"
    data = {
        "api_key": api_key,
        "db_name": db_name,
        "coll_name": coll_name,
        "operation": "update",
        "query": query,
        "update_data": update_data,
    }

    response = requests.put(url, json=data)
    return response.text


def datacube_delete_function(api_key, db_name, coll_name, query):
    url = "https://datacube.uxlivinglab.online/db_api/crud/"
    data = {
        "api_key": api_key,
        "db_name": db_name,
        "coll_name": coll_name,
        "operation": "delete",
        "query": query,
    }

    response = requests.delete(url, json=data)
    return response.text


def samanta_content_evaluator(api_key, title, description):
    url = f"https://100085.pythonanywhere.com/uxlivinglab/v1/content-scan/{api_key}/"
    payload = {"title": title, "content": description}
    response = requests.post(url, json=payload)
    return response.text


def datacube_add_collection(api_key, db_name, coll_names, num_collections):
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


def get_speed_test_result(email):
    try:
        url = f"https://dowellresearch.com/livinglab/api.php?email={email}"
        response = requests.get(url)
        if response.status_code == 200:
            return response.json()[:20]
        else:
            return None
    except requests.RequestException as e:
        print(f"Request failed: {e}")
        return None


def speed_test_condition(upload, download, jitter, latency):
    conditions_met = (
        (upload >= 100) + (download >= 100) + (jitter <= 30) + (latency <= 50)
    )
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
        return {
            "success": False,
            "message": f"Speed test has not been completed yet for {applicant_email}",
        }
    download_speed = float(speed_test_result.get("DOWNLOAD").split()[0])
    upload_speed = float(speed_test_result.get("UPLOAD").split()[0])
    latency = float(speed_test_result.get("LATENCY").split()[0])
    jitter = float(speed_test_result.get("JITTER").split()[0])
    device_type = speed_test_result.get("DEVICE")
    if device_type != "Laptop":
        return {"success": False, "message": "Device not recognized as a Laptop"}
    elif not speed_test_condition(download_speed, upload_speed, latency, jitter):
        return {
            "success": False,
            "message": f"Speed test result less for {applicant_email} - Download Speed: {download_speed} Mbps, Upload Speed: {upload_speed} Mbps , Latency: {latency} MS , Jitter: {jitter} MS",
        }
    else:
        date_to_match = date_time_operation(speed_test_result.get("DATETIME"))
        if date_to_match:
            return {"success": True, "internet_speed": download_speed}
        else:
            return {
                "success": False,
                "message": f"Speed test has not been completed yet for {applicant_email}",
            }


def get_projects():
    p_url = "https://100098.pythonanywhere.com/settinguserproject/"
    sp_url = "https://100098.pythonanywhere.com/settingusersubproject/"

    headers = {"Content-Type": "application/json"}

    proj_response = json.loads(requests.request("GET", p_url, headers=headers).text)
    _projects = []
    proj_list = [i["project_list"] for i in proj_response if "project_list" in i.keys()]
    for proj in proj_list:
        for p in proj:
            if type(p) == str:
                _projects.append(p)

    sproj_response = json.loads(requests.request("GET", sp_url, headers=headers).text)[
        "data"
    ]
    data = {}
    for i in sproj_response:
        if "parent_project" in i.keys() and i["parent_project"] in _projects:
            if i["parent_project"] not in data.keys():
                data[i["parent_project"]] = i["sub_project_list"]
            else:
                data[i["parent_project"]] += i["sub_project_list"]

    return data


def datacube_data_retrival_function(
    api_key, database_name, collection_name, data, limit, offset, payment
):
    """
    DON"T USE THIS WITHOUT ASKING ME
    """
    url = "https://datacube.uxlivinglab.online/db_api/get_data/"

    data = {
        "api_key": api_key,
        "db_name": database_name,
        "coll_name": collection_name,
        "operation": "fetch",
        "filters": data,
        "limit": limit,
        "offset": offset,
        "payment": payment,
    }

    response = requests.post(url, json=data)
    return response.text


def get_current_week_start_end_date(date_taken):
    date_format = "%Y-%m-%d"
    date_obj = datetime.datetime.strptime(date_taken, date_format).date()
    start_date = date_obj - timedelta(days=date_obj.weekday())
    end_date = start_date + timedelta(days=4)

    return start_date, end_date


def get_dates_between(start_date, end_date):
    start_date = datetime.datetime.strptime(start_date, "%Y-%m-%d")
    end_date = datetime.datetime.strptime(end_date, "%Y-%m-%d")

    date_list = [
        start_date + timedelta(days=x) for x in range((end_date - start_date).days + 1)
    ]

    return [date.strftime("%Y-%m-%d") for date in date_list]


def update_user_Report_data(
    api_key, db_name, report_uuid, user_id, task_date, update_data
):
    year, _monthname, _monthcnt = get_month_details(task_date)
    query = {
        "report_record_month": _monthname,
        "report_record_year": year,
        "db_report_type": "report",
    }
    coll_name = report_uuid + user_id
    get_report = json.loads(
        datacube_data_retrival_function(
            api_key, db_name, coll_name, query, 100000, 0, False
        )
    )
    if get_report["success"] == True:
        if len(get_report["data"]) > 0:
            task_added = get_report["data"][0]["task_added"] + (
                1 if "task_added" in update_data.keys() else 0
            )
            task_completed = get_report["data"][0]["tasks_completed"]
            task_uncompleted = get_report["data"][0]["tasks_uncompleted"]
            if "tasks_uncompleted" in update_data.keys():
                task_uncompleted += 1
            if "tasks_completed" in update_data.keys():
                task_completed += 1
                task_uncompleted -= 1
            percentage_tasks_completed = 0.0
            if task_added > 0:
                percentage_tasks_completed = (task_completed / task_added) * 100
            task_approved = get_report["data"][0]["tasks_approved"]
            task_you_marked_as_complete = get_report["data"][0][
                "tasks_you_marked_as_complete"
            ]
            tasks_you_marked_as_incomplete = get_report["data"][0][
                "tasks_you_marked_as_incomplete"
            ]
            if "tasks_approved" in update_data.keys() and task_approved < task_added:
                task_approved += 1
            if (
                "tasks_you_marked_as_incomplete" in update_data.keys()
                and task_approved < task_added
            ):
                tasks_you_marked_as_incomplete += 1
            if (
                "tasks_you_marked_as_complete" in update_data.keys()
                and task_approved < task_added
            ):
                task_you_marked_as_complete += 1
                tasks_you_marked_as_incomplete -= 1

            team_tasks = get_report["data"][0]["team_tasks"] + (
                1 if "team_tasks" in update_data.keys() else 0
            )
            team_tasks_completed = get_report["data"][0]["team_tasks_completed"]
            team_tasks_uncompleted = get_report["data"][0]["team_tasks_uncompleted"]
            if "team_tasks_uncompleted" in update_data.keys():
                team_tasks_uncompleted += 1
            if "team_tasks_completed" in update_data.keys():
                team_tasks_completed += 1
                team_tasks_uncompleted -= 1
            percentage_team_tasks_completed = 0.0
            if team_tasks > 0:
                percentage_team_tasks_completed = (
                    team_tasks_completed / team_tasks
                ) * 100

            update_ = {
                "task_added": task_added,
                "tasks_completed": task_completed,
                "tasks_uncompleted": task_uncompleted,
                "tasks_approved": get_report["data"][0]["tasks_approved"]
                + (1 if "tasks_approved" in update_data.keys() else 0),
                "percentage_tasks_completed": percentage_tasks_completed,
                "tasks_you_approved": task_approved,
                "tasks_you_marked_as_complete": task_you_marked_as_complete,
                "tasks_you_marked_as_incomplete": tasks_you_marked_as_incomplete,
                "teams": get_report["data"][0]["teams"]
                + (1 if "teams" in update_data.keys() else 0),
                "team_tasks": team_tasks,
                "team_tasks_completed": team_tasks_completed,
                "team_tasks_uncompleted": team_tasks_uncompleted,
                "percentage_team_tasks_completed": percentage_team_tasks_completed,
                "team_tasks_approved": get_report["data"][0]["team_tasks_approved"]
                + (1 if "team_tasks_approved" in update_data.keys() else 0),
                "team_tasks_issues_raised": get_report["data"][0][
                    "team_tasks_issues_raised"
                ]
                + (1 if "team_tasks_issues_raised" in update_data.keys() else 0),
                "team_tasks_issues_resolved": get_report["data"][0][
                    "team_tasks_issues_resolved"
                ]
                + (1 if "team_tasks_issues_resolved" in update_data.keys() else 0),
                "team_tasks_comments_added": get_report["data"][0][
                    "team_tasks_comments_added"
                ]
                + (1 if "team_tasks_comments_added" in update_data.keys() else 0),
                "report_record_month": _monthname,
                "report_record_year": year,
                "db_report_type": "report",
            }
            update_report = json.loads(
                datacube_data_update(api_key, db_name, coll_name, query, update_)
            )
            return update_report
        else:
            data = {
                "task_added": 1 if "task_added" in update_data.keys() else 0,
                "tasks_completed": 1 if "tasks_completed" in update_data.keys() else 0,
                "tasks_uncompleted": (
                    1 if "tasks_uncompleted" in update_data.keys() else 0
                ),
                "tasks_approved": 1 if "tasks_approved" in update_data.keys() else 0,
                "percentage_tasks_completed": (
                    (1 if "tasks_completed" in update_data.keys() else 0) / 1
                )
                * 100,
                "tasks_you_approved": (
                    1 if "tasks_you_approved" in update_data.keys() else 0
                ),
                "tasks_you_marked_as_complete": (
                    1 if "tasks_you_marked_as_complete" in update_data.keys() else 0
                ),
                "tasks_you_marked_as_incomplete": (
                    1 if "tasks_you_marked_as_incomplete" in update_data.keys() else 0
                ),
                "teams": 1 if "teams" in update_data.keys() else 0,
                "team_tasks": 1 if "team_tasks" in update_data.keys() else 0,
                "team_tasks_completed": (
                    1 if "team_tasks_completed" in update_data.keys() else 0
                ),
                "team_tasks_uncompleted": (
                    1 if "team_tasks_uncompleted" in update_data.keys() else 0
                ),
                "percentage_team_tasks_completed": (
                    (1 if "team_tasks_completed" in update_data.keys() else 0) / 1
                )
                * 100,
                "team_tasks_approved": (
                    1 if "team_tasks_approved" in update_data.keys() else 0
                ),
                "team_tasks_issues_raised": (
                    1 if "team_tasks_issues_raised" in update_data.keys() else 0
                ),
                "team_tasks_issues_resolved": (
                    1 if "team_tasks_issues_resolved" in update_data.keys() else 0
                ),
                "team_tasks_comments_added": (
                    1 if "team_tasks_comments_added" in update_data.keys() else 0
                ),
                "report_record_month": _monthname,
                "report_record_year": year,
                "db_report_type": "report",
            }
            insert_report = json.loads(
                datacube_data_insertion(api_key, db_name, coll_name, data)
            )
            return insert_report
    else:
        create_collection = json.loads(
            datacube_add_collection(api_key, db_name, coll_name, 1)
        )
        if create_collection["success"] == True:
            data = {
                "task_added": 1 if "task_added" in update_data.keys() else 0,
                "tasks_completed": 1 if "tasks_completed" in update_data.keys() else 0,
                "tasks_uncompleted": (
                    1 if "tasks_uncompleted" in update_data.keys() else 0
                ),
                "tasks_approved": 1 if "tasks_approved" in update_data.keys() else 0,
                "percentage_tasks_completed": 0.0,
                "tasks_you_approved": (
                    1 if "tasks_you_approved" in update_data.keys() else 0
                ),
                "tasks_you_marked_as_complete": (
                    1 if "tasks_you_marked_as_complete" in update_data.keys() else 0
                ),
                "tasks_you_marked_as_incomplete": (
                    1 if "tasks_you_marked_as_incomplete" in update_data.keys() else 0
                ),
                "teams": 1 if "teams" in update_data.keys() else 0,
                "team_tasks": 1 if "team_tasks" in update_data.keys() else 0,
                "team_tasks_completed": (
                    1 if "team_tasks_completed" in update_data.keys() else 0
                ),
                "team_tasks_uncompleted": (
                    1 if "team_tasks_uncompleted" in update_data.keys() else 0
                ),
                "percentage_team_tasks_completed": 0.0,
                "team_tasks_approved": (
                    1 if "team_tasks_approved" in update_data.keys() else 0
                ),
                "team_tasks_issues_raised": (
                    1 if "team_tasks_issues_raised" in update_data.keys() else 0
                ),
                "team_tasks_issues_resolved": (
                    1 if "team_tasks_issues_resolved" in update_data.keys() else 0
                ),
                "team_tasks_comments_added": (
                    1 if "team_tasks_comments_added" in update_data.keys() else 0
                ),
                "report_record_month": _monthname,
                "report_record_year": year,
                "db_report_type": "report",
            }
            insert_collection = json.loads(
                datacube_data_insertion(api_key, db_name, coll_name, data)
            )
            return insert_collection
        else:
            return create_collection


def delete_user_Report_data(
    api_key, db_name, report_uuid, user_id, task_date, update_data
):
    year, _monthname, _monthcnt = get_month_details(task_date)
    query = {
        "report_record_month": _monthname,
        "report_record_year": year,
        "db_report_type": "report",
    }
    coll_name = report_uuid + user_id
    get_report = json.loads(
        datacube_data_retrival_function(
            api_key, db_name, coll_name, query, 100000, 0, False
        )
    )
    if get_report["success"] == True:
        if len(get_report["data"]) > 0:
            task_added = get_report["data"][0]["task_added"]
            task_completed = get_report["data"][0]["tasks_completed"]
            task_uncompleted = get_report["data"][0]["tasks_uncompleted"]
            if "task_added" in update_data.keys():
                task_added -= 1
                if "tasks_uncompleted" in update_data.keys():
                    task_uncompleted -= 1
                if "tasks_completed" in update_data.keys():
                    task_completed -= 1
            else:
                if "tasks_uncompleted" in update_data.keys():
                    task_uncompleted -= 1
                if "tasks_completed" in update_data.keys():
                    task_completed -= 1

            percentage_tasks_completed = 0.0
            if task_added > 0:
                percentage_tasks_completed = (task_completed / task_added) * 100

            team_tasks = get_report["data"][0]["team_tasks"]
            team_tasks_completed = get_report["data"][0]["team_tasks_completed"]
            team_tasks_uncompleted = get_report["data"][0]["team_tasks_uncompleted"]

            if "team_tasks" in update_data.keys():
                team_tasks -= 1
                if "team_tasks_uncompleted" in update_data.keys():
                    team_tasks_uncompleted -= 1
                if "team_tasks_completed" in update_data.keys():
                    team_tasks_completed -= 1
            else:
                if "team_tasks_uncompleted" in update_data.keys():
                    team_tasks_uncompleted -= 1
                if "team_tasks_completed" in update_data.keys():
                    team_tasks_completed -= 1

            percentage_team_tasks_completed = 0.0
            if team_tasks > 0:
                percentage_team_tasks_completed = (
                    team_tasks_completed / team_tasks
                ) * 100

            update_ = {
                "task_added": task_added,
                "tasks_completed": task_completed,
                "tasks_uncompleted": task_uncompleted,
                "tasks_approved": get_report["data"][0]["tasks_approved"]
                - (1 if "tasks_approved" in update_data.keys() else 0),
                "percentage_tasks_completed": percentage_tasks_completed,
                "tasks_you_approved": get_report["data"][0]["tasks_you_approved"]
                - (1 if "tasks_you_approved" in update_data.keys() else 0),
                "tasks_you_marked_as_complete": get_report["data"][0][
                    "tasks_you_marked_as_complete"
                ]
                - (1 if "tasks_you_marked_as_complete" in update_data.keys() else 0),
                "tasks_you_marked_as_incomplete": get_report["data"][0][
                    "tasks_you_marked_as_incomplete"
                ]
                - (1 if "tasks_you_marked_as_incomplete" in update_data.keys() else 0),
                "teams": get_report["data"][0]["teams"]
                - (1 if "teams" in update_data.keys() else 0),
                "team_tasks": team_tasks,
                "team_tasks_completed": team_tasks_completed,
                "team_tasks_uncompleted": team_tasks_uncompleted,
                "percentage_team_tasks_completed": percentage_team_tasks_completed,
                "team_tasks_approved": get_report["data"][0]["team_tasks_approved"]
                - (1 if "team_tasks_approved" in update_data.keys() else 0),
                "team_tasks_issues_raised": get_report["data"][0][
                    "team_tasks_issues_raised"
                ]
                - (1 if "team_tasks_issues_raised" in update_data.keys() else 0),
                "team_tasks_issues_resolved": get_report["data"][0][
                    "team_tasks_issues_resolved"
                ]
                - (1 if "team_tasks_issues_resolved" in update_data.keys() else 0),
                "team_tasks_comments_added": get_report["data"][0][
                    "team_tasks_comments_added"
                ]
                - (1 if "team_tasks_comments_added" in update_data.keys() else 0),
                "report_record_month": _monthname,
                "report_record_year": year,
                "db_report_type": "report",
            }
            update_report = json.loads(
                datacube_data_update(api_key, db_name, coll_name, query, update_)
            )
            return update_report
    else:
        return get_report


def valid_teamlead(username):
    profiles = SettingUserProfileInfo.objects.all()
    serializer = SettingUserProfileInfoSerializer(profiles, many=True)
    # print(serializer.data,"----")
    info = dowellconnection(
        *candidate_management_reports,
        "fetch",
        {
            "username": username,
        },
        update_field=None,
    )
    # print(len(json.loads(info)["data"]),"==========")
    if len(json.loads(info)["data"]) > 0:
        user_id = [
            users["user_id"]
            for users in json.loads(info)["data"]
            if "user_id" in users.keys()
        ][0]
        portfolio_name = [
            names["portfolio_name"]
            for names in json.loads(info)["data"]
            if "portfolio_name" in names.keys()
        ]
        valid_profiles = []
        for data in serializer.data:
            for d in data["profile_info"]:
                if "profile_title" in d.keys():
                    if d["profile_title"] in portfolio_name:
                        if (
                            d["Role"] == "Project_Lead"
                            or d["Role"] == "Proj_Lead"
                            or d["Role"] == "super_admin"
                        ):
                            valid_profiles.append(d["profile_title"])
        if len(valid_profiles) > 0:
            if valid_profiles[-1] in portfolio_name:
                return True, user_id
            else:
                return False, user_id
    return False, ""

def check_position(username, company_id):
    profiles = SettingUserProfileInfo.objects.all()
    serializer = SettingUserProfileInfoSerializer(profiles, many=True)
    # print(serializer.data,"----")
    info = json.loads(
        dowellconnection(
            *candidate_management_reports,
            "fetch",
            {"username": username, "company_id": company_id},
            update_field=None,
        )
    )["data"]

    positions = {
        "Proj_Lead": "Team Lead",
        "Project_Lead": "Project Lead",
        "group_lead": "Group Lead",
        "Dept_Lead": "Account Lead",
        "Hr": "Hr",
        "sub_admin": "Sub Admin",
        "super_admin": "Super Admin",
        "candidate": "Candidate",
        "Viewer": "Viewer",
    }
    if len(info) > 0:
        for data in serializer.data:
            for d in data["profile_info"]:
                if "profile_title" in d.keys():
                    if d["profile_title"] == info[0]["portfolio_name"]:
                        if "Role" in d.keys():
                            return positions[d["Role"]]

    return "None"
