from django.http import Http404
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Post
from .serializers import PostSerializer
from drf_api.permissions import IsOwnerOrReadOnly



class PostList(APIView):
    # To have a nice create form rendered in the preview window, set the serializer_class attribute to PostSerializer on our PostList class
    serializer_class = PostSerializer

    # Add permission_classes so that user is authenticated when creating a post
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]

    # define the GET method to list all posts
    def get(self, request):
        # Retrieve all the post instances from the database
        posts = Post.objects.all()

        # Serialize them
        serializer = PostSerializer(
            posts, many=True, context={'request': request}
        )

        # Return the serialized data in the response
        return Response(serializer.data)

    # Post method
    def post(self, request):
        # Deserialize the post data, passing in whatever the user sends in the equest and the request itself in the context object
        serializer = PostSerializer(
            data=request.data, context={'request': request}
        )

        # If the is_valid method does throw, save the method on teh serializer and pass in the user that is making the request
        if serializer.is_valid():
            serializer.save(owner=request.user)

            # Return serialized data with the 201 status if the serializer is valid and return serializer errors with 400 status otherwise
            return Response(
                serializer.data, status=status.HTTP_201_CREATED
            )
        return Response(
            serializer.errors, status=status.HTTP_400_BAD_REQUEST
        )


class PostDetail(APIView):
    permission_classes = [IsOwnerOrReadOnly]
    serializer_class = PostSerializer
    
    def get_object(self, pk):
        try:
            post = Post.objects.get(pk=pk)
            self.check_object_permissions(self.request, post)
            return post
        except Post.DoesNotExist:
            raise Http404    

    def get(self, request, pk):
        post = self.get_object(pk)
        serializer = PostSerializer(
            post, context={'request': request}
        )
        return Response(serializer.data)

    def put(self, request, pk):
        post = self.get_object(pk)
        serializer = PostSerializer(
            post, data=request.data, context={'request': request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        post = self.get_object(pk)
        post.delete()
        return Response(
            status=status.HTTP_204_NO_CONTENT
        )
