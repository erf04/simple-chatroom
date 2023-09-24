from django.db import models
from django.contrib.auth import get_user_model

user=get_user_model()


class Chat(models.Model):
    roomname=models.CharField(max_length=50,blank=True)
    members=models.ManyToManyField(user,blank=True)

    def __str__(self):
        return self.roomname

class Message(models.Model):
    author=models.ForeignKey(user,on_delete=models.CASCADE)
    content=models.TextField()
    timestamp=models.DateTimeField()
    related_chat=models.ForeignKey(Chat,on_delete=models.CASCADE,blank=True,null=True)
    replied_to=models.ForeignKey('self', on_delete=models.CASCADE , blank=True,null=True)

    def __str__(self):
        return self.author.username
    
    def message_order(self ,roomname):
        return Message.objects.filter(related_chat__roomname=roomname).order_by("-timestamp")