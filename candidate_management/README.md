### Backend services for candidate management view

_Post_ to `/candidate_management/apply_job/`

- Request Body

```json
{
  "job_number": "<job _number of already created jobs",
  "job_title": "<job title of already created jobs>",
  "job_category": "<freelancer | internship | Employee>",
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
  "message": "Application failed to receive."
}
```

_Post_ to `/candidate_management/get_job_application/`

- Request Body

```json
{
  "company_id": "<company_id>"
}
```

- Response 200

```json
{
  "message": "List of job apllications.",
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

_Post_ to `/candidate_management/get_candidate_application/`

- Request Body

```json
{
  "document_id": "<document id>"
}
```

- Response 200

```json
{
  "message": "Candidate job apllications.",
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

_delete_ to `/candidate_management/delete_candidate_application/`

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
  "message": "candidate application deletion has failed."
}
```
