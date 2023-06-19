from django.db import models
import jsonfield

# userprofile settings----------

class SettingUserProfileInfo(models.Model):
    company_id = models.CharField(max_length=400)
    org_name = models.CharField(max_length=400)
    owner = models.CharField(max_length=400)
    data_type = models.CharField(max_length=400)
    profile_info = jsonfield.JSONField()


class UserProject(models.Model):
    company_id = models.CharField(max_length=400)
    data_type = models.CharField(max_length=100)
    project_list = jsonfield.JSONField()

