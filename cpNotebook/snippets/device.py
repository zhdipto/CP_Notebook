import re

from rest_framework import permissions
from rest_framework.throttling import SimpleRateThrottle

# Header the browser sends on every request. The value is a random UUID the
# frontend generates once and keeps in localStorage.
DEVICE_HEADER = 'X-Device-Id'

# Snippets that existed back when the app had user accounts were all reassigned
# to this id by migration 0004, so they remain reachable. Seed a browser's
# localStorage with it to view them.
LEGACY_DEVICE_ID = '00000000-0000-4000-8000-000000000001'

# Deliberately strict: the value goes straight into a DB lookup and a cache key,
# and the column is max_length=64. Anything outside this shape is treated as no
# device at all rather than silently matching a truncated/odd row.
_DEVICE_RE = re.compile(r'^[A-Za-z0-9-]{16,64}$')


def get_device_id(request):
    """Return the validated device id for this request, or None."""
    raw = request.headers.get(DEVICE_HEADER, '')
    return raw if _DEVICE_RE.fullmatch(raw) else None


class HasDeviceId(permissions.BasePermission):
    """Replaces IsOwner: identity is the device token, not a logged-in user."""

    message = f'A valid {DEVICE_HEADER} header is required.'

    def has_permission(self, request, view):
        return get_device_id(request) is not None

    def has_object_permission(self, request, view, obj):
        # get_queryset() already scopes by device, so this is defence in depth
        # for any code path that fetches an object some other way.
        return obj.device_id == get_device_id(request)


class DeviceRateThrottle(SimpleRateThrottle):
    """Per-browser limit.

    Every request is anonymous now, so the old AnonRateThrottle would have
    lumped every visitor behind one NAT into a single IP bucket. Keying on the
    device token gives each browser its own budget. A device token is trivially
    rotated, so this is a fair-use limit, not a defence — AnonRateThrottle stays
    enabled alongside it as the per-IP backstop.
    """

    scope = 'device'

    def get_cache_key(self, request, view):
        ident = get_device_id(request) or self.get_ident(request)
        return self.cache_format % {'scope': self.scope, 'ident': ident}
