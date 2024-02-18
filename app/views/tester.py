from datetime import datetime, timedelta

import time, json, requests
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

task_details_module = [
    "jobportal",
    "jobportal",
    "task_details",
    "task_details",
    "1000981019",
    "ABCDE",
]

st = time.time()
team_id ="64ba20055ea62015d90b6a3c"
field = {"_id": team_id}
def generate_dates(start_date_str, end_date_str):
    # Convert start date and end date strings to datetime objects
    start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
    end_date = datetime.strptime(end_date_str, '%Y-%m-%d')

    # Initialize list to store dates
    dates = []

    # Iterate through the range of dates and add them to the list
    current_date = start_date
    while current_date <= end_date:
        dates.append(current_date.strftime('%Y-%m-%d'))
        current_date += timedelta(days=1)

    return dates

# Example usage
start_date_str = '2024-01-01'
end_date_str = '2024-01-31'
dates = generate_dates(start_date_str, end_date_str)
print(dates)

tasks = dowellconnection(
    *task_details_module,
    "fetch",
    {"task_created_date": '2024-01-31'},update_field=None,
)
"""for num, i in enumerate(json.loads(tasks)['data']):
    print(num)"""
#print(json.loads(tasks)['data'],"===")

#sorted_data_list = sorted(json.loads(tasks)['data'], key=lambda x: datetime.strptime(set_date_format(x["task_created_date"]), "%m/%d/%Y %H:%M:%S") if set_date_format(x["task_created_date"]) else datetime.max)
#print(sorted_data_list,"\n\n")
print(time.time()-st,"secs ---------")