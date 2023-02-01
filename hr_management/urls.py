from django.urls import path
from hr_management.hr_views import *

urlpatterns = [
    path('hr_shortlisted_candidate/', hr_shortlisted_candidate.as_view()),
    path('hr_selected_candidate/', hr_selected_candidate.as_view()),
]