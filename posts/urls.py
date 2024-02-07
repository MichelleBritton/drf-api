from django.urls import path
from posts import views


# PostList is a class view so remember to call as_view on it
urlpatterns = [
    path('posts/', views.PostList.as_view()),
    path('posts/<int:pk>/', views.PostDetail.as_view()),
]