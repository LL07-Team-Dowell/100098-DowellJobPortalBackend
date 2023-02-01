from django.urls import path
from admin_management.jobs_views import *

urlpatterns = [
    path('create_jobs/',create_jobs.as_view()),
    path('get_jobs/',get_jobs.as_view()),
    path('update_jobs/',update_jobs.as_view()),
]