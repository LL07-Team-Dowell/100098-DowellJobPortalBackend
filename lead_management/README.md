### Backend services for lead management view

_Post_ to `lead_management/hire_candidate/`

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
  "message": "Candidate has been Onboarding."
}
```

- Response 400

```json
{
  "message": "Lead operation failed"
}
```

_Post_ to `lead_management/rehire_candidate/`

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
  "message": "Candidate has been rehire."
}
```

- Response 400

```json
{
  "message": "HR operation failed"
}
```
