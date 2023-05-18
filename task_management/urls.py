from django.urls import path
from task_management.task_views import *

urlpatterns = [
    path('create_task/', create_task.as_view()),
    path('get_task/<str:company_id>/', get_task.as_view()),
    path('get_candidate_task/<str:document_id>/', get_candidate_task.as_view()),
    path('update_task/', update_task.as_view()),
    path('delete_task/', delete_task.as_view()),
]
