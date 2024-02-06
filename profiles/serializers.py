from rest_framework import serializers
from .models import Profile

# Serializers are needed to convert django model instances to JSON. as we are only working with django models
# we'll use model serializers to avoid data replication, just like you would use ModelForm over a regular form.  
# Model serializers are similar to django's modelforms in that they handle validation and the syntax for writing
# a model serializer is the same, we specify the model and fields in the meta class and we can specify extra fields too.
# We can use methods like .is_valid and .save with serializers. Additionally they handle all the conversions between data types


# Create a ProfileSerializer class and inherit from ModelSerializer and specify owner as a readonly field so it can't be edited
class ProfileSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')


    class Meta:
        model = Profile
        # You can list all the fields or set them to all: fields = '__all__'. Prefer to be explicit about which fields to include
        # because you may want to add another field to the profile model later on that we don't want included in the serializer
        # When extending django's model class using models.model, the id field is created automatically without us having to write it ourselves
        # If we want it included in the response, we have to add it to the serializer's field array
        fields = [
            'id', 'owner', 'created_at', 'updated_at', 'name',
            'content', 'image'
        ]
