from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    # Overwrite it's has_object_permission method
    def has_object_permission(self, request, view, obj):
        # Check if the user is requesting read only access and return true
        if request.method in permissions.SAFE_METHODS:
            return True
        # Otherwise we'll return True only if the user making the request owns the profile
        return obj.owner == request.user