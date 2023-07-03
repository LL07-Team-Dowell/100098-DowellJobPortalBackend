## URL change log

### account management apis---------

- _Post_ to 'accounts_management/onboard_candidate/'  -------->   __Post__ to 'accounts_onboard_candidate/'

- _Patch_ to 'accounts_management/update_project/'  -------->   __Patch__ to 'accounts_update_project/'

- _Post_ to 'accounts_management/rehire_candidate/'  -------->   __Post__ to 'accounts_rehire_candidate/'

- _Post_ to 'accounts_management/reject_candidate/'  --------   __Post__ to 'accounts_reject_candidate/'


### admin management apis---------

- _Post_ to 'admin_management/create_jobs/'   -------->   __Post__ to 'admin_create_jobs/'

- _Post_ to 'admin_management/get_job/'   -------->   __Get__ to 'admin_get_job/<str:document_id>/'

- _Post_ to 'admin_management/get_jobs/'   -------->   __Get__ to 'admin_get_all_jobs/<str:company_id>/'

- _Post_ to 'admin_management/update_jobs/'   -------->   __Patch__ to 'admin_update_jobs/'

- _Post_ to 'admin_management/delete_job/'  -------->   __Delete__ to 'admin_delete_job/<str:document_id>/'




### candidate management apis---------

- _Post_ to 'candidate_management/apply_job/'   -------->   __Post__ to 'candidate_apply_job/'

- _get_ to 'candidate_management/get_job_application/<str:company_id>/'   -------->   __Get__ to 'candidate_get_job_application/<str:company_id>/'

- _get_ to 'candidate_management/get_candidate_application/<str:document_id>/'   -------->   __Get__ to 'get_all_onboarded_candidate/<str:company_id>/'

- _get_ to 'candidate_management/get_all_onboarded_candidate/<str:company_id>/'   -------->   __Get__ to 'get_candidate_application/<str:document_id>/'

- _Delete_ to 'candidate_management/delete_candidate_application/'   -------->   __Delete__ to 'delete_candidate_application/<str:document_id>/'




### hr management apis---------

- _Post_ to 'hr_management/shortlisted_candidate/ '  -------->   __Post__ to 'hr_shortlisted_candidate/'

- _Post_ to 'hr_management/selected_candidate/'   -------->   __Post__ to 'hr_selected_candidate/'

- _Post_ to 'hr_management/reject_candidate/'   -------->   __Post__ to 'hr_reject_candidate/'




### lead management apis---------

- _Post_ to 'lead_management/hire_candidate/'   -------->   __Post__ to 'lead_hire_candidate/'

- _Post_ to 'lead_management/rehire_candidate/'   -------->   __Post__ to 'lead_rehire_candidate/'

- _Post_ to 'lead_management/reject_candidate/'   -------->   __Post__ to 'lead_reject_candidate/'




### task management apis---------

- _Post_ to 'task_management/create_task/'   -------->   __Post__ to 'create_task/'

- _Get_ to 'task_management/get_task/<str:company_id>/'   -------->   __Get__ to 'get_task/<str:company_id>/'

- _Get_ to 'task_management/get_candidate_task/<str:document_id>/'   -------->   __Get__ to 'get_candidate_task/<str:document_id>/'

- _Patch_ to 'task_management/update_task/'   -------->   __Patch__ to 'update_task/'

- _delete_ to 'task_management/delete_task/'   -------->   __Delete__ to 'delete_task/<str:document_id>/'




### team task management apis---------

- _Post_ to 'team_task_management/create_team/'   -------->   __Post__ to 'create_team/'

- _Get_ to 'team_task_management/get_team/<str:document_id>/'   -------->   __Get__ to 'get_team/<str:document_id>/'

- _Get_ to 'team_task_management/get_all_teams/<str:company_id>/'   -------->   __Get__ to 'get_all_teams/<str:company_id>/'

- _Patch_ to 'team_task_management/edit_team/<str:document_id>/'   -------->   __Patch__ to 'edit_team/<str:document_id>/'

- _delete_ to 'team_task_management/delete_team/<int:team_id>/'   -------->   __Delete__ to 'delete_team/<int:team_id>/'

- _Post_ to 'team_task_management/create_team_task/'   -------->   __Post__ to 'create_team_task/'

- _Patch_ to 'team_task_management/edit_team_task/<str:task_id>/'   -------->   __Patch__ to 'edit_team_task/<str:task_id>/'

- _Get_ to 'team_task_management/get_team_task/<str:task_id>/'   -------->   __Get__ to 'get_team_task/<str:task_id>/'

- _delete_ to 'team_task_management/delete-task/<int:task_id>/'   -------->   __Delete__ to 'delete_team_task/<int:task_id>/'

- _Post_ to 'team_task_management/create_member_task/'   -------->   __Post__ to 'create_member_task/'

-                                             -------->   __Get__ to 'get_member_task/<str:task_id>/'
                                            
- _delete_ to 'team_task_management/delete-member-task/<int:task_id>/'   -------->   __Delete__ to 'delete_member_task/<int:task_id>/'




### training management apis---------

- _Post_ to 'training_management/create_question/'   -------->   __Post__ to 'create_question/'

- _Get_ to 'training_management/get_question/<str:document_id>/'   -------->   __Get__ to 'get_question/<str:document_id>/'

- _Get_ to 'training_management/get_all_question/<str:company_id>/'   -------->   __Get__ to 'get_all_question/<str:company_id>/'

- _Patch_ to 'training_management/update_question/'   -------->   __Patch__ to 'update_question/'

- _Post_ to 'training_management/submit_response/'   -------->   __Post__ to 'create_response/'

- _Patch_ to 'training_management/update_response/'   -------->   __Patch__ to 'update_response/'

- _Get_ to 'training_management/get_response/<str:document_id>/'   -------->   __Get__ to 'get_response/<str:document_id>/'

- _Patch_ to 'training_management/submit_response/'   -------->   __Patch__ to 'submit_response/'

- _Get_ to 'training_management/get_all_responses/<str:company_id>/'   -------->   __Get__ to 'get_all_responses/<str:company_id>/'



### setting apis---------

- _Post_ to `setting/SettingUserProfileInfo/`   -------->   __post__ to `settinguserprofileinfo/`

- _get_ to `setting/SettingUserProfileInfo/`   -------->   __get__ to `settinguserprofileinfo/`

- _put_ to `SettingUserProfileInfo/<int:pk>`   -------->   __put__ to `settinguserprofileinfo/<int:pk>`

- _Post_ to `setting/SettingUserProject/`   -------->   __post__ to `settinguserproject/`

- _get_ to `setting/SettingUserProject/`   -------->   __get__ to `settinguserproject/`

- _put_ to `SettingUserProject/<int:pk>`   -------->   __put__ to `settinguserproject/<int:pk>`



### discord apis---------

-                                               -------->   __post__ to `generate_discord_invite/`
-                                               -------->   __get__ to `get_discord_server_channels/<int:guild_id>/`
-                                               -------->   __get__ to `get_discord_server_members/<int:guild_id>/`