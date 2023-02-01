### Backend services for lead management view

*Post* to `lead_management/lead_hired_candidate/`

- Request Body

```json
{
  "document_id": "<document id>",
  "teamlead_remarks": "<teamlead remarks>",
  "status": "<status>",
  "applicant": "<applicant name>",
  "company_id": "<company_id>",
  "data_type": "<data_type>"
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
