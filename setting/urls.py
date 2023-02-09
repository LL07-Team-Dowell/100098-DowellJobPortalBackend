from django.urls import path
from setting.setting_views import *

urlpatterns = [
    path('SettingUserProfileInfo/', SettingUserProfileInfoView.as_view()),
    path('SettingUserProfileInfo/', SettingUserProfileInfoView.as_view()),
    path('SettingUserProfileInfo/<int:pk>', SettingUserProfileInfoView.as_view()),
]