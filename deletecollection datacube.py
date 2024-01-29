import requests
import json
url = "https://datacube.uxlivinglab.online/db_api/crud/"


import requests
import json

url = "https://datacube.uxlivinglab.online/db_api/get_data/"

data = {
    "api_key": "1b834e07-c68b-4bf6-96dd-ab7cdc62f07f",
    "db_name": "ATTENDANCE_DB",
    "coll_name": "Events_Collection",
    "operation": "fetch",
    "filters": {},
    "limit": 100,
    "offset": 0
}

response = json.loads(requests.post(url, json=data).text)
# print(response.text)

events_to_delete=[]

for event in response["data"]:
    events_to_delete.append(event["_id"])

print(events_to_delete)

url2 = "https://datacube.uxlivinglab.online/db_api/crud/"

for delete_id in events_to_delete:
    data = {
        "api_key": "1b834e07-c68b-4bf6-96dd-ab7cdc62f07f",
        "db_name": "ATTENDANCE_DB",
        "coll_name": "Events_Collection",
        "operation": "delete",
        "query": {
            "_id": delete_id,
        }

    }
    response = requests.delete(url2, json=data)
    print(response.text)
