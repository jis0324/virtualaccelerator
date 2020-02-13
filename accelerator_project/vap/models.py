from django.db import models
from PIL import Image
from django.contrib.auth.models import User as vap_user

class User(models.Model):
    user = models.OneToOneField(vap_user, on_delete = models.CASCADE, primary_key = True, related_name='profile')
    name = models.CharField(max_length=100, default="")
    email = models.CharField(max_length=100, default="", blank=True, null=True)
    phone = models.CharField(max_length=20, default="", blank=True, null=True)
    is_coach = models.BooleanField(default=False)
    is_team_member = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class Coach(User):
    job_title = models.CharField(max_length=100, blank=True, null=True)
    organization = models.CharField(max_length=100, blank=True, null=True)
    field = models.CharField(max_length=100, blank=True, null=True)
    about_me = models.TextField(default="", null=True, blank=True)
    photo = models.TextField(default="", null=True, blank=True)
    # photo = models.ImageField(max_length=200, null=True, blank=True, upload_to='img/')

    def __str__(self):
        return self.name


class Team(models.Model):
    name = models.CharField(max_length=100)
    photo = models.TextField(default="", blank=True, null=True)
    # photo = models.ImageField(upload_to = 'img/', blank=True, null=True)
    pipeline = models.CharField(max_length=100, null=True, blank=True)
    research_stream = models.BooleanField(default=False, null=True, blank=True)
    maturity_level = models.IntegerField(null=True, blank=True)
    date_of_entry = models.DateField(auto_now_add=True, null=True, blank=True)
    website = models.CharField(max_length=100, blank=True, null=True)
    coorporate_existance = models.BooleanField(default=False, null=True)
    tag_line = models.CharField(max_length=100, blank=True, null=True)
    about = models.TextField(max_length=1000, default="", blank=True, null=True)
    # coach = models.ForeignKey(Coach, null=True, on_delete=models.CASCADE)
    coach_id = models.IntegerField(null=True, blank=True)
    login_date_1st = models.CharField(null=True, blank=True, max_length=100)

    def __str__(self):
        return self.name


class TeamMember(User):
    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    role = models.CharField(max_length=100, default="", blank=True, null=True)
    field = models.CharField(max_length=100, default="", blank=True, null=True)

    def __str__(self):
        return self.name


class Deliverable(models.Model):
    title = models.CharField(max_length=100, null=True)
    description = models.TextField(default="", null=True, blank=True)
    release_date = models.CharField(max_length=100, blank=True, null=True)
    pipeline = models.CharField(max_length=100, default="", blank=True, null=True)
    template = models.FileField(upload_to = 'deliverables/', blank=True, null=True)
    icon = models.CharField(max_length=100, default="group", blank=True, null=True)
    deadline = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return self.title

class TeamDeliverable(models.Model):
    deliverable = models.ForeignKey(Deliverable, on_delete=models.CASCADE, related_name='deliverable')
    team = models.ForeignKey(Team, on_delete=models.CASCADE, )
    deadline = models.DateField(null=True, blank=True)
    status = models.BooleanField(default=False, null=True)
    file = models.FileField(upload_to = 'teamdeliverables/', blank=True, null=True)

    class Meta:
        unique_together = ('deliverable', 'team',)

    def __str__(self):
        return "%s %s" % (self.deliverable, self.team)

class Comment(models.Model):
    teamdeliverable = models.ForeignKey(TeamDeliverable, related_name='comments', on_delete=models.CASCADE, default=1)
    coach = models.ForeignKey(Coach, on_delete=models.CASCADE, null=True)
    text = models.TextField(default="", null=True)
    date = models.DateField(auto_now=True, null=True)

    def __str__(self):
        return "%s %s %s" % (self.teamdeliverable, self.coach, self.text)

class Helpfullink(models.Model):
    link = models.CharField(max_length=255, null=True)
    course_id = models.IntegerField(null=True)

    def __str__(self):
        return self.link

class RealTeamMember(models.Model):
    name = models.CharField(max_length=100, null=True)
    role = models.CharField(max_length=100, null=True)
    team_id = models.IntegerField(null=True)

    def __str__(self):
        return self.name        