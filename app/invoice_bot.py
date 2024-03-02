from datetime import datetime, timedelta
from app.helper import check_position
from app.views import get_all_onboarded_candidate
from app._views import process_payment
from app.views import get_all_task_details
from app.views import get_user_wise_attendance


def getPreviousWeekDates():
    current_date = datetime.now()
    weekday = current_date.weekday()
    monday = current_date - timedelta(days=weekday, weeks=1)
    friday = monday + timedelta(days=4)
    sunday = monday + timedelta(days=6)

    return {
        "Monday": monday.strftime("%Y-%m-%d"),
        "Friday": friday.strftime("%Y-%m-%d"),
        "Sunday": sunday.strftime("%Y-%m-%d"),
    }


def calculate_hours(worklogs):
    total_hours = 0
    for log in worklogs:
        start_time = datetime.strptime(log["start_time"], "%H:%M")
        end_time = datetime.strptime(log["end_time"], "%H:%M")
        time_diff = end_time - start_time
        total_hours += time_diff.total_seconds() / 3600  # convert seconds to hours
    return total_hours


def create_invoice_bot():
    # Get previous week dates
    monday_pf_previous_week, friday_of_previous_week, sunday_of_previous_week = (
        getPreviousWeekDates(datetime.datetime.now())
    )
    company_id = "63a2b3fb2be81449d3a30d3f"

    # Fetch all applications that have a user_id and data_type of 'Real_Data'
    all_applications = get_all_onboarded_candidate()

    # Loop through all the applications
    for application in all_applications:
        # Get all logs between Monday and Sunday
        user_approved_logs = get_all_task_details(
            application["username"], monday_pf_previous_week, sunday_of_previous_week
        )

        # Filter only approved logs
        user_approved_logs = [
            log for log in user_approved_logs if log["status"] == "approved"
        ]

        # Calculate hours
        hours = calculate_hours(user_approved_logs)

        # Check user role
        user_role = check_position(application["username"], company_id)

        if user_role in ["Group lead", "Teamlead"]:
            if hours < 40:
                print(
                    f'Invoice not created for {application["username"]} because hours did not meet requirements'
                )
                continue

            # Check user attendance
            user_present_at_least_once = get_user_wise_attendance(
                application["username"],
                application["project"],
                monday_pf_previous_week,
                friday_of_previous_week,
            )

            # Process payment if user was present at least once
            if user_present_at_least_once:
                process_payment(application["username"])
            else:
                print(
                    f'Invoice not created for {application["username"]} because user was not present for at least one meeting last week'
                )
                continue
        else:
            if hours < 20:
                print(
                    f'Invoice not created for {application["username"]} because hours did not meet requirements'
                )
                continue
