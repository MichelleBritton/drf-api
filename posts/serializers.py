from rest_framework import serializers
from posts.models import Post
from likes.models import Like


class PostSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    is_owner = serializers.SerializerMethodField()
    profile_id = serializers.ReadOnlyField(source='owner.profile.id')
    profile_image = serializers.ReadOnlyField(source='owner.profile.image.url')
    like_id = serializers.SerializerMethodField()

    # Use rest framework's field level validation methods, they're called validate_fieldname, in this case validate_image
    # If we use this naming convention, this method will be called automatically and validate the uploaded image every time we create or update a post
    # This takes two arguments, self and value which is the uploaded image
    def validate_image(self, value):
        # We'll check if the file size is bigger than 2 megabytes. The default file size unit is a byte. If we multiply it by 1024, we'll get kilobytes
        # Mulitplied again by 1024, we'll get megabytes. We then multiply it by 2 and we'll get the 2 megabyte file size limit.
        if value.size > 1024 * 1024 * 2:
            raise serializers.ValidationError(
                'Image size larger than 2MB!'
            )
        if value.image.width > 4096:
            raise serializers.ValidationError(
                'Image width larger than 4096px!'
            )
        if value.image.height > 4096:
            raise serializers.ValidationError(
                'Image height larger than 4096px!'
            )
        # return original value passed into our validate_image function
        return value

    def get_is_owner(self, obj):
        request = self.context['request']
        return request.user == obj.owner

    def get_like_id(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            like = Like.objects.filter(
                owner=user, post=obj
            ).first()
            return like.id if like else None
        return None

    class Meta:
        model = Post
        fields = [
            'id', 'owner', 'is_owner', 'profile_id',
            'profile_image', 'created_at', 'updated_at',
            'title', 'content', 'image', 'image_filter', 'like_id',
        ]