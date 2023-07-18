import json
import requests
import pprint
import os
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
    print("running bot...")

    # Close the bot
    @client.command()
    @commands.is_owner()
    async def shutdown(context):
        print("bot is shut down")
        await context.close()

    @client.event
    async def on_ready():#gets the invite link when the bot is ready
        print("bot is ready...")
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




def create_master_link(company_id,links):
    url = "https://100099.pythonanywhere.com/api/v3/qr-code/"
    
    payload = {
        "qrcode_type": "Link",
        "quantity": 1,
        "company_id": company_id,
        "links": links,
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