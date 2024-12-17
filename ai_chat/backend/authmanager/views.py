import requests
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from usersmanager.models import ChatUser
from usersmanager.serializers import ChatUserSerializer
from .serializers import CustomTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView, TokenBlacklistView
from usersmanager.models import ChatUser

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

@permission_classes([IsAuthenticated])
class CustomTokenBlacklistView(TokenBlacklistView):
    pass

@api_view(['POST'])
def signup(request):
    serializer = ChatUserSerializer(data = request.data)
    if serializer.is_valid():
        serializer.save()
        user = ChatUser.objects.get(username=request.data['username'])
        user.set_password(request.data['password'])
        user.save()
        return Response({"data":serializer.data},status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
  

@api_view(['POST'])
def login(request):
    user = get_object_or_404(ChatUser, username=request.data['username'])
    print(user)
    if not user.check_password(request.data['password']):
        return Response({"detail":"Not found"}, status=status.HTTP_404_NOT_FOUND)
    
    response = requests.post('http://127.0.0.1:8000/api/auth/jwt/token/', data={
        'username': user.username,
        'password': request.data['password']
    })
    jwttoken = response.json()
    serializer = ChatUserSerializer(instance = user)
    return Response({"token":jwttoken, "user":serializer.data}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def logout(request):
    return Response({})