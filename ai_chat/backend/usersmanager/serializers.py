from rest_framework import serializers
from .models import ChatUser

class ChatUserSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = ChatUser
        fields = ['id','username','password','email', 'useruuid']

