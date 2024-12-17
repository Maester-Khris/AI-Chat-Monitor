from django.db import models

class Message(models.Model):
    body = models.TextField()
    tag = models.BooleanField(null=True)
    sender = models.CharField(max_length=200)
    receiver = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    message_uuid = models.UUIDField(unique=True)
    room_uuid = models.UUIDField(unique=False)

    def __str__(self):
        return f"{self.sender}: {self.body} at {self.created_at}" 
    

def createFromObject(msg):
    message = Message(**msg)
    message.save()
    return message


def getAllMessages():
    return Message.objects.all()


def findMessage(messageuuid):
    message = Message.objects.filter(message_uuid=messageuuid).first()
    return message

def retrieve_participant_message(sender, receiver):
    messages = Message.objects.filter(sender=sender, receiver=receiver)
    return messages


def updateTag(messageuuid, tag):
    message = Message.objects.filter(message_uuid=messageuuid).first()
    message.tag = tag
    message.save()
    return message

