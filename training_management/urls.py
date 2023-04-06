from django.urls import path
from training_management.training_views import *

urlpatterns = [
    path('create_question/', question.as_view()),
    path("get_question/",get_question.as_view()),
    path('create_response/', response.as_view()),
    path('update_response/',update_response.as_view()),
    path('get_response/',get_response.as_view())
]