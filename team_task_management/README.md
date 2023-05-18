### Backend services for Task management view

_Post_ to `team_task_management/create_team/`

- Request Body

```json
{
  "team_name": "team name",
  "members": ["list of members"]
}
```

- Response 201

```json
{
  "message": "Team created successfully"
}
```

- Response 400

```json
{
  "message": "serializer.errors"
}
```

_Patch_ to `team_task_management/edit-team-api/<int:pk>/`

- Request Body

```json
{
    "team_name": "New Team Name",
    "members": [
        "New Member 1",
			"New Member 2"
    ]
}
```

- Response 200

```json
{
	"id": "<id>",
	"team_name": "New Team Name",
	"members": [
		"New Member 1",
		"New Member 2"
	]
}
```

- Response 400

```json
{
  "message": "serializer.errors"
}
```
- Response 404

```json
{
  "message": "Team does not exist"
}
```

_delete_ to `team_task_management/delete-team/<int:team_id>/`


- Response 200

```json
{"message": "Team with id - {team_id} was successfully deleted"}
```

- Response 400

```json
{
	"error": "Team with id was not successfully deleted"
}
```

_Post_ to `team_task_management/create_team_task/`

- Request Body

```json
{
  "assignee": "user name",
  "title": "title",
  "description": "This field is required.",
  "team": "Team id",
  "completed": "True/False"
}
```

- Response 201

```json
{
  "message": "Task created successfully"
}
```

- Response 400

```json
{
  "message": "serializer.errors"
}
```

_Patch_ to `team_task_management/edit-task/<int:pk>/`

- Request Body

```json
{
    "title": "title of task",
    "description": " task description",
    "assignee": "assignee of the task",
    "team": " id of the team used",
    "completed": "false/true"
}
```

- Response 200

```json
{
	"id": "<id>",
	"title": "title of task",
    "description": " task description",
    "assignee": "assignee of the task",
    "completed": false
}
```

- Response 400

```json
{
  "message": "serializer.errors"
}
```
- Response 404

```json
{
  "message": "This task does not exist"
}
```

_delete_ to `team_task_management/delete-task/<int:task_id>/`


- Response 200

```json
{"message": "Task with id - {task_id} was successfully deleted"}
```

- Response 400

```json
{
	"error": "Task with id - {task_id} was not successfully deleted"
}
```


_Post_ to `team_task_management/create_member_task/`

- Request Body

```json
{
  "assignee": "user name",
  "title": "title",
  "description": "This field is required.",
  "team": "Team id",
  "team_member": "member id",
  "completed": "True/False"
}
```

- Response 201

```json
{
  "message": "Task for member-{member} is created successfully"
}
```

- Response 400

```json
{
  "message": "serializer.errors"
}
```


_delete_ to `team_task_management/delete-member-task/<int:task_id>/`

- Response 200

```json
{"message": "Task with id - {task_id} for member - {task.team_member} was successfully deleted"}
```

- Response 400

```json
{
	"error": "Task with id - {task_id} for member - {task.team_member} was not successfully deleted"
}
```
