### Backend services for Admin view

*Post* to `admin_management/create_jobs/`
- Request Body
```json
{
    "job_number": "<unique number>",
    "job_title": "<Job title>",
    "description": "Description for the job>",
    "skills": "<Required skills for the job",
    "qualification": "<Qualifications required for the job>",
    "job_catagory": "<freelancer | intership | Employee>",
    "type_of_job": "<Part time | Full time>",
    "payment": "<Payment for the job>",
    "is_active": "<True| False>",
    "time_interval":"<Time interval for the job>",
    "general_terms":["term1","term2"],
    "technical_specification":["term1","term2"], 
    "workflow_terms":["term1","term2"],
    "other_info":["term1","term2"],
    "company_id":"<company_id>",
    "data_type":"<data_type>",
    "created_by":"<created_by>"  
}
```
- Response 201
```json
{
    "message":"Job creation was successful."
}
```
- Response 400
```json
{
    "message":"Job creation has failed"
}
```
*Post* to `admin_management/get_jobs/`
- Request Body
```json
{
    "company_id":"<company_id>", 
}
```
- Response 200
```json
{
    "message":"Requested Job list." , 
    "response":["list of jobs"]
}
```
- Response 204
```json
{
    "message":"There is no jobs",
    "response":["list of jobs"]
}
```
*Post* to `admin_management/update_jobs/`
- Request Body
```json
{
    "document_id":"<document_id>",
    "<update_field : Kindly follow notes to update the database , you should not update other field>"
}
```
- Response 200
```json
{
   "message":"Job updation successful." 
}
```
- Response 304
```json
{
    "message":"Job updation has failed." 
}
```
**Notes: "job_title","description","skills","qualification","payment","is_active","time_interval","general_terms","technical_specification","workflow_terms","other_info","data_type"**
