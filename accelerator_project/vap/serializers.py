from rest_framework import serializers
from .models import User, Team, Coach, TeamMember, Deliverable, TeamDeliverable, Comment, Helpfullink, RealTeamMember
from django.contrib.auth.models import User as vap_user
from django.core.files.base import ContentFile
import base64
from django.contrib.auth.hashers import make_password
import six
import uuid
import imghdr
import PyPDF2

import io


# Upload pdf files
class Base64FileField(serializers.FileField):

    def to_internal_value(self, data):

        # Check if this is a base64 string
        if isinstance(data, six.string_types):
            # Check if the base64 string is in the "data:" format
            if 'data:' in data and ';base64,' in data:
                # Break out the header from the base64 content
                header, data = data.split(';base64,')

            # Try to decode the file. Return validation error if it fails.
            try:
                decoded_file = base64.b64decode(data)
            except TypeError:
                self.fail('invalid_file')

            # Generate file name:
            # 12 characters are more than enough.
            file_name = str(uuid.uuid4())[:12]
            # Get the file name extension:
            file_extension = self.get_file_extension(file_name, decoded_file)

            complete_file_name = "%s.%s" % (file_name, file_extension,)

            data = ContentFile(decoded_file, name=complete_file_name)

        return super(Base64FileField, self).to_internal_value(data)

    def get_file_extension(self, filename, decoded_file):
        try:
            PyPDF2.PdfFileReader(io.BytesIO(decoded_file))
        except PyPDF2.utils.PdfReadError as e:
            logger.warning(e)
        else:
            return 'pdf'

class Base64ImageField(serializers.ImageField):

    def to_internal_value(self, data):
        from django.core.files.base import ContentFile
        import base64
        import six
        import uuid

        # Check if this is a base64 string
        if isinstance(data, six.string_types):
            # Check if the base64 string is in the "data:" format
            if 'data:' in data and ';base64,' in data:
                # Break out the header from the base64 content
                header, data = data.split(';base64,')

            # Try to decode the file. Return validation error if it fails.
            try:
                decoded_file = base64.b64decode(data)
            except TypeError:
                self.fail('invalid_image')

            # Generate file name:
            file_name = str(uuid.uuid4())[:12] # 12 characters are more than enough.
            # Get the file name extension:
            file_extension = self.get_file_extension(file_name, decoded_file)

            complete_file_name = "%s.%s" % (file_name, file_extension, )

            data = ContentFile(decoded_file, name=complete_file_name)

        return super(Base64ImageField, self).to_internal_value(data)

    def get_file_extension(self, file_name, decoded_file):
        import imghdr

        extension = imghdr.what(file_name, decoded_file)
        extension = "jpg" if extension == "jpeg" else extension

        return extension

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('user', 'name', 'email', 'phone',
                  'is_coach', 'is_team_member')


class UserSerializer(serializers.ModelSerializer):
    profile = CustomUserSerializer(many=False, read_only=True)

    password = serializers.CharField(
        write_only=True,
        required=True,
        help_text='Leave empty if no change needed',
        style={'input_type': 'password', 'placeholder': 'Password'}
    )

    class Meta:
        model = vap_user
        fields = ('id', 'username', 'password', 'profile', 'is_superuser')
        lookup_field = 'username'


    def create(self, validated_data):
        user = super().create(validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user

    def update(self, instance, validated_data):
        user = super().update(instance, validated_data)
        try:
            user.set_password(validated_data['password'])
            user.save()
        except KeyError:
            pass
        return user

class CoachSerializer(serializers.ModelSerializer):
    # photo = Base64ImageField(max_length=None, use_url=True)

    class Meta:
        model = Coach
        fields = ('user', 'name', 'email', 'phone', 'field', 'organization', 'job_title', 'photo', 'about_me')

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('id', 'teamdeliverable', 'coach', 'text', 'date')

    # For post
    def to_representation(self, instance):
        # self.fields['coach'] = CoachSerializer(read_only=False)
        return super(CommentSerializer, self).to_representation(instance)


class HelpLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Helpfullink
        fields = '__all__'

class DeliverableSerializer(serializers.ModelSerializer):
    template = Base64FileField(
        max_length=None, use_url=True,
    )

    class Meta:
        model = Deliverable
        fields = ('id', 'title', 'description', 'release_date', 'pipeline', 'template', 'icon', 'deadline')
        depth = 1
        


class TeamSerializer(serializers.ModelSerializer):
    # photo = Base64ImageField(max_length=None, use_url=True)

    class Meta:
        model = Team
        fields = '__all__'
        depth = 1


class TeamDeliverableSerializer(serializers.ModelSerializer):
    file = Base64FileField(
        max_length=None, use_url=True,
    )

    class Meta:
        model = TeamDeliverable
        fields = ('id', 'deliverable', 'team', 'deadline', 'status', 'file')

    # For post
    def to_representation(self, instance):
        self.fields['deliverable'] = DeliverableSerializer(read_only=False)
        return super(TeamDeliverableSerializer, self).to_representation(instance)


class TeamDelSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamDeliverable
        fields = ('id', 'deliverable', 'team', 'deadline', 'status', 'file')

    # For post
    def to_representation(self, instance):
        self.fields['deliverable'] = DeliverableSerializer(read_only=False)
        return super(TeamDelSerializer, self).to_representation(instance)


class AllTeamDeliverableSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamDeliverable
        fields = '__all__'
        depth = 2


class TeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = ('user', 'team', 'name', 'email', 'phone', 'field', 'role')

    # For post
    def to_representation(self, instance):
        self.fields['team'] = TeamSerializer(read_only=False)
        return super(TeamMemberSerializer, self).to_representation(instance)

class RealTeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = RealTeamMember
        fields = ('id', 'name', 'role', 'team_id')

class CoachWithoutPhotoSerializer(serializers.ModelSerializer):

    class Meta:
        model = Coach
        fields = ('user', 'name', 'email', 'phone', 'field', 'organization', 'job_title', 'about_me')

class DeliverableWithoutTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Deliverable
        fields = ('id', 'title', 'description', 'release_date', 'pipeline', 'icon', 'deadline')
        depth = 1


class TeamWithoutTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = '__all__'
        depth = 1

class updateTeamDeliverableWithoutFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamDeliverable
        fields = ('id', 'deliverable', 'team', 'deadline')

        