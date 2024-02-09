# from django.http import Http404
# from rest_framework import status
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from .models import Profile
# from .serializers import ProfileSerializer
# from drf_api.permissions import IsOwnerOrReadOnly


# class ProfileList(APIView):
#     """
#     List all profiles
#     No Create view (post method), as profile creation handled by django signals
#     """
#     def get(self, request):
#         #First, we return all the profiles
#         profiles = Profile.objects.all()
        
#         # Then we serialized them
#         # Before we return a response, we need to create a ProfileSerializer instance and pass in profiles and many=true to specify we're serializing multiple profile instances
#         serializer = ProfileSerializer(
#             profiles, many=True, context={'request': request}
#         )
        
#         # Finally, we sent serialized data in the response
#         # In our response we'll send data return from our serializer
#         return Response(serializer.data)


# # Create a new class for detail view which inherits from APIView
# class ProfileDetail(APIView):
#     # This will create a nice form in the admin area to edit content
#     serializer_class = ProfileSerializer

#     # Set the permission classes attribute
#     permission_classes = [IsOwnerOrReadOnly]

#     # we need code to handle if a request is made for a profile that doesn't exist so we define a new method
#     # called get_object. It will take in self and primary key as arguments
#     def get_object(self, pk):
#         # Inside the try/except block we'll attempt to retreive a profile by primary key and return it
#         try:
#             profile = Profile.objects.get(pk=pk)
#             # Explicity check object permissions before we return a profile instance. If the user doesn't own the profile
#             # it will throw the 403 forbidden error and not return the instance.
#             self.check_object_permissions(self.request, profile)
#             return profile
#         # IF the profile doesn't exist raise a 404 exception (import at the top from django's http module)
#         except Profile.DoesNotExist:
#             raise Http404
    

#     def get(self, request, pk):
#         # First we call the get_object method and then the Profile Serializer with the profile instance. 
#         # No need to pass many=true as above as we are dealing with a single profile model instance and not a queryset
#         profile = self.get_object(pk)
#         serializer = ProfileSerializer(
#             profile, context={'request': request}
#         )
#         return Response(serializer.data)


#     def put(self, request, pk):
#         profile = self.get_object(pk)
#         serializer = ProfileSerializer(
#             profile, data=request.data, context={'request': request}
#         )
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         # To access status, import it above
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# Refactured code to use generic views
from django.db.models import Count
from rest_framework import generics, filters
from django_filters.rest_framework import DjangoFilterBackend
from drf_api.permissions import IsOwnerOrReadOnly
from .models import Profile
from .serializers import ProfileSerializer


class ProfileList(generics.ListAPIView):
    """
    List all profiles.
    No create view as profile creation is handled by django signals.
    """
    # queryset = Profile.objects.all()

    # The annotate function allows us to define extra fields to be added to the queryset. In this case
    # we will add fields to work out how many posts and followers a user have and how many others they're following
    # Define field called posts_count, for how many posts a user has, and then we'll use the Count class we imported
    # earlier because we want to count how many posts there are. There is no direct relationship between profile and post so we need
    # to go through the user model to get there, so inside the Count class we will need to perform a lookup that spans the profile, user and post
    # models, so we can get to the POst model with the instances we want to count. Similar to when we used dot notation, the first part of our lookup
    # string is the owner field on the profile model, which is a OneToOne field referencing user. From there we can reach the Post model, so we have to 
    # add double underscore post to show the relationship between Profile, User and Post. As we'll be defining more than one field inside the annotate function, 
    # we also need to pass distinct=True here to only count the unique posts, without this there would be duplicates.
    queryset = Profile.objects.annotate(
        posts_count=Count('owner__post', distinct=True),
        followers_count=Count('owner__followed', distinct=True),
        following_count=Count('owner__following', distinct=True)
    ).order_by('-created_at')
    serializer_class = ProfileSerializer

    # To create a filter and made the fields sortable, set the filter_backends attribute to OrderingFilter and set the ordering_fields to the fields we just annotated
    filter_backends = [
        filters.OrderingFilter,
        DjangoFilterBackend,
    ]
    filterset_fields = [
        'owner__following__followed__profile',
        'owner__followed__owner__profile'
    ]
    ordering_fields = [
        'posts_count',
        'followers_count',
        'following_count',
        'owner__following__created_at',
        'owner__followed__created_at',
    ]


class ProfileDetail(generics.RetrieveUpdateAPIView):
    """
    Retrieve or update a profile if you're the owner.
    """
    permission_classes = [IsOwnerOrReadOnly]
    # queryset = Profile.objects.all()
    queryset = Profile.objects.annotate(
        posts_count=Count('owner__post', distinct=True),
        followers_count=Count('owner__followed', distinct=True),
        following_count=Count('owner__following', distinct=True)
    ).order_by('-created_at')
    serializer_class = ProfileSerializer
