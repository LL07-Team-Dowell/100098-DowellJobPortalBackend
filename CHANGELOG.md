###url change log

##account management apis---------
_Post_ to 'accounts_management/onboard_candidate/'  -------->   'accounts_onboard_candidate/'
_Post_ to 'accounts_management/update_project/'  -------->   'accounts_update_project/'
_Post_ to 'accounts_management/rehire_candidate/'  -------->   'accounts_rehire_candidate/'
_Post_ to 'accounts_management/reject_candidate/'  --------   'accounts_reject_candidate/'

##admin management apis===========
'admin_management/create_jobs/'   -------->   'admin_create_jobs/'
'admin_management/get_job/'   -------->   'admin_get_job/<str:document_id>/'
'admin_management/get_jobs/'   -------->   'admin_get_all_jobs/<str:company_id>/'
'admin_management/update_jobs/'   -------->   'admin_update_jobs/'
'admin_management/delete_job/'  -------->   'admin_delete_job/<str:document_id>/'

##candidate management apis===========
'candidate_management/apply_job/'   -------->   'candidate_apply_job/'
'candidate_management/get_job_application/<str:company_id>/'   -------->   'candidate_get_job_application/<str:company_id>/'
'candidate_management/get_candidate_application/<str:document_id>/'   -------->   'get_all_onboarded_candidate/<str:company_id>/'
'candidate_management/get_all_onboarded_candidate/<str:company_id>/'   -------->   'get_candidate_application/<str:document_id>/'
'candidate_management/delete_candidate_application/'   -------->   'delete_candidate_application/<str:document_id>/'

##hr management apis============
'hr_management/shortlisted_candidate/ '  -------->   'hr_shortlisted_candidate/'
'hr_management/selected_candidate/'   -------->   'hr_selected_candidate/'
'hr_management/reject_candidate/'   -------->   'hr_reject_candidate/'

##lead management apis=============
'lead_management/hire_candidate/'   -------->   'lead_hire_candidate/'
'lead_management/rehire_candidate/'   -------->   'lead_rehire_candidate/'
'lead_management/reject_candidate/'   -------->   'lead_reject_candidate/'

##task management apis=============
'task_management/create_task/'   -------->   'create_task/'
'task_management/get_task/<str:company_id>/'   -------->   'get_task/<str:company_id>/'
'task_management/get_candidate_task/<str:document_id>/'   -------->   'get_candidate_task/<str:document_id>/'
'task_management/update_task/'   -------->   'update_task/'
'task_management/delete_task/'   -------->   'delete_task/<str:document_id>/'

##team task management apis=============
'team_task_management/create_team/'   -------->   'create_team/'
'team_task_management/get_team/<str:document_id>/'   -------->   'get_team/<str:document_id>/'
'team_task_management/get_all_teams/<str:company_id>/'   -------->   'get_all_teams/<str:company_id>/'
'team_task_management/edit_team/<str:document_id>/'   -------->   'edit_team/<str:document_id>/'
'team_task_management/delete_team/<int:team_id>/'   -------->   'delete_team/<int:team_id>/'
'team_task_management/create_team_task/'   -------->   'create_team_task/'
'team_task_management/get_team_task/<str:task_id>/'   -------->   'edit_team_task/<str:task_id>/'
'team_task_management/delete_task/<int:task_id>/'   -------->   'get_team_task/<str:task_id>/'
'team_task_management/delete-task/<int:task_id>/'   -------->   'delete_team_task/<int:task_id>/'
'team_task_management/create_member_task/'   -------->   'create_member_task/'
                                            -------->   'get_member_task/<str:task_id>/'
'team_task_management/delete-member-task/<int:task_id>/'   -------->   'delete_member_task/<int:task_id>/'

##training management apis=============
'training_management/create_question/'   -------->   'create_question/'
'training_management/get_question/<str:document_id>/'   -------->   'get_question/<str:document_id>/'
'training_management/get_all_question/<str:company_id>/'   -------->   'get_all_question/<str:company_id>/'
'training_management/update_question/'   -------->   'update_question/'
'training_management/submit_response/'   -------->   'create_response/'
'training_management/update_response/'   -------->   'update_response/'
'training_management/get_response/<str:document_id>/'   -------->   'get_response/<str:document_id>/'
'training_management/submit_response/'   -------->   'submit_response/'
'training_management/get_all_responses/<str:company_id>/'   -------->   'get_all_responses/<str:company_id>/'