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

_patch_ to `team_task_management/edit_team/<str:document_id>/`

- Request Body

```json
{
  "team_name": "team name",
  "members": ["list of members"]
}

```
- Response 200

```json
{
  "message": "Team Updated Successfully", 
  "response": "response"
}
```

- Response 304

```json
{
  "message": "Team Update Failed"
}
```

_Get_ to `team_task_management/get_team/<str:document_id>/`

- Response 200

```json
{
  "message": "Teams available",
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

_Delete_ to `team_task_management/delete_team/<int:team_id>/`

- Response 200

```json
{
  "message": "Team with id {team_id} has been deleted"
}
```

- Response 304

```json
{
  "message": "Team with id {team_id} failed to be deleted"
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

_Delete_ to `team_task_management/delete_task/<int:task_id>/`

- Response 200

```json
{
  "message": "Task with id {task_id} has been deleted"
}
```

- Response 304

```json
{
  "message": "Task with id {task_id} failed to be deleted"
}
```

_patch_ to `team_task_management/edit_team/<str:document_id>/`

- Request Body

```json
{
  "team_name": "team name",
  "members": ["list of members"]
}

```
- Response 200

```json
{
  "message": "Team with id - {document_id} Updated Successfully", 
  "response": "response"
}
```

- Response 304

```json
{
  "message": "Team with id - {document_id} Update Failed"
}
```