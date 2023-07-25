import json
import requests
import threading
from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .constant import *
from .helper import get_event_id, dowellconnection, call_notification, set_finalize, update_number, update_string, discord_invite,\
    get_guild_channels, get_guild_members , create_master_link , send_mail , interview_email
from .serializers import AccountSerializer, RejectSerializer, AdminSerializer, TrainingSerializer, \
    UpdateQuestionSerializer, CandidateSerializer, HRSerializer, LeadSerializer, TaskSerializer, \
    SubmitResponseSerializer, SettingUserProfileInfoSerializer, UpdateSettingUserProfileInfoSerializer, \
    SettingUserProjectSerializer, UpdateSettingUserProjectSerializer, SettingUserProfileInfo, UpdateuserSerializer, UserProject , CreatePublicLinkSerializer ,SendMailToPublicSerializer
import datetime
from dateutil.relativedelta import relativedelta
import jwt
import json
import requests
import threading
from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .constant import *
from .helper import get_event_id, dowellconnection, call_notification, set_finalize, update_number, update_string, discord_invite,\
    get_guild_channels, get_guild_members , create_master_link , send_mail , interview_email
from .serializers import AccountSerializer, RejectSerializer, AdminSerializer, TrainingSerializer, \
    UpdateQuestionSerializer, CandidateSerializer, HRSerializer, LeadSerializer, TaskSerializer, \
    SubmitResponseSerializer, SettingUserProfileInfoSerializer, UpdateSettingUserProfileInfoSerializer, \
    SettingUserProjectSerializer, UpdateSettingUserProjectSerializer, SettingUserProfileInfo, UpdateuserSerializer, UserProject , CreatePublicLinkSerializer ,SendMailToPublicSerializer
import datetime
from dateutil.relativedelta import relativedelta
import jwt

# Create your views here.

INVERVIEW_CALL = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;300;400;500;600&display=swap" rel="stylesheet">
    <title>Interview Invitation</title>
</head>
<body style="font-family: poppins;background-color: #f5f5f5;margin: 0;padding: 0;text-align: center;">
    <div style="max-width: 600px;margin: 20px auto;background-color: #fff;padding: 20px;border-radius: 4px;box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
        <div style= :text-align: center;margin-bottom: 20px;>
            <img src="http://67.217.61.253/hr/logo-2-min-min.png" alt="Company Logo" style="width: 200px;">
        </div>
        <div >
            <h3 style="text-align: center;font-size: 24px;margin: 0;margin-bottom: 10px;">Hello {},</h3>
            <img src="https://img.freepik.com/free-vector/people-talking-via-electronic-mail_52683-38063.jpg?size=626&ext=jpg&ga=GA1.1.225976907.1673277028&semt=ais" alt="Interview Image" style="display: block;margin: 0 auto;width: 400px;max-width: 100%;border-radius: 4px;">
        </div>
        <div>
            <p style="margin: 0;margin-bottom: 10px;line-height: 1.5;">Congratulations! You have been invited to interview for the {} job at DoWell UX Living Lab.</p>
            <p style="margin: 0;margin-bottom: 10px;line-height: 1.5;">Here are the details of the interview:</p>
            <p style="margin: 0;margin-bottom: 10px;line-height: 1.5;"><b>Venue:</b> Discord</p>
            <p style="margin: 0;margin-bottom: 10px;line-height: 1.5;"><b>Time:</b> {}</p>
            <br>
            <p style="margin: 0;margin-bottom: 10px;line-height: 1.5;">Kindly click the button below to join the Discord server:</p>
            <a href="https://discord.gg/Qfw7nraNPS" style="display: inline-block;background-color: #007bff;color: #fff;text-decoration: none;padding: 10px 20px;border-radius: 4px;transition: background-color 0.3s ease;text-align: center;" target="_blank">Join Discord Server</a>
        </div>
    </div>
</body>
</html>
"""

INVITATION_MAIL = """

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FULL SIGNUP MAIL</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter&family=Poppins&display=swap" rel="stylesheet">
</head>
<body>
    <div style="width: 80%; margin: 0 auto;font-family: 'Poppins', sans-serif;">
        <img src="http://67.217.61.253/hr/logo-2-min-min.png" alt="Dowell Logo" width="70px" height="70px" style="display: block; margin: 0 auto;">
        <div style="width: 80%; margin: 0 auto; text-align: center;">
            <p style="font-size: 2rem; font-weight: 700;">Hello {},</p>
            <img src="https://img.freepik.com/free-vector/reading-letter-concept-illustration_114360-4591.jpg?size=626&ext=jpg&ga=GA1.1.225976907.1673277028&semt=sph" alt="mail-logo" width="250px" height="250px">
        </div>
        <div style="width: 80%; margin: 0 auto; text-align: center;">
            <p style="font-weight: 400; margin: 0; margin-bottom: 1.5rem; margin-top: 1rem;">Congratulations! Your application for {} has been approved at DoWell UX Living Lab.</p>
            <p style="font-weight: 400; margin: 0; margin-bottom: 1.5rem;">Kindly use the button below to create an account and track your application progress.</p> 
            <a href="{}" style="text-decoration: none; cursor: pointer; background-color: #005734; padding: 1rem; border-radius: 0.5rem; display: block; margin: 5rem auto 0; width: max-content;">
                <p style="display: inline-block; margin: 0; color: #fff; font-weight: 600;">
                    Complete full signup
                </p>
            </a>
        </div>
    </div>
</body>
</html>




"""
# api for job portal begins here---------------------------
@method_decorator(csrf_exempt, name="dispatch")
class serverStatus(APIView):
    def get(self, request):
        return Response({"info": "Welcome to Dowell-Job-Portal-Version 2.0"}, status=status.HTTP_200_OK)


# api for job portal ends here--------------------------------


# api for account management begins here______________________
@method_decorator(csrf_exempt, name='dispatch')
class accounts_onboard_candidate(APIView):
    def post(self, request):
        data = request.data
        if data:
            """# call the notification api-----
            notify_data = {
                "created_by": data.get('applicant'),
                "org_id": data.get('company_id'),
                "org_name": data.get('company_name'),
                "data_type": data.get('data_type'),
                "user_type": data.get('user_type'),
                "from_field": data.get('company_id'),
                "to": data.get('applicant'),
                "desc": "Notification for action",
                "meant_for": data.get('applicant'),
                "type_of_notification": "notify"
            }
            url = 'https://100092.pythonanywhere.com/api/v1/notifications/'
            create_notification = call_notification(url=url, request_type='post', data=notify_data)"""
            # continue with the onboard candidate api----------------
            field = {
                "_id": data.get("document_id"),
            }
            update_field = {
                "status": data.get("status"),
                "onboarded_on": data.get("onboarded_on"),
            }
            insert_to_hr_report = {
                "event_id": get_event_id()["event_id"],
                "applicant": data.get("applicant"),
                "project": data.get("project"),
                "status": data.get("status"),
                "company_id": data.get("company_id"),
                "data_type": data.get("data_type"),
                #"company_name": data.get('company_name'),
                #"user_type": data.get('user_type'),
                "onboarded_on": data.get("onboarded_on"),
                #"notified": create_notification['isSuccess'],
                #"notification_id": create_notification['inserted_id']
            }
            serializer = AccountSerializer(data=data)
            if serializer.is_valid():
                c_r=[]
                a_r=[]
                def call_dowellconnection(*args):
                    d=dowellconnection(*args)
                    #print(d,*args,"=======================")
                    if "candidate_report" in args:
                        c_r.append(d)
                    if "account_report" in args:
                        a_r.append(d)

                update_response_thread = threading.Thread(target=call_dowellconnection, args=(
                    *candidate_management_reports, "update", field, update_field))
                update_response_thread.start()

                insert_response_thread = threading.Thread(target=call_dowellconnection, args=(
                    *account_management_reports, "update", insert_to_hr_report, update_field))

                insert_response_thread.start()
                # print(update_response_thread,insert_response_thread)
                update_response_thread.join()
                insert_response_thread.join()

                if not update_response_thread.is_alive() and not insert_response_thread.is_alive():
                    #print(json.loads(c_r[0])["isSuccess"],"====",a_r)
                    
                    if json.loads(c_r[0])["isSuccess"] ==True:
                        return Response({"message": f"Candidate has been {data.get('status')}",
                                        #"notification": {"notified": insert_to_hr_report['notified'],
                                         #                   "notification_id": insert_to_hr_report['notification_id']},
                                        "response":json.loads(c_r[0])},
                            status=status.HTTP_201_CREATED,
                        )
                    else:
                        return Response({"message": "Operation has failed","response": json.loads(c_r[0])},
                                    status=status.HTTP_204_NO_CONTENT)
                    
                else:
                    return Response({"message": "Operation failed"}, status=status.HTTP_304_NOT_MODIFIED)
            else:
                default_errors = serializer.errors
                new_error = {}
                for field_name, field_errors in default_errors.items():
                    new_error[field_name] = field_errors[0]
                return Response(new_error, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class accounts_update_project(APIView):
    def patch(self, request):
        data = request.data
        if data:
            """# call the notification api-----
            notify_data = {
                "created_by": data.get('applicant'),
                "org_id": data.get('company_id'),
                "org_name": data.get('company_name'),
                "data_type": data.get('data_type'),
                "user_type": data.get('user_type'),
                "from_field": data.get('company_id'),
                "to": data.get('applicant'),
                "desc": "Notification for action",
                "meant_for": data.get('applicant'),
                "type_of_notification": "notify"
            }
            url = 'https://100092.pythonanywhere.com/api/v1/notifications/'
            create_notification = call_notification(url=url, request_type='post', data=notify_data)
            print(create_notification, "================")"""

            # continue update project api-----
            field = {
                "_id": data.get("document_id"),
            }
            update_field = {
                "payment": data.get("payment"),
                "project": data.get("project"),
                #"applicant": data.get("applicant"),
                #"company_id": data.get("company_id"),
                #"company_name": data.get('company_name'),
                #"data_type": data.get('data_type'),
                #"user_type": data.get('user_type'),
                #"notified": create_notification['isSuccess'],
                #"updated": "True",
                #"notification_id": create_notification['inserted_id']
            }

            c_r=[]
            a_r=[]
            def call_dowellconnection(*args):
                d=dowellconnection(*args)
                #print(d,*args,"=======================")
                if "candidate_report" in args:
                    c_r.append(d)
                if "account_report" in args:
                    a_r.append(d)

            update_response_thread = threading.Thread(target=call_dowellconnection, args=(
                *candidate_management_reports, "update", field, update_field))
            update_response_thread.start()

            insert_response_thread = threading.Thread(target=call_dowellconnection, args=(
                *account_management_reports, "update", field, update_field))

            insert_response_thread.start()
            # print(update_response_thread,insert_response_thread)
            update_response_thread.join()
            insert_response_thread.join()

            if not update_response_thread.is_alive() and not insert_response_thread.is_alive():
                #print(c_r,'::::::')
                if json.loads(c_r[0])["isSuccess"] ==True:
                    return Response({"message": f"Candidate project and payment has been updated",
                                    #"notification": {"notified": update_field['notified'],
                                    #                 "updated": update_field['updated'],
                                    #                 "notification_id": update_field['notification_id']},
                                    "response":json.loads(c_r[0])},
                        status=status.HTTP_201_CREATED,
                    )
                else:
                    return Response({"message": "Failed to update","response": json.loads(c_r[0])},
                                status=status.HTTP_204_NO_CONTENT)
            else:
                return Response({"message": "Failed to update"}, status=status.HTTP_304_NOT_MODIFIED)
        else:
            return Response(
                {"message": "Parameters are not valid"},
                status=status.HTTP_400_BAD_REQUEST,
            )


@method_decorator(csrf_exempt, name='dispatch')
class accounts_rehire_candidate(APIView):
    def post(self, request):
        data = request.data
        if data:
            """# call the notification api-----
            notify_data = {
                "created_by": data.get('applicant'),
                "org_id": data.get('company_id'),
                "org_name": data.get('company_name'),
                "data_type": data.get('data_type'),
                "user_type": data.get('user_type'),
                "from_field": data.get('company_id'),
                "to": data.get('applicant'),
                "desc": "Notification for action",
                "meant_for": data.get('applicant'),
                "type_of_notification": "notify"
            }
            url = 'https://100092.pythonanywhere.com/api/v1/notifications/'
            create_notification = call_notification(url=url, request_type='post', data=notify_data)"""
            # continue with the rehire candidate api----------------

            field = {
                "_id": data.get("document_id"),
            }
            update_field = {
                "status": data.get("status"),
                #"applicant": data.get("applicant"),
                #"company_id": data.get("company_id"),
                #"company_name": data.get('company_name'),
                #"data_type": data.get('data_type'),
                #"user_type": data.get('user_type'),
                #"notified": create_notification['isSuccess'],
                #"rehired": "True",
                #"notification_id": create_notification['inserted_id']
            }

            c_r=[]
            a_r=[]
            def call_dowellconnection(*args):
                d=dowellconnection(*args)
                print(d,*args,"=======================")
                if "candidate_report" in args:
                    c_r.append(d)
                if "account_report" in args:
                    a_r.append(d)

            update_response_thread = threading.Thread(target=call_dowellconnection, args=(
                *candidate_management_reports, "update", field, update_field))
            update_response_thread.start()

            insert_response_thread = threading.Thread(target=call_dowellconnection, args=(
                *account_management_reports, "update", field, update_field))

            insert_response_thread.start()
            # print(update_response_thread,insert_response_thread)
            update_response_thread.join()
            insert_response_thread.join()

            if not update_response_thread.is_alive() and not insert_response_thread.is_alive():
                
                if json.loads(c_r[0])["isSuccess"] ==True:
                    return Response({"message": f"Candidate has been rehired",
                                    #"notification": {"notified": update_field['notified'],
                                    #                 "rehired": update_field['rehired'],
                                    #                 "notification_id": update_field['notification_id']},
                                    "response":json.loads(c_r[0])},
                        status=status.HTTP_200_OK,
                    )
                else:
                    return Response({"message": "Operation failed","response": json.loads(c_r[0])},
                                status=status.HTTP_204_NO_CONTENT)
            else:
                return Response({"message": "Operation failed"}, status=status.HTTP_304_NOT_MODIFIED)
        else:
            return Response(
                {"message": "Parameters are not valid"},
                status=status.HTTP_400_BAD_REQUEST,
            )


@method_decorator(csrf_exempt, name='dispatch')
class accounts_reject_candidate(APIView):
    def post(self, request):
        data = request.data
        print(data)
        if data:
            """# call the notification api-----
            notify_data = {
                "created_by": data.get('applicant'),
                "org_id": data.get('company_id'),
                "org_name": data.get('company_name'),
                "data_type": data.get('data_type'),
                "user_type": data.get('user_type'),
                "from_field": data.get('company_id'),
                "to": data.get('applicant'),
                "desc": "Notification for action",
                "meant_for": data.get('applicant'),
                "type_of_notification": "notify"
            }
            url = 'https://100092.pythonanywhere.com/api/v1/notifications/'
            create_notification = call_notification(url=url, request_type='post', data=notify_data)"""
            # continue with the reject candidate api----------------

            field = {
                "_id": data.get("document_id"),
            }
            update_field = {
                "reject_remarks": data.get("reject_remarks"),
                "status": "Rejected",
                "rejected_on": data.get("rejected_on"),
                "data_type": data.get("data_type"),
            }
            insert_to_account_report = {
                "company_id": data.get("company_id"),
                "applicant": data.get("applicant"),
                "username": data.get("username"),
                "reject_remarks": data.get("reject_remarks"),
                "status": "Rejected",
                "data_type": data.get("data_type"),
                "rejected_on": data.get("rejected_on"),
                #"company_name": data.get('company_name'),
                #"user_type": data.get('user_type'),
                #"notified": create_notification['isSuccess'],
                #"selected": "True",
                #"notification_id": create_notification['inserted_id']
            }
            serializer = RejectSerializer(data=data)
            if serializer.is_valid():

                c_r=[]
                a_r=[]
                def call_dowellconnection(*args):
                    d=dowellconnection(*args)
                    print(d,*args,"=======================")
                    if "candidate_report" in args:
                        c_r.append(d)
                    if "account_report" in args:
                        a_r.append(d)

                candidate_thread = threading.Thread(
                    target=call_dowellconnection,
                    args=(*candidate_management_reports, "update", field, update_field),
                )
                candidate_thread.start()

                hr_thread = threading.Thread(
                    target=call_dowellconnection,
                    args=(*hr_management_reports, "update", field, update_field),
                )
                hr_thread.start()

                lead_thread = threading.Thread(
                    target=call_dowellconnection,
                    args=(*lead_management_reports, "update", field, update_field),
                )
                lead_thread.start()
                account_thread = threading.Thread(target=call_dowellconnection,
                                                  args=(*account_management_reports, "insert", insert_to_account_report,
                                                        update_field))
                account_thread.start()

                hr_thread.join()
                candidate_thread.join()
                lead_thread.join()
                account_thread.join()

                if (not candidate_thread.is_alive() and not hr_thread.is_alive() and not lead_thread.is_alive()
                        and not account_thread.is_alive()):
                    
                    if json.loads(c_r[0])["isSuccess"] ==True:
                        return Response({"message": f"Candidate has been Rejected",
                                        #"notification": {"notified": insert_to_account_report['notified'],
                                        #                "rejected": update_field['rejected'],
                                        #                "notification_id": insert_to_account_report['notification_id']},
                                        "response":json.loads(c_r[0])},
                            status=status.HTTP_200_OK,
                        )
                    else:
                        return Response({"message": "Operation failed","response": json.loads(c_r[0])},
                                    status=status.HTTP_204_NO_CONTENT)
                else:
                    return Response({"message": "Operation failed"}, status=status.HTTP_304_NOT_MODIFIED)
            else:
                default_errors = serializer.errors
                new_error = {}
                for field_name, field_errors in default_errors.items():
                    new_error[field_name] = field_errors[0]
                return Response(new_error, status=status.HTTP_400_BAD_REQUEST)


# api for account management ends here______________________


# api for admin management starts here______________________
@method_decorator(csrf_exempt, name='dispatch')
class admin_create_jobs(APIView):
    def post(self, request):
        data = request.data
        """# call the notification api-----
        notify_data = {
            "created_by": data.get('applicant'),
            "org_id": data.get('company_id'),
            "org_name": data.get('company_name'),
            "data_type": data.get('data_type'),
            "user_type": data.get('user_type'),
            "from_field": data.get('company_id'),
            "to": data.get('applicant'),
            "desc": "Notification for action",
            "meant_for": data.get('applicant'),
            "type_of_notification": "notify"
        }
        url = 'https://100092.pythonanywhere.com/api/v1/notifications/'
        create_notification = call_notification(url=url, request_type='post', data=notify_data)
        #print(create_notification, "=============")"""

        # continue create job api-----
        field = {
            "eventId": get_event_id()["event_id"],
            "job_number": data.get("job_number"),
            "job_title": data.get("job_title"),
            "description": data.get("description"),
            "skills": data.get("skills"),
            "qualification": data.get("qualification"),
            "time_interval": data.get("time_interval"),
            "job_category": data.get("job_category"),
            "type_of_job": data.get("type_of_job"),
            "payment": data.get("payment"),
            "is_active": data.get("is_active", False),
            "general_terms": data.get("general_terms"),
            "module": data.get("module"),
            "technical_specification": data.get("technical_specification"),
            "workflow_terms": data.get("workflow_terms"),
            "payment_terms": data.get("payment_terms"),
            "other_info": data.get("other_info"),
            "company_id": data.get("company_id"),
            "data_type": data.get("data_type"),
            "created_by": data.get("created_by"),
            "created_on": data.get("created_on"),
            #"applicant": data.get("applicant"),
            #"company_name": data.get('company_name'),
            #"user_type": data.get('user_type'),
            #"notified": create_notification['isSuccess'],
            #"created": "True",
            #"notification_id": create_notification['inserted_id']
        }
        update_field = {"status": "nothing to update"}
        serializer = AdminSerializer(data=field)
        #print(serializer,"=========================")
        if serializer.is_valid():
            response = dowellconnection(*jobs, "insert", field, update_field)
            #print(response,"=========================")
            if json.loads(response)["isSuccess"] ==True:
                return Response({"message": "Job creation was successful.",
                                #"notification": {"notified": field['notified'],
                                #                      "created": field['created'],
                                #                      "notification_id": field['notification_id']},
                                 "response":json.loads(response)},
                    status=status.HTTP_201_CREATED,
                )
            else:
                return Response({"message": "Job creation has failed","response": json.loads(response)},
                            status=status.HTTP_204_NO_CONTENT)
        else:
            default_errors = serializer.errors
            new_error = {}
            for field_name, field_errors in default_errors.items():
                new_error[field_name] = field_errors[0]
            return Response(new_error, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class admin_get_job(APIView):
    def get(self, request, document_id):
        field = {
            "_id": document_id
        }
        update_field = {
            "status": "nothing to update"
        }
        response = dowellconnection(*jobs, "fetch", field, update_field)
        # print(response)
        if json.loads(response)["isSuccess"] ==True:
            if len(json.loads(response)["data"])==0:
                return Response({"message":"Job details do not exist","response":json.loads(response)},
                            status=status.HTTP_204_NO_CONTENT)
            else:
                return Response({"message": "List of jobs.", 
                                 "response": json.loads(response)},
                                status=status.HTTP_200_OK)
        else:
            return Response({"message": "There are no jobs with this id", "response": json.loads(response)},
                            status=status.HTTP_204_NO_CONTENT)


@method_decorator(csrf_exempt, name='dispatch')
class admin_get_all_jobs(APIView):
    def get(self, request, company_id):
        field = {
            "company_id": company_id,
        }
        update_field = {
            "status": "nothing to update"
        }
        response = dowellconnection(*jobs, "fetch", field, update_field)
        #print(response)
        if json.loads(response)["isSuccess"] ==True:
            if len(json.loads(response)["data"])==0:
                return Response({"message":"There is no job with the company id",
                                 "response":json.loads(response)},
                            status=status.HTTP_204_NO_CONTENT)
            else:
                return Response({"message": "List of jobs.", 
                                 "response": json.loads(response)},
                                status=status.HTTP_200_OK)
        else:
            return Response({"message": "There is no jobs", 
                             "response": json.loads(response)},
                            status=status.HTTP_204_NO_CONTENT)


# update the jobs
@method_decorator(csrf_exempt, name='dispatch')
class admin_update_jobs(APIView):
    def patch(self, request):
        data = request.data
        if data:
            field = {"_id": data.get("document_id")}
            update_field = data
            response = dowellconnection(*jobs, "update", field, update_field)
            print(response)
            if json.loads(response)["isSuccess"] ==True:
                
                return Response({"message": "Job update was successful", 
                                 "response": json.loads(response)}, 
                                 status=status.HTTP_200_OK)
            else:
                return Response({"message": "Job update has failed", 
                                 "response": json.loads(response)}, 
                                 status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(
                {"message": "Parameters are not valid"},
                status=status.HTTP_400_BAD_REQUEST,
            )


# delete the jobs

@method_decorator(csrf_exempt, name='dispatch')
class admin_delete_job(APIView):
    def delete(self, request, document_id):
        field = {
            "_id": document_id
        }
        update_field = {
            "data_type": "archive_data"
        }
        response = dowellconnection(*jobs, "update", field, update_field)
        print(response)
        if json.loads(response)["isSuccess"] ==True:
            return Response({"message": "Job successfully deleted"},
                                    status=status.HTTP_200_OK)
        else:
            return Response({"message": "Job not successfully deleted",
                             "response":json.loads(response)}, status=status.HTTP_204_NO_CONTENT)
        


# api for admin management ends here______________________


# api for candidate management starts here______________________

@method_decorator(csrf_exempt, name='dispatch')
class candidate_apply_job(APIView):
    def is_eligible_to_apply(self, applicant_email):
        data = self.request.data
        field = {
            "applicant": data.get('applicant'),
            "applicant_email": data.get('applicant_email'),
            "username": data.get('username'),
        }
        update_field = {
            "status": "nothing to update"
        }
        applicant = dowellconnection(*hr_management_reports, "fetch", field, update_field)
        # rejected_reports_modules = []
        # rejected_reports_modules.append(applicant)

        # Check if applicant is present in rejected_reports_modules
        if applicant is not None:
            rejected_dates = [datetime.datetime.strptime(item["rejected_on"], '%m/%d/%Y') for item in
                              json.loads(applicant)["data"]]
            #print(rejected_dates,"=============================")
            if len(rejected_dates) >= 1:
                rejected_on = max(rejected_dates)  # get last date
                #print(rejected_on, "=======================")
                if rejected_on:
                    three_months_after = rejected_on + relativedelta(months=3)
                    # print(rejected_on, "=======================", three_months_after)
                    current_date = datetime.datetime.today()
                    #print(rejected_on, "==========", three_months_after, "=========", current_date)
                    if current_date >= three_months_after or current_date == datetime.datetime.today():
                        return True
                return True
            else:
                return True

        return False

    def post(self, request):
        data = request.data
        applicant_email = data.get("applicant_email")
        if not self.is_eligible_to_apply(applicant_email):
            return Response({"message": "Not eligible to apply yet.",
                             "response":{"applicant": data.get('applicant'),
                                         "applicant_email": data.get('applicant_email'),
                                         "username": data.get('username')}}, status=status.HTTP_400_BAD_REQUEST)
        """# call the notification api-----
        notify_data = {
            "created_by": data.get('applicant'),
            "org_id": data.get('company_id'),
            "org_name": data.get('company_name'),
            "data_type": data.get('data_type'),
            "user_type": data.get('user_type'),
            "from_field": data.get('company_id'),
            "to": data.get('applicant'),
            "desc": "Notification for action",
            "meant_for": data.get('applicant'),
            "type_of_notification": "notify"
        }
        url = 'https://100092.pythonanywhere.com/api/v1/notifications/'
        details = call_notification(url=url, request_type='post', data=notify_data)
        #print(details,"=========+++")"""

        # continue apply api-----
        field = {
            "eventId": get_event_id()['event_id'],
            "job_number": data.get('job_number'),
            "job_title": data.get('job_title'),
            "applicant": data.get('applicant'),
            "applicant_email": data.get('applicant_email'),
            "feedBack": data.get('feedBack'),
            "freelancePlatform": data.get('freelancePlatform'),
            "freelancePlatformUrl": data.get('freelancePlatformUrl'),
            "academic_qualification_type": data.get('academic_qualification_type'),
            "academic_qualification": data.get('academic_qualification'),
            "country": data.get('country'),
            "job_category": data.get('job_category'),
            "agree_to_all_terms": data.get('agree_to_all_terms'),
            "internet_speed": data.get('internet_speed'),
            "other_info": data.get('other_info'),
            "project": "",
            "status": "Pending",
            "hr_remarks": "",
            "teamlead_remarks": "",
            "rehire_remarks": "",
            "server_discord_link": "https://discord.gg/Qfw7nraNPS",
            "product_discord_link": "",
            "payment": data.get('payment'),
            "company_id": data.get('company_id'),
            "company_name": data.get('company_name'),
            "username": data.get('username'),
            "portfolio_name": data.get('portfolio_name'),
            "data_type": data.get('data_type'),
            "user_type": data.get('user_type'),
            "scheduled_interview_date": "",
            "application_submitted_on": data.get('application_submitted_on'),
            "shortlisted_on": "",
            "selected_on": "",
            "hired_on": "",
            "onboarded_on": "",
            "module": data.get("module")
            #"notified": details['isSuccess'],
            #"notification_id": details['inserted_id']
        }
        update_field = {
            "status": "nothing to update"
        }

        serializer = CandidateSerializer(data=field)
        if serializer.is_valid():
            response = dowellconnection(*candidate_management_reports, "insert", field, update_field)
            if json.loads(response)["isSuccess"] ==True:
                return Response({"message": "Application received.",
                                 "Eligibility": self.is_eligible_to_apply(applicant_email),
                                 #"notification": {"notified": field['notified'],
                                  #                "notification_id": field['notification_id']},
                                 "response": json.loads(response),
                                 }, status=status.HTTP_201_CREATED)
            else:
                return Response({"message": "Application failed to receive.","response": json.loads(response)}, status=status.HTTP_304_NOT_MODIFIED)
        else:
            default_errors = serializer.errors
            new_error = {}
            for field_name, field_errors in default_errors.items():
                new_error[field_name] = field_errors[0]
            return Response(new_error, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class candidate_get_job_application(APIView):

    def get(self, request, company_id):
        field = {
            "company_id": company_id
        }
        update_field = {
            "status": "nothing to update"
        }
        response = dowellconnection(*candidate_management_reports, "fetch", field, update_field)
        print(response)
        
        if json.loads(response)["isSuccess"] ==True:
            if len(json.loads(response)["data"])==0:
                return Response({"message":"There is no job with the company id","response":json.loads(response)},
                            status=status.HTTP_204_NO_CONTENT)
            else:
                return Response({"message": "List of jobs applications",
                                 "response": json.loads(response)},
                                status=status.HTTP_200_OK)
        else:
            return Response({"message": "There are no job applications", "response": json.loads(response)},
                            status=status.HTTP_204_NO_CONTENT)


@method_decorator(csrf_exempt, name='dispatch')
class get_candidate_application(APIView):
    def get(self, request, document_id):
        field = {
            "_id": document_id
        }
        update_field = {
            "status": "nothing to update"
        }
        response = dowellconnection(*candidate_management_reports, "fetch", field, update_field)
        print(response)
        
        if json.loads(response)["isSuccess"] ==True:

            if len(json.loads(response)["data"])==0:
                return Response({"message":"There is no candidate job applications with the document id","response":json.loads(response)},
                            status=status.HTTP_204_NO_CONTENT)
            else:
                return Response({"message": "Candidate job applications", 
                                 "response": json.loads(response)},
                                status=status.HTTP_200_OK)
        else:
            return Response({"message": "There are no job applications", "response": json.loads(response)},
                            status=status.HTTP_204_NO_CONTENT)


@method_decorator(csrf_exempt, name='dispatch')
class get_all_onboarded_candidate(APIView):
    def get(self, request, company_id):
        data = company_id
        if data:
            field = {
                #"company_id": company_id,
                "status": "onboarded"
            }
            update_field = {
                "status": "onboarded"
            }
            response = dowellconnection(*candidate_management_reports, "fetch", field, update_field)

            if json.loads(response)["isSuccess"] ==True:
                #print(response,"==========================++++")
                if len(json.loads(response)["data"])==0:
                    return Response({"message":f"There is no {field['status']} Candidates with this company id","response":json.loads(response)},
                                status=status.HTTP_204_NO_CONTENT)
                else:
                    return Response({"message": f"List of {field['status']} Candidates", "response": json.loads(response)},
                                    status=status.HTTP_200_OK)
            else:
                return Response({"message": f"There are no {field['status']} Candidates",
                                 "response": json.loads(response)},
                                status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"message": "Parameters are not valid"}, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class delete_candidate_application(APIView):
    def delete(self, request, document_id):
        field = {
            "_id": document_id
        }
        update_field = {
            "data_type": "Archived_Data"
        }
        response = dowellconnection(*candidate_management_reports, "update", field, update_field)
        print(response, "================================",)
        if json.loads(response)["isSuccess"] == True:
            
            return Response({"message": "Candidate application deleted successfully", "response": json.loads(response)},
                                status=status.HTTP_200_OK)
        else:
            return Response({"message": "There is no job applications", "response": json.loads(response)},
                            status=status.HTTP_204_NO_CONTENT)


# api for candidate management ends here______________________


# api for hr management starts here______________________
@method_decorator(csrf_exempt, name='dispatch')
class hr_shortlisted_candidate(APIView):
    def post(self, request):

        data = request.data
        if data:
            """# call the notification api-----
            notify_data = {
                "created_by": data.get('applicant'),
                "org_id": data.get('company_id'),
                "org_name": data.get('company_name'),
                "data_type": data.get('data_type'),
                "user_type": data.get('user_type'),
                "from_field": data.get('company_id'),
                "to": data.get('applicant'),
                "desc": "Notification for action",
                "meant_for": data.get('applicant'),
                "type_of_notification": "notify"
            }
            url = 'https://100092.pythonanywhere.com/api/v1/notifications/'
            details = call_notification(url=url, request_type='post', data=notify_data)
"""
            # continue shortlisting api-----
            field = {
                "_id": data.get('document_id'),
            }
            update_field = {
                "hr_remarks": data.get('hr_remarks'),
                "status": data.get('status'),
                "shortlisted_on": data.get('shortlisted_on')
            }
            insert_to_hr_report = {
                "event_id": get_event_id()["event_id"],
                "applicant": data.get('applicant'),
                "hr_remarks": data.get('hr_remarks'),
                "status": data.get('status'),
                "company_id": data.get('company_id'),
                #"company_name": data.get('company_name'),
                "data_type": data.get('data_type'),
                #"user_type": data.get('user_type'),
                "shortlisted_on": data.get('shortlisted_on'),
                #"notified": details['isSuccess'],
                #"notification_id": details['inserted_id']
            }

            serializer = HRSerializer(data=data)
            if serializer.is_valid():
                c_r=[]
                h_r=[]
                def call_dowellconnection(*args):
                    d=dowellconnection(*args)
                    print(d,*args,"=======================")
                    if "candidate_report" in args:
                        c_r.append(d)
                    if "hr_report" in args:
                        h_r.append(d)

                update_response_thread = threading.Thread(target=call_dowellconnection, args=(
                    *candidate_management_reports, "update", field, update_field))
                update_response_thread.start()

                insert_response_thread = threading.Thread(target=call_dowellconnection, args=(
                    *hr_management_reports, "update", insert_to_hr_report, update_field))

                insert_response_thread.start()
                # print(update_response_thread,insert_response_thread)
                update_response_thread.join()
                insert_response_thread.join()

                if not update_response_thread.is_alive() and not insert_response_thread.is_alive():

                    if json.loads(c_r[0])["isSuccess"] ==True:
                        return Response({"message": f"Candidate has been {data.get('status')}",
                                        #"notification": {"notified": insert_to_hr_report['notified'],
                                        #                    "notification_id": insert_to_hr_report['notification_id']},
                                        "response":json.loads(c_r[0])},
                            status=status.HTTP_201_CREATED,
                        )
                    else:
                        return Response({"message": "Operation has failed","response": json.loads(c_r[0])},
                                    status=status.HTTP_204_NO_CONTENT)
                else:
                    return Response({"message": "Operation has failed"}, status=status.HTTP_304_NOT_MODIFIED)
            else:
                default_errors = serializer.errors
                new_error = {}
                for field_name, field_errors in default_errors.items():
                    new_error[field_name] = field_errors[0]
                return Response(new_error, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class hr_selected_candidate(APIView):
    def post(self, request):
        data = request.data
        if data:
            """# call the notification api-----
            notify_data = {
                "created_by": data.get('applicant'),
                "org_id": data.get('company_id'),
                "org_name": data.get('company_name'),
                "data_type": data.get('data_type'),
                "user_type": data.get('user_type'),
                "from_field": data.get('company_id'),
                "to": data.get('applicant'),
                "desc": "Notification for action",
                "meant_for": data.get('applicant'),
                "type_of_notification": "notify"
            }
            url = 'https://100092.pythonanywhere.com/api/v1/notifications/'
            create_notification = call_notification(url=url, request_type='post', data=notify_data)
            print(create_notification, "================")"""

            # continue selection api-----
            field = {
                "_id": data.get('document_id'),
            }
            update_field = {
                "hr_remarks": data.get('hr_remarks'),
                "project": data.get('project'),
                "product_discord_link": data.get('product_discord_link'),
                "status": data.get('status'),
                "selected_on": data.get('selected_on')
            }
            insert_to_hr_report = {
                "event_id": get_event_id()["event_id"],
                "applicant": data.get('applicant'),
                "hr_remarks": data.get('hr_remarks'),
                "project": data.get('project'),
                "product_discord_link": data.get('product_discord_link'),
                "status": data.get('status'),
                "company_id": data.get('company_id'),
                #"company_name": data.get('company_name'),
                "data_type": data.get('data_type'),
                #"user_type": data.get('user_type'),
                "selected_on": data.get('selected_on'),
                #"notified": create_notification['isSuccess'],
                #"selected": "True",
                #"notification_id": create_notification['inserted_id']
            }

            c_r=[]
            h_r=[]
            def call_dowellconnection(*args):
                d=dowellconnection(*args)
                arg=args
                print(d,*args,"=======================")
                if "candidate_report" in args:
                    c_r.append(d)
                if "hr_report" in args:
                    h_r.append(d)

            update_response_thread = threading.Thread(target=call_dowellconnection, args=(
                *candidate_management_reports, "update", field, update_field))
            update_response_thread.start()

            insert_response_thread = threading.Thread(target=call_dowellconnection, args=(
                *hr_management_reports, "update", insert_to_hr_report, update_field))

            insert_response_thread.start()
            # print(update_response_thread,insert_response_thread)
            update_response_thread.join()
            insert_response_thread.join()

            if not update_response_thread.is_alive() and not insert_response_thread.is_alive():
                """# call the mark as seen notification api-----
                n_id = insert_to_hr_report['notification_id']
                url = f'https://100092.pythonanywhere.com/api/v1/notifications/{n_id}/'
                patch_notification = call_notification(url=url, request_type='patch', data=notify_data)
"""
                if json.loads(c_r[0])["isSuccess"] ==True:
                    return Response({"message": f"Candidate has been {data.get('status')}",
                                    #"notification": {"notified": insert_to_hr_report['notified'],
                                    #                 "seen": patch_notification['isSuccess'],
                                    #                    "notification_id": insert_to_hr_report['notification_id']},
                                    "response":json.loads(c_r[0])},
                        status=status.HTTP_200_OK,
                    )
                else:
                    return Response({"message": "Hr Operation has failed","response": json.loads(c_r[0])},
                                status=status.HTTP_204_NO_CONTENT)
            else:
                return Response({"message": "Hr operation failed"}, status=status.HTTP_304_NOT_MODIFIED)
        else:
            return Response({"message": "Parameters are not valid"}, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class hr_reject_candidate(APIView):
    def post(self, request):
        data = request.data
        print(data)
        if data:
            """# call the notification api-----
            notify_data = {
                "created_by": data.get('applicant'),
                "org_id": data.get('company_id'),
                "org_name": data.get('company_name'),
                "data_type": data.get('data_type'),
                "user_type": data.get('user_type'),
                "from_field": data.get('company_id'),
                "to": data.get('applicant'),
                "desc": "Notification for action",
                "meant_for": data.get('applicant'),
                "type_of_notification": "notify"
            }
            url = 'https://100092.pythonanywhere.com/api/v1/notifications/'
            create_notification = call_notification(url=url, request_type='post', data=notify_data)
            print(create_notification, "================")"""

            # continue reject api-----
            field = {
                "_id": data.get('document_id'),
            }
            update_field = {
                "reject_remarks": data.get('reject_remarks'),
                "status": "Rejected",
                "data_type": data.get('data_type'),
                "rejected_on": data.get('rejected_on')
            }
            insert_to_hr_report = {
            "company_id": data.get('company_id'),
            "applicant": data.get('applicant'),
            "username": data.get("username"),
            "reject_remarks": data.get('reject_remarks'),
            "status": "Rejected",
            "data_type": data.get('data_type'),
            "rejected_on": data.get('rejected_on'),
            #"company_name": data.get('company_name'),
            #"user_type": data.get('user_type'),
            #"notified": create_notification['isSuccess'],
            #"Rejected": "True",
            #"notification_id": create_notification['inserted_id']
        }

        serializer = RejectSerializer(data=data)
        if serializer.is_valid():
            candidate_report_result = []
            hr_report_result = []

            def call_dowellconnection(*args):
                try:
                    result = dowellconnection(*args)
                    if "candidate_report" in args:
                        candidate_report_result.append(result)
                    if "hr_report" in args:
                        hr_report_result.append(result)
                except Exception as e:
                    # Handle the exception
                    print(f"Error in call_dowellconnection: {e}")

            candidate_thread = threading.Thread(target=call_dowellconnection, args=(*candidate_management_reports, "update", field, update_field))
            candidate_thread.start()

            hr_thread = threading.Thread(target=call_dowellconnection, args=(*hr_management_reports, "insert", insert_to_hr_report, update_field))
            hr_thread.start()

            candidate_thread.join()
            hr_thread.join()

            if not candidate_thread.is_alive() and not hr_thread.is_alive():
                """# call the mark as seen notification api-----
                n_id = insert_to_hr_report['notification_id']
                url = f'https://100092.pythonanywhere.com/api/v1/notifications/{n_id}/'
                patch_notification = call_notification(url=url, request_type='patch', data=notify_data)
                """
                if json.loads(candidate_report_result[0])["isSuccess"]:
                    return Response(
                        {
                            "message": f"Candidate has been {insert_to_hr_report['status']}",
                            #"notification": {"notified": insert_to_hr_report['notified'],
                            #                "rejected": patch_notification['isSuccess'],
                            #                    "notification_id": insert_to_hr_report['notification_id']},
                            "response": json.loads(candidate_report_result[0]),
                        },
                        status=status.HTTP_201_CREATED,
                    )
                else:
                    return Response(
                        {"message": "Hr Operation failed", "response": json.loads(candidate_report_result[0])},
                        status=status.HTTP_204_NO_CONTENT,
                    )
            else:
                return Response({"message": "Hr Operation failed"}, status=status.HTTP_304_NOT_MODIFIED)
        else:
            default_errors = serializer.errors
            new_error = {}
            for field_name, field_errors in default_errors.items():
                new_error[field_name] = field_errors[0]
            return Response(new_error, status=status.HTTP_400_BAD_REQUEST)


# api for hr management ends here________________________


# api for lead management starts here________________________
@method_decorator(csrf_exempt, name='dispatch')
class lead_hire_candidate(APIView):
    def post(self, request):
        data = request.data
        if data:
            """# call the notification api-----
            notify_data = {
                "created_by": data.get('applicant'),
                "org_id": data.get('company_id'),
                "org_name": data.get('company_name'),
                "data_type": data.get('data_type'),
                "user_type": data.get('user_type'),
                "from_field": data.get('company_id'),
                "to": data.get('applicant'),
                "desc": "Notification for action",
                "meant_for": data.get('applicant'),
                "type_of_notification": "notify"
            }
            url = 'https://100092.pythonanywhere.com/api/v1/notifications/'
            create_notification = call_notification(url=url, request_type='post', data=notify_data)
            print(create_notification, "================")
"""
            # continue hire api-----
            field = {
                "_id": data.get('document_id'),
            }
            update_field = {
                "teamlead_remarks": data.get('teamlead_remarks'),
                "status": data.get('status'),
                "hired_on": data.get('hired_on')
            }
            insert_to_lead_report = {
                "event_id": get_event_id()["event_id"],
                "applicant": data.get('applicant'),
                "teamlead_remarks": data.get('teamlead_remarks'),
                "status": data.get('status'),
                "company_id": data.get('company_id'),
                #"company_name": data.get('company_name'),
                "data_type": data.get('data_type'),
                #"user_type": data.get('user_type'),
                "hired_on": data.get('hired_on'),
                #"notified": create_notification['isSuccess'],
                #"Hired": "True",
                #"notification_id": create_notification['inserted_id']
            }
            serializer = LeadSerializer(data=data)
            if serializer.is_valid():
                c_r=[]
                l_r=[]
                def call_dowellconnection(*args):
                    d=dowellconnection(*args)
                    print(d,*args,"=======================")
                    if "candidate_report" in args:
                        c_r.append(d)
                    if "hr_report" in args:
                        l_r.append(d)

                update_response_thread = threading.Thread(target=call_dowellconnection, args=(
                    *candidate_management_reports, "update", field, update_field))
                update_response_thread.start()

                insert_response_thread = threading.Thread(target=call_dowellconnection, args=(
                    *lead_management_reports, "update", insert_to_lead_report, update_field))

                insert_response_thread.start()
                # print(update_response_thread,insert_response_thread)
                update_response_thread.join()
                insert_response_thread.join()

                if not update_response_thread.is_alive() and not insert_response_thread.is_alive():
                    """# call the mark as seen notification api-----
                    n_id = insert_to_lead_report['notification_id']
                    url = f'https://100092.pythonanywhere.com/api/v1/notifications/{n_id}/'
                    patch_notification = call_notification(url=url, request_type='patch', data=notify_data)
"""
                    if json.loads(c_r[0])["isSuccess"] ==True:
                        return Response({"message": f"Candidate has been {insert_to_lead_report['status']}",
                                        #"notification": {"notified": insert_to_lead_report['notified'],
                                        #                "Hired": patch_notification['isSuccess'],
                                        #                    "notification_id": insert_to_lead_report['notification_id']},
                                        "response":json.loads(c_r[0])},
                            status=status.HTTP_200_OK,
                        )
                    else:
                        return Response({"message": "Hr Operation has failed","response": json.loads(c_r[0])},
                                    status=status.HTTP_204_NO_CONTENT)
                else:
                    return Response({"message": "Lead operation failed"}, status=status.HTTP_304_NOT_MODIFIED)

            else:
                default_errors = serializer.errors
                new_error = {}
                for field_name, field_errors in default_errors.items():
                    new_error[field_name] = field_errors[0]
                return Response(new_error, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class lead_rehire_candidate(APIView):
    def post(self, request):
        data = request.data
        if data:
            """# call the notification api-----
            notify_data = {
                "created_by": data.get('applicant'),
                "org_id": data.get('company_id'),
                "org_name": data.get('company_name'),
                "data_type": data.get('data_type'),
                "user_type": data.get('user_type'),
                "from_field": data.get('company_id'),
                "to": data.get('applicant'),
                "desc": "Notification for action",
                "meant_for": data.get('applicant'),
                "type_of_notification": "notify"
            }
            url = 'https://100092.pythonanywhere.com/api/v1/notifications/'
            create_notification = call_notification(url=url, request_type='post', data=notify_data)
            print(create_notification, "================")
"""
            # continue rehire api-----
            field = {
                "_id": data.get('document_id'),
            }
            update_field = {
                "rehire_remarks": data.get('rehire_remarks'),
                "status": "Rehired",
                #"applicant": data.get('applicant'),
                #"company_id": data.get('company_id'),
                #"company_name": data.get('company_name'),
                #"data_type": data.get('data_type'),
                #"user_type": data.get('user_type'),
                #"rehired_on": data.get('rehired_on'),
                #"notified": create_notification['isSuccess'],
                #"Rehired": "True",
                #"notification_id": create_notification['inserted_id']
            }
            update_response = dowellconnection(*candidate_management_reports, "update", field, update_field)
            print(update_response)
            if json.loads(update_response)["isSuccess"] ==True:
                """# call the mark as seen notification api-----
                n_id = update_field['notification_id']
                url = f'https://100092.pythonanywhere.com/api/v1/notifications/{n_id}/'
                patch_notification = call_notification(url=url, request_type='patch', data=notify_data)
"""
                return Response({"message": f"Candidate has been {update_field['status']}",
                                 #"notification": {"notified": update_field['notified'],
                                  #                       "rehired": patch_notification['isSuccess'],
                                  #                    "notification_id": update_field['notification_id']},
                                "response":json.loads(update_response)}, status=status.HTTP_200_OK)
            else:
                return Response({"message": "Lead Operation failed","response":json.loads(update_response)}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"message": "Parameters are not valid"}, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class lead_reject_candidate(APIView):
    def post(self, request):
        data = request.data
        print(data)
        if data:
            """# call the notification api-----
            notify_data = {
                "created_by": data.get('applicant'),
                "org_id": data.get('company_id'),
                "org_name": data.get('company_name'),
                "data_type": data.get('data_type'),
                "user_type": data.get('user_type'),
                "from_field": data.get('company_id'),
                "to": data.get('applicant'),
                "desc": "Notification for action",
                "meant_for": data.get('applicant'),
                "type_of_notification": "notify"
            }
            url = 'https://100092.pythonanywhere.com/api/v1/notifications/'
            create_notification = call_notification(url=url, request_type='post', data=notify_data)
            print(create_notification, "================")
"""
            # continue reject api-----
            field = {
                "_id": data.get('document_id'),
            }
            update_field = {
                "reject_remarks": data.get('reject_remarks'),
                "status": "Rejected",
                "rejected_on": data.get('rejected_on'),
                "data_type": data.get('data_type')
            }
            insert_to_lead_report = {
                "company_id": data.get('company_id'),
                "applicant": data.get('applicant'),
                "username": data.get("username"),
                "reject_remarks": data.get('reject_remarks'),
                "status": "Rejected",
                "data_type": data.get('data_type'),
                "rejected_on": data.get('rejected_on'),
                #"company_name": data.get('company_name'),
                #"user_type": data.get('user_type'),
                #"notified": create_notification['isSuccess'],
                #"selected": "True",
                #"notification_id": create_notification['inserted_id']
            }

            serializer = RejectSerializer(data=data)
            if serializer.is_valid():
                c_r=[]
                l_r=[]
                def call_dowellconnection(*args):
                    d=dowellconnection(*args)
                    arg=args
                    print(d,*args,"=======================")
                    if "candidate_report" in args:
                        c_r.append(d)
                    if "hr_report" in args:
                        l_r.append(d)

                hr_thread = threading.Thread(target=call_dowellconnection,
                                             args=(*hr_management_reports, "update", field, update_field))
                hr_thread.start()

                candidate_thread = threading.Thread(target=call_dowellconnection,
                                                    args=(*candidate_management_reports, "update", field, update_field))
                candidate_thread.start()

                lead_thread = threading.Thread(target=call_dowellconnection, args=(
                    *lead_management_reports, "insert", insert_to_lead_report, update_field))
                lead_thread.start()

                hr_thread.join()
                candidate_thread.join()
                lead_thread.join()

                if not hr_thread.is_alive() and not candidate_thread.is_alive() and not lead_thread.is_alive():
                    """# call the mark as seen notification api-----
                    n_id = insert_to_lead_report['notification_id']
                    url = f'https://100092.pythonanywhere.com/api/v1/notifications/{n_id}/'
                    patch_notification = call_notification(url=url, request_type='patch', data=notify_data)
"""
                    if json.loads(c_r[0])["isSuccess"] ==True:
                        return Response({"message": f"Candidate has been {insert_to_lead_report['status']}",
                                        #"notification": {"notified": insert_to_lead_report['notified'],
                                        #                "rejected": patch_notification['isSuccess'],
                                        #                    "notification_id": insert_to_lead_report['notification_id']},
                                        "response":json.loads(c_r[0])},
                            status=status.HTTP_201_CREATED,
                        )
                    else:
                        return Response({"message": "Lead Operation has failed","response": json.loads(c_r[0])},
                                    status=status.HTTP_204_NO_CONTENT)
                else:
                    return Response({"message": "Lead Operation failed","response":json.loads(c_r[0])}, status=status.HTTP_304_NOT_MODIFIED)
            else:
                default_errors = serializer.errors
                new_error = {}
                for field_name, field_errors in default_errors.items():
                    new_error[field_name] = field_errors[0]
                return Response(new_error, status=status.HTTP_400_BAD_REQUEST)


# api for lead management ends here________________________


# api for task management starts here________________________
@method_decorator(csrf_exempt, name='dispatch')
class create_task(APIView):
    def max_updated_date(self,updated_date):
        task_updated_date=datetime.datetime.strptime(updated_date, "%m/%d/%Y %H:%M:%S")
        _date= task_updated_date + relativedelta(hours=12)
        return str(_date)
        
    def post(self, request):
        data = request.data
        if data:
            field = {
                "eventId": get_event_id()["event_id"],
                "project": data.get('project'),
                "applicant": data.get('applicant'),
                "task": data.get('task'),
                "status": "Incomplete",
                "task_added_by": data.get('task_added_by'),
                "data_type": data.get('data_type'),
                "company_id": data.get('company_id'),
                "task_created_date": data.get('task_created_date'),
                "task_updated_date": "",
                "approval":False,
                "max_updated_date":self.max_updated_date(data.get('task_created_date'))
            }
            update_field = {
                "status": "Nothing to update"
            }
            insert_response = dowellconnection(*task_management_reports, "insert", field, update_field)
            #print(insert_response)
            if json.loads(insert_response)["isSuccess"] ==True:
                return Response({"message": "Task has been created successfully",
                                 "response":json.loads(insert_response)},
                                status=status.HTTP_201_CREATED)
            else:
                return Response({"message": "Task failed to be Created",
                                 "response":json.loads(insert_response)}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"message": "Parameters are not valid"}, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class get_task(APIView):
    def get(self, request, company_id):
        field = {
            "company_id": company_id
        }
        update_field = {
            "status": "Nothing to update"
        }
        response = dowellconnection(*task_management_reports, "fetch", field, update_field)
        print(response)
        if json.loads(response)["isSuccess"] ==True:
            if len(json.loads(response)["data"])==0:
                return Response({"message":f"There is no task with this company id","response":json.loads(response)},
                            status=status.HTTP_204_NO_CONTENT)
            else:
                return Response({"message": f"List of Task", "response": json.loads(response)},
                                status=status.HTTP_200_OK)
        else:
            return Response({"message": "There are no tasks", "response": json.loads(response)},
                            status=status.HTTP_204_NO_CONTENT)


@method_decorator(csrf_exempt, name='dispatch')
class get_candidate_task(APIView):
    def get(self, request, document_id):
        field = {
            "_id": document_id
        }
        update_field = {
            "status": "Nothing to update"
        }
        response = dowellconnection(*task_management_reports, "fetch", field, update_field)
        print(response)
        if json.loads(response)["isSuccess"] ==True:
            if len(json.loads(response)["data"])==0:
                return Response({"message":f"There is no task with this document id","response":json.loads(response)},
                            status=status.HTTP_204_NO_CONTENT)
            else:
                return Response({"message": f"List of the tasks", "response": json.loads(response)},
                                status=status.HTTP_200_OK)
        else:
            return Response({"message": "There are no tasks", "response": json.loads(response)},
                            status=status.HTTP_204_NO_CONTENT)


@method_decorator(csrf_exempt, name='dispatch')
class update_task(APIView):
    def patch(self, request):
        data = request.data
        if data:
            field = {
                "_id": data.get('document_id')
            }
            update_field = {
                "status": data.get('status'),
                "task": data.get('task'),
                "task_added_by": data.get('task_added_by'),
                "task_updated_date": data.get('task_updated_date'),
            }
            #check if task exists---
            check = dowellconnection(*task_management_reports, "fetch", field, update_field)
            print(check,"=====================[[[[[[]]]]]]")
            if json.loads(check)["isSuccess"] is True:
                if len(json.loads(check)["data"])==0:
                    return Response({"message":"Task failed to be updated, there is no task with this document id","response":json.loads(check)},
                                        status=status.HTTP_404_NOT_FOUND)
                else:
                    response = dowellconnection(*task_management_reports, "update", field, update_field)
                    #print(response, "=========================")
                    if json.loads(response)["isSuccess"] is True:
                        return Response({"message": "Task updated successfully",
                                        "response":json.loads(response)}, status=status.HTTP_200_OK)
                    else:
                        return Response({"message": "Task failed to be updated",
                                        "response":json.loads(response)}, status=status.HTTP_204_NO_CONTENT)
            else:
                return Response({"message": "Task failed to be updated, there is no task with this document id",
                                        "response":json.loads(check)}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"message": "Parameters are not valid"}, status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name='dispatch')
class approve_task(APIView):
    def approvable(self):
        data = self.request.data
        field = {
            "_id": data.get('document_id')
        }
        update_field = {
        }
        response = dowellconnection(*task_management_reports, "fetch", field, update_field)
        #print(response,"==================")
        if response is not None:
            current_date = datetime.datetime.today()
            max_updated_dates = [datetime.datetime.strptime(item["max_updated_date"], "%Y-%m-%d %H:%M:%S") for item in
                              json.loads(response)["data"]]
            #print(max_updated_dates,"=============================")
            if len(max_updated_dates) >= 1:
                max_updated_date = max(max_updated_dates)
                if current_date <= max_updated_date:
                    return True
                else:
                    return False
            else:
                return True

        return False
        
        
    def patch(self, request):
        data = request.data
        if data:
            field = {
                "_id": data.get('document_id')
            }
            update_field = {
                "status": data.get('status'),
                "task": data.get('task')
            }
            # check if a task is approveable
            check_approvable = self.approvable()
            #print(check_approvable)

            if check_approvable is True:
                update_field["approved"]= check_approvable
                response = dowellconnection(*task_management_reports, "update", field, update_field)
                #print(response)
                if json.loads(response)["isSuccess"] is True:
                    return Response({"message": "Task approved successfully",
                                    "response":json.loads(response),
                                    }, status=status.HTTP_200_OK)
                else:
                    return Response({"message": "Task failed to be approved",
                                    "response":json.loads(response)}, status=status.HTTP_204_NO_CONTENT)
            else:
                return Response({"message": "Task failed to be approved. Approval date is over"}, status=status.HTTP_304_NOT_MODIFIED)
            
        else:
            return Response({"message": "Parameters are not valid"}, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class delete_task(APIView):
    def delete(self, request, document_id):
        field = {
            "_id": document_id
        }
        update_field = {
            "data_type": "Archived_Data"
        }
        response = dowellconnection(*task_management_reports, "update", field, update_field)
        print(response)
        if json.loads(response)["isSuccess"] ==True:
            return Response({"message": "Task deleted successfully",
                             "response":json.loads(response)}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Task failed to be deleted",
                             "response":json.loads(response)}, status=status.HTTP_204_NO_CONTENT)


# api for task management ends here________________________


# api for team_task management starts here__________________________

@method_decorator(csrf_exempt, name='dispatch')
class create_team(APIView):
    def post(self, request):
        data = request.data
        if data:
            field = {
                "eventId": get_event_id()['event_id'],
                "team_name": data.get("team_name"),
                "team_description": data.get("team_description"),
                "created_by": data.get("created_by"),
                "company_id": data.get("company_id"),
                "data_type": data.get('data_type'),
                "members": data.get("members")
            }
            update_field = {
                "status": "nothing to update"
            }
            response = dowellconnection(
                *team_management_modules, "insert", field, update_field)
            print(response)
            if json.loads(response)["isSuccess"] ==True:
                return Response({"message": "Team created successfully","response":json.loads(response)}, status=status.HTTP_201_CREATED)
            else:
                return Response({"message": "Team failed to be created","response":json.loads(response)}, status=status.HTTP_304_NOT_MODIFIED)
        else:
            return Response({"message": "Parameters are not valid"}, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class get_team(APIView):
    def get(self, request, team_id):
        field = {
            "_id": team_id,
        }
        update_field = {
            "status": "nothing to update"
        }
        response = dowellconnection(*team_management_modules, "fetch", field, update_field)
        print(response)
        if json.loads(response)["isSuccess"] ==True:
            if len(json.loads(response)["data"])==0:
                return Response({"message":"There is no team available with ths document id","response":json.loads(response)},
                            status=status.HTTP_204_NO_CONTENT)
            else:
                return Response({"message": "List of Teams available", "response": json.loads(response)},
                                status=status.HTTP_200_OK)
        else:
            return Response({"message": "There is no team available with ths document id", "response": json.loads(response)},
                            status=status.HTTP_204_NO_CONTENT)


@method_decorator(csrf_exempt, name='dispatch')
class get_all_teams(APIView):  # all teams
    def get(self, request, company_id):
        field = {
            "company_id": company_id,
        }
        update_field = {
            "status": "nothing to update"
        }
        response = dowellconnection(*team_management_modules, "fetch", field, update_field)
        print(response)
        if json.loads(response)["isSuccess"] ==True:
            if len(json.loads(response)["data"])==0:
                return Response({"message":"There is no teams with this company id","response":json.loads(response)},
                            status=status.HTTP_204_NO_CONTENT)
            else:
                return Response({"message": f"Teams with company id - {company_id} available", "response": json.loads(response)},
                                status=status.HTTP_200_OK)
        else:
            return Response({"message": "There is no team available with ths document id", "response": json.loads(response)},
                            status=status.HTTP_204_NO_CONTENT)


@method_decorator(csrf_exempt, name='dispatch')
class edit_team(APIView):
    def patch(self, request, team_id):
        data = request.data
        
        if data:
            field = {
                "_id": team_id,
            }
            update_field = {
                "members": data.get("members"),
                "team_name": data.get("team_name"),
                "team_description": data.get("team_description"),
            }
            #check if task exists---
            check = dowellconnection(*team_management_modules, "fetch", field, update_field)
            #print(check,"=====================[[[[[[]]]]]]")
            if json.loads(response)["isSuccess"] ==True:
                if len(json.loads(check)["data"])==0:
                    return Response({"message":"Cannot be Edited, there is no team with this team id","response":json.loads(check)},
                                        status=status.HTTP_204_NO_CONTENT)
                else:
                    response = dowellconnection(
                        *team_management_modules, "update", field, update_field)
                    print(response)
                    if json.loads(response)["isSuccess"] ==True:
                        return Response({"message": "Team Updated successfully",
                                        "response": json.loads(response)},
                                        status=status.HTTP_200_OK)
                    else:
                        return Response({"message": "Team failed to be updated", "response":json.loads(response)}, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response({"message":"Cannot be Edited, there is no team with this team id","response":json.loads(check)},
                                        status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"message": "Parameters are not valid"}, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class delete_team(APIView):
    def delete(self, request, team_id):
        field = {
            "_id": team_id
        }
        update_field = {
            "data_type": "Archived_Data"
        }
        response = dowellconnection(*team_management_modules, "update", field, update_field)
        print(response)
        if json.loads(response)["isSuccess"] ==True:
            return Response({"message": f"Team has been deleted","response":json.loads(response)}, status=status.HTTP_200_OK)
        else:
            return Response({"message": f"Team failed to be deleted", "response":json.loads(response)},
                            status=status.HTTP_204_NO_CONTENT)


@method_decorator(csrf_exempt, name='dispatch')
class create_team_task(APIView):
    def post(self, request):
        data = request.data
        if data:
            field = {
                "eventId": get_event_id()['event_id'],
                'title': data.get("title"),
                'description': data.get("description"),
                "assignee": data.get("assignee"),
                "completed": data.get("completed"),
                "team_id": data.get("team_id"),
                "data_type": data.get('data_type'),
                "due_date":data.get("due_date")
            }
            update_field = {
                "status": "nothing to update"
            }
            response = dowellconnection(*task_management_reports, "insert", field, update_field)
            print(response)
            if json.loads(response)["isSuccess"] ==True:
                return Response({"message": "Task created successfully", "response":json.loads(response)}, status=status.HTTP_201_CREATED)
            else:
                return Response({"message": "Task Creation Failed","response":json.loads(response)}, status=status.HTTP_304_NOT_MODIFIED)
        else:
            return Response({"message": "Parameters are not valid"}, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class edit_team_task(APIView):
    def patch(self, request, task_id):
        data = request.data
        if data:
            field = {
                "_id": task_id,
            }
            update_field = {
                "title": data.get("title"),
                "description": data.get("description"),
                "assignee": data.get("assignee"),
                "completed": data.get("completed"),
                "team_name": data.get("team_name"),
            }
            #check if task exists---
            check = dowellconnection(*team_management_modules, "fetch", field, update_field)
            #print(check,"=====================[[[[[[]]]]]]")
            if len(json.loads(check)["data"])==0:
                return Response({"message":"Cannot be Edited, there is no team task with this id","response":json.loads(check)},
                                    status=status.HTTP_204_NO_CONTENT)
            else:
                response = dowellconnection(
                    *task_management_reports, "update", field, update_field)
                print(response)
                if json.loads(response)["isSuccess"] ==True:
                    return Response({"message": "Team Task Updated successfully",
                                    "response": json.loads(response)},
                                    status=status.HTTP_200_OK)
                else:
                    return Response({"message": "Team Task failed to be updated", "response":json.loads(response)}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"message": "Parameters are not valid"}, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class get_team_task(APIView):
    def get(self, request, team_id):
        field = {
            "team_id": team_id,
        }
        update_field = {
            "status": "nothing to update"
        }
        response = dowellconnection(
            *task_management_reports, "fetch", field, update_field)
        
        if json.loads(response)["isSuccess"] ==True:
            if len(json.loads(response)["data"])==0:
                return Response({"message":f"There are no tasks with this team id",
                                 "success":False,
                                 "Data":[]},
                            status=status.HTTP_204_NO_CONTENT)
            else:
                return Response({"message": f"Tasks with team id - {team_id} available", "response": json.loads(response)},
                                status=status.HTTP_200_OK)
        else:
            return Response({"message": "There is no task with team id",
                             "response": json.loads(response)},
                            status=status.HTTP_204_NO_CONTENT)


@method_decorator(csrf_exempt, name='dispatch')
class delete_team_task(APIView):
    def delete(self, request, task_id):
        field = {
            "_id": task_id
        }
        update_field = {
            "data_type": "Archived_Data"
        }
        response = dowellconnection(*task_management_reports, "update", field, update_field)
        print(response)
        if json.loads(response)["isSuccess"] ==True:
            return Response({"message": f"Tasks with task id - {task_id} has been deleted", "response": json.loads(response)},
                                status=status.HTTP_200_OK)
        else:
            return Response({"message": f"Task with id {task_id} failed to be deleted", "response":json.loads(response)},
                            status=status.HTTP_204_NO_CONTENT)


# this is the api for creating a task for a team member
@method_decorator(csrf_exempt, name='dispatch')
class create_member_task(APIView):
    def post(self, request):
        data = request.data
        # print(request.data)
        if data:
            field = {
                "eventId": get_event_id()['event_id'],
                'title': data.get("title"),
                'description': data.get("description"),
                "assignee": data.get("assignee"),
                "completed": data.get("completed"),
                "team_name": data.get("team_name"),
                "team_member": data.get("team_member"),
                "data_type": data.get('data_type')
            }
            update_field = {
                "status": "nothing to update"
            }
            response = dowellconnection(*task_management_reports, "insert", field, update_field)
            print(response)
            if json.loads(response)["isSuccess"] ==True:
                return Response({"message": "Task for member created successfully", "response":json.loads(response)}, status=status.HTTP_201_CREATED)
            else:
                return Response({"message": "Task for member Creation Failed", "response":json.loads(response)}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"message": "Parameters are not valid"}, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class get_member_task(APIView):
    def get(self, request, task_id):
        field = {
            "_id": task_id,
        }
        update_field = {
            "status": "nothing to update"
        }
        response = dowellconnection(*task_management_reports, "fetch", field, update_field)
        print(response)
        if json.loads(response)["isSuccess"] ==True:
            if len(json.loads(response)["data"])==0:
                return Response({"message":f"There is no member tasks with this task id","response":json.loads(response)},
                            status=status.HTTP_204_NO_CONTENT)
            else:
                return Response({"message": f"Member Task with task id - {task_id} available", "response": json.loads(response)},
                            status=status.HTTP_200_OK)
        else:
            return Response({"message": "There is no member tasks with this task id",
                             "response": json.loads(response)},
                            status=status.HTTP_204_NO_CONTENT)


@method_decorator(csrf_exempt, name='dispatch')
class delete_member_task(APIView):
    def delete(self, request, task_id):
        field = {
            "_id": task_id
        }
        update_field = {
            "data_type": "Archived_Data"
        }
        response = dowellconnection(*task_management_reports, "update", field, update_field)
        print(response)
        if json.loads(response)["isSuccess"] ==True:
            return Response({"message": f"Member Task with id {task_id} has been deleted", "response":json.loads(response)}, status=status.HTTP_200_OK)
        else:
            return Response({"message": f"Member Task with id {task_id} failed to be deleted","response":json.loads(response)},
                            status=status.HTTP_204_NO_CONTENT)


# api for team_task management ends here____________________________


# api for training management starts here______________________
@method_decorator(csrf_exempt, name='dispatch')
class create_question(APIView):
    def post(self, request):
        data = request.data
        field = {
            "eventId": get_event_id()["event_id"],
            "company_id": data.get("company_id"),
            "data_type": data.get("data_type"),
            "question_link": data.get("question_link"),
            "module": data.get("module"),
            "created_on": data.get("created_on"),
            "created_by": data.get("created_by"),
            "is_active": data.get("is_active"),
        }
        update_field = {"status": "nothing to update"}
        serializer = TrainingSerializer(data=field)
        if serializer.is_valid():
            question_response = dowellconnection(*questionnaire_modules, "insert", field, update_field)
            print(question_response)
            if json.loads(question_response)["isSuccess"] ==True:
                return Response(
                    {"message": "Question created successfully","response":json.loads(question_response)},
                    status=status.HTTP_201_CREATED,
                )
            else:
                return Response({"message": "Question failed to be created","response":json.loads(response)}, status=status.HTTP_304_NOT_MODIFIED)
        else:
            default_errors = serializer.errors
            new_error = {}
            for field_name, field_errors in default_errors.items():
                new_error[field_name] = field_errors[0]
            return Response(new_error, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name="dispatch")
class get_all_question(APIView):
    def get(self, request, company_id):
        field = {
            "company_id": company_id,
        }
        update_field = {"status": "nothing to update"}
        question_response = dowellconnection(*questionnaire_modules, "fetch", field, update_field)
        print("----response from dowelconnection---", question_response)
        print(question_response)
        if json.loads(question_response)["isSuccess"] ==True:
            if len(json.loads(question_response)["data"])==0:
                return Response({"message":f"There is no questions","response":json.loads(question_response)},
                            status=status.HTTP_204_NO_CONTENT)
            else:
                return Response({"message": f"List of questions", "response": json.loads(question_response)},
                            status=status.HTTP_200_OK)
        return Response({"error": "There is no questions", "response": json.loads(question_response)}, status=status.HTTP_204_NO_CONTENT)


@method_decorator(csrf_exempt, name="dispatch")
class get_question(APIView):
    def get(self, request, document_id):
        field = {
            "_id": document_id,
        }
        # print(field)
        update_field = {
            "status": "nothing to update"
        }
        question_response = dowellconnection(*questionnaire_modules, "fetch", field, update_field)
        print(question_response)
        if json.loads(question_response)["isSuccess"] ==True:
            if len(json.loads(question_response)["data"])==0:
                return Response({"message":f"There is no questions","response":json.loads(question_response)},
                            status=status.HTTP_204_NO_CONTENT)
            else:
                return Response({"message": f"List of questions", "response": json.loads(question_response)},
                            status=status.HTTP_200_OK)
        else:
            return Response({"error": "No question found","response": json.loads(question_response)}, status=status.HTTP_204_NO_CONTENT)


@method_decorator(csrf_exempt, name="dispatch")
class update_question(APIView):
    def patch(self, request):
        data = request.data
        field = {
            "_id": data.get("document_id"),
        }
        print(field)
        update_field = {
            "is_active": data.get("is_active"),
            "question_link": data.get("question_link"),
        }
        serializer = UpdateQuestionSerializer(data=update_field)
        if serializer.is_valid():
            question_response = dowellconnection(
                *questionnaire_modules, "update", field, update_field
            )
            print(question_response)
            if json.loads(question_response)["isSuccess"] ==True:
                return Response({"message": "Question updated successfully", "response": json.loads(question_response)},
                                status=status.HTTP_200_OK)
            else:
                return Response({"message": "Question failed to update", "response": json.loads(question_response)}, 
                                status=status.HTTP_204_NO_CONTENT)
                
        else:
            default_errors = serializer.errors
            new_error = {}
            for field_name, field_errors in default_errors.items():
                new_error[field_name] = field_errors[0]
            return Response(new_error, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name="dispatch")
class response(APIView):
    def post(self, request):
        data = request.data
        if data:
            field = {
                "event_id": get_event_id()["event_id"],
                "company_id": data.get("company_id"),
                "data_type": data.get("data_type"),
                "module": data.get("module"),
                "project_name": data.get("project_name"),
                "username": data.get("username"),
                "code_base_link": data.get("code_base_link"),
                "live_link": data.get("live_link"),
                "documentation_link": data.get("documentation_link"),
                "started_on": data.get("started_on"),
                "submitted_on": data.get("submitted_on"),
                "rating": data.get("rating")
            }
            update_field = {

            }
            insert_response = dowellconnection(
                *response_modules, "insert", field, update_field)
            print(insert_response)
            if json.loads(insert_response)["isSuccess"] ==True:
                return Response(
                    {"message": "Response has been created successfully", "info": json.loads(insert_response)},
                    status=status.HTTP_201_CREATED)
            else:
                return Response({"message": "Response failed to be Created"}, status=status.HTTP_304_NOT_MODIFIED)
        else:
            return Response({"message": "Parameters are not valid"}, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name="dispatch")
class update_response(APIView):
    def patch(self, request):
        data = request.data
        field = {
            "_id": data.get("document_id"),
        }
        update_field = {
            "code_base_link": data.get("code_base_link"),
            "live_link": data.get("live_link"),
            "documentation_link": data.get("documentation_link"),
        }
        insert_to_hr_report = {
            "status": data.get("status"),
        }

        r_m=[]
        h_r=[]
        def call_dowellconnection(*args):
            d=dowellconnection(*args)
            arg=args
            print(d,*args,"=======================")
            if "Response_report" in args:
                r_m.append(d)
            if "hr_report" in args:
                h_r.append(d)

        insert_to_response_thread = threading.Thread(target=call_dowellconnection, args=(
            *response_modules, "insert", field, update_field))
        insert_to_response_thread.start()

        update_to_hr_thread = threading.Thread(target=call_dowellconnection, args=(
            *hr_management_reports, "update", insert_to_hr_report, update_field))

        update_to_hr_thread.start()
        # print(insert_to_response_thread,update_to_hr_thread)
        update_to_hr_thread.join()
        insert_to_response_thread.join()

        if not insert_to_response_thread.is_alive() and not update_to_hr_thread.is_alive():
            if json.loads(r_m[0])["isSuccess"] ==True:
                return Response({"message": f"Candidate has been {data.get('status')}",
                                "response":json.loads(r_m[0])},
                    status=status.HTTP_200_OK,
                )
            else:
                return Response({"message": f"Candidate has been {data.get('status')}",
                                 "response": json.loads(r_m[0])},
                            status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"message": f"Candidate has been {data.get('status')}"},
                            status=status.HTTP_304_NOT_MODIFIED)


@method_decorator(csrf_exempt, name="dispatch")
class get_response(APIView):
    def get(self, request, document_id):
        field = {
            "_id": document_id,
        }
        update_field = {"status": "nothing to update"}
        response = dowellconnection(*response_modules, "fetch", field, update_field)
        print(response)
        if json.loads(response)["isSuccess"] ==True:
            if len(json.loads(response)["data"])==0:
                return Response({"message":f"There is no responses","response":json.loads(response)},
                            status=status.HTTP_204_NO_CONTENT)
            else:
                return Response({"message": f"List of responses", "response": json.loads(response)},
                            status=status.HTTP_200_OK)
            
        else:
            return Response({"message": "There is no responses","response":json.loads(response)},
                            status=status.HTTP_204_NO_CONTENT)


@method_decorator(csrf_exempt, name='dispatch')
class submit_response(APIView):
    def patch(self, request):
        data = request.data
        field = {
            "_id": data.get('document_id'),
        }
        update_field = {
            "code_base_link": data.get("code_base_link"),
            "live_link": data.get("live_link"),
            "video_link": data.get("video_link"),
            "documentation_link": data.get("documentation_link"),
            "answer_link": data.get("answer_link"),
            "submitted_on": data.get("submitted_on"),
        }
        serializer = SubmitResponseSerializer(data=update_field)
        if serializer.is_valid():
            insert_to_response = dowellconnection(
                *response_modules, "update", field, update_field)
            print(insert_to_response)

            if json.loads(insert_to_response)["isSuccess"] ==True:
                return Response({"message": f"Response has been submitted", "response": json.loads(insert_to_response)},
                                status=status.HTTP_200_OK)
            else:
                return Response({"message": "Response failed to be submitted","response":json.loads(insert_to_response)},
                            status=status.HTTP_204_NO_CONTENT)
            
        else:
            default_errors = serializer.errors
            new_error = {}
            for field_name, field_errors in default_errors.items():
                new_error[field_name] = field_errors[0]
            return Response(new_error, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class get_all_responses(APIView):
    def get(self, request, company_id):
        field = {
            "company_id": company_id,
        }
        print(field)
        update_field = {
            "status": "nothing to update"
        }
        response = dowellconnection(
            *response_modules, "fetch", field, update_field)
        print(response)
        if json.loads(response)["isSuccess"] ==True:
            if len(json.loads(response)["data"])==0:
                return Response({"message":f"There is no responses","response":json.loads(response)},
                            status=status.HTTP_204_NO_CONTENT)
            else:
                return Response({"message": f"List of responses", "response": json.loads(response)},
                            status=status.HTTP_200_OK)
        else:
            return Response({"message":f"There is no responses","response":json.loads(response)}, status=status.HTTP_204_NO_CONTENT)

# api for training management ends here______________________

# api for setting starts here___________________________
@method_decorator(csrf_exempt, name='dispatch')
class SettingUserProfileInfoView(APIView):
    serializer_class = SettingUserProfileInfoSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        profiles = SettingUserProfileInfo.objects.all()
        serializer = self.serializer_class(profiles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


    def put(self, request, pk, *args, **kwargs):
        data=request.data
        setting = SettingUserProfileInfo.objects.get(pk=pk)
        serializer = UpdateSettingUserProfileInfoSerializer(setting,data=request.data)
        if serializer.is_valid():
            current_version = setting.profile_info[-1]["version"]
            setting.profile_info.append({'profile_info': data['profile_title'], 'Role': data['Role'], 'version': update_number(current_version)})
            setting.save()
            old_version = setting.profile_info[-2]["version"]
            setting.profile_info[-2]["version"] = update_string(old_version)
            setting.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.error_messages, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class SettingUserProjectView(APIView):
    serializer_class = SettingUserProjectSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        profiles = UserProject.objects.all()
        serializer = self.serializer_class(profiles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def put(self, request, pk):
        my_model = UserProject.objects.get(pk=pk)
        serializer = SettingUserProjectSerializer(my_model, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
# api for setting ends here____________________________

# api for discord starts here____________________________
@method_decorator(csrf_exempt, name="dispatch")
class generate_discord_invite(APIView):
    def post(self, request):
        data = request.data
        if data:
            # generate invite link-------------------
            invite = discord_invite(server_owner_ids=data.get("owners_ids"), guild_id=data.get("guild_id"), token=data.get("bot_token"))
            #print(invite[0])
            if invite:
                return Response(
                    {"message": "Invite link has been generated successfully",
                     "response": {"invite_link":f"{invite[0]}",
                               "server":f"{invite}"             
                                }
                     },
                    status=status.HTTP_201_CREATED)
            else:
                return Response({"message": "Invite link failed to be generated"}, status=status.HTTP_304_NOT_MODIFIED)
        else:
            return Response({"message": "Parameters are not valid"}, status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name="dispatch")
class get_discord_server_channels(APIView):
    def get(self, request, guild_id, token):
        #print(token,"=====----------------", guild_id)
        channels = get_guild_channels(guildid=guild_id, token=token)
        #print(channels)
        if len(channels) != 0:
            return Response(
                {"message": "List of channels in server",
                    "response": {"num of channels":len(channels),
                                 "channels":channels,           
                                }
                    },
                status=status.HTTP_200_OK)
        else:
            return Response({"message":"There is no channels","response":channels}, status=status.HTTP_204_NO_CONTENT)
        
@method_decorator(csrf_exempt, name="dispatch")
class get_discord_server_members(APIView):
    def get(self, request, guild_id, token):
         #print(token,"=====----------------", guild_id)
        members = get_guild_members(guildid=guild_id, token=token)
        #print(members)
        if len(members) != 0:
            return Response(
                {"message": "List of members in server",
                    "response": {"num of members":len(members),
                                 "members":members,           
                                }
                },
                status=status.HTTP_200_OK)
        else:
            return Response({"message":f"There is no members","response":members}, status=status.HTTP_204_NO_CONTENT)
# api for discord ends here____________________________


#public api for job creation__________________________
@method_decorator(csrf_exempt, name="dispatch")
class Public_apply_job(APIView):
    def post(self, request):
        link_id=request.GET.get("link_id")
        data = request.data
        field = {
            "eventId": get_event_id()['event_id'],
            "job_number": data.get('job_number'),
            "job_title": data.get('job_title'),
            "applicant": data.get('applicant'),
            "applicant_email": data.get('applicant_email'),
            "feedBack": data.get('feedBack'),
            "freelancePlatform": data.get('freelancePlatform'),
            "freelancePlatformUrl": data.get('freelancePlatformUrl'),
            "academic_qualification_type": data.get('academic_qualification_type'),
            "academic_qualification": data.get('academic_qualification'),
            "country": data.get('country'),
            "job_category": data.get('job_category'),
            "agree_to_all_terms": data.get('agree_to_all_terms'),
            "internet_speed": data.get('internet_speed'),
            "other_info": data.get('other_info'),
            "project": "",
            "status": "Guest_Pending",
            "hr_remarks": "",
            "teamlead_remarks": "",
            "rehire_remarks": "",
            "server_discord_link": "https://discord.gg/Qfw7nraNPS",
            "product_discord_link": "",
            "payment": data.get('payment'),
            "company_id": data.get('company_id'),
            "company_name": data.get('company_name'),
            "username": data.get('username'),
            "portfolio_name": data.get('portfolio_name'),
            "data_type": data.get('data_type'),
            "user_type": data.get('user_type'),
            "scheduled_interview_date": "",
            "application_submitted_on": data.get('application_submitted_on'),
            "shortlisted_on": "",
            "selected_on": "",
            "hired_on": "",
            "onboarded_on": "",
            "module": data.get("module"),
            "is_public":True
        }
        update_field = {
            "status": "nothing to update"
        }

        serializer = CandidateSerializer(data=field)
        if serializer.is_valid():
            response = dowellconnection(*candidate_management_reports, "insert", field, update_field)
            if json.loads(response)["isSuccess"] ==True:
                set_finalize(linkid=link_id)
                return Response({"message": "Application received.",
                                 "response": json.loads(response),
                                 }, status=status.HTTP_201_CREATED)
            else:
                return Response({"message": "Application failed to receive.","response": json.loads(response)}, status=status.HTTP_304_NOT_MODIFIED)
        else:
            default_errors = serializer.errors
            new_error = {}
            for field_name, field_errors in default_errors.items():
                new_error[field_name] = field_errors[0]
            return Response(new_error, status=status.HTTP_400_BAD_REQUEST) 
# Generating public link for job application

@method_decorator(csrf_exempt, name="dispatch")
class createPublicApplication(APIView):
    """Create Job Public Job Application link using QRCode function"""

    def post(self, request):
        field = {
            "qr_ids": request.data.get('qr_ids'),
            "job_company_id": request.data.get('job_company_id'),
            "job_id": request.data.get('job_id'),
            "company_data_type": request.data.get('company_data_type')
        }
        serializer = CreatePublicLinkSerializer(data=field)
        if serializer.is_valid():
            qr_ids = field['qr_ids']
            generated_links = [{"link": generate_public_link.format(qr_id, field['job_company_id'], field['job_id'], field['company_data_type'])} for qr_id in qr_ids]
            response_qr_code = create_master_link(field['job_company_id'],generated_links)
            response = json.loads(response_qr_code)
            fields = {
                "eventId": get_event_id()['event_id'],
                "job_company_id": field['job_company_id'],
                "company_data_type": field['company_data_type'],
                "job_id": field['job_company_id'],
                "qr_ids": field['qr_ids'],
                "generated_links": generated_links,
                "master_link": response["qrcodes"][0]["masterlink"],
                "qr_code": response["qrcodes"][0]["qrcode_image_url"],
                "qrcode_id" : response["qrcodes"][0]["qrcode_id"],
                "api_key": response["qrcodes"][0]["links"][0]["response"]["api_key"]
            }
            update_field = {
                "status": "Nothing to update"
            }
            dowellresponse = dowellconnection(*Publiclink_reports,"insert", fields, update_field)
            return Response({
                "success": True,
                "message":"Master link for public job apllication generated successfully",
                "master_link": response["qrcodes"][0]["masterlink"],
                "qr_code": response["qrcodes"][0]["qrcode_image_url"]
            },status=status.HTTP_200_OK)
        else:
            return Response({
                "success": False,
                "message": "Failed to generate master link for public job apllication"
            },status=status.HTTP_400_BAD_REQUEST)
        
    def get(self,request,company_id):
        print(company_id)
        field = {
            "job_company_id": company_id
        }
        update_field = {
            "status":"Nothing to update"
        }
        responses = dowellconnection(*Publiclink_reports,"fetch", field, update_field)
        response = json.loads(responses)

        master_links = []
        for i in response["data"]:
            master_links.append(i["master_link"])

        if response["isSuccess"] ==True:
            return Response({
                "success": True,
                "message": "Master link deatils.",
                "master_link": master_links
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                "success": False,
                "message": "User details is not updated."
            }, status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name="dispatch")
class sendMailToPublicCandidate(APIView):
    """Sending Mail to public user"""
    def post(self, request):
        qr_id = request.data.get('qr_id')
        org_name = request.data.get("org_name")
        org_id = request.data.get("org_id")
        owner_name = request.data.get("owner_name")
        portfolio_name = request.data.get("portfolio_name")
        unique_id = request.data.get("unique_id")
        product = request.data.get("product")
        role = request.data.get("role")
        member_type = request.data.get("member_type")
        toemail = request.data.get("toemail")
        toname = request.data.get("toname")
        subject = request.data.get("subject")
        job_role = request.data.get("job_role")
        data_type = request.data.get("data_type")
        date_time = request.data.get("date_time")

        data = {
            "qr_id": qr_id,
            "org_name": org_name,
            "org_id": org_id,
            "owner_name": owner_name,
            "portfolio_name": portfolio_name,
            "unique_id": unique_id,
            "product": product,
            "role": role,
            "member_type": member_type,
            "toemail": toemail,
            "toname": toname,
            "subject": subject,
            "job_role": job_role,
            "data_type": data_type,
            "date_time": date_time,
        }

        serializer = SendMailToPublicSerializer(data=data)
        if serializer.is_valid():
            encoded_jwt = jwt.encode(
                {
                "qr_id": qr_id,
                "org_name": org_name,
                "org_id": org_id,
                "owner_name": owner_name,
                "portfolio_name": portfolio_name,
                "unique_id": unique_id,
                "product": product,
                "role": role,
                "member_type": member_type,
                "toemail": toemail,
                "toname": toname,
                "data_type": data_type,
                "date_time": date_time,
                "job_role": job_role
            }, 
            "secret", algorithm="HS256"
            )
            link = f"https://100014.pythonanywhere.com/?hr_invitation={encoded_jwt.decode('utf-8')}"
            print("------link------", link)
            email_content = INVITATION_MAIL.format(toname,job_role,link)
            mail_response = interview_email(toname,toemail,subject,email_content)
            response = json.loads(mail_response)
            if response["success"]:
                return Response({
                    "success": True,
                    "message": f"Mail sent successfully to {toname}"
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    "success": False,
                    "message": "Something went wrong"
                }, status= status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({
                "success": False,
                "message": "Something went wrong",
                "error": serializer.errors
            }, status= status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name="dispatch")
class updateTheUserDetails(APIView):
    """Update the user details by login team"""
    def post(self, request):
        qr_id = request.data.get('qr_id')
        username = request.data.get('username')
        portfolio_name = request.data.get('portfolio_name')
        job_role = request.data.get('job_role')
        date_time = request.data.get('date_time')
        toemail = request.data.get('toemail')
        field = {
            "username": qr_id,
        }
        update_field = {
            "username": username,
            "portfolio_name": portfolio_name,
            "status": "Pending"
        }
        serializer = UpdateuserSerializer(data=request.data)
        if serializer.is_valid():
            response = dowellconnection(*candidate_management_reports, "update", field, update_field)
            if json.loads(response)["isSuccess"] ==True:
                email_content = INVERVIEW_CALL.format(username,job_role, date_time)
                subject = "Interview call from DoWell UX Living Lab"
                send_interview_email = interview_email(username,toemail,subject,email_content)
                if json.loads(send_interview_email)["success"]:
                    return Response({
                        "success": True,
                        "message": "User details is updated."
                    }, status=status.HTTP_200_OK)
                else:
                    return Response({
                        "success": False,
                        "message": "Mail was not sent."
                    }, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({
                    "success": False,
                    "message": "User details is not updated."
                }, status=status.HTTP_400_BAD_REQUEST)