from django.urls import path
from training_management.training_views import *

urlpatterns = [
    path('create_question/', question.as_view()),
    path("get_question/<str:document_id>/", get_question.as_view()),
    path('create_response/', response.as_view()),
    path('update_response/', update_response.as_view()),
    path('get_response/<str:document_id>/', get_response.as_view()),
    path("get_all_question/<str:company_id>/", get_all_question.as_view()),
    path("update_question/", update_question.as_view()),
    path("submit_response/",submit_response.as_view())
]
