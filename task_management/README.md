### Backend services for Task management view

_Post_ to `task_management/create_task/`

- Request Body

```json
{
  "project": "[<project name 1>,<project name 2>,<project name 3>]",
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
- Response 304

```json
{
  "message": "Failed to add task"
}
```

- Response 400

```json
{
  "message": "Parameters are not valid"
}
```

_Get_ to `task_management/get_task/<str:company_id>/`

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

- Response 204

```json
{
  "message": "There is no task",
  "response": ["There is no task"]
}
```

_Get_ to `task_management/get_candidate_task/<str:document_id/`

- Request Body

```json
{
  "document_id": "<document id>"
}
```

- Response 200

```json
{
  "message": "List of the task.",
  "response": ["List of the task."]
}
```

- Response 204

```json
{
  "message": "There is no task",
  "response": ["There is no task"]
}
```

_Patch_ to `task_management/update_task/`

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
  "message": "Task updated successfully"
}
```
- Response 304

```json
{
  "message": "Task failed to update"
}
```

- Response 400

```json
{
  "message": "Parameters are not valid"
}
```
_delete_ to `task_management/delete_task/`

- Request Body

```json
{
  "document_id": "<document id>",
}
```

- Response 200

```json
{
  "message": "Task deleted successfully"
}
```

- Response 304

```json
{
  "message": "Task failed to delete"
}
```

- Response 400

```json
{
  "message": "Parameters are not valid"
}
```