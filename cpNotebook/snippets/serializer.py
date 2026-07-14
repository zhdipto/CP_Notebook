
from rest_framework import serializers
from .models import CodeSnippet

class CodeSnippetSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = CodeSnippet
        fields = ['id', 'title', 'code', 'language', 'is_public', 'created_at', 'updated_at', 'owner']