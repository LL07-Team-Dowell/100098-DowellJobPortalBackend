### Backend services for Admin view

_changes_ to `admin_management/create_jobs/`

`there is a changes in request body, new field "module" is added`

- Request Body

```json
{
  "module": "<Frontend | Backend | UI/UX | Virtual_Assistant |Web | Mobile>"
}
```



_Post_ to `admin_management/create_jobs/`

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

_Post_ to `admin_management/update_jobs/`

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
  "message": "Job successfully deleted"
}
```

- Response 304

```json
{
  "message": "Deleting of Job has failed"
}
```
- Response 400

```json
{
  "message": "Parameters are not valid"
}
```

**Notes: "job_title","description","skills","qualification","payment","is_active","time_interval","general_terms","technical_specification","workflow_terms","other_info","data_type"**
