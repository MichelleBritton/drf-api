from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Profile
from .serializers import ProfileSerializer


class ProfileList(APIView):
    def get(self, request):
        profiles = Profile.objects.all()
        # Before we return a response, we need to create a ProfileSerializer instance and pass in profiles and many=true to specify we're serializing multiple profile instances
        serializer = ProfileSerializer(profiles, many=True)
        # Finally in our response we'll send data return from our serializer
        return Response(serializer.data)
