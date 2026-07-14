import django.urls as urls
from . import views

urlpatterns = [
    urls.path('', views.CodeSnippetListView.as_view(), name='snippet-list'),
    urls.path('<int:pk>/', views.CodeSnippetDetailView.as_view(), name='snippet-detail'),
]