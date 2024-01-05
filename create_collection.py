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
    # print(today.weekday())

    start_date = today + timedelta(days=(0 - today.weekday() + 7) % 7)

    
    end_date = start_date + timedelta(days=(4 - start_date.weekday() + 7) % 7)

    # Ensure start_date is not before today
    start_date = max(start_date, today)

    # print("Start date (Monday):", start_date)
    # print("End date (Friday):", end_date)

    return (start_date,end_date)


def datacube_data_insertion():

    url = "https://datacube.uxlivinglab.online/db_api/collections/?name=add_collection"

    
    dates=get_start_end_date()
    
    formatted_dates = tuple(date.strftime("%Y-%m-%d") for date in dates)

    start_date = formatted_dates[0]
    end_date = formatted_dates[1]
    print(start_date)
    print(end_date)
    collection=f"{start_date}_to_{end_date}"
    # formatted_date2 = date2.strftime("%Y-%m-%d")
    print(collection)

    data = {
        "api_key": API_KEY,
        "db_name": DB_Name,
        "coll_names": collection,
        "num_collections": 1,
    }

    response = requests.post(url, json=data)
    res=json.loads(response.text)
    if res["success"]:
        print(f"{collection} has been successfully added {res} ")
    
    print(res["message"])

   

    return None

if __name__ == "__main__":
    datacube_data_insertion()
