from rest_framework.routers import DefaultRouter
from .views import CodeSnippetViewSet

router = DefaultRouter()
router.register('snippets', CodeSnippetViewSet, basename='snippet')

urlpatterns = router.urls
