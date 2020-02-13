from django.contrib import admin

from .models import User, Coach, Team, TeamMember, Deliverable, TeamDeliverable, Comment

admin.site.register(User)
admin.site.register(Coach)
admin.site.register(Team)
admin.site.register(TeamMember)
admin.site.register(Deliverable)
admin.site.register(TeamDeliverable)
admin.site.register(Comment)
