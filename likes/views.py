from rest_framework import generics, permissions
from drf_api.permissions import IsOwnerOrReadOnly
from likes.models import Like
from likes.serializers import LikeSerializer


# List and create likes so extend teh ListCreateAPIView generics class
# we have to make sure only the authenticated users can like posts by setting permission classes
class LikeList(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    serializer_class = LikeSerializer
    queryset = Like.objects.all()

    #Just like when we set the user creating a comment as it's owner, we'll do teh same here iwth the Like
    # When saving the like instances to our database, we'll set the owner to be the user making the request
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class LikeDetail(generics.RetrieveDestroyAPIView):
    permission_classes = [IsOwnerOrReadOnly]
    serializer_class = LikeSerializer
    queryset = Like.objects.all()
