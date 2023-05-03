### Backend services for account management view

_Post_ to `accounts_management/onboard_candidate/`

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

_Post_ to `accounts_management/update_project/`

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
  "message": "Candidate has been rehired"
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
_Post_ to `accounts_management/reject_candidate/`

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