from django.db import models
from django.db.models.signals import post_save
from django.contrib.auth.models import User

class Profile(models.Model):
    owner = models.OneToOneField(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    name = models.CharField(max_length=255, blank=True)
    content = models.TextField(blank=True)
    image = models.ImageField(
        upload_to='images/', default='../default_profile_ycpbtt'
    )

    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.owner}'s profile"


# we need to create this functoin before we pass it as an argument to the post_save.connect method and requires the arguments in brackets - the sender model, it's instance, created - which is a boolean value of whether or
# not the instance has just been created and kwargs
# Every time a user is created, a signal will trigger the Profile model to be created
def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(owner=instance)


# Listen for the post_save signal coming from the user model by calling the connect function
# create_profile is the function which should run eery time and User as the model we're expecting the signal from
post_save.connect(create_profile, sender=User)

