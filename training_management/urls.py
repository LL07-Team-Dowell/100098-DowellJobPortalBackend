from django.urls import path
from training_management.training_views import *

urlpatterns = [
    path('index/', index.as_view()),
]