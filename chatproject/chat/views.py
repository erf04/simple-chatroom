from django.shortcuts import render,redirect
from django.utils.safestring import mark_safe
import json
from django.contrib.auth import login as login_user,logout as logout_user,authenticate
from django.http import HttpRequest
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from .models import Chat,Message
from .forms import SignupForm
from django.contrib.auth.forms import UserCreationForm
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
    member_count=chat_model[0].members.count()
    print(member_count)
    print("username" +':' +str(username))
    return render(request,"chat/room.html",{
        "room_name":room_name,
        "username":mark_safe(json.dumps(username.username)),
        "messages":messages,
        "member_count":member_count,
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
        form=UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request,"you signed up successfully")
            messages.success(request,"use your username and password to login now")
            return redirect('login')
        else:
            messages.error(request,"there is something wrong!")
        
    form=UserCreationForm()
    return render(request,"signup.html",{
        "form":form,
    })


@login_required(login_url="login")
def delete_message(request :HttpRequest,id):
    message=Message.objects.get(pk=id)
    message.delete()
    chat=message.related_chat
    return redirect("room",chat)


def edit_message(request:HttpRequest,id,replace):
    messagemodel=Message.objects.get(pk=id)
    messagemodel.content=replace
    messagemodel.save()
    chat=messagemodel.related_chat
    return redirect("room",chat)


def clear_chat(request,roomname):
    related_chat=Chat.objects.get(roomname=roomname)
    messages=Message.objects.filter(related_chat=related_chat)
    for message in messages:
        message.delete()
    return redirect('room',roomname)

