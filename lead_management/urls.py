from django.urls import path
from lead_management.lead_views import *

urlpatterns = [
    path('lead_hired_candidate/', lead_hired_candidate.as_view()),
]