import json
from datetime import datetime, timedelta, date
import requests
import threading


"""updating the task details"""
def update_project_details(company_id,_date):
    url=f"https://100098.pythonanywhere.com/project_details/?type=update_day_project&company_id={company_id}&date={_date}"
    
    headers = {"Content-Type": "application/json"}

    response = requests.request("PATCH", url, headers=headers)
    res = json.loads(response.text)

    return res 

def main():
    print("-----------------------------------")
    print("----------Process started----------")

    company_id='6385c0f18eca0fb652c94561'
    _date = datetime.today().date()-timedelta(days=1)
    _date = _date.strftime("%Y-%m-%d")

    """project details"""
    project_details =update_project_details(company_id=company_id,_date=_date)
    print(project_details,"--------------------------------")
    print("----------Process done-------------")
    print("-----------------------------------")
      
if __name__ == "__main__":
    ##call main-----
    main()