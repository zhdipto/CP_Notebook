
from rest_framework import serializers
from .models import CodeSnippet

class CodeSnippetSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    is_favorited = serializers.SerializerMethodField()

    class Meta:
        model = CodeSnippet
        fields = ['id', 'title', 'code', 'language', 'created_at', 'updated_at', 'owner', 'is_favorited']

    def get_is_favorited(self, obj):
        request = self.context.get('request')
        if request is None or not request.user.is_authenticated:
            return False
        return obj.favorited_by.filter(pk=request.user.pk).exists()