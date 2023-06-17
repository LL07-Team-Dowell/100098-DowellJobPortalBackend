### Backend services version 2 for app view


### account management view-------------------------------------------------
_Post_ to `accounts_onboard_candidate/`

- Request Body

```json
{
  "document_id": "<document id>",
  "applicant": "<applicant name>",
  "project": "[<project name 1>,<project name 2>,<project name 3>]",
  "task": "<task>",
  "status": "<status>",
  "company_id": "<company_id>",
  "data_type": "<Real_Data | Learning_Data | Testing_Data | Archived_Data>",
  "company_name": "<company_name>", 
  "user_type": "<Freelancer | Internship | Employee>",
  "onboarded_on": "<onboarded on>"
}
```

- Response 201

```json
{
  "message": "Candidate has been onboarded.",
  "notification": {"notified": "True/False",
                  "notification_id": "notification id"
                    }
}
```
- Response 304

```json
{
  "message": "HR operation failed"
}
```


- Response 400

```json
{
  "message": "serializer.errors"
}
```
_Patch_ to `accounts_update_project/`

- Request Body

```json
{
  "document id": "<document id>",
  "project": "[<project name 1>,<project name 2>,<project name 3>]",
  "payment": "<payment>",
  "applicant": "applicant",
  "company_id": "company_id",
  "data_type": "<Real_Data | Learning_Data | Testing_Data | Archived_Data>",
  "company_name": "<company_name>", 
  "user_type": "<Freelancer | Internship | Employee>"
}
```

- Response 200

```json
{
  "message": "Candidate project and payment has been updated",
  "notification": {"notified": "True/False",
                    "seen": "True/False",
                  "notification_id": "notification id"
                    }
}
```
- Response 304

```json
{
  "message": "Failed to update"
}
```

- Response 400

```json
{
  "message": "Parameters are not valid"
}
```
_Post_ to `accounts_rehire_candidate/`

- Request Body

```json
{
  "document_id": "<document id>",
  "status": "<status>",
  "applicant": "applicant",
  "company_id": "company_id",
  "data_type": "<Real_Data | Learning_Data | Testing_Data | Archived_Data>",
  "company_name": "<company_name>", 
  "user_type": "<Freelancer | Internship | Employee>"
}
```

- Response 200

```json
{
  "message": "Candidate has been rehired",
  "notification": {"notified": "True/False",
                  "notification_id": "notification id"
                    }
}
```

- Response 304

```json
{
  "message": "Operation failed"
}
```
- Response 400

```json
{
  "message": "Parameters are not valid"
}
```
_Post_ to `accounts_reject_candidate/`

- Request Body

```json
{
    "document_id":"<document id>",
    "reject_remarks": "<reject remark>",
    "applicant": "<applicant>",
    "username": "<username>",
    "company_id": "<company id>",
    "data_type": "<Real_Data | Learning_Data | Testing_Data | Archived_Data>",
    "rejected_on": "<rejected on>",
    "company_name": "<company_name>", 
    "user_type": "<Freelancer | Internship | Employee>"
}
```

- Response 200

```json
{
  "message": "Candidate has been Rejected.",
  "notification": {"notified": "True/False",
                  "notification_id": "notification id"
                    }
}
```

- Response 304

```json
{
  "message": "Operation failed"
}
```

- Response 400

```json
{
  "message": "serializer.errors"
}
```

### admin management view-------------------------------------------------

_Post_ to `admin_create_jobs/`

- Request Body

```json
{
  "job_number": "<unique number>",
  "job_title": "<Job title>",
  "description": "Description for the job>",
  "skills": "Required skills for the job",
  "qualification": "<Qualifications required for the job>",
  "job_category": "<Freelancer | Internship | Employee>",
  "type_of_job": "< Full time | Part time | Time based | Task based>",
  "payment": "<Payment for the job>",
  "payment_terms": ["term1", "term2"],
  "is_active": "<True| False>",
  "time_interval": "<Time interval for the job>",
  "general_terms": ["term1", "term2"],
  "technical_specification": ["term1", "term2"],
  "workflow_terms": ["term1", "term2"],
  "other_info": ["term1", "term2"],
  "company_id": "<company_id>",
  "module": "<Frontend | Backend | UI/UX | Virtual Assistant |Web | Mobile>",
  "data_type": "<Real_Data | Learning_Data | Testing_Data | Archived_Data>",
  "created_by": "<created_by>",
  "created_on": "<created_on>"
}
```

- Response 201

```json
{
  "message": "Job creation was successful."
}
```

- Response 304

```json
{
  "message": "Job creation has failed"
}
```

- Response 400

```json
{
  "error": "serializer.errors"
}
```


_Get_ to `admin_get_job/<str:document_id>/`


- Response 200

```json
{
  "message": "Job details",
  "response": "Job details"
}
```

- Response 204

```json
{
  "message": "There are no jobs",
  "response": ["list of jobs"]
}
```


_Get_ to `admin_get_all_jobs/<str:company_id>/`


- Response 200

```json
{
  "message": "List of jobs",
  "response": ["Requested Job list."]
}
```

- Response 204

```json
{
  "message": "There are no jobs",
  "response": ["list of jobs"]
}
```


_Patch_ to `admin_update_jobs/`

- Request Body

```json
{
    "document_id":"<document_id>",
    "update_field" : "Kindly follow notes to update the database , you should not update other field"
}
```

- Response 200

```json
{
  "message": "Job update is successful"
}
```

- Response 304

```json
{
  "message": "Job update has failed"
}
```
- Response 400

```json
{
  "message": "Parameters are not valid"
}
```

_Delete_ to `admin_delete_job/<str:document_id>/`

- Response 200

```json
{
  "message": "Job successfully deleted"
}
```

- Response 304

```json
{
  "message": "Job not successfully deleted"
}
```
- Response 400

```json
{
  "message": "Parameters are not valid"
}
```

### candidate management view-------------------------------------------------
_Post_ to `candidate_apply_job/`

- Request Body

```json
{
  "job_number": "<job _number of already created jobs",
  "job_title": "<job title of already created jobs>",
  "job_category": "<Freelancer | Internship | Employee>",
  "applicant": "<applicant name>",
  "applicant_email": "<applicant email>",
  "feedBack": "<feedback>",
  "freelancePlatform": "<freelancePlatform>",
  "freelancePlatformUrl": "<freelancePlatformUrl>",
  "academic_qualification_type": "<academic_qualification_type>",
  "academic_qualification": "<academic_qualification>",
  "country": "<location function>",
  "internet_speed": "<internet_speed>",
  "other_info": ["term1", "term2"],
  "agree_to_all_terms": "<True | False>",
  "company_id": "<company_id>",
  "username": "<username>",
  "portfolio_name": "<portfolio_name>",
  "data_type": "<Real_Data | Learning_Data | Testing_Data | Archived_Data>",
  "payment": "<payment>",
  "application_submitted_on": "<application_submitted_on>"
}
```

- Response 201

```json
{"message": "Application received.",
  "Eligibility": "True/False"
}
```

- Response 304

```json
{
  "message": "Application not received"
}
```
- Response 400

```json
{
  "message": "Serializers.errors"
}
```


_get_ to `candidate_get_job_application/<str:company_id>/`

- Response 200

```json
{
  "message": "List of job applications",
  "response": ["list of jobs"]
}
```

- Response 204

```json
{
  "message": "There is no job applications",
  "response": ["list of jobs"]
}
```

_get_ to `get_candidate_application/<str:document_id>/`

- Response 200

```json
{
  "message": "Candidate job applications",
  "response": ["Candidate job"]
}
```

- Response 204

```json
{
  "message": "There are no job applications",
  "response": ["Candidate job not exist"]
}
```

_get_ to `get_all_onboarded_candidate/<str:company_id>/`

- Response 200

```json
{
  "message": "List of onboarded Candidates",
  "response": ["List of onboarded Candidates"] 
}
```

- Response 204

```json
{
  "message": "There is no onboarded Candidates",
  "response": ["onboarded Candidates do not exist"]
}
```
- Response 400

```json
{
  "message": "Parameters are not valid"
}
```

_delete_ to `delete_candidate_application/<str:document_id>/`

- Response 200

```json
{
  "message": "Candidate application deleted successfully."
}
```

- Response 304

```json
{
  "message": "Deleting candidate application has failed"
}
```

### hr management view-------------------------------------------------
_Post_ to `hr_shortlisted_candidate/`

- Request Body

```json
{
  "document_id": "<document id>",
  "hr_remarks": "<hr remarks>",
  "status": "<status>",
  "applicant": "<applicant name>",
  "company_id": "<company_id>",
  "data_type": "<Real_Data | Learning_Data | Testing_Data | Archived_Data>",
  "company_name": "<company_name>", 
  "user_type": "<Freelancer | Internship | Employee>",
  "shortlisted_on": "<shortlisted_on>"
}
```

- Response 201

```json
{
  "message": "Candidate has been shortlisted"
}
```
- Response 304

```json
{
  "message": "HR operation failed"
}
```

- Response 400

```json
{
  "message": "serializer.errors"
}
```

_Post_ to `hr_selected_candidate/`

- Request Body

```json
{
  "document_id": "<document id>",
  "hr_remarks": "<hr remarks>",
  "status": "<status>",
  "project": "[<project name 1>,<project name 2>,<project name 3>]",
  "product_discord_link": "<link>",
  "applicant": "<applicant name>",
  "company_id": "<company_id>",
  "data_type": "<Real_Data | Learning_Data | Testing_Data | Archived_Data>",
  "company_name": "<company_name>", 
  "user_type": "<Freelancer | Internship | Employee>",
  "selected_on": "<selected on>"
}
```

- Response 200

```json
{
  "message": "Candidate has been selected"
}
```

- Response 304

```json
{
  "message": "HR operation failed"
}
```
- Response 400

```json
{
  "message": "Parameters are not valid"
}
```
_Post_ to `hr_reject_candidate/`

- Request Body

```json
{
    "document_id":"<document id>",
    "reject_remarks": "<reject remark>",
    "applicant": "<applicant>",
    "username": "<username>",
    "company_id": "<company id>",
    "data_type": "<Real_Data | Learning_Data | Testing_Data | Archived_Data>",
    "rejected_on": "<rejected on>"
}
```

- Response 200

```json
{
  "message": "Candidate has been Rejected"
}
```

- Response 304

```json
{
  "message": "Hr Operation failed"
}
```

- Response 400

```json
{
  "message": "serializers error"
}
```

### lead management view-------------------------------------------------
_Post_ to `lead_hire_candidate/`

- Request Body

```json
{
  "document_id": "<document id>",
  "teamlead_remarks": "<teamlead remarks>",
  "status": "<status>",
  "applicant": "<applicant name>",
  "company_id": "<company_id>",
  "data_type": "<data_type>",
  "hired_on": "<hired_on>"
}
```

- Response 201

```json
{
  "message": "Candidate has been Hired"
}
```

- Response 304

```json
{
  "message": "Lead operation failed"
}
```
- Response 400

```json
{
  "message": "serializer.errors"
}
```

_Post_ to `lead_rehire_candidate/`

- Request Body

```json
{
  "document_id": "<document id>",
  "rehire_remarks": "<rehire remarks>"
}
```

- Response 201

```json
{
  "message": "Candidate has been rehired"
}
```

- Response 304

```json
{
  "message": "Lead operation failed"
}
```
- Response 400

```json
{
  "message": "Parameters are not valid"
}
```
_Post_ to `lead_reject_candidate/`

- Request Body

```json
{
    "document_id":"<document id>",
    "reject_remarks": "<reject remark>",
    "applicant": "<applicant>",
    "username": "<username>",
    "company_id": "<company id>",
    "data_type": "<Real_Data | Learning_Data | Testing_Data | Archived_Data>",
    "rejected_on": "<rejected on>"
}
```

- Response 200

```json
{
  "message": "Candidate has been Rejected"
}
```

- Response 304

```json
{
  "message": "Lead Operation failed"
}
```

- Response 400

```json
{
  "message": "serializers error"
}
```

### task management view-------------------------------------------------

_Post_ to `create_task/`

- Request Body

```json
{
  "project": "[<project name 1>,<project name 2>,<project name 3>]",
  "applicant": "<applicant name>",
  "task": "<task>",
  "task_added_by": "<task added name>",
  "data_type": "<data_type>",
  "company_id": "<company_id>",
  "task_created_date": "<task created date>"
}
```

- Response 201

```json
{
  "message": "Task has been created successfully"
}
```
- Response 304

```json
{
  "message": "Task failed to be Created"
}
```

- Response 400

```json
{
  "message": "Parameters are not valid"
}
```

_Get_ to `get_task/<str:company_id>/`


- Response 200

```json
{
  "message": "List of the tasks",
  "response": ["List of the tasks"]
}
```

- Response 204

```json
{
  "message": "There are no tasks",
  "response": ["There is no task"]
}
```

_Get_ to `get_candidate_task/<str:document_id>/`

- Response 200

```json
{
  "message": "List of the tasks",
  "response": ["List of the tasks"]
}
```

- Response 204

```json
{
  "message": "There are no tasks",
  "response": ["There is no tasks"]
}
```

_Patch_ to `update_task/`

- Request Body

```json
{
  "document_id": "<document id>",
  "task": "<task>",
  "status": "<status>",
  "task_added_by": "<task added name>",
  "task_updated_date": "task updated date"
}
```

- Response 200

```json
{
  "message": "Task updated successfully"
}
```
- Response 304

```json
{
  "message": "Task failed to be updated"
}
```

- Response 400

```json
{
  "message": "Parameters are not valid"
}
```
_delete_ to `delete_task/<str:document_id>/`

- Response 200

```json
{
  "message": "Task deleted successfully"
}
```

- Response 304

```json
{
  "message": "Task failed to be deleted"
}
```


### team task management view-------------------------------------------------

_Post_ to `create_team/`

- Request Body

```json
{
  "team_name": "team name",
  "company_id": "company_id",
  "members": ["list of members"]
}
```

- Response 201

```json
{
  "message": "Team created successfully"
}
```
- Response 304

```json
{
  "message": "Team failed to be created"
}
```
- Response 400

```json
{
  "message": "Parameters are not valid"
}
```

_Get_ to `get_team/<str:document_id>/`

- Response 200

```json
{
  "message": "Teams available",
  "response": "[List of teams]"
}
```

- Response 204

```json
{
  "message": "There is no team"
}
```


_Get_ to `get_all_teams/<str:company_id>/`

- Response 200

```json
{
  "message": "Teams with company id - {company_id} available",
  "response": "[List of teams]"
}
```

- Response 204

```json
{
  "message": "There is no team"
}
```

_patch_ to `edit_team/<str:document_id>/`

- Request Body

```json
{
  "team_name": "team name",
  "members": ["list of members"]
}

```
- Response 200

```json
{
  "message": "Team Updated Successfully", 
  "response": "response"
}
```

- Response 304

```json
{
  "message": "Team failed to be updated"
}
```
- Response 400

```json
{
  "message": "Parameters are not valid"
}
```

_Delete_ to `delete_team/<int:team_id>/`

- Response 200

```json
{
  "message": "Team has been deleted"
}
```

- Response 304

```json
{
  "message": "Team failed to be deleted"
}
```


_Post_ to `create_team_task/`

- Request Body

```json
{
  "title": "title",
  "description": "This field is required.",
  "assignee": "user name",
  "completed": "True/False",
  "team_name": "team_name"
}
```

- Response 201

```json
{
  "message": "Task created successfully"
}
```

- Response 304

```json
{
  "message": "Task Creation Failed"
}
```
- Response 400

```json
{
  "message": "Parameters are not valid"
}
```


_patch_ to `edit_team_task/<str:task_id>/`

- Request Body

```json
{
    "title": "title",
    "description": "description",
    "assignee": "assignee",
    "completed": "<True | False>",
    "team_name": "team_name"
}
```
- Response 200

```json
{
  "message": "Team Task Updated successfully", 
  "response": "response"
}
```

- Response 304

```json
{
  "message": "Team Task failed to be updated"
}
```
- Response 400

```json
{
  "message": "Parameters are not valid"
}
```

_Get_ to `get_team_task/<str:task_id>/`

- Response 200

```json
{
  "message": "Tasks with id - {task_id} available",
  "response": "[List of teams]"
}
```

- Response 204

```json
{
  "message": "There is no task"
}
```
_Delete_ to `delete_team_task/<int:task_id>/`

- Response 200

```json
{
  "message": "Task has been deleted"
}
```

- Response 304

```json
{
  "message": "Task failed to be deleted"
}
```


_Post_ to `create_member_task/`

- Request Body

```json
{
  "title": "title",
  "description": "This field is required.",
  "assignee": "user name",
  "completed": "True/False",
  "team_name": "team_name",
  "team_member": "team_member"
}
```

- Response 201

```json
{
  "message": "Task for member created successfully"
}
```

- Response 304

```json
{
  "message": "Task for member Creation Failed"
}
```
- Response 400

```json
{
  "message": "Parameters are not valid"
}
```


_Get_ to `get_member_task/<str:task_id>/`

- Response 200

```json
{
  "message": "Member Task with id - {task_id} available",
  "response": "[List of teams]"
}
```

- Response 204

```json
{
  "message": "There is no task"
}
```
_Delete_ to `delete_team_task/<int:task_id>/`

- Response 200

```json
{
  "message": "Member Task with id {task_id} has been deleted"
}
```

- Response 304

```json
{
  "message": "Member Task with id {task_id} failed to be deleted"
}
```




### training management view-------------------------------------------------
_Post_ to `create_question/`

- Request Body

```json
{
    "company_id": "<company_id>",
    "data_type": "<data_type>",
    "question_link": "<question_link>",
    "module": "<Frontend | Backend | UI/UX | Virtual Assistant |Web | Mobile>",
    "created_on": "<created_on>",
    "created_by": "<created_by>",
    "is_active": "<True | False>"
}
```

- Response 201

```json
{
  "message": "Question created successfully"
}
```

- Response 304

```json
{
    "message":"Question failed to be created"
}
```

- Response 400

```json
{
  "message": "serializer.errors"
}
```

__get__ to `get_question/<str:document_id>/`

- Response 200

```json
{
  "message": "List of questions"
}
```

- Response 204

```json
{
    "message":"No question found"
}
```

__get__ to `get_all_question/<str:company_id>/`
`

- Response 200

```json
{
  "message": "List of questions"
}
```

- Response 204

```json
{
    "message":"No question found"
}
```


__patch__ to `update_question/`

- Request Body

```json
{
    "document_id": "<document_id>",
    "is_active":"<true|false>",
    "question_link": "question_link"
}
```

- Response 200

```json
{
  "message": "Question updated successfully"
}
```

- Response 304

```json
{
    "message":"Question updating failed"
}
```
- Response 400

```json
{
    "message":"serializer.errors"
}
```

_Post_ to `create_response/`

- Request Body

```json
{
    "company_id": "company_id",
    "data_type": "<Real_Data|Learning_Data|Testing_Data|Archived_Data>",
    "module": "<Frontend | Backend | UI/UX | Virtual Assistant |Web | Mobile>",
    "project_name": "project_name",
    "username": "username",
    "code_base_link": "code_base_link",
    "live_link": "live_link",
    "documentation_link": "documentation_link",
    "started_on": "started_on",
    "submitted_on": "submitted_on",
    "rating": "rating"
}
```

- Response 201

```json
{
  "message": "Response has been created successfully"
}
```

- Response 304

```json
{
    "message":"Response failed to be Created"
}
```

- Response 400

```json
{
  "message": "Parameters are not valid"
}
```

__patch__ to `update_response/`

- Request Body

```json
{
    "document_id": "<document_id>",
    "code_base_link": "code_base_link",
    "live_link": "live_link",
    "documentation_link": "documentation_link",
    "status": "<Hired|Rejected>"
}
```

- Response 200

```json
{
  "message": "Candidate has been {Hired|Rejected}"
}
```
- Response 304

```json
{
  "message": "Candidate has been {Hired|Rejected}"
}
```

__get__ to `get_response/<str:document_id>/`
`

- Response 200

```json
{
  "message": "List of responses",
  "response": "[List of responses]"
}
```
- Response 204

```json
{
  "error": "data not found"
}
```

__patch__ to `submit_response/`

- Request Body

```json
{
    "document_id": "<document_id>",
    "code_base_link": "<code_base_link>",
    "live_link": "<live_link>",
    "video_link": "video_link",
    "documentation_link": "<documentation_link>",
    "answer_link": "<answer_link>",
    "submitted_on": "<submitted_on>"
}
```

- Response 200

```json
{
  "message": "Response has been submitted"
}
```

- Response 304

```json
{
    "message":"operation failed"
}
```
- Response 400

```json
{
    "message":"serializers.error"
}
```

__get__ to `get_all_responses/<str:company_id>/`

- Response 200

```json
{
  "message": "List of responses",
  "response": "[List of response]"
}
```
- Response 204

```json
{
  "error": "data not found"
}
```