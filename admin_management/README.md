### Backend services for Admin view

_Post_ to `admin_management/create_jobs/`

- Request Body

```json
{
  "job_number": "<unique number>",
  "job_title": "<Job title>",
  "description": "Description for the job>",
  "skills": "<Required skills for the job",
  "qualification": "<Qualifications required for the job>",
  "job_category": "<freelancer | internship | Employee>",
  "type_of_job": "<Part time | Full time| Time based>",
  "payment": "<Payment for the job>",
  "payment_terms": "<payment_terms>",
  "is_active": "<True| False>",
  "time_interval": "<Time interval for the job>",
  "general_terms": ["term1", "term2"],
  "technical_specification": ["term1", "term2"],
  "workflow_terms": ["term1", "term2"],
  "other_info": ["term1", "term2"],
  "company_id": "<company_id>",
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
  "error": "field errors"
}
```

_Post_ to `admin_management/get_jobs/`

- Request Body

```json
{
  "company_id": "<company_id>"
}
```

- Response 200

```json
{
  "message": "Requested Job list.",
  "response": ["list of jobs"]
}
```

- Response 204

```json
{
  "message": "There is no jobs",
  "response": ["list of jobs"]
}
```

_Post_ to `admin_management/get_job/`

- Request Body

```json
{
  "document_id": "<document_id>"
}
```

- Response 200

```json
{
  "message": "Requested Job list.",
  "response": ["list of jobs"]
}
```

- Response 204

```json
{
  "message": "There is no jobs",
  "response": ["list of jobs"]
}
```

_Post_ to `admin_management/update_jobs/`

- Request Body

```json
{
    "document_id":"<document_id>",
    "<update_field : Kindly follow notes to update the database , you should not update other field>"
}
```

- Response 200

```json
{
  "message": "Job updation successful."
}
```

- Response 304

```json
{
  "message": "Job updation has failed."
}
```

_Post_ to `admin_management/delete_job/`

- Request Body

```json
{
  "document_id": "<document_id>"
}
```

- Response 200

```json
{
  "message": "Job deletion successful."
}
```

- Response 304

```json
{
  "message": "Job deletion has failed."
}
```

**Notes: "job_title","description","skills","qualification","payment","is_active","time_interval","general_terms","technical_specification","workflow_terms","other_info","data_type"**
