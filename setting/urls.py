from django.urls import path
from setting.setting_views import *

urlpatterns = [
    path('SettingUserProfileInfo/', SettingUserProfileInfoView.as_view()),
    path('SettingUserProfileInfo/<int:pk>', SettingUserProfileInfoView.as_view()),
    path('SettingUserProject/', SettingUserProjectView.as_view()),
    # path('SettingUserProfileInfo/<int:pk>', SettingUserProfileInfoView.as_view()),
]

# // "org_name": "cae",
#             // "owner": "umair",
# // "profile_info": [{"profile_title": "peach", "Role": "group lead", "version": "C1"}],