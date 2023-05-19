from django.urls import path
from candidate_management.candidate_views import *

urlpatterns = [
    path('apply_job/', apply_job.as_view()),
    path('get_job_application/<str:company_id>/', get_job_application.as_view()),
    path('get_candidate_application/<str:document_id>/', get_candidate_application.as_view()),
    path('get_all_onboarded_candidate/<str:company_id>/', get_all_onboarded_candidate.as_view()),
    path('delete_candidate_application/', delete_candidate_application.as_view())
]
