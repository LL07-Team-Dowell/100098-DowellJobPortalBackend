### Backend services for Training management view

_Post_ to `training_management/create_question/`

- Request Body

```json
{
    "company_id": "<company_id>",
    "data_type": "<data_type>",
    "question_link": "<question_link>",
    "module": "<Frontend | Backend | UI/UX | Virtual Assistant |Web | Mobile>
>",
    "created_on": "<created_on>",
    "created_by": "<created_by>",
    "is_active": "<True | False>",
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
    "message":"Question creation failed"
}
```

- Response 400

```json
{
  "message": "field errors"
}
```

__get__ to `training_management/get_question/`

- Request Body

```json
{
    "document_id": "<document_id>",
}
```

- Response 200

```json
{
  "message": "List of questions"
}
```

- Response 304

```json
{
    "message":"No question found"
}
```

__get__ to `training_management/get_all_question/`

- Request Body

```json
{
    "company_id": "<company_id>",
}
```

- Response 200

```json
{
  "message": "List of questions"
}
```

- Response 304

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