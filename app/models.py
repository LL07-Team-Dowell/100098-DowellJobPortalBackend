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
    inactive_project_list=jsonfield.JSONField()

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
    _id = models.CharField(max_length=1000)
    eventId = models.CharField(max_length=1000, blank=True)
    job_number = models.CharField(max_length=1000, blank=True)
    job_title = models.CharField(max_length=1000, blank=True)
    applicant = models.CharField(max_length=1000, blank=True)
    applicant_email = models.CharField(max_length=1000, blank=True)
    feedBack = models.CharField(max_length=1000, blank=True)
    freelancePlatform = models.CharField(max_length=1000, blank=True)
    freelancePlatformUrl = models.CharField(max_length=1000, blank=True)
    academic_qualification_type = models.CharField(max_length=1000, blank=True)
    academic_qualification = models.CharField(max_length=1000, blank=True)
    country = models.CharField(max_length=1000, blank=True)
    job_category = models.CharField(max_length=1000, blank=True)
    agree_to_all_terms = models.CharField(max_length=1000, blank=True)
    internet_speed = models.CharField(max_length=1000, blank=True)
    other_info = models.CharField(max_length=1000, blank=True)
    project = models.CharField(max_length=1000, blank=True)
    status = models.CharField(max_length=1000, blank=True)
    hr_remarks = models.CharField(max_length=1000, blank=True)
    teamlead_remarks = models.CharField(max_length=1000, blank=True)
    rehire_remarks = models.CharField(max_length=1000, blank=True)
    server_discord_link = models.CharField(max_length=1000, blank=True)
    product_discord_link = models.CharField(max_length=1000, blank=True)
    payment = models.CharField(max_length=1000, blank=True)
    company_id = models.CharField(max_length=1000, blank=True)
    company_name = models.CharField(max_length=1000, blank=True)
    username = models.CharField(max_length=1000, blank=True)
    portfolio_name = models.CharField(max_length=1000, blank=True)
    data_type = models.CharField(max_length=1000, blank=True)
    user_type = models.CharField(max_length=1000, blank=True)
    scheduled_interview_date = models.CharField(max_length=1000, blank=True)
    application_submitted_on = models.CharField(max_length=1000, blank=True)
    shortlisted_on = models.CharField(max_length=1000, blank=True)
    selected_on = models.CharField(max_length=1000, blank=True)
    hired_on = models.CharField(max_length=1000, blank=True)
    onboarded_on = models.CharField(max_length=1000, blank=True)
    module = models.CharField(max_length=1000, blank=True)
    is_public = models.CharField(max_length=1000, blank=True)

    def __str__(self):
        return f"{self.username}, {self.applicant}"
class TaskReportdata(models.Model):
    applicant_id = models.CharField(max_length=1000, blank=True)
    company_id = models.CharField(max_length=1000, blank=True)
    username = models.CharField(max_length=1000, blank=True)
    year= models.CharField(max_length=1000, blank=True)
    _id= models.CharField(max_length=1000, blank=True)
    task= models.CharField(max_length=1000, blank=True)
    project= models.CharField(max_length=1000, blank=True)
    user_id= models.CharField(max_length=1000, blank=True)
    task_type= models.CharField(max_length=1000, blank=True)
    company_id= models.CharField(max_length=1000, blank=True)
    start_time= models.CharField(max_length=1000, blank=True)
    end_time= models.CharField(max_length=1000, blank=True)
    is_active= models.CharField(max_length=1000, blank=True)
    task_created_date= models.CharField(max_length=1000, blank=True)
    task_id= models.CharField(max_length=1000, blank=True)
    def __str__(self):
        return f"{self.username}, {self.applicant_id}"
class MonthlyTaskData(models.Model):
    applicant_id = models.CharField(max_length=1000, blank=True)
    company_id = models.CharField(max_length=1000, blank=True)
    username = models.CharField(max_length=1000, blank=True)
    year= models.CharField(max_length=1000, blank=True)
    month = models.CharField(max_length=1000, blank=True)
    task_added =models.IntegerField(default=0)
    tasks_completed =models.IntegerField(default=0)
    tasks_uncompleted =models.IntegerField(default=0)
    tasks_approved =models.IntegerField(default=0)
    percentage_tasks_completed =models.IntegerField(default=0)
    tasks_you_approved =models.IntegerField(default=0)
    tasks_you_marked_as_complete =models.IntegerField(default=0)
    tasks_you_marked_as_incomplete =models.IntegerField(default=0)
    teams =models.IntegerField(default=0)
    team_tasks =models.IntegerField(default=0)
    team_tasks_completed =models.IntegerField(default=0)
    team_tasks_uncompleted =models.IntegerField(default=0)
    percentage_team_tasks_completed =models.IntegerField(default=0)
    team_tasks_approved =models.IntegerField(default=0)
    team_tasks_issues_raised =models.IntegerField(default=0)
    team_tasks_issues_resolved =models.IntegerField(default=0)
    team_tasks_comments_added =models.IntegerField(default=0)
    def __str__(self):
        return f"{self.username}, {self.applicant_id}"
    
