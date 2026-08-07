from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .device import HasDeviceId, get_device_id
from .models import CodeSnippet
from .serializer import CodeSnippetSerializer


class CodeSnippetViewSet(viewsets.ModelViewSet):
    # none() rather than all(): get_queryset() below is the real source, and a
    # permissive class attribute is a footgun if any code path ever reads it.
    queryset = CodeSnippet.objects.none()
    serializer_class = CodeSnippetSerializer
    permission_classes = [HasDeviceId]

    search_fields = ['title', 'code', 'language']
    filterset_fields = ['language']
    ordering_fields = ['created_at', 'updated_at', 'title']

    def get_queryset(self):
        # The only isolation boundary: a browser sees exactly the snippets its
        # own device token created. HasDeviceId has already guaranteed the
        # header is present and well-formed, so this can never be a blank match.
        return CodeSnippet.objects.filter(device_id=get_device_id(self.request))

    def perform_create(self, serializer):
        serializer.save(device_id=get_device_id(self.request))

    @action(detail=True, methods=['post'])
    def favorite(self, request, pk=None):
        # get_object() runs through get_queryset(), so you can only ever star
        # something your own device owns.
        snippet = self.get_object()
        snippet.is_favorited = not snippet.is_favorited
        snippet.save(update_fields=['is_favorited', 'updated_at'])
        return Response({
            'status': 'added to favorites' if snippet.is_favorited else 'removed from favorites',
            'is_favorited': snippet.is_favorited,
        })

    @action(detail=False, methods=['get'])
    def favorites(self, request):
        # filter_queryset() so search / language / ordering behave identically
        # here and on list() — without it the sidebar's search and sort would
        # silently do nothing whenever the favorites filter is on.
        snippets = self.filter_queryset(self.get_queryset()).filter(is_favorited=True)
        page = self.paginate_queryset(snippets)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(snippets, many=True)
        return Response(serializer.data)
