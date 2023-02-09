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
    { "profile_title": "profile_title", "Role": "Role", "version": "version" }
  ]
}
```

- Response 201

```json
{
  "success": "Profile info '[{'profile_title': 'Apple', 'Role': 'lead', 'version': 'C1'}]' created successfully"
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

- Response 201

```json
{
  "company_id": "<company_id>",
  "org_name": "<org_name>",
  "owner": "<owner>",
  "data_type": "<data_type>",
  "profile_info": [
    { "profile_title": "profile_title", "Role": "Role", "version": "version" }
  ]
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

_put_ to `SettingUserProfileInfo/<int:pk>`

- Request Body

```json
{
  "profile_title": "<profile_title>",
  "Role": "<Role>"
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
