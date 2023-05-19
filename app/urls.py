from django.urls import path
from .views import *

urlpatterns = [
    path('', serverStatus.as_view()),
    # accounts management-------------------------------------------
    path('onboard_candidate/', onboard_candidate.as_view()),
    path('update_project/', update_project.as_view()),
    path('rehire_candidate/', rehire_candidate.as_view()),
    path('reject_candidate/', reject_candidate.as_view()),

    # admin management-------------------------------------------
    path('create_jobs/', create_jobs.as_view()),
    path('get_jobs/<str:company_id>/', get_jobs.as_view()),
    path('get_job/<str:document_id>/', get_job.as_view()),
    path('update_jobs/', update_jobs.as_view()),
    path('delete_job/', delete_job.as_view()),

    # candidate management-------------------------------------------
    path('apply_job/', apply_job.as_view()),
    path('get_job_application/<str:company_id>/', get_job_application.as_view()),
    path('get_candidate_application/<str:document_id>/', get_candidate_application.as_view()),
    path('get_all_onboarded_candidate/<str:company_id>/', get_all_onboarded_candidate.as_view()),
    path('delete_candidate_application/', delete_candidate_application.as_view()),

    # hr management--------------------------------------------------
    path('shortlisted_candidate/', shortlisted_candidate.as_view()),
    path('selected_candidate/', selected_candidate.as_view()),
    path('reject_candidate/', reject_candidate.as_view()),

    # lead management------------------------------------------------
    path('hire_candidate/', hire_candidate.as_view()),
    path('rehire_candidate/', rehire_candidate.as_view()),
    path('reject_candidate/', reject_candidate.as_view()),

    # task management------------------------------------------------
    path('create_task/', create_task.as_view()),
    path('get_task/<str:company_id>/', get_task.as_view()),
    path('get_candidate_task/<str:document_id>/', get_candidate_task.as_view()),
    path('update_task/', update_task.as_view()),
    path('delete_task/', delete_task.as_view()),

    # team task management--------------------------------------------
    path('create_team/', create_team.as_view()),
    path('create_team_task/', create_team_task.as_view()),
    path('create_member_task/', create_member_task.as_view()),
    path('edit_team/<int:pk>/', EditTeamAPIView.as_view(), name='team-retrieve-update-destroy'),
    path('delete_team/<int:team_id>/', DeleteTeam.as_view(), name="delete_team"),
    path('edit_task/<int:pk>/', EditTaskAPIView.as_view(), name='edit_task'),
    path('delete_task/<int:task_id>/', DeleteTask.as_view(), name="delete_task"),
    path('delete_member_task/<int:task_id>/', DeleteMemberTask.as_view(), name="delete_task_for_member"),

    # training management--------------------------------------------
    path('create_question/', create_question.as_view()),
    path("get_question/<str:document_id>/", get_question.as_view()),
    path("get_all_question/<str:company_id>/", get_all_question.as_view()),
    path("update_question/", update_question.as_view()),
    path('create_response/', response.as_view()),
    path('update_response/', update_response.as_view()),
    path('get_response/<str:document_id>/', get_response.as_view()),
    path("submit_response/", submit_response.as_view()),
    path("get_all_responses/<str:company_id>/", get_all_responses.as_view())
]
