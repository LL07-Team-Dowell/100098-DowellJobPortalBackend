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

- Response 200

```json
{
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
_delete_ `team_task_management/delete_team/<str:team_id>/`

- Request Body

```json
{
  "team_id": "Team id"
}
```

- Response 200

```json
{
  "message": "Team with id - {team_id} was successfully deleted"
}
```

- Response 400

```json
{
  "message": "Team with id - {team_id} was not successfully deleted"
}
```

- Response 404

```json
{
  "message": "Team does not exist"
}
```
