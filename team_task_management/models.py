from django.db import models

class User(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Team(models.Model):
    team_name = models.CharField(max_length=255)
    members = models.ManyToManyField(User, through='TeamMember')

    def __str__(self):
        return self.team_name


class TeamMember(models.Model):
    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user.name} ({self.team.team_name})"


class Task(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    assignee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assigned_tasks')
    completed = models.BooleanField(default=False)
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='tasks')

    def __str__(self):
        return self.title