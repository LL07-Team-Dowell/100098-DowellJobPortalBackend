# Generated by Django 4.1.5 on 2023-05-06 11:54

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('team_task_management', '0003_alter_task_assignee_alter_task_team'),
    ]

    operations = [
        migrations.CreateModel(
            name='TaskForMember',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('completed', models.BooleanField(default=False)),
                ('assignee', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='assigned_task_for_member', to='team_task_management.user')),
                ('team_member', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='task_for_member', to='team_task_management.teammember')),
            ],
            options={
                'ordering': ('title',),
            },
        ),
    ]
