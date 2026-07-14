from django.shortcuts import get_object_or_404
from rest_framework.views import APIView, Response
from .models import CodeSnippet
from .serializer import CodeSnippetSerializer

# Create your views here.
class CodeSnippetListView(APIView):
    def get(self, request):
        snippets = CodeSnippet.objects.all()
        serializer = CodeSnippetSerializer(snippets, many=True)
        return Response(serializer.data)
    def post(self, request):
        serializer = CodeSnippetSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
class CodeSnippetDetailView(APIView):
    def get(self, request, pk):
        snippet = get_object_or_404(CodeSnippet, pk=pk)
        serializer = CodeSnippetSerializer(snippet)
        return Response(serializer.data)
    def put(self, request, pk):
        snippet = get_object_or_404(CodeSnippet, pk=pk)
        serializer = CodeSnippetSerializer(snippet, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    def delete(self, request, pk):
        snippet = get_object_or_404(CodeSnippet, pk=pk)
        snippet.delete()
        return Response(status=204)
    def patch(self, request, pk):
        snippet = get_object_or_404(CodeSnippet, pk=pk)
        serializer = CodeSnippetSerializer(snippet, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)