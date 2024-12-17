from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path('login', views.login),
    path('signup',views.signup),
    path('logout', views.logout),
    path('jwt/token/', views.CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('jwt/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('jwt/token/revoke/', views.CustomTokenBlacklistView.as_view(), name='token_blacklist'),   
]