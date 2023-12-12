import json
import requests

def update_report_database():
    url="https://100098.pythonanywhere.com/update_reportdb/"
    payload = json.dumps(
            {
                "report_type":"Individual"
            }
        )
    headers = {"Content-Type": "application/json"}

    response = requests.request("PATCH", url, headers=headers, data=payload)
    res = json.loads(response.text)

    return res 
def main():
    report =update_report_database()
      
if __name__ == "__main__":
    ##call main-----
    main()