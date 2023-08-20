import json
import requests
import pprint
import os
import datetime
from rest_framework.response import Response
from rest_framework import status
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

def period_check(start_dt, end_dt, data_list, key):
    start_date = datetime.datetime.strptime(
            start_dt, "%m/%d/%Y %H:%M:%S"
        )
    end_date = datetime.datetime.strptime(
            end_dt, "%m/%d/%Y %H:%M:%S"
        )
    items=[]
    
    for l in data_list:
        try:
            custom_time=datetime.datetime.strptime(l[key],"%Y-%m-%dT%H:%M:%S.%fZ")
            if custom_time >= start_date and custom_time <= end_date:
                items.append(l) 
        except Exception:
            try:
                custom_time=datetime.datetime.strptime(l[key],"%m/%d/%Y")
                if custom_time >= start_date and custom_time <= end_date:
                    items.append(l) 
            except Exception:
                try:
                    date_string = l[key].replace('(West Africa Standard Time)', '').rstrip()
                    date_object = datetime.datetime.strptime(date_string, '%a %b %d %Y %H:%M:%S %Z%z').strftime("%m/%d/%Y %H:%M:%S")
                    custom_time = datetime.datetime.strptime(date_object,"%m/%d/%Y %H:%M:%S")
                    if custom_time >= start_date and custom_time <= end_date:
                        items.append(l)
                except Exception:
                    try:
                        custom_time=datetime.datetime.strptime(l[key],"%m/%d/%Y %H:%M:%S")
                        if custom_time >= start_date and custom_time <= end_date:
                            items.append(l) 
                    except Exception:
                        try:
                            custom_time=datetime.datetime.strptime(l[key],"%Y-%m-%d")
                            if custom_time >= start_date and custom_time <= end_date:
                                items.append(l) 
                        except Exception:
                            try:
                                custom_time=datetime.datetime.strptime(l[key],"%d/%m/%Y")
                                if custom_time >= start_date and custom_time <= end_date:
                                    items.append(l) 
                            except Exception as error:
                                #print("error", error)
                                pass
    return items, len(items)

def targeted_population(database, collection, fields, period, start_point,end_point):
    url = 'http://100032.pythonanywhere.com/api/targeted_population/'

    database_details = {
        'database_name': 'mongodb',
        'collection': collection,
        'database': database,
        'fields': fields
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
        'period': period,
        'start_point': start_point,
        'end_point': end_point,
        'split': 'week',
        'time_input_type' : 'eventID',
        'column_name': 'eventId',
    }

    stage_input_list= []

    distribution_input={
        'normal': 1,
        'poisson':0,
        'binomial':0,
        'bernoulli':0
        
    }

    request_data={
        'database_details': database_details,
        'distribution_input': distribution_input,
        'number_of_variable':number_of_variables,
        'stages':stage_input_list,
        'time_input':time_input,
    }

    headers = {'content-type': 'application/json'}

    response = requests.post(url, json=request_data,headers=headers)

    return response.text
