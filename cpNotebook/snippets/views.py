from rest_framework import viewsets
from .models import CodeSnippet
from .serializer import CodeSnippetSerializer
from rest_framework import permissions
from django.db.models import Q
from rest_framework.decorators import action
from rest_framework.response import Response


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.owner == request.user
class CodeSnippetViewSet(viewsets.ModelViewSet):
    queryset = CodeSnippet.objects.all()
    serializer_class = CodeSnippetSerializer
    permission_classes = [IsOwnerOrReadOnly]

    search_fields = ['title', 'code', 'language']
    filterset_fields = ['is_public', 'language']
    ordering_fields = ['created_at', 'updated_at', 'title']

    def get_permissions(self):
        if self.action == 'favorite':
            return [permissions.IsAuthenticated()]
        return super().get_permissions()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
    def get_queryset(self):
        base = CodeSnippet.objects.select_related('owner')
        if not self.request.user.is_authenticated:
            return base.filter(is_public=True)
        return base.filter(Q(is_public=True) | Q(owner=self.request.user))
    @action(detail=True, methods=['post'])
    def favorite(self, request, pk=None):
        snippet = self.get_object()
        user = request.user
        if snippet.favorited_by.filter(pk=user.pk).exists():
            snippet.favorited_by.remove(user)
            return Response({'status': 'removed from favorites'})
        else:
            snippet.favorited_by.add(user)
            return Response({'status': 'added to favorites'})
    
    @action(detail=False, methods=['get'])
    def favorites(self, request):
        snippets = self.get_queryset().filter(favorited_by=request.user)
        page = self.paginate_queryset(snippets)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(snippets, many=True)
        return Response(serializer.data)
