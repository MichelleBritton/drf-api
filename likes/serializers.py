from django.db import IntegrityError
from rest_framework import serializers
from likes.models import Like


class LikeSerializer(serializers.ModelSerializer):
    """
    Serializer for the Like model
    The create method handles the unique constraint on 'owner' and 'post'
    """
    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Like
        fields = ['id', 'created_at', 'owner', 'post']
    
    # To prevent duplication of likes
    # Define the create method inside our Like Serializer to return a complete object instances based on the validated data.
    # Inside a try-except block, try and return the newly created like by calling the create method with the validated_data.
    # This create method is on the model serializer and for that reason I had to call super()
    # IF that throws an IntegrityError, I raise a serializer validation error and let the users know that this could be happening
    # because they're trying to like the same post twice.
    def create(self, validated_data):
        try:
            return super().create(validated_data)
        except IntegrityError:
            raise serializers.ValidationError({
                'detail': 'possible duplicate'
            })