from rest_framework import viewsets
from .models import CodeSnippet
from .serializer import CodeSnippetSerializer
from rest_framework import permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Exists, OuterRef


# Personal code bin: a snippet is only ever accessible to its owner. Read is
# NOT public anymore — every method requires you to be the authenticated owner.
class IsOwner(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user


class CodeSnippetViewSet(viewsets.ModelViewSet):
    queryset = CodeSnippet.objects.all()
    serializer_class = CodeSnippetSerializer
    permission_classes = [IsOwner]

    search_fields = ['title', 'code', 'language']
    filterset_fields = ['language']
    ordering_fields = ['created_at', 'updated_at', 'title']

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_queryset(self):
        # The ONLY isolation boundary now: you can only ever see your own
        # snippets. `has_permission` guarantees an authenticated user here,
        # so there's no anonymous branch to handle.
        #
        # select_related('owner') folds the owner.username lookup into one JOIN;
        # the Exists() annotation computes is_favorited as a SQL column so the
        # serializer never fires a per-row query (kills the list N+1).
        favorited = CodeSnippet.favorited_by.through.objects.filter(
            codesnippet_id=OuterRef('pk'), user_id=self.request.user.pk
        )
        return (
            CodeSnippet.objects
            .select_related('owner')
            .filter(owner=self.request.user)
            .annotate(is_favorited_flag=Exists(favorited))
        )

    @action(detail=True, methods=['post'])
    def favorite(self, request, pk=None):
        # Star/pin one of your own snippets. get_object() runs through
        # get_queryset(), so you can only ever favorite something you own.
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
        # filter_queryset() so search / language / ordering behave identically
        # here and on list() — without it the sidebar's search and sort would
        # silently do nothing whenever the favorites filter is on.
        snippets = self.filter_queryset(self.get_queryset()).filter(
            favorited_by=request.user
        )
        page = self.paginate_queryset(snippets)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(snippets, many=True)
        return Response(serializer.data)
