### Backend services for research management view

_Post_ to `/research_management/apply_job_form`

- Request Body

```json
{
  "Individual_name": "<Individual_name>",
  "email": "<applicant email>",
  "Individual_address": "<Individual_address>",
  "city": "<city>",
  "state": "<state>",
  "country": "<country>",
  "phone": "<phone>"
}
```

- Response 201

```json
{
  "message": "Task added successfully."
}
```

- Response 400

```json
{
  "message": "failed to add task"
}
```

_get_ to `/research_management/get_apply_job_form`

- Request Body

- Response 200

```json
{
  "message": "Candidate job apllications.",
  "response": ["research job"]
}
```

- Response 204

```json
{
  "message": "There is no job applications",
  "response": ["Candidate job not exist"]
}
```

_Post_ to `/research_management/research_job_creation`

- Request Body

```json
{
  "title": "<title>",
  "description": "<description>",
  "skills": "<skills>",
  "is_active": "<is_active>",
  "typeof": "<typeof>",
  "Avaliable": "<Avaliable>",
  "city": "<city>",
  "location": "<location>",
  "others": "<others>",
  "payment": "<payment>"
}
```

- Response 200

```json
{
  "message": "List of job apllications.",
  "response": ["list of jobs"]
}
```

- Response 204

```json
{
  "message": "There is no job applications",
  "response": ["list of jobs"]
}
```

_get_ to `/research_management/get_research_job_creation`

- Request Body

- Response 200

```json
{
  "message": "List of jobs",
  "response": ["research job"]
}
```

- Response 204

```json
{
  "message": "There is no job"
}
```
