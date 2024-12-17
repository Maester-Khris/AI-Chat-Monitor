from django.urls import path
from . import views

urlpatterns = [
    path('new',views.createuser),
    path('list',views.allusers),
]
