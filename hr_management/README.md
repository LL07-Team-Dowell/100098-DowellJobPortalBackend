### Backend services for Hr view

_Post_ to `hr_management/shortlisted_candidate/`

- Request Body

```json
{
  "document_id": "<document id>",
  "hr_remarks": "<hr remarks>",
  "status": "<status>",
  "applicant": "<applicant name>",
  "company_id": "<company_id>",
  "data_type": "<data_type>",
  "shortlisted_on": "<shortlisted_on>"
}
```

- Response 201

```json
{
  "message": "Candidate has been shortlisted."
}
```

- Response 400

```json
{
  "message": "HR operation failed."
}
```

_Post_ to `hr_management/selected_candidate/`

- Request Body

```json
{
  "document_id": "<document id>",
  "hr_remarks": "<hr remarks>",
  "status": "<status>",
  "project": "<project>",
  "product_discord_link": "<link>",
  "applicant": "<applicant name>",
  "company_id": "<company id>",
  "data_type": "<data type>",
  "selected_on": "<selected on>"
}
```

- Response 200

```json
{
  "message": "Candidate has been selected."
}
```

- Response 204

```json
{
  "message": "HR operation failed"
}
```
