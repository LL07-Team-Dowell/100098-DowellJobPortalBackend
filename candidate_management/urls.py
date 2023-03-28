from django.urls import path
from candidate_management.candidate_views import *

urlpatterns = [
    path('apply_job/',apply_job.as_view()),
    path('get_job_application/',get_job_application.as_view()),
    path('get_candidate_application/',get_candidate_application.as_view()),
    path('delete_candidate_application/',delete_candidate_application.as_view())
]