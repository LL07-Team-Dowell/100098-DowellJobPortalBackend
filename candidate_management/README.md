### Backend services for Admin view

*Post* to `/candidate_management/apply_job_application`
- Request Body
```json
{
  "job_number": "<job _number of already created jobs",
  "job_title": "<job title of already created jobs>",
  "applicant": "<applicant name>",
  "feedBack": "<feedcak>",
  "freelancePlatform": "<freelancePlatform>",
  "freelancePlatformUrl": "<freelancePlatformUrl>",
  "country": "<location function>",
  "agree_to_all_terms": "<True | False>",
  "status": "<pending | Shortlist | hire | Select | Onboarding | Rehire | Reject>",
  "company_id": "<company_id>",
  "usernames": "<username>",
  "data_type": "<data_type>"
}
```
- Response 201
```json
{
    "message":"Application received."
}
```
- Response 400
```json
{
    "message":"Application failed to receive."
}
```
*Post* to `/admin_management/get_job_application`
- Request Body
```json
{
    "company_id":"<company_id>", 
}
```
- Response 200
```json
{
    "message":"List of job apllications." , 
    "response":["list of jobs"]
}
```
- Response 204
```json
{
    "message":"There is no job applications",
    "response":["list of jobs"]
}
```

