from django.contrib import admin
from .models import SettingUserProfileInfo, UserProject

# Register your models here.

# settings models registered______________________________________
admin.site.register(SettingUserProfileInfo)
admin.site.register(UserProject)
