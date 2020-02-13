from django.urls import re_path
from . import views
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.urlpatterns import format_suffix_patterns

app_name = 'vap'
urlpatterns = [
    re_path('^users/?$', views.UserList.as_view()),
    re_path(r'^users/(?P<username>\w+)/?$', views.UserDetail.as_view()),
    re_path('^teams/?$', views.TeamList.as_view()),
    re_path(r'^teams/(?P<pk>\d+)/?$', views.TeamDetail.as_view()),
    re_path(r'^teams/(?P<team_id>[0-9]+)/teammembers/?$',views.TeamMemberList.as_view()),
    re_path(r'^teams/(?P<team_id>[0-9]+)/teammembers/(?P<pk>\d+)/?$',views.TeamMemberDetail.as_view()),
    re_path(r'^teams/(?P<team_id>[0-9]+)/teamdeliverables/?$',views.TeamDeliverableList.as_view()),
    re_path(r'^teams/(?P<team_id>[0-9]+)/teamdeliverables/(?P<pk>\d+)/?$',views.TeamDeliverableDetail.as_view()),
    re_path(r'^teams/(?P<team_id>[0-9]+)/teamdeliverables/(?P<teamdeliverable_id>[0-9]+)/comments/?$',views.CommentList.as_view()),
    re_path(r'^teams/(?P<team_id>[0-9]+)/teamdeliverables/(?P<teamdeliverable_id>[0-9]+)/comments/(?P<pk>\d+)/?$',views.CommentDetail.as_view()),
    re_path('^coaches/?$', views.CoachList.as_view()),
    re_path(r'^coaches/(?P<pk>\d+)/?$', views.CoachDetail.as_view()),
    re_path(r'^deliverables/?$', views.DeliverableList.as_view()),
    re_path(r'^deliverables/(?P<pk>\d+)/?$', views.DeliverableDetail.as_view()),
    re_path(r'^teammembers/?$',views.TeamMemberList.as_view()),
    re_path(r'^teammembers/(?P<pk>\d+)/?$',views.TeamMemberDetail.as_view()),
    re_path(r'^teamdeliverables/?$',views.AllTeamDeliverableList.as_view()),
    re_path(r'^teamdeliverables/(?P<pk>\d+)/?$',views.AllTeamDeliverableDetail.as_view()),
    re_path(r'^uploadteamdeliverables/?$',views.TeamDeliverableUploadList.as_view()),
    re_path(r'^uploadteamdeliverables/(?P<pk>\d+)/?$',views.TeamDeliverableUploadDetail.as_view()),
    re_path('^realteammember/?$',views.RealTeamMemberList.as_view()),
    re_path(r'^realteammember/(?P<pk>\d+)/?$',views.RealTeamMemberDetail.as_view()),
    re_path('^deliverableLinks/?$',views.HelpfulLinkList.as_view()),
    re_path(r'^deliverableLinks/(?P<pk>\d+)/?$',views.HelpfulLinkDetail.as_view()),
    re_path(r'^coacheUpdateWithoutPhoto/(?P<pk>\d+)/?$',views.coachUpdateWithoutPhoto.as_view()),
    re_path(r'^updateTeamToCoach/(?P<pk>\d+)/?$',views.updateTeamToCoach.as_view()),
    re_path(r'^deliverableWithoutTemplate/(?P<pk>\d+)/?$',views.deliverableWithoutTemplate.as_view()),
    re_path(r'^deliverableWithoutTemplateList/?$',views.deliverableWithoutTemplateList.as_view()),
    re_path(r'^updateTeamWithoutPhoto/(?P<pk>\d+)/?$',views.updateTeamWithoutPhoto.as_view()),
    re_path(r'^updateTeamDeliverableWithoutFile/(?P<pk>\d+)/?$',views.updateTeamDeliverableWithoutFile.as_view()),
    re_path(r'^allcomments/?$',views.TotalCommentList.as_view()),
]

# Adding this lets you use filename extensions on URLs to provide an endpoint for a given media type.
# For example you can get endpoint data in json representation or html static file
urlpatterns = format_suffix_patterns(urlpatterns, allowed=['json', 'html'])
