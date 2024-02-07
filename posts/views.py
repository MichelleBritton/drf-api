from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Post
from .serializers import PostSerializer


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
