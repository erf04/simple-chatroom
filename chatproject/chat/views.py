from django.shortcuts import render,redirect
from django.utils.safestring import mark_safe
import json
from django.contrib.auth import login as login_user,logout as logout_user,authenticate
from django.http import HttpRequest
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from .models import Chat,Message
from .forms import SignupForm
# Create your views here.

@login_required(login_url='login')
def index(request :HttpRequest):
    user=request.user
    print(user)
    chatrooms=Chat.objects.filter(members=user)
    print(chatrooms)
    return render(request,"chat/arrive.html",{
        "chatrooms":chatrooms,
    })


@login_required(login_url='login')
def room(request,room_name):
    username=request.user
    chat_model=Chat.objects.filter(roomname=room_name)

    if not chat_model.exists():
        chat=Chat.objects.create(roomname=room_name)
        chat.members.add(username)
    else:
        chat_model[0].members.add(username)
    messages=Message.objects.filter(related_chat=chat_model[0])
    print("username" +':' +str(username))
    return render(request,"chat/room.html",{
        "room_name":room_name,
        "username":mark_safe(json.dumps(username.username)),
        "messages":messages
    })

def login(request :HttpRequest):
    if request.method=="POST":
        username=request.POST["username"]
        password=request.POST["password"]
        user=authenticate(request,username=username,password=password)
        print(user)
        if user is not None:
            login_user(request,user)
            messages.success(request,"you logged in successfully")
            return redirect('index')
        
        else:
            messages.error(request,"wrong username or password!!")
            return redirect("login")

    
    return render(request,"login.html",{})

def logout(request):
    logout_user(request)
    return redirect('login')


def signup(request :HttpRequest):
    if request.method=="POST":
        form=SignupForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request,"you signed up successfully")
            return redirect('index')
        else:
            messages.error(request,"there is something wrong!")
        
    form=SignupForm()
    return render(request,"signup.html",{
        "form":form,
    })


@login_required(login_url="login")
def delete_message(request :HttpRequest,id):
    message=Message.objects.get(pk=id)
    message.delete()
    chat=message.related_chat
    return redirect("room",chat)

