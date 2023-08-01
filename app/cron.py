from django.core.management.base import BaseCommand
from .helper import dowellconnection

from constant import candidate_management_reports
import json
import logging
import datetime
from dateutil.relativedelta import relativedelta


def change_status(self, *args,):
    data = {}
    field = {}
    update_field = {
        "status": "hired"
    }
    applications = dowellconnection(*candidate_management_reports, "fetch", field, update_field)
    job_applications_data=json.load(applications)
    for application in job_applications_data:
            hired_on = application.get("hired_on")
            rehire_date = hired_on + relativedelta(days=7)
            current_date = datetime.today()
            if current_date < rehire_date:
                application["status"] = 'Hired'
            else:
                application["status"] = 'Rehire'
   

        