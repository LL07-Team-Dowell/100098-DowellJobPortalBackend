from database.connection import *
from database.event import *

field = {
  "job_number": 100,
  "job_title": "React developer",
  "applicant": "John Doe",
  "skills": "Strong in Python and JavaScript",
  "freelancePlatform": "Upwork",
  "freelancePlatformUrl": "https://www.upwork.com/o/profiles/users/_~01abcd12efghijklmn/",
  "country": "India",
  "hr_remarks": "Positive feedback from previous employer",
  "agree_to_all_terms": "true",
  "status": "pending",
  "company_id": "10002ABCD",
  "usernames": "johndoe123",
  "data_type": "Real_data"
}
update_field = {
    "status":"nothing to update"
}
# inserted_data = dowellconnection("jobportal","jobportal","jobs","jobs","100098001","ABCDE","update",field,update_field)
inserted_data = dowellconnection("jobportal","jobportal","candidate_reports","candidate_report","100098002","ABCDE","insert",field,update_field)
# inserted_data = dowellconnection("jobportal","jobportal","hr_reports","hr_report","100098003","ABCDE","insert",field,"nill")
# inserted_data = dowellconnection("jobportal","jobportal","lead_reports","lead_report","100098004","ABCDE","insert",field,"nill")
# inserted_data = dowellconnection("jobportal","jobportal","account_reports","account_report","100098005","ABCDE","insert",field,"nill")
# inserted_data = dowellconnection("jobportal","jobportal","admin_reports","admin_report","100098006","ABCDE","insert",field,"nill")

# a = {
#     "document_id":"63d82b241d5dc6eeec86811f",
#     "job_title":"React developer"
# }

# res = {key: a[key] for key in a.keys()}
# print(res)
print(inserted_data)

