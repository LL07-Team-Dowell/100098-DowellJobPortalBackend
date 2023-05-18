### Backend services for Training management view

_Post_ to `training_management/create_question/`

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

__get__ to `training_management/get_question/<str:document_id>/`

- Request Body

```json
{
    "document_id": "<document_id>"
}
```

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

__get__ to `training_management/get_all_question/<str:company_id>/`

- Request Body

```json
{
    "company_id": "<company_id>"
}
```

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


__patch__ to `training_management/update_question/`

- Request Body

```json
{
    "document_id": "<document_id>",
    "is_active":"<true|false>",
    "question_link":"<link to the question>"
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

__Post__ to `training_management/create_response/`

- Request Body

```json
{
    "company_id": "company_id",
    "data_type":"data_type",
    "module": "module",
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
  "info": "Response has been created"
}
```


__patch__ to `training_management/update_response/`

- Request Body

```json
{
    "document_id": "<document_id>",
    "code_base_link": "code_base_link",
    "live_link": "live_link",
    "documentation_link": "documentation_link"
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

__get__ to `training_management/get_response/`

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
- Response 204

```json
{
  "error": "data not found"
}
```