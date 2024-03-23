from datetime import datetime
from dateutil.parser import isoparse
from dateutil.relativedelta import relativedelta
from bghelper import dowellconnection
from bghelper import candidate_management_reports
import json


def rehire_candidates():
    data = {}
    field = {"status": "hired"}
    update_field = {"status": "rehired"}
    rehired_count = 0
    applications = dowellconnection(
        *candidate_management_reports, "fetch", field, update_field
    )
    job_applications_data = json.loads(applications)["data"]
    for application in job_applications_data:
        onboarded_on = application.get("onboarded_on")
        if onboarded_on:
            try:
                onboarded_date = isoparse(onboarded_on).date()
                rehire_date = onboarded_date + relativedelta(days=7)
                current_date = datetime.today().date()
                if current_date > rehire_date:
                    application_id = application.get("_id")
                    update_status = dowellconnection(
                        *candidate_management_reports,
                        "update",
                        {"_id": application_id},
                        update_field,
                    )
                    print(f"Application ID {application_id} has been rehired.")
                    rehired_count += 1
            except ValueError:
                print(
                    f"Invalid 'onboarded_on' date format for application ID {application.get('_id')}. Skipping rehire process."
                )
        else:
            print(
                f"'onboarded_on' date is missing for application ID {application.get('_id')}. Skipping rehire process."
            )

    print(f"Total {rehired_count} candidates have been rehired.")


if __name__ == "__main__":
    rehire_candidates()
