import requests
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import json
"""for linux server"""
load_dotenv("/home/100098/100098-DowellJobPortal/.env")

if os.getenv("API_KEY"):
    API_KEY = str(os.getenv("API_KEY"))
    

if os.getenv("DB_Name"):
    DB_Name = str(os.getenv("DB_Name"))

"""for windows local"""
load_dotenv(f"{os.getcwd()}/.env")
API_KEY = str(os.getenv("API_KEY"))
DB_Name = str(os.getenv("DB_Name"))
    

def get_start_end_date():
    
    today = datetime.today().date()
    start_date = today + timedelta(days=(0 - today.weekday() + 7) % 7)
    end_date = start_date + timedelta(days=(4 - start_date.weekday() + 7) % 7)
    start_date = max(start_date, today)

    return (start_date,end_date)

def datacube_add_collection():

    url = "https://datacube.uxlivinglab.online/db_api/add_collection/"
    start_date,end_date=get_start_end_date()
    collection=f"{start_date}_to_{end_date}"

    data = {
        "api_key": API_KEY,
        "db_name": DB_Name,
        "coll_names": collection,
        "num_collections": 1,
    }
    try:
        response = requests.post(url, json=data)
    except:
        print("datacube is not responding")

    res=json.loads(response.text)
    
    if res["success"]:
        print(f"collection {collection} has been successfully added to the {DB_Name} database.")
    else:
        print(res["message"])
    
    return None

if __name__ == "__main__":
    datacube_add_collection()
