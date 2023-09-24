from django.urls import path,include
from . import views

urlpatterns = [
    path('index/',views.index,name="index"),
    path('',views.login,name="login"),
    path('index/<str:room_name>/',views.room,name="room"),
    path('signup/',views.signup,name="signup"),
    path('del_msg/<int:id>/',views.delete_message,name="delete_message"),
    path('edit_msg/<int:id>/<str:replace>/',views.edit_message,name="edit_message"),
    path('clear_chat/<str:roomname>/',views.clear_chat,name="clear_chat"),
    
    
]