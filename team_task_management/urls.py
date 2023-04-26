from django.urls import path
from team_task_management.views import *

urlpatterns = [
    path('create_get_team/',TeamList.as_view()),

]