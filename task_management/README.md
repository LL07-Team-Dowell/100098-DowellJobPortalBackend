### Backend services for Task management view

_Post_ to `task_management/create_task/`

- Request Body

```json
{
  "project": "<project name>",
  "applicant": "<applicant name>",
  "task": "<task>",
  "task_added_by": "<task added name>",
  "data_type": "<data_type>",
  "company_id": "<company_id>",
  "task_created_date": "<task created date>"
}
```

- Response 201

```json
{
  "message": "Task added successfully and the status is {status}."
}
```

- Response 400

```json
{
  "message": "failed to add task"
}
```

_Post_ to `task_management/get_task/`

- Request Body

```json
{
  "company_id": "<company_id>"
}
```

- Response 201

```json
{
  "message": "List of the task.",
  "response": ["List of the task."]
}
```

- Response 400

```json
{
  "message": "There is no task",
  "response": ["There is no task"]
}
```

_Post_ to `task_management/get_cadidate_task/`

- Request Body

```json
{
  "document_id": "<document id>"
}
```

- Response 201

```json
{
  "message": "List of the task.",
  "response": ["List of the task."]
}
```

- Response 400

```json
{
  "message": "There is no task",
  "response": ["There is no task"]
}
```

_Post_ to `task_management/update_task/`

- Request Body

```json
{
  "document_id": "<document id>",
  "task": "<task>",
  "status": "<status>",
  "task_added_by": "<task added name>",
  "task_updated_date": "task updated date"
}
```

- Response 201

```json
{
  "message": "Task updation successful."
}
```

- Response 400

```json
{
  "message": "Task updation failed"
}
```
