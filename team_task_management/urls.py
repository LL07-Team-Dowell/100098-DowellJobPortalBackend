from django.urls import path
from team_task_management.team_views import *

urlpatterns = [
    path('create_team/', create_team.as_view()),
    path('get_team/<str:document_id>/', get_team.as_view()),
    path('get_all_teams/<str:company_id>/', get_all_teams.as_view()),
    path('edit_team/<str:document_id>/', edit_team.as_view(),),
    path('delete_team/<int:team_id>/', delete_team.as_view()),
    path('create_team_task/', create_task.as_view()),
    path('get_team_task/<str:task_id>/', get_task.as_view()),
    path('delete_task/<int:task_id>/', delete_task.as_view(),),

    # path('create_member_task/', create_member_task.as_view()),
    # path('edit-team-api/<int:pk>/', EditTeamAPIView.as_view(), name='team-retrieve-update-destroy'),
    # path('delete-team/<int:team_id>/', DeleteTeam.as_view(), name="delete_team"),
    # path('edit-task/<int:pk>/', EditTaskAPIView.as_view(), name='edit_task'),
    # path('delete-task/<int:task_id>/', DeleteTask.as_view(), name="delete_task"),
    # path('delete-member-task/<int:task_id>/', DeleteMemberTask.as_view(), name="delete_task_for_member")
]
