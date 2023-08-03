from datetime import datetime
from dateutil.parser import isoparse
from dateutil.relativedelta import relativedelta
from helper import dowellconnection
from constant import candidate_management_reports
import json

def rehire_candidates():
    field = {
        "status": "hired"
    }
    update_field = {
        "status": "rehired"
    }
    applications = dowellconnection(*candidate_management_reports, "fetch", field, update_field)
    job_applications_data = json.loads(applications)['data']
    for application in job_applications_data:
        onboarded_on = application.get("onboarded_on")
        rehire_date = isoparse(onboarded_on).date() + relativedelta(days=7)
        current_date = datetime.today().date()
        if current_date > rehire_date:
            update_status = dowellconnection(*candidate_management_reports, "update", field, update_field)

if __name__ == "__main__":
    rehire_candidates()
