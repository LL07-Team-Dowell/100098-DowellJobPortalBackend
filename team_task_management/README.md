### Backend services for Task management view

_Post_ to `team_task_management/create_get_team/`

- Request Body

```json
{
	"team_name":"team name",
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