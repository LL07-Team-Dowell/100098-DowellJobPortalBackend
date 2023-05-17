### Backend services version 2 for app view


### account management view-------------------------------------------------
_Post_ to `onboard_candidate/`

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
  "onboarded_on": "<onboarded on>"
}
```

- Response 201

```json
{
  "message": "Candidate has been onboarded."
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
_Patch_ to `update_project/`

- Request Body

```json
{
  "document id": "<document id>",
  "project": "[<project name 1>,<project name 2>,<project name 3>]",
  "payment": "<payment>"
}
```

- Response 201

```json
{
  "message": "Candidate project and payment has been updated"
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
_Post_ to `rehire_candidate/`

- Request Body

```json
{
  "document_id": "<document id>",
  "status": "<status>"
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
  "message": "operation failed"
}
```
- Response 400

```json
{
  "message": "Parameters are not valid"
}
```
_Post_ to `reject_candidate/`

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
  "message": "Candidate has been Rejected."
}
```

- Response 304

```json
{
  "message": "operation failed"
}
```

- Response 400

```json
{
  "message": "serializer.errors"
}
```

### admin management view-------------------------------------------------

_Post_ to `create_jobs/`

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

- Response 400

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

_Get_ to `get_jobs/<str:company_id>/`

- Request Body

```json
{
  "company_id": "<company_id>"
}
```

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

_Get_ to `get_job/<str:document_id>/`

- Request Body

```json
{
  "document_id": "<document_id>"
}
```

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


_Patch_ to `update_jobs/`

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

_Delete_ to `delete_job/`

- Request Body

```json
{
  "document_id": "<document_id>"
}
```

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
    "is_active":"<true|false>"
}
```

- Response 201

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
  "message": "Candidate has been responded to"
}
```
- Response 304

```json
{
  "message": "HR operation failed"
}
```

__get__ to `get_response/<str:document_id>/`

- Request Body

```json
{
    "document_id": "<document_id>"
}
```

- Response 200

```json
{
  "message": "List of response.",
  "response": "[List of response]"
}
```
- Response 304

```json
{
  "error": "data not found"
}
```

_Post_ to `/apply_job/`

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
{
  "message": "Application received."
}
```

- Response 400

```json
{
  "message": "Application not recieved"
}
```


_get_ to `/get_job_application/<str:company_id>/`

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

_get_ to `/get_candidate_application/<str:document_id>/`

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
  "message": "There is no job applications",
  "response": ["Candidate job not exist"]
}
```

_delete_ to `/delete_candidate_application/`

- Request Body

```json
{
  "document_id": "<document id>"
}
```

- Response 200

```json
{
  "message": "candidate application deleted successfully."
}
```

- Response 304

```json
{
  "message": "Deleting candidate application has failed"
}
```
- Response 400

```json
{
  "message": "Parameters are not valid"
}
```

_get_ to `/get_all_onboarded_candidate/<str:company_id>`

- Response 200

```json
{
  "message": "List of onboard applications.",
  "response": ["onboard Candidate"] 
}
```

- Response 204

```json
{
  "message": "There is no job applications",
  "response": ["Candidate job not exist"]
}
```

_Post_ to `shortlisted_candidate/`

- Request Body

```json
{
  "document_id": "<document id>",
  "hr_remarks": "<hr remarks>",
  "status": "<status>",
  "applicant": "<applicant name>",
  "company_id": "<company_id>",
  "data_type": "<Real_Data | Learning_Data | Testing_Data | Archived_Data>",
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

_Post_ to `selected_candidate/`

- Request Body

```json
{
  "document_id": "<document id>",
  "hr_remarks": "<hr remarks>",
  "status": "<status>",
  "project": "[<project name 1>,<project name 2>,<project name 3>]",
  "product_discord_link": "<link>",
  "applicant": "<applicant name>",
  "company_id": "<company id>",
  "data_type": "<Real_Data | Learning_Data | Testing_Data | Archived_Data>",
  "selected_on": "<selected on>"
}
```

- Response 200

```json
{
  "message": "Candidate has been selected."
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
_Post_ to `reject_candidate/`

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
  "message": "Candidate has been Rejected."
}
```

- Response 500

```json
{
  "message": "operation failed"
}
```

- Response 400

```json
{
  "message": "serializers error"
}
```
