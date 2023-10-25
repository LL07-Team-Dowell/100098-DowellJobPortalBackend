### Backend services version 2 for app view

### account management view-------------------------------------------------

**Post** to `accounts_onboard_candidate/`

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
  "notification": {
    "notified": "True/False",
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

**Patch** to `accounts_update_project/`

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
  "notification": {
    "notified": "True/False",
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

**Post** to `accounts_rehire_candidate/`

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
  "notification": {
    "notified": "True/False",
    "rehired": "True/False",
    "notification_id": "notification id"
  }
}
```

- Response 204

```json
{
  "message": "Operation failed"
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

**Post** to `accounts_reject_candidate/`

- Request Body

```json
{
  "document_id": "<document id>",
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
  "notification": {
    "notified": "True/False",
    "rejected": "True/False",
    "notification_id": "notification id"
  }
}
```

- Response 204

```json
{
  "message": "Operation failed"
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

**Post** to `admin_create_jobs/`

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
  "created_on": "<created_on>",
  "applicant": "applicant",
  "company_name": "company_name",
  "user_type": "<Freelancer | Internship | Employee>"
}
```

- Response 201

```json
{
  "message": "Job creation was successful."
}
```

- Response 204

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

**Get** to `admin_get_job/<str:document_id>/`

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

**Get** to `admin_get_all_jobs/<str:company_id>/`

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

**Patch** to `admin_update_jobs/`

- Request Body

```json
{
  "document_id": "<document_id>",
  "update_field": "Kindly follow notes to update the database , you should not update other field"
}
```

- Response 200

```json
{
  "message": "Job update is successful"
}
```

- Response 204

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

**Delete** to `admin_delete_job/<str:document_id>/`

- Response 200

```json
{
  "message": "Job successfully deleted"
}
```

- Response 204

```json
{
  "message": "Job not successfully deleted"
}
```

### candidate management view-------------------------------------------------

**Post** to `candidate_apply_job/`

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
{ "message": "Application received.", "Eligibility": "True/False" }
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

**Get** to `candidate_get_job_application/<str:company_id>/`

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

**Get** to `get_candidate_application/<str:document_id>/`

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

**Get** to `get_all_onboarded_candidate/<str:company_id>/`

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

**Delete** to `delete_candidate_application/<str:document_id>/`

- Response 200

```json
{
  "message": "Candidate application deleted successfully."
}
```

- Response 204

```json
{
  "message": "Deleting candidate application has failed"
}
```

### hr management view-------------------------------------------------

**Post** to `hr_shortlisted_candidate/`

- Request Body

```json
{
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

- Response 204

```json
{
  "message": "Operation has failed"
}
```

- Response 304

```json
{
  "message": "Operation has failed"
}
```

- Response 400

```json
{
  "message": "serializer.errors"
}
```

**Post** to `hr_selected_candidate/`

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

- Response 204

```json
{
  "message": "Operation has failed"
}
```

- Response 304

```json
{
  "message": "Operation has failed"
}
```

- Response 400

```json
{
  "message": "Parameters are not valid"
}
```

**Post** to `hr_reject_candidate/`

- Request Body

```json
{
  "document_id": "<document id>",
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
  "message": "Candidate has been Rejected"
  "notification": {"notified": "True/False",
                    "Rejected": "True/False",
                  "notification_id": "notification id"
                    }
}
```

- Response 204

```json
{
  "message": "Hr Operation failed"
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

**Post** to `lead_hire_candidate/`

- Request Body

```json
{
  "document_id": "<document id>",
  "teamlead_remarks": "<teamlead remarks>",
  "status": "<status>",
  "applicant": "<applicant name>",
  "company_id": "<company_id>",
  "data_type": "<data_type>",
  "hired_on": "<hired_on>",
  "company_name": "<company_name>",
  "user_type": "<Freelancer | Internship | Employee>"
}
```

- Response 200

```json
{
  "message": "Candidate has been Hired",
  "notification": {
    "notified": "True/False",
    "Hired": "True/False",
    "notification_id": "notification id"
  }
}
```

- Response 204

```json
{
  "message": "Lead Operation failed"
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

**Post** to `lead_rehire_candidate/`

- Request Body

```json
{
  "document_id": "<document id>",
  "rehire_remarks": "<rehire remarks>",
  "applicant": "hardik",
  "company_id": "63a2b3fb2be81449d3a30d9h",
  "data_type": "Real_Data",
  "rehired_on": "12/12/2022",
  "company_name": "<company_name>",
  "user_type": "<Freelancer | Internship | Employee>"
}
```

- Response 200

```json
{
  "message": "Candidate has been rehired",
  "notification": {
    "notified": "True/False",
    "rehired": "True/False",
    "notification_id": "notification id"
  }
}
```

- Response 204

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

**Post** to `lead_reject_candidate/`

- Request Body

```json
{
  "document_id": "<document id>",
  "reject_remarks": "<reject remark>",
  "applicant": "<applicant>",
  "username": "<username>",
  "company_id": "<company id>",
  "data_type": "<Real_Data | Learning_Data | Testing_Data | Archived_Data>",
  "rejected_on": "<rejected on>",
  "status": "Rejected",
  "company_name": "<company_name>",
  "user_type": "<Freelancer | Internship | Employee>"
}
```

- Response 201

```json
{
  "message": "Candidate has been Rejected",
  "notification": {
    "notified": "True/False",
    "rejected": "True/False",
    "notification_id": "notification id"
  }
}
```

- Response 204

```json
{
  "message": "Lead Operation failed"
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

**Post** to `create_task/`

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

- Response 204

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

**Get** to `get_task/<str:company_id>/`

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

**Get** to `get_candidate_task/<str:document_id>/`

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

**Patch** to `update_task/`

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

- Response 204

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

- Response 404

```json
{
  "message": "Task failed to be updated, there is no task with this document id"
}
```

**Patch** to `approve_task/`

- Request Body

```json
{
  "document_id": "<document id>",
  "task": "<task>",
  "status": "<status>",
  "task_updated_date": "task updated date"
}
```

- Response 200

```json
{
  "message": "Task approved successfully"
}
```

- Response 204

```json
{
  "message": "Task failed to be approved"
}
```

- Response 304

```json
{ "message": "Task failed to be approved. Approval date is over" }
```

- Response 400

```json
{
  "message": "Parameters are not valid"
}
```

**Delete** to `delete_task/<str:document_id>/`

- Response 200

```json
{
  "message": "Task deleted successfully"
}
```

- Response 204

```json
{
  "message": "Task failed to be deleted"
}
```

### team task management view-------------------------------------------------

**Post** to `create_team/`

- Request Body

```json
{
  "team_name": "team name",
  "team_description": "team description",
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

**Get** to `get_team/<str:document_id>/`

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
  "message": "There is no team available with ths document id"
}
```

**Get** to `get_all_teams/<str:company_id>/`

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
  "message": "There is no team available with ths document id"
}
```

**Patch** to `edit_team/<str:document_id>/`

- Request Body

```json
{
  "team_name": "team name",
  "team_description": "team description",
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

**Delete** to `delete_team/<int:team_id>/`

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

**Post** to `create_team_task/`

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

**Patch** to `edit_team_task/<str:task_id>/`

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

**Get** to `get_team_task/<str:task_id>/`

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

**Delete** to `delete_team_task/<int:task_id>/`

- Response 200

```json
{
  "message": "Task has been deleted"
}
```

- Response 204

```json
{
  "message": "Task failed to be deleted"
}
```

**Post** to `create_member_task/`

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

- Response 204

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

**Get** to `get_member_task/<str:task_id>/`

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
  "message": "There is no member tasks with this task id"
}
```

**Delete** to `delete_team_task/<int:task_id>/`

- Response 200

```json
{
  "message": "Member Task with id {task_id} has been deleted"
}
```

- Response 204

```json
{
  "message": "Member Task with id {task_id} failed to be deleted"
}
```

### training management view-------------------------------------------------

**Post** to `create_question/`

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
  "message": "Question failed to be created"
}
```

- Response 400

```json
{
  "message": "serializer.errors"
}
```

**get** to `get_question/<str:document_id>/`

- Response 200

```json
{
  "message": "List of questions"
}
```

- Response 204

```json
{
  "message": "No question found"
}
```

**get** to `get_all_question/<str:company_id>/`
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
  "message": "There is no questions"
}
```

**patch** to `update_question/`

- Request Body

```json
{
  "document_id": "<document_id>",
  "is_active": "<true|false>",
  "question_link": "question_link"
}
```

- Response 200

```json
{
  "message": "Question updated successfully"
}
```

- Response 204

```json
{
  "message": "Question failed to update"
}
```

- Response 400

```json
{
  "message": "serializer.errors"
}
```

**Post** to `create_response/`

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
  "message": "Response failed to be Created"
}
```

- Response 400

```json
{
  "message": "Parameters are not valid"
}
```

**patch** to `update_response/`

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

- Response 204

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

**get** to `get_response/<str:document_id>/`
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
  "message": "There is no responses"
}
```

**patch** to `submit_response/`

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

- Response 204

```json
{
  "message": "Response failed to be submitted"
}
```

- Response 400

```json
{
  "message": "serializers.error"
}
```

**get** to `get_all_responses/<str:company_id>/`

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
  "message": "There is no responses"
}
```

### settings view-------------------------------------------------

**post** to `settinguserprofileinfo/`

- Request Body

```json
{
  "company_id": "<company_id>",
  "org_name": "<org_name>",
  "owner": "<owner>",
  "data_type": "<data_type>",
  "profile_info": [
    {
      "profile_title": "profile_title",
      "Role": "Role",
      "project": "project",
      "version": "version"
    }
  ]
}
```

- Response 201

```json
{
  "success": "Profile info '[{'profile_title': 'Apple', 'Role': 'lead','project': 'project', 'version': 'C1'}]' created successfully"
}
```

- Response 400

```json
{
  "message": "serializer.errors"
}
```

**get** to `settinguserprofileinfo/`

- Response 200

```json
{
  "company_id": "<company_id>",
  "org_name": "<org_name>",
  "owner": "<owner>",
  "data_type": "<data_type>",
  "profile_info": [
    {
      "profile_title": "profile_title",
      "Role": "Role",
      "project": "project",
      "version": "version"
    }
  ],
  "status": "200"
}
```

**put** to `settinguserprofileinfo/<int:pk>`

- Request Body

```json
{
  "profile_title": "<profile_title>",
  "Role": "<Role>",
  "project": "<project>"
}
```

- Response 201

```json
{
  "success": "Profile info [{'profile_title': 'Apple', 'Role': 'lead', 'version': 'C1'}]"
}
```

- Response 400

```json
{
  "message": "serializer.errors"
}
```

**Notes: Post_example**

```json
{
  "company_id": "1002",
  "org_name": "Dowell",
  "owner": "Mannish",
  "data_type": "real data",
  "profile_info": [
    { "profile_title": "Apple", "Role": "lead", "version": "C1" }
  ]
}
```

**post** to `settinguserproject/`

- Request Body

```json
{
  "company_id": "<company_id>",
  "data_type": "<data_type>",
  "project_list": [{ "project_name1": "peach", "project_name2": "group lead" }]
}
```

- Response 201

```json
{
  "id": "id",
  "company_id": "<company_id>",
  "data_type": "<data_type>",
  "project_list": [{ "project_name1": "peach", "project_name2": "group lead" }]
}
```

- Response 400

```json
{
  "message": "serializer.errors",
  "status": "400"
}
```

**get** to `settinguserproject/`

- Response 200

```json
{
  "id": "id",
  "company_id": "<company_id>",
  "data_type": "<data_type>",
  "project_list": [{ "project_name1": "peach", "project_name2": "group lead" }]
}
```

**put** to `settinguserproject/<int:pk>`

- Request Body

```json
{
  "company_id": "<company_id>",
  "data_type": "<data_type>",
  "project_list": [{ "project_name1": "peach", "project_name2": "group lead" }]
}
```

- Response 201

```json
{
  "id": "id",
  "company_id": "<company_id>",
  "data_type": "<data_type>",
  "project_list": [{ "project_name1": "peach", "project_name2": "group lead" }]
}
```

- Response 400

```json
{
  "message": "serializer.errors"
}
```

### discord api view------------------------------------------------

**post** to `generate_discord_invite/`

- Request Body

```json
{
  "guild_id": "<guild id>",
  "owners_ids": "[owners_ids]",
  "bot_token": "<generated bot token>"
}
```

- Response 201

```json
{
  "message": "Invite link has been generated successfully",
  "response": { "invite_link": "invite link", "server": "invite" }
}
```

- Response 304

````json
{
  "message": "Invite link failed to be generated",
}

- Response 400

```json
{
    "message": "Parameters are not valid",
}
````

**get** to `get_discord_server_channels/<str:token>/<int:guild_id>/`

- Response 200

```json
{
  "message": "List of channels in server",
  "response": {
    "num of channels": "No of channels",
    "channels": "[list of channels]"
  }
}
```

- Response 204

````json
{
  "message":"There is no channels",
  "response":"[channels]"
}

__get__ to `get_discord_server_members/<str:token>/<int:guild_id>/`

- Response 200

```json
{"message": "List of members in server",
  "response": {"num of members":"No of members",
                "members":"[list of members]",
              }
}
````

- Response 204

```json
{
  "message": "There is no members",
  "response": "[members]"
}
```

### public api view --------------------------

**Post** to `public_candidate_job_application/`

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
  "portfolio_name": "",
  "data_type": "<Real_Data | Learning_Data | Testing_Data | Archived_Data>",
  "payment": "<payment>",
  "application_submitted_on": "<application_submitted_on>",
  "status": "Guest_Pending",
  "module": "<Frontend|Backend|UI/UX|Virtual Assistant|Web|Mobile>",
  "is_public": "<True/False>"
}
```

- Response 201

```json
{ "message": "Application received.", "Eligibility": "True/False" }
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

**post** to `generate_public_job_application_link`

- Request Body

```json
{
  "qr_ids": "('qr_ids')",
  "job_company_id": "('job_company_id')",
  "job_id": "('job_id')",
  "company_data_type": "<Real_Data | Learning_Data | Testing_Data | Archived_Data>"
}
```

- Response 200

```json
{
  "success": "True",
  "message": "Master link for public job apllication generated successfully",
  "master_link": "masterlink",
  "qr_code": "qrcode_image_url"
}
```

- Response 400

```json
{
  "success": "False",
  "message": "Failed to generate master link for public job apllication"
}
```

**get** to `generate_public_job_application_link/<str:company_id>/`

- Response 200

```json
{
  "success": "True",
  "message": "Master link deatils.",
  "master_link": "master_links"
}
```

- Response 400

```json
{
  "success": "False",
  "message": "User details is not updated."
}
```

**post** to `send_mail_to_public/`

- Request Body

```json
{
  "qr_id": "qr_id",
  "org_name": "org_name",
  "org_id": "org_id",
  "owner_name": "owner_name",
  "portfolio_name": "portfolio_name",
  "unique_id": "unique_id",
  "product": "product",
  "role": "role",
  "member_type": "member_type",
  "toemail": "toemail",
  "toname": "toname",
  "subject": "subject",
  "job_role": "job_role",
  "data_type": "data_type"
}
```

- Response 200

```json
{
  "success": "True",
  "message": "Mail sent successfully to {toname}"
}
```

- Response 400

```json
{
  "success": "False",
  "message": "Something went wrong",
  "error": "serializer.errors"
}
```

- Response 401

```json
{
  "success": "False",
  "message": "Something went wrong"
}
```

**post** to `update_user_status/`

- Request Body

```json
{
  "username": "username",
  "portfolio_name": "protfolio_name",
  "status": "Pending"
}
```

- Response 200

```json
{
  "success": "True",
  "message": "User details is updated."
}
```

- Response 400

`````json
{
"success": "False",
"message": "User details is not updated."
            }

**Post** to `project_deadline/`

type_request = add_total_project_hours,enable_edit_project_hours

type_request == add_total_project_hours
- Request Body

```json
{
    "project":"<project>",
    "company_id": "<company_id>",
    "total_time": "<total_time>",
    "lead_name": "<lead_name>",

}
```
- Response 200

```json
{
  {
    "success": "True",
    "message": "Total project time added successfully",
    "response": "field",
    "_id": "response"
  }
}
```
- Response 400

```json
{
  {
    "success": "False",
    "message": "Failed to add total project time",
  }
}
```
- Response 400

```json
{
  {
    "success": "False",
    "message": "Posting wrong data to API",
    "error": "serializer.errors"
}
}
```

type_request == enable_edit_project_hours
- Request Body

```json
{
    "_id":"document_id",
}
```
- Response 200

```json
{
  {
    "success": "True",
    "message": "Status updated successfully",
}
}
```

**get** to `project_deadline`

type_request = get_project_hours_details,get_project_hours_detail
type_request = get_project_hours_details

- Request Body

````json
{
    "company_id": "<company_id>",
}

- Response 200

```json
{
  "success": "True",
  "message": "List project hour details for company",
  "response": "response"
}
```

type_request = get_project_hours_detail
- Request Body

````json
{
    "_id": "document_id",
}

- Response 200

```json
{
  "success": "True",
  "message": "List project hour details for company",
  "response": "response"
}
```
# Change Log Link :- https://github.com/LL07-Team-Dowell/100098-DowellJobPortal/blob/backend-v2/app/CHANGELOG.md
````
`````
