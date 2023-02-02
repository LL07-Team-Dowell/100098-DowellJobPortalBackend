from django.urls import path
from task_management.task_views import *

urlpatterns = [
    path('create_task/',create_task.as_view()),
    path('get_task/',get_task.as_view()),
    path('get_cadidate_task/',get_cadidate_task.as_view()),
    path('update_task/',update_task.as_view()),
]