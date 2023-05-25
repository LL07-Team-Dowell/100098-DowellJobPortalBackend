### Backend services for Task management view

_Post_ to `team_task_management/create_team/`

- Request Body

```json
{
  "team_name": "team name",
  "company_id": "company_id",
  "members": ["list of members"]
}
```

- Response 201

```json
{
  "message": "Team created successfully"
}
```

- Response 304

```json
{
  "message": "Team Creation Failed"
}
```

_Get_ to `team_task_management/get_team/<str:document_id>/`

- Response 200

```json
{
  "message": "Teams with id - {document_id} available",
  "response": "[List of teams]"
}
```

- Response 204

```json
{
  "message": "There is no team"
}
```

_Get_ to `team_task_management/get_all_teams/<str:company_id>/`

- Response 200

```json
{
  "message": "Teams with company id - {company_id} available",
  "response": "[List of teams]"
}
```

- Response 204

```json
{
  "message": "There is no team"
}
```


_Post_ to `team_task_management/create_team_task/`

- Request Body

```json
{
  
  "task_id": "task_id",
  "title": "title",
  "description": "This field is required.",
  "assignee": "user name",
  "completed": "True/False",
  "team_name": "team_name"
}
```

- Response 201

```json
{
  "message": "Task created successfully"
}
```

- Response 304

```json
{
  "message": "Task Creation Failed"
}
```


_Get_ to `team_task_management/get_team_task/<str:task_id>/`

- Response 200

```json
{
  "message": "Tasks with id - {task_id} available",
  "response": "[List of teams]"
}
```

- Response 204

```json
{
  "message": "There is no task"
}
```
