from django.contrib.auth.models import User
from .models import Post
from rest_framework import status
from rest_framework.test import APITestCase

# What happens for each test
# At the very beginning, before any test is run, the test database is created
# Then, before every test, the test database is flushed, which means that any data is destroyed
# Then, the setUp method runs, and finally the test. The cycle repeats for each test method
# Eventually, at the very end, once all of the test have been run, the test database is destroyed

class PostListViewTests(APITestCase):
    # Define a setUp method that will automatically run before every test method in the class
    # Create a user that we can reference later on in all the tests inside this class
    # Use this user's credentials when we need to log in to create a post
    # We also need this user when we manually create a post and need to set it's owner
    def setUp(self):
        User.objects.create_user(username='adam', password='pass')

    # Test that we can list posts present in the database
    # Get the user adam which has been created in the setUp method so that you can 
    # associate the newly created post with that user

    # Test that we cdan make a get request to /posts to list all the posts
    # You make test netweork requests by calling an appropriate method on self.client,
    # namely self.client.get or .post or .put etc, followed by the URL we are making a request to

    # In this case, we will make a get request to posts so we can inspect the response we get back
    # first make it fail by asserting the status_code isn't 200, it will say that it should be 200, so change the test to 200 to make it pass
    # Run the test by typing python manage.py test in teh terminal

    def test_can_list_posts(self):
        adam = User.objects.get(username='adam')
        Post.objects.create(owner=adam, title='a title')
        response = self.client.get('/posts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)   
        print(response.data)
        print(len(response.data))        
    
    # Test that a logged in user can create a post
    # To test protected routes (which are routes that require the user to be logged in), we'll have to log in first using the APITest client
    # To do this, we use the client.login method and pass in the username and password from the setUp method
    # Then, make a post request to /posts/ with post data and save the response to a variable
    # Count the posts and check if there is just one
    # Make it fail first iwth a 200-Ok, then make it pass with a 201 created
    def test_logged_in_user_can_create_post(self):
        self.client.login(username='adam', password='pass')
        response = self.client.post('/posts/', {'title': 'a title'})
        count = Post.objects.count()
        self.assertEqual(count, 1)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)   
    
    def test_user_has_to_be_logged_in_to_create_a_post(self):
        response = self.client.post('/posts/', {'title': 'a title'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)   


class PostDetailViewTests(APITestCase):
    def setUp(self):
        adam = User.objects.create_user(username='adam', password='pass')
        brian = User.objects.create_user(username='brian', password='pass')
        Post.objects.create(
            owner=adam, title='a title', content='adams content'
        )
        Post.objects.create(
            owner=brian, title='another title', content='brians content'
        )

    def test_can_retrieve_post_using_valid_id(self):
        response = self.client.get('/posts/1/')
        self.assertEqual(response.data['title'], 'a title')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_cant_retrieve_post_using_invalid_id(self):
        response = self.client.get('/posts/999/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_user_can_update_own_post(self):
        self.client.login(username='adam', password='pass')
        response = self.client.put('/posts/1/', {'title': 'a new title'})
        post = Post.objects.filter(pk=1).first()
        self.assertEqual(post.title, 'a new title')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_cant_update_another_users_post(self):
        self.client.login(username='adam', password='pass')
        response = self.client.put('/posts/2/', {'title': 'a new title'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)