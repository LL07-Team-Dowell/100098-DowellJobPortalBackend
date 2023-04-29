from django.urls import path
from team_task_management.views import *

urlpatterns = [
    path('create_get_team/',TeamList.as_view()),
    path('create_task_team/',create_task.as_view()),
]