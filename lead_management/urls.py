from django.urls import path
from lead_management.lead_views import *

urlpatterns = [
    path('hire_candidate/', hire_candidate.as_view()),
    path('rehire_candidate/', rehire_candidate.as_view()),
]