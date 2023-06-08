###url change log

##account management apis---------
_Post_ to 'accounts_management/onboard_candidate/'  -------->   _Post_ to 'accounts_onboard_candidate/'
_Post_ to 'accounts_management/update_project/'  -------->   _Post_ to 'accounts_update_project/'
_Post_ to 'accounts_management/rehire_candidate/'  -------->   _Post_ to 'accounts_rehire_candidate/'
_Post_ to 'accounts_management/reject_candidate/'  --------   _Post_ to 'accounts_reject_candidate/'

##admin management apis---------
_Post_ to 'admin_management/create_jobs/'   -------->   _Post_ to 'admin_create_jobs/'
_Post_ to 'admin_management/get_job/'   -------->   _Get_ to 'admin_get_job/<str:document_id>/'
_Post_ to 'admin_management/get_jobs/'   -------->   _Get_ to 'admin_get_all_jobs/<str:company_id>/'
_Post_ to 'admin_management/update_jobs/'   -------->   _Patch_ to 'admin_update_jobs/'
_Post_ to 'admin_management/delete_job/'  -------->   _Delete_ to 'admin_delete_job/<str:document_id>/'

##candidate management apis---------
_Post_ to 'candidate_management/apply_job/'   -------->   _Post_ to 'candidate_apply_job/'
_get_ to 'candidate_management/get_job_application/<str:company_id>/'   -------->   _get_ to 'candidate_get_job_application/<str:company_id>/'
_get_ to 'candidate_management/get_candidate_application/<str:document_id>/'   -------->   _get_ to 'get_all_onboarded_candidate/<str:company_id>/'
_get_ to 'candidate_management/get_all_onboarded_candidate/<str:company_id>/'   -------->   _get_ to 'get_candidate_application/<str:document_id>/'
_Delete_ to 'candidate_management/delete_candidate_application/'   -------->   _Delete_ to 'delete_candidate_application/<str:document_id>/'

##hr management apis---------
_Post_ to 'hr_management/shortlisted_candidate/ '  -------->   _Post_ to 'hr_shortlisted_candidate/'
_Post_ to 'hr_management/selected_candidate/'   -------->   _Post_ to 'hr_selected_candidate/'
_Post_ to 'hr_management/reject_candidate/'   -------->   _Post_ to 'hr_reject_candidate/'

##lead management apis---------
_Post_ to 'lead_management/hire_candidate/'   -------->   _Post_ to 'lead_hire_candidate/'
_Post_ to 'lead_management/rehire_candidate/'   -------->   _Post_ to 'lead_rehire_candidate/'
_Post_ to 'lead_management/reject_candidate/'   -------->   _Post_ to 'lead_reject_candidate/'

##task management apis---------
_Post_ to 'task_management/create_task/'   -------->   _Post_ to 'create_task/'
_Get_ to 'task_management/get_task/<str:company_id>/'   -------->   _Get_ to 'get_task/<str:company_id>/'
_Get_ to 'task_management/get_candidate_task/<str:document_id>/'   -------->   _Get_ to 'get_candidate_task/<str:document_id>/'
_Patch_ to 'task_management/update_task/'   -------->   _Patch_ to 'update_task/'
_delete_ to 'task_management/delete_task/'   -------->   _delete_ to 'delete_task/<str:document_id>/'

##team task management apis---------
_Post_ to 'team_task_management/create_team/'   -------->   _Post_ to 'create_team/'
_Get_ to 'team_task_management/get_team/<str:document_id>/'   -------->   _Get_ to 'get_team/<str:document_id>/'
_Get_ to 'team_task_management/get_all_teams/<str:company_id>/'   -------->   _Get_ to 'get_all_teams/<str:company_id>/'
_Patch_ to 'team_task_management/edit_team/<str:document_id>/'   -------->   _Patch_ to 'edit_team/<str:document_id>/'
_delete_ to 'team_task_management/delete_team/<int:team_id>/'   -------->   _delete_ to 'delete_team/<int:team_id>/'
_Post_ to 'team_task_management/create_team_task/'   -------->   _Post_ to 'create_team_task/'
_Patch_ to 'team_task_management/edit_team_task/<str:task_id>/'   -------->   _Patch_ to 'edit_team_task/<str:task_id>/'
_Get_ to 'team_task_management/get_team_task/<str:task_id>/'   -------->   _Get_ to 'get_team_task/<str:task_id>/'
_delete_ to 'team_task_management/delete-task/<int:task_id>/'   -------->   _delete_ to 'delete_team_task/<int:task_id>/'
_Post_ to 'team_task_management/create_member_task/'   -------->   _Post_ to 'create_member_task/'
                                            -------->   _Get_ to 'get_member_task/<str:task_id>/'
_delete_ to 'team_task_management/delete-member-task/<int:task_id>/'   -------->   _delete_ to 'delete_member_task/<int:task_id>/'

##training management apis---------
_Post_ to 'training_management/create_question/'   -------->   _Post_ to 'create_question/'
_Get_ to 'training_management/get_question/<str:document_id>/'   -------->   _Get_ to 'get_question/<str:document_id>/'
_Get_ to 'training_management/get_all_question/<str:company_id>/'   -------->   _Get_ to 'get_all_question/<str:company_id>/'
_Patch_ to 'training_management/update_question/'   -------->   _Patch_ to 'update_question/'
_Post_ to 'training_management/submit_response/'   -------->   _Post_ to 'create_response/'
_Patch_ to 'training_management/update_response/'   -------->   _Patch_ to 'update_response/'
_Get_ to 'training_management/get_response/<str:document_id>/'   -------->   _Get_ to 'get_response/<str:document_id>/'
_Patch_ to 'training_management/submit_response/'   -------->   _Patch_ to 'submit_response/'
_Get_ to 'training_management/get_all_responses/<str:company_id>/'   -------->   _Get_ to 'get_all_responses/<str:company_id>/'