from django.contrib.auth.models import AbstractUser
from django.db import models


class ChatUser(AbstractUser):
    useruuid = models.UUIDField(unique=True, null=False)

def getAllUsers():
    return ChatUser.objects.all()