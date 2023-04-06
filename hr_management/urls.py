from django.urls import path
from hr_management.hr_views import *

urlpatterns = [
    path('shortlisted_candidate/', shortlisted_candidate.as_view()),
    path('selected_candidate/', selected_candidate.as_view()),
    path('reject_candidate/',reject_candidate.as_view())
]