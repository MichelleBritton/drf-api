from django.http import Http404
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Profile
from .serializers import ProfileSerializer


class ProfileList(APIView):
    """
    List all profiles
    No Create view (post method), as profile creation handled by django signals
    """
    def get(self, request):
        #First, we return all the profiles
        profiles = Profile.objects.all()
        
        # Then we serialized them
        # Before we return a response, we need to create a ProfileSerializer instance and pass in profiles and many=true to specify we're serializing multiple profile instances
        serializer = ProfileSerializer(profiles, many=True)
        
        # Finally, we sent serialized data in the response
        # In our response we'll send data return from our serializer
        return Response(serializer.data)


# Create a new class for detail view which inherits from APIView
class ProfileDetail(APIView):
    # This will create a nice form in the admin area to edit content
    serializer_class = ProfileSerializer
    
    # we need code to handle if a request is made for a profile that doesn't exist so we define a new method
    # called get_object. It will take in self and primary key as arguments
    def get_object(self, pk):
        # Inside the try/except block we'll attempt to retreive a profile by primary key and return it
        try:
            profile = Profile.objects.get(pk=pk)
            return profile
        # IF the profile doesn't exist raise a 404 exception (import at the top from django's http module)
        except Profile.DoesNotExist:
            raise Http404
    

    def get(self, request, pk):
        # First we call the get_object method and then the Profile Serializer with the profile instance. 
        # No need to pass many=true as above as we are dealing with a single profile model instance and not a queryset
        profile = self.get_object(pk)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)


    def put(self, request, pk):
        profile = self.get_object(pk)
        serializer = ProfileSerializer(profile, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        # To access status, import it above
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)