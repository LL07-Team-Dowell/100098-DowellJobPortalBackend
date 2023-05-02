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

_Post_ to `team_task_management/create_task_team/`

- Request Body

```json
{
  "assignee": "user id",
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