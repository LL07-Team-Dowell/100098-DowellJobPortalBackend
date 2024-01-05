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
print(API_KEY)
DB_Name = str(os.getenv("DB_Name"))
    

def get_start_end_date():
    today = datetime.today().date()

    start_date = today + timedelta(days=(0 - today.weekday() + 7) % 7)

    end_date = start_date + timedelta(days=(4 - start_date.weekday() + 7) % 7)

    start_date = max(start_date, today)

    return (start_date,end_date)

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

def datacube_add_collection():

    url = "https://datacube.uxlivinglab.online/db_api/collections/?name=add_collection"

    
    dates=get_start_end_date()
    
    formatted_dates = tuple(date.strftime("%Y-%m-%d") for date in dates)

    start_date = formatted_dates[0]
    end_date = formatted_dates[1]

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
    # res={
    #     "success":True
    # }
    if res["success"]:
        print(f"collection {collection} has been successfully added to the {DB_Name} database.")

        insert_collection_list=json.loads(datacube_data_insertion(API_KEY,DB_Name,collection_name="Attendance_collections",data={"collection":collection}))
        
        if insert_collection_list["success"]:
            print(f"collection {collection} has been added to the attendance collection list")

        else:
            print(f"collection could not be added to the database to the attendance collection list")

    else:
        print(res["message"])
    
    return None

if __name__ == "__main__":
    datacube_add_collection()
