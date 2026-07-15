from rest_framework import viewsets
from .models import CodeSnippet
from .serializer import CodeSnippetSerializer

# Create your views here.
class CodeSnippetListView(viewsets.ModelViewSet):
    queryset = CodeSnippet.objects.all()
    serializer_class = CodeSnippetSerializer
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
    
class CodeSnippetDetailView(viewsets.ModelViewSet):
    queryset = CodeSnippet.objects.all()
    serializer_class = CodeSnippetSerializer