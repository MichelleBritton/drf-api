from django.urls import path
from profiles import views


# ProfileList is a class view so remember to call as_view on it
urlpatterns = [
    path('profiles/', views.ProfileList.as_view()),
]