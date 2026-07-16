from django.contrib.auth import get_user_model
from rest_framework import generics, permissions
from rest_framework.throttling import ScopedRateThrottle
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import RegisterSerializer

class RegisterView(generics.CreateAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class ThrottledTokenObtainPairView(TokenObtainPairView):
    # ScopedRateThrottle reads `throttle_scope` and applies the matching rate
    # ("login": "5/min") — a targeted brute-force brake on the login endpoint,
    # independent of the broad anon/user limits.
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "login"
