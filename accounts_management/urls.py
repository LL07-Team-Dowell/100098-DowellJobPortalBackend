from django.urls import path
from accounts_management.accounts_views import *

urlpatterns = [
    path('onboard_candidate/',onboard_candidate.as_view()),
    path('update_project/',update_project.as_view()),
    path('rehire_candidate/',rehire_candidate.as_view()),
    path('reject_candidate/',reject_candidate.as_view())
]