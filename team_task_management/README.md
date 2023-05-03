### Backend services for Task management view

_Post_ to `team_task_management/create_get_team/`

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

_get_ to `team_task_management/create_get_team/`

- Response 201

```json
{
  {
    "id":"<team_id>",
		"team_name": "team_name",
		"members": [
			{
				"name": "name"
			},
			{
				"name": "name"
			}
		]
	}
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

_delete_ to `team_task_management/delete-team/<int:team_id>/`


- Response 200

```json
{"message": f"Team with id - {team_id} was successfully deleted"}
```

- Response 400

```json
{
	"error": "Team with id was not successfully deleted"
}
```

_Post_ to `team_task_management/create_task_team/`

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
_get_ to `team_task_management/create_team_task/`

- Response 201

```json
{
  {
  
		"id": "task_id",
		"title": "Task Title",
		"description": "Task Description",
		"assignee": "user name",
		"completed": false,
		"team": "team_id"
	
	}
}
```