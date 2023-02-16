from django.urls import path
from research_management.research_views import *

urlpatterns = [
    path('get_apply_job_form/',get_apply_job_form.as_view()),
    path('apply_job_form/',apply_job_form.as_view()),
    path('research_job_creation/',research_job_creation.as_view()),
    path('get_research_job_creation/',get_research_job_creation.as_view()),

    # path('get_candidate_application/',get_candidate_application.as_view()),
]