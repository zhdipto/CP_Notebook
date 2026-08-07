from rest_framework import serializers
from .models import CodeSnippet


class CodeSnippetSerializer(serializers.ModelSerializer):
    # ModelSerializer maps TextField -> CharField, whose trim_whitespace
    # defaults to True. For code that is destructive: it strips the leading
    # indentation off the first line (paste an indented block and it shifts to
    # column 0) and eats the trailing newline. Whitespace IS the content here.
    # title/language keep the default trimming, which is what you want there.
    code = serializers.CharField(trim_whitespace=False)

    class Meta:
        model = CodeSnippet
        # device_id is deliberately absent: it is the bearer credential for the
        # whole notebook, so it must be neither readable nor client-settable.
        fields = ['id', 'title', 'code', 'language', 'created_at', 'updated_at', 'is_favorited']
        # Toggled through the /favorite/ action, never by a direct write.
        read_only_fields = ['is_favorited']

    def validate_code(self, value):
        # trim_whitespace=False means a whitespace-only body would no longer be
        # normalised to '' and rejected, so reject it explicitly instead.
        if not value.strip():
            raise serializers.ValidationError('Code cannot be empty.')
        return value
