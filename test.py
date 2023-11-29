import requests
import json
def datacube_data_retrieval(api_key,database_name,collection_name,data,limit,offset):

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
data={"company_id":"640f12aebab572e4dba376d1"}

# subprojectcheck = json.loads(datacube_data_retrieval("1b834e07-c68b-4bf6-96dd-ab7cdc62f07f","WeeklyAgendaReport", "User-Profile", data, limit=10, offset=0))

subprojectcheck=json.loads(datacube_data_retrieval("1b834e07-c68b-4bf6-96dd-ab7cdc62f07f","teammanagement_db","map",data,limit=0,offset=0))
print(subprojectcheck)