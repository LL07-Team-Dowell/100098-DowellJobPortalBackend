import json
from datetime import datetime, timedelta, date
import requests
import threading


"""updating the task details"""
def update_project_details(company_id,_date):
    url=f"https://100098.pythonanywhere.com/project_details/?type=update_day_project&company_id={company_id}&date={_date}"
    
    headers = {"Content-Type": "application/json"}

    response = requests.request("POST", url, headers=headers)
    if response.status_code == 200:
        res = {'status':f'success-{response.status_code}','message':'project time updated', 'data': response.text}
        return res
    elif response.status_code == 204:
        res = {'status':f'error-{response.status_code}','message':"No Project time with these details exists"}
        return res
    elif response.status_code == 304:
        res = {'status':f'error-{response.status_code}','message':'project time not updated'}
        return res
    else:
        res = {'status':f'error-{response.status_code}','message':'project time not updated'}
        return res

def main():
    print("-----------------------------------")
    print("----------Process started----------\n")

    company_id='6385c0f18eca0fb652c94561'
    _date = datetime.today().date()-timedelta(days=1)
    _date = _date.strftime("%Y-%m-%d")

    """project details"""
    response =update_project_details(company_id=company_id,_date=_date)
    print("\n")
    print("----------",response,"-------------\n")
    print("----------Process done-------------")
    print("-----------------------------------")
      
if __name__ == "__main__":
    ##call main-----
    main()