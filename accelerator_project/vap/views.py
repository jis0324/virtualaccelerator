import os

from .models import User, Team, TeamMember, Coach, Deliverable, TeamDeliverable, Comment, RealTeamMember, Helpfullink
from .serializers import UserSerializer, CustomUserSerializer, TeamSerializer, TeamMemberSerializer, CoachSerializer, DeliverableSerializer, TeamDeliverableSerializer, AllTeamDeliverableSerializer, CommentSerializer, RealTeamMemberSerializer, HelpLinkSerializer, CoachWithoutPhotoSerializer, DeliverableWithoutTemplateSerializer, TeamWithoutTemplateSerializer, updateTeamDeliverableWithoutFileSerializer
from django.contrib.auth.models import User as vap_user
from rest_framework import generics
from django.contrib.staticfiles import views
from rest_framework import permissions
from .serializers import TeamDelSerializer

# To upload a file
from rest_framework.views import APIView

from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import JSONParser

from rest_framework.request import Request
from rest_framework.response import Response


def index(request, path=''):
    if (path.endswith('.js')):
        return views.serve(request, path)
    else:
        return views.serve(request, 'index.html')


class UserList(generics.ListCreateAPIView):
    serializer_class = UserSerializer

    def get_queryset(self):
        queryset = vap_user.objects.all()
        username = self.request.query_params.get('username', None)
        if username is not None:
            queryset = queryset.filter(user = user_id)
        return queryset

class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = vap_user.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'username'

class TeamList(generics.ListCreateAPIView):
    serializer_class = TeamSerializer

    def get_queryset(self):
        queryset = Team.objects.all()
        name = self.request.query_params.get('name', None)
        if name is not None:
            queryset = queryset.filter(name__contains=name)
        return queryset


class TeamDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer


class TeamMemberList(generics.ListCreateAPIView):
    serializer_class = TeamMemberSerializer

    def get_queryset(self):
        queryset = TeamMember.objects.all()
        team_id = self.kwargs.get('team_id', None)
        if team_id is not None:
            queryset = queryset.filter(team=team_id)
        return queryset


class TeamMemberDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = TeamMember.objects.all()
    serializer_class = TeamMemberSerializer


class AllTeamMemberList(generics.ListCreateAPIView):
    serializer_class = TeamMemberSerializer

    def get_queryset(self):
        queryset = TeamMember.objects.all()
        user = self.request.query_params.get('user', None)
        if user is not None:
            queryset = queryset.filter(user=user)
        return queryset


class AllTeamMemberDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = TeamMember.objects.all()
    serializer_class = TeamMemberSerializer


class CoachList(generics.ListCreateAPIView):
    serializer_class = CoachSerializer

    def get_queryset(self):
        queryset = Coach.objects.all()
        name = self.request.query_params.get('name', None)
        if name is not None:
            queryset = queryset.filter(name__contains=name)
        return queryset


class CoachDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Coach.objects.all()
    serializer_class = CoachSerializer


class TeamDeliverableList(generics.ListCreateAPIView):
    serializer_class = TeamDelSerializer

    def get_queryset(self):
        queryset = TeamDeliverable.objects.all()
        team_id = self.kwargs.get('team_id', None)
        if team_id is not None:
            queryset = queryset.filter(team=team_id).order_by('deadline')
        return queryset


class TeamDeliverableDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = TeamDeliverable.objects.all()
    serializer_class = TeamDelSerializer


class TeamDeliverableUploadList(generics.ListCreateAPIView):
    serializer_class = TeamDeliverableSerializer

    def get_queryset(self):
        queryset = TeamDeliverable.objects.all()
        team_id = self.kwargs.get('team_id', None)
        if team_id is not None:
            queryset = queryset.filter(team=team_id).order_by('deadline')
        return queryset

    def post(self, request):

        serializer = TeamDeliverableSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TeamDeliverableUploadDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = TeamDeliverable.objects.all()
    serializer_class = TeamDeliverableSerializer


class AllTeamDeliverableList(generics.ListCreateAPIView):
    serializer_class = AllTeamDeliverableSerializer

    def get_queryset(self):
        queryset = TeamDeliverable.objects.all()
        id = self.request.query_params.get('id', None)
        if id is not None:
            queryset = queryset.order_by('deadline')
        return queryset.order_by('deadline')


class AllTeamDeliverableDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = TeamDeliverable.objects.all()
    serializer_class = AllTeamDeliverableSerializer


class DeliverableList(generics.ListCreateAPIView):
    serializer_class = DeliverableSerializer

    def get_queryset(self):
        queryset = Deliverable.objects.all()
        title = self.request.query_params.get('title', None)
        if title is not None:
            queryset = queryset.filter(title__contains=name)
        return queryset

    def post(self, request):

        serializer = DeliverableSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeliverableDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Deliverable.objects.all()
    serializer_class = DeliverableSerializer


class CommentList(generics.ListCreateAPIView):
    serializer_class = CommentSerializer

    def get_queryset(self):
        queryset = Comment.objects.all()
        teamdeliverable_id = self.kwargs.get('teamdeliverable_id', None)
        if teamdeliverable_id is not None:
            queryset = queryset.filter(
                teamdeliverable=teamdeliverable_id).order_by('-date')
        return queryset


class TotalCommentList(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()


class CommentDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer


class RealTeamMemberList(generics.ListCreateAPIView):
    serializer_class = RealTeamMemberSerializer
    queryset = RealTeamMember.objects.all()

class RealTeamMemberDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = RealTeamMember.objects.all()
    serializer_class = RealTeamMemberSerializer

class HelpfulLinkList(generics.ListCreateAPIView):
    serializer_class = HelpLinkSerializer
    queryset = Helpfullink.objects.all()
    
class HelpfulLinkDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = HelpLinkSerializer
    queryset = Helpfullink.objects.all()

class coachUpdateWithoutPhoto(generics.RetrieveUpdateDestroyAPIView):
    queryset = Coach.objects.all()
    serializer_class = CoachWithoutPhotoSerializer

class updateTeamToCoach(generics.RetrieveUpdateDestroyAPIView):
    queryset = Team.objects.all()
    serializer_class = TeamWithoutTemplateSerializer

class deliverableWithoutTemplate(generics.RetrieveUpdateDestroyAPIView):
    queryset = Deliverable.objects.all()
    serializer_class = DeliverableWithoutTemplateSerializer

class deliverableWithoutTemplateList(generics.ListCreateAPIView):
    queryset = Deliverable.objects.all()
    serializer_class = DeliverableWithoutTemplateSerializer

class updateTeamWithoutPhoto(generics.RetrieveUpdateDestroyAPIView):
    queryset = Team.objects.all()
    serializer_class = TeamWithoutTemplateSerializer

class updateTeamDeliverableWithoutFile(generics.RetrieveUpdateAPIView):
    queryset = TeamDeliverable.objects.all()
    serializer_class = updateTeamDeliverableWithoutFileSerializer