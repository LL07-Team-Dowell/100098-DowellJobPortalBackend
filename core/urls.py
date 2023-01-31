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

# import views for URL
from jobportal.views import *
from candidate_management.candidate_views import *
from hr_management.hr_views import *
from lead_management.lead_views import *
from accounts_management.accounts_views import *
from admin_management.jobs_views import *
urlpatterns = [
    # admin url
    path('admin/', admin.site.urls),
    # get server_reports
    path('', getServerReport.as_view()),
    # candidate management url
    path('candidate_management/apply_job_application',apply_job_application.as_view()),
    path('candidate_management/get_job_application',get_job_application.as_view()),

    # hr management url
    path('hr_management/server_report', getServerReport.as_view()),

    # lead management url
    path('lead_management/server_report', getServerReport.as_view()),

    # account management url
    path('account_management/server_report', getServerReport.as_view()),
    
    # admin management url
    path('admin_management/create_jobs',create_jobs.as_view()),
    path('admin_management/get_jobs',get_jobs.as_view()),
    path('admin_management/update_jobs',update_jobs.as_view()),
]
