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
from CandidateView.canditate_views import (
    getServerReport,
)
from HrView.hr_views import (
    getServerReport,
)
from LeadView.lead_views import (
    getServerReport,
)
from AccountView.account_views import (
    getServerReport,
)
from AdminView.admin_views import (
    getServerReport,
)
urlpatterns = [
    # admin url
    path('admin/', admin.site.urls),
    # candidate page url
    path('candidatepage/server_report', getServerReport.as_view()),
    # hr page url
    path('hrpage/server_report', getServerReport.as_view()),
    # lead page url
    path('leadpage/server_report', getServerReport.as_view()),
    # account page url
    path('accountpage/server_report', getServerReport.as_view()),
    # admin page url
    path('adminpage/server_report', getServerReport.as_view()),

]
