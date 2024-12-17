from rest_framework import status
from rest_framework.response import Response 
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .serializers import ChatUserSerializer
from .models import ChatUser, getAllUsers


@api_view(['POST'])
def createuser(request):
    serializer = ChatUserSerializer(data = request.data)
    if serializer.is_valid():
        serializer.save()
        user = ChatUser.objects.get(username=request.data['username'])
        user.set_password(request.data['password'])
        user.save()
        return Response({"data":serializer.data},status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def allusers(request):
    users = getAllUsers()
    serializer = ChatUserSerializer(users, many=True)
    return Response({"data":serializer.data},status=status.HTTP_200_OK)
