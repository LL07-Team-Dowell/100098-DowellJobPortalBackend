from django.db import models
import jsonfield

# userprofile settings----------
class SettingUserProfileInfo(models.Model):
    company_id = models.CharField(max_length=400)
    org_name = models.CharField(max_length=400)
    owner = models.CharField(max_length=400)
    data_type = models.CharField(max_length=400)
    profile_info = jsonfield.JSONField()

    def __str__(self):
        return f"{self.id}, {self.company_id}"

class UserProject(models.Model):
    company_id = models.CharField(max_length=400)
    data_type = models.CharField(max_length=100)
    project_list = jsonfield.JSONField()
    inactive_project_list = jsonfield.JSONField()

    def __str__(self):
        return f"{self.id}, {self.company_id}"

class UsersubProject(models.Model):
    parent_project = models.CharField(max_length=100)
    sub_project_list = jsonfield.JSONField()
    company_id = models.CharField(max_length=400)
    data_type = models.CharField(max_length=100)
    link_id = models.CharField(max_length=100, default="test")
    def __str__(self):
        return f"{self.id}, {self.company_id}"

class PersonalInfo(models.Model):
    _id = models.CharField(max_length=1000,blank=True, null=True)
    eventId = models.CharField(max_length=1000, blank=True, null=True)
    job_number = models.CharField(max_length=1000, blank=True, null=True)
    job_title = models.CharField(max_length=1000, blank=True, null=True)
    applicant = models.CharField(max_length=1000, blank=True, null=True)
    applicant_email = models.CharField(max_length=1000, blank=True, null=True)
    feedBack = models.CharField(max_length=1000, blank=True, null=True)
    freelancePlatform = models.CharField(max_length=1000, blank=True, null=True)
    freelancePlatformUrl = models.CharField(max_length=1000, blank=True, null=True)
    academic_qualification_type = models.CharField(max_length=1000, blank=True, null=True)
    academic_qualification = models.CharField(max_length=1000, blank=True, null=True)
    country = models.CharField(max_length=1000, blank=True, null=True)
    job_category = models.CharField(max_length=1000, blank=True, null=True)
    agree_to_all_terms = models.CharField(max_length=1000, blank=True, null=True)
    internet_speed = models.CharField(max_length=1000, blank=True, null=True)
    other_info = jsonfield.JSONField(null=True)
    project = jsonfield.JSONField(null=True)
    status = models.CharField(max_length=1000, blank=True, null=True)
    hr_remarks = models.CharField(max_length=1000, blank=True, null=True)
    teamlead_remarks = models.CharField(max_length=1000, blank=True, null=True)
    rehire_remarks = models.CharField(max_length=1000, blank=True, null=True)
    server_discord_link = models.CharField(max_length=1000, blank=True, null=True)
    product_discord_link = models.CharField(max_length=1000, blank=True, null=True)
    payment = models.CharField(max_length=1000, blank=True, null=True)
    company_id = models.CharField(max_length=1000, blank=True, null=True)
    company_name = models.CharField(max_length=1000, blank=True, null=True)
    username = models.CharField(max_length=1000, blank=True, null=True)
    portfolio_name = models.CharField(max_length=1000, blank=True, null=True)
    data_type = models.CharField(max_length=1000, blank=True, null=True)
    user_type = models.CharField(max_length=1000, blank=True, null=True)
    scheduled_interview_date = models.CharField(max_length=1000, blank=True, null=True)
    application_submitted_on = models.CharField(max_length=1000, blank=True, null=True)
    shortlisted_on = models.CharField(max_length=1000, blank=True, null=True)
    selected_on = models.CharField(max_length=1000, blank=True, null=True)
    hired_on = models.CharField(max_length=1000, blank=True, null=True)
    onboarded_on = models.CharField(max_length=1000, blank=True, null=True)
    module = models.CharField(max_length=1000, blank=True, null=True)
    is_public = models.CharField(max_length=1000, blank=True, null=True)
    signup_mail_sent = models.CharField(max_length=1000, blank=True, null=True)

    def __str__(self):
        return f"{self.username}, {self.applicant}"
class TaskReportdata(models.Model):
    applicant_id = models.CharField(max_length=1000, blank=True, null=True)
    company_id = models.CharField(max_length=1000, blank=True, null=True)
    username = models.CharField(max_length=1000, blank=True, null=True)
    year = models.CharField(max_length=1000, blank=True, null=True)
    project = models.CharField(max_length=1000, blank=True, null=True)
    subprojects = jsonfield.JSONField(null=True, blank=True)
    total_hours = models.FloatField(default=0)
    total_mins = models.FloatField(default=0)
    total_secs = models.FloatField(default=0)
    total_tasks = models.FloatField(default=0)
    tasks_uploaded_this_week = models.FloatField(default=0)
    total_tasks_last_one_day = models.FloatField(default=0)
    total_tasks_last_one_week = models.FloatField(default=0)
    tasks = jsonfield.JSONField(null=True, blank=True)
    def __str__(self):
        return f"{self.username}, {self.applicant_id}"
class MonthlyTaskData(models.Model):
    applicant_id = models.CharField(max_length=1000, blank=True, null=True)
    company_id = models.CharField(max_length=1000, blank=True, null=True)
    username = models.CharField(max_length=1000, blank=True, null=True)
    year= models.CharField(max_length=1000, blank=True, null=True)
    month = models.CharField(max_length=1000, blank=True, null=True)
    task_added =models.IntegerField(default=0)
    tasks_completed =models.IntegerField(default=0)
    tasks_uncompleted =models.IntegerField(default=0)
    tasks_approved =models.IntegerField(default=0)
    percentage_tasks_completed =models.FloatField(default=0)
    tasks_you_approved =models.IntegerField(default=0)
    tasks_you_marked_as_complete =models.IntegerField(default=0)
    tasks_you_marked_as_incomplete =models.IntegerField(default=0)
    teams =models.IntegerField(default=0)
    team_tasks =models.IntegerField(default=0)
    team_tasks_completed =models.IntegerField(default=0)
    team_tasks_uncompleted =models.IntegerField(default=0)
    percentage_team_tasks_completed =models.FloatField(default=0)
    team_tasks_approved =models.IntegerField(default=0)
    team_tasks_issues_raised =models.IntegerField(default=0)
    team_tasks_issues_resolved =models.IntegerField(default=0)
    team_tasks_comments_added =models.IntegerField(default=0)
    def __str__(self):
        return f"{self.username}, {self.applicant_id}"
    
