from rest_framework import generics, permissions
from drf_api.permissions import IsOwnerOrReadOnly
from .models import Comment
from .serializers import CommentSerializer, CommentDetailSerializer


# Instead of using the get, post, put methods like in Posts and Profiles there is an easier way to do it with 
# generic views so we don't have to repeat ourselves
# As we want to both list and create comments in the ListView, instead of explicitly defining the post and get methods
# like we did before, we can extend teh generics ListCreateAPIView. Extending the ListAPIView means we won't have to write the get method
# and the CreateAPIView takes care of the post method
class CommentList(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    # Instead of specifying the model we'd like to us, in DRF we set the queryset attribute. This way it is possible to filter out some of the model instances
    # This would make sense if we were dealing with user sensitive data like orders or payments where we would need to make sure users can access and query only
    # their own data
    queryset = Comment.objects.all()

    # Make sure comments are associated with a user upon creation
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class CommentDetail(generics.RetrieveUpdateDestroyAPIView):
    # we want only the comment owner to be able to edit or delete it
    permission_classes = [IsOwnerOrReadOnly]

    # In order not to have to send the post id every time I want to edit a comment
    # Our serializer still needs to access teh request but we don't need to do anything as the request is passed in as part of the context object by default
    serializer_class = CommentDetailSerializer

    queryset = Comment.objects.all()