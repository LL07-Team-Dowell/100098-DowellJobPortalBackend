### Backend services for Setting view

_Post_ to `setting/SettingUserProfileInfo/`

- if you not understand see the example end of the page

- Request Body

```json
{
  "company_id": "<company_id>",
  "org_name": "<org_name>",
  "owner": "<owner>",
  "data_type": "<data_type>",
  "profile_info": [
    {
      "profile_title": "profile_title",
      "Role": "Role",
      "project": "project",
      "version": "version"
    }
  ]
}
```

- Response 201

```json
{
  "success": "Profile info '[{'profile_title': 'Apple', 'Role': 'lead','project': 'project', 'version': 'C1'}]' created successfully"
}
```

- Response 400

```json
{
    {
    "message":"serializer.errors"
    },
    status=400

}
```

_get_ to `setting/SettingUserProfileInfo/`

- Response 200

```json
{
  "company_id": "<company_id>",
  "org_name": "<org_name>",
  "owner": "<owner>",
  "data_type": "<data_type>",
  "profile_info": [
    { "profile_title": "profile_title", "Role": "Role", "project": "project", "version": "version" }
  ]
},status=200
```

- Response 400

```json
{
    {
    "message":"serializer.errors"
    },
    status=400

}
```

_put_ to `SettingUserProfileInfo/<int:pk>`

- Request Body

```json
{
  "profile_title": "<profile_title>",
  "Role": "<Role>",
  "project": "<project>"
}
```

- Response 201

```json
{
  "success": "Profile info [{'profile_title': 'Apple', 'Role': 'lead', 'version': 'C1'}]"
}
```

- Response 400

```json
{
    {
    "message":"serializer.errors"
    },
    status=400

}
```

**Notes: Post_example**

```json
{
  "company_id": "1002",
  "org_name": "Dowell",
  "owner": "Mannish",
  "data_type": "real data",
  "profile_info": [
    { "profile_title": "Apple", "Role": "lead", "version": "C1" }
  ]
}
```

_Post_ to `setting/SettingUserProject/`

- if you not understand see the example end of the page

- Request Body

```json
{
  "company_id": "<company_id>",
  "data_type": "<data_type>",
  "project_list": [{ "project_name1": "peach", "project_name2": "group lead" }]
}
```

- Response 201

```json
{
  "id": "id",
  "company_id": "<company_id>",
  "data_type": "<data_type>",
  "project_list": [{ "project_name1": "peach", "project_name2": "group lead" }]
}
```

- Response 400

```json
{
    {
    "message":"serializer.errors"
    },
    status=400

}
```

_get_ to `setting/SettingUserProject/`

- Response 200

```json
{
  "id": "id",
  "company_id": "<company_id>",
  "data_type": "<data_type>",
  "project_list": [{ "project_name1": "peach", "project_name2": "group lead" }]
},status=200
```

- Response 400

```json
{
    {
    "message":"serializer.errors"
    },
    status=400

}
```

_put_ to `SettingUserProject/<int:pk>`

- Request Body

```json
{
  "company_id": "<company_id>",
  "data_type": "<data_type>",
  "project_list": [{ "project_name1": "peach", "project_name2": "group lead" }]
}
```

- Response 201

```json
{
  "id": "id",
  "company_id": "<company_id>",
  "data_type": "<data_type>",
  "project_list": [{ "project_name1": "peach", "project_name2": "group lead" }]
}
```

- Response 400

```json
{
    {
    "message":"serializer.errors"
    },
    status=400

}
```
