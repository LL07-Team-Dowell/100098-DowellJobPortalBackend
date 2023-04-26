from django.contrib import admin
from team_task_management.models import *
# Register your models here.
admin.site.register(Task)
admin.site.register(Team)
admin.site.register(User)
admin.site.register(TeamMember)
