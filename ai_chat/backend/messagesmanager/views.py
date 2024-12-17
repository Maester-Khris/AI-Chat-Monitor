from rest_framework import status
from rest_framework.response import Response 
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .serializers import MessageSerializer
from .models import getAllMessages, updateTag, retrieve_participant_message


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def allMessages(request):
    messages = getAllMessages()
    serializer = MessageSerializer(messages, many=True)
    return Response({"data":serializer.data},status=status.HTTP_200_OK)


@api_view(['POST'])
def saveMessage(request):
    serializer = MessageSerializer(data = request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"data":serializer.data},status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def retrieveparticipantsmessage(request,sender,receiver):
    messages = retrieve_participant_message(sender, receiver)
    responseSerializer = MessageSerializer(messages, many=True)
    return Response({"data":responseSerializer.data},status=status.HTTP_200_OK)



@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def updateMessageTag(request):
    print(request.data)
    message = updateTag(request.data['message_uuid'],request.data['tag'])
    serializer = MessageSerializer(instance=message)
    return Response({"data":serializer.data},status=status.HTTP_200_OK)
    #return Response("okay")
   
