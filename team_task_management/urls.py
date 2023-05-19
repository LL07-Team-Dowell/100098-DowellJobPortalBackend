from django.urls import path
from team_task_management.views import *

urlpatterns = [
    path('create_team/', create_team.as_view()),
    path('get_team/', create_team.as_view()),
    path('create_team_task/', create_task.as_view()),
    path('create_member_task/', create_member_task.as_view()),
    path('edit-team-api/<int:pk>/', EditTeamAPIView.as_view(), name='team-retrieve-update-destroy'),
    path('delete-team/<int:team_id>/', DeleteTeam.as_view(), name="delete_team"),
    path('edit-task/<int:pk>/', EditTaskAPIView.as_view(), name='edit_task'),
    path('delete-task/<int:task_id>/', DeleteTask.as_view(), name="delete_task"),
    path('delete-member-task/<int:task_id>/', DeleteMemberTask.as_view(), name="delete_task_for_member")
]
