### Backend services for account management view

_Post_ to `accounts_management/onboard_candidate/`

- Request Body

```json
{
  "document_id": "<document id>",
  "applicant": "<applicant name>",
  "project": "<project name>",
  "task": "<task>",
  "status": "<status>",
  "company_id": "<company_id>",
  "data_type": "<data_type>",
  "onboarded_on": "<onboarded on>"
}
```

- Response 201

```json
{
  "message": "Candidate has been onboard."
}
```

- Response 400

```json
{
  "message": "HR operation failed"
}
```

_Post_ to `accounts_management/update_project/`

- Request Body

```json
{
  "document id": "<document id>",
  "project": "<project name>",
  "payment": "<payment>"
}
```

- Response 201

```json
{
  "message": "Candidate project and payment has been updated"
}
```

- Response 400

```json
{
  "message": "Failed to update."
}
```

_Post_ to `accounts_management/rehire_candidate/`

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
  "message": "Candidate has been rehire."
}
```

- Response 400

```json
{
  "message": "HR operation failed"
}
```
