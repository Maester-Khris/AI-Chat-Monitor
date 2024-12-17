from django.urls import path
from . import views

urlpatterns = [
    path('add',views.saveMessage),
    path('list',views.allMessages),
    path('updatetag',views.updateMessageTag),
    path('participants/<str:sender>/<str:receiver>/',views.retrieveparticipantsmessage),
]
