"""core URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path ,include ,path , re_path
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions
# import views for JobPortal
from jobportal.views import *

schema_view = get_schema_view(
   openapi.Info(
      title="API DOCS",
      default_version='1.0.0',
      description="Test description",
   ),
   public=True,
   permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', serverStatus.as_view()),
    path('candidate_management/',include('candidate_management.urls')),
    path('hr_management/',include('hr_management.urls')),
    path('lead_management/',include('lead_management.urls')),
    path('accounts_management/',include('accounts_management.urls')),
    path('admin_management/',include('admin_management.urls')),
    path('task_management/',include('task_management.urls')),
    path('swagger/schema/', schema_view.with_ui('swagger',cache_timeout=0), name='schema-schema')
]
