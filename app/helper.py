import json
import requests
import pprint
import os
import datetime
from discord.ext import commands
from discord import Intents


def dowellconnection(cluster, database, collection, document, team_member_ID, function_ID, command, field,
                     update_field):
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
        "bookmarks": "a book marks"
    }

    r = requests.post(url, json=data)
    
    if r.status_code == 201:
        #print("r->", r.text,json.loads(r.text))
        return json.loads(r.text)
    else:
        #print("r---->", r.text,json.loads(r.text))
        return json.loads(r.text)['error']

### for notification api----------------------------
def call_notification(url, request_type, data):  ## calling  notification api
    if request_type == 'post':
        notification = requests.post(url, data)
        details = notification.json()
        return details
    elif request_type == 'get':
        notification = requests.get(url)
        details = notification.json()
        return details
    elif request_type == 'patch':
        notification = requests.patch(url, data)
        details = notification.json()
        return details
### for settings api----------------------------
def update_number(string):
            updated_string = ""
            for char in string:
                if char.isdigit():
                    updated_string += f'C{str(int(char) + 1)}'
            return updated_string

def update_string(string):
            new_str = ""
            for char in string:
                if char=="C":
                    new_str = string.replace("C", "O")
            return new_str

### calling the discord api----------------------------

# generate discord invite link
def discord_invite(server_owner_ids,guild_id, token):
    invite_link = []
    client = commands.Bot(command_prefix="?", owner_ids=server_owner_ids, intents=Intents.default())
    #print("running bot...")

    # Close the bot
    @client.command()
    @commands.is_owner()
    async def shutdown(context):
        #print("bot is shut down")
        await context.close()

    @client.event
    async def on_ready():#gets the invite link when the bot is ready
        #print("bot is ready...")
        discord_link = await client.get_guild(guild_id).text_channels[0].create_invite()
        #print(discord_link, "==============")
        invite_link.append(discord_link)
        await shutdown(client)

    #with open(os.getcwd()+"/app/token", "r", encoding="utf-8") as t:
    #    token = t.read()
    # token file is the token for the bot created
    client.run(token=token)
    return invite_link

# get the channels in the server
def get_guild_channels(guildid,token):
    """with open(os.getcwd()+"/app/token", "r", encoding="utf-8") as t:
        token = t.read()"""
    headers = {
        'Content-Type': 'application/json',
        'authorization': f'Bot {token}'
    }
    url = f"https://discord.com/api/v9/guilds/{guildid}/channels"  # /{userid}"
    response = requests.request("GET", url=url, headers=headers)
    res = json.loads(response.text)

    return res
def get_guild_members(guildid,token):
    """with open(os.getcwd()+"/app/token", "r", encoding="utf-8") as t:
        token = t.read()"""
    headers = {
        'Content-Type': 'application/json',
        'authorization': f'Bot {token}'
    }
    url = f"https://discord.com/api/v9/guilds/{guildid}/members"
    response = requests.request("GET", url=url, headers=headers)
    res = json.loads(response.text)

    return res




def create_master_link(company_id,links,job_name):
    url = "https://www.qrcodereviews.uxlivinglab.online/api/v3/qr-code/"
    
    payload = {
        "qrcode_type": "Link",
        "quantity": 1,
        "company_id": company_id,
        "links": links,
        "document_name":job_name
    }
    response = requests.post(url, json=payload)

    return response.text

def send_mail(toname,toemail,subject,job_role,link):
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

def interview_email(toname,toemail,subject,email_content):
    url = "https://100085.pythonanywhere.com/api/email/"
    payload = {
        "toname": toname,
        "toemail": toemail,
        "subject": subject,
        "email_content":email_content
    }
    response = requests.post(url, json=payload)
    return response.text

def set_finalize(linkid):
    #print(linkid)
    url = f"https://www.qrcodereviews.uxlivinglab.online/api/v3/masterlink/?link_id={linkid}"
    payload = {
        "is_finalized": True,
    }
    response = requests.put(url, json=payload)
    #print(response)
    #print(response.text)
    return response.text

import base64

def save_image(image):
    url = "http://67.217.61.253/uploadfiles/upload-hr-image/"
    payload = {
        "image": image  # Read the binary data from the file object
    }
    #print(payload)
    response = requests.post(url, files=payload)  # Use 'files' instead of 'json'
    #print(response.text)
    return response.text


def periodic_jobs(start_dt, end_dt, data_list):
    #convert to date format--------
    start_date = datetime.datetime.strptime(
            start_dt, "%m/%d/%Y %H:%M:%S"
        )
    end_date = datetime.datetime.strptime(
            end_dt, "%m/%d/%Y %H:%M:%S"
        )
    
    items=[]
    for l in data_list:
        try:
            created_on=datetime.datetime.strptime(l["created_on"],"%Y-%m-%dT%H:%M:%S.%fZ")
            if created_on >= start_date and created_on <= end_date:
                items.append(l)
            
        except Exception:
            try:
                created_on=datetime.datetime.strptime(l["created_on"]+" 0:00:00", "%m/%d/%Y %H:%M:%S")
                if created_on >= start_date and created_on <= end_date:
                    items.append(l) 
            except Exception:
                try:
                    created_on=datetime.datetime.strptime(l["created_on"], "%m/%d/%Y %H:%M:%S")
                    if created_on >= start_date and created_on <= end_date:
                        items.append(l)
                except Exception:
                    pass

    return (items, len(items))

def periodic_application(start_dt, end_dt, data_list):
    #convert to date format--------
    start_date = datetime.datetime.strptime(
            start_dt, "%m/%d/%Y %H:%M:%S"
        )
    end_date = datetime.datetime.strptime(
            end_dt, "%m/%d/%Y %H:%M:%S"
        )
    
    items=[]
    for l in data_list:
        try:
            application_submitted_on=datetime.datetime.strptime(l["application_submitted_on"],"%Y-%m-%dT%H:%M:%S.%fZ")
            if application_submitted_on >= start_date and application_submitted_on <= end_date:
                items.append(l)
        except Exception:
            try:
                application_submitted_on=datetime.datetime.strptime(l["application_submitted_on"]+" 0:00:00", "%m/%d/%Y %H:%M:%S")
                if application_submitted_on >= start_date and application_submitted_on <= end_date:
                    items.append(l) 
            except Exception:
                try:
                    application_submitted_on=datetime.datetime.strptime(l["application_submitted_on"], "%m/%d/%Y %H:%M:%S")
                    if application_submitted_on >= start_date and application_submitted_on <= end_date:
                        items.append(l)
                except Exception:
                    pass

    return (items, len(items))

def periodic_teams(start_dt, end_dt, data_list):
    #convert to date format--------
    start_date = datetime.datetime.strptime(
            start_dt, "%m/%d/%Y %H:%M:%S"
        )
    end_date = datetime.datetime.strptime(
            end_dt, "%m/%d/%Y %H:%M:%S"
        )
    
    items=[]
    for l in data_list:
        try:
            date_created=datetime.datetime.strptime(l["date_created"],"%Y-%m-%dT%H:%M:%S.%fZ")
            if date_created >= start_date and date_created <= end_date:
                items.append(l)
            
        except Exception:
            try:
                date_created=datetime.datetime.strptime(l["date_created"]+" 0:00:00", "%m/%d/%Y %H:%M:%S")
                if date_created >= start_date and date_created <= end_date:
                    items.append(l) 
                
            except Exception:
                try:
                    date_created=datetime.datetime.strptime(l["date_created"], "%m/%d/%Y %H:%M:%S")
                    if date_created >= start_date and date_created <= end_date:
                        items.append(l)
                    
                except Exception:
                    pass

    return (items, len(items))

def periodic_tasks(start_dt, end_dt, data_list):
    #convert to date format--------
    start_date = datetime.datetime.strptime(
            start_dt, "%m/%d/%Y %H:%M:%S"
        )
    end_date = datetime.datetime.strptime(
            end_dt, "%m/%d/%Y %H:%M:%S"
        )
    
    items=[]
    for l in data_list:
        try:
            task_created_date=datetime.datetime.strptime(l["task_created_date"],"%Y-%m-%dT%H:%M:%S.%fZ")
            if task_created_date >= start_date and task_created_date <= end_date:
                items.append(l)
            
        except Exception:
            try:
                task_created_date=datetime.datetime.strptime(l["task_created_date"]+" 0:00:00", "%m/%d/%Y %H:%M:%S")
                if task_created_date >= start_date and task_created_date <= end_date:
                    items.append(l) 
            except Exception:
                try:
                    task_created_date=datetime.datetime.strptime(l["task_created_date"], "%m/%d/%Y %H:%M:%S")
                    if task_created_date >= start_date and task_created_date <= end_date:
                        items.append(l)
                except Exception:
                    pass

    return (items, len(items))
def periodic_application_account(start_dt, end_dt, data_list, status=None):
    start_date = datetime.datetime.strptime(start_dt, "%m/%d/%Y")
    end_date = datetime.datetime.strptime(end_dt, "%m/%d/%Y")
    
    items = []
    
    for application in data_list:
        try:
            onboarded_on = application.get("onboarded_on")
            rejected_on = application.get("rejected_on")
            
            if onboarded_on and "/" in onboarded_on:
                application_date = datetime.datetime.strptime(onboarded_on, "%m/%d/%Y")
            elif onboarded_on:
                application_date = datetime.datetime.strptime(onboarded_on, "%Y-%m-%dT%H:%M:%S.%fZ")
            elif rejected_on:
                application_date = datetime.datetime.strptime(rejected_on, "%m/%d/%Y")
            else:
                continue
                
            if start_date <= application_date <= end_date and (status is None or application.get("status") == status):
                items.append(application)
        except (KeyError, ValueError):
            pass

    return len(items)



import datetime

def periodic_application_hr(start_dt, end_dt, data_list, status=None):
    start_date = datetime.datetime.strptime(start_dt, "%m/%d/%Y")
    end_date = datetime.datetime.strptime(end_dt, "%m/%d/%Y")
    
    filtered_data = []
    
    for entry in data_list:
        if status is None or entry['status'].lower() == status.lower():
            date_field = None
            if status is None:
                date_field_options = ['selected_on', 'shortlisted_on', 'rejected_on']
                for date_field_option in date_field_options:
                    if date_field_option in entry:
                        date_field = date_field_option
                        break
            else:
                if status.lower() == 'selected':
                    date_field = 'selected_on'
                elif status.lower() == 'shortlisted':
                    date_field = 'shortlisted_on'
                elif status.lower() == 'rejected':
                    date_field = 'rejected_on'
            
            if date_field and date_field in entry:
                try:
                    entry_date = datetime.datetime.strptime(entry[date_field], '%Y-%m-%dT%H:%M:%S.%fZ')
                except ValueError:
                    try:
                        entry_date = datetime.datetime.strptime(entry[date_field], '%m/%d/%Y')
                    except ValueError:
                        continue  # Skip entries with invalid date formats
                    
                if start_date <= entry_date <= end_date:
                    filtered_data.append(entry)
    
    return len(filtered_data)
