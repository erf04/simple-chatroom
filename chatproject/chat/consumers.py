import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from .serializer import MessageSerializer
from rest_framework.renderers import JSONRenderer
from .models import Message,Chat
from django.contrib.auth import get_user_model
from datetime import datetime,date
import calendar

user=get_user_model()

class ChatConsumer(WebsocketConsumer):

    def new_message(self,text_data):
        print(f"text_data : {text_data}")
        message=text_data["message"]
        username=text_data["username"]
        roomname=text_data["roomname"]
        chat_model=Chat.objects.get(roomname=roomname)
        usermodel=user.objects.filter(username=username).first()
        now = datetime.now()
        print(f"usermodel:{usermodel}")
        
        my_date = date.today()
        day=calendar.day_name[my_date.weekday()]
        
        status=text_data["reply"]["status"]
        
        if not status:
            messagemodel=Message.objects.create(author=usermodel ,content=message,related_chat=chat_model,timestamp=now)
            #print(f"true : {messagemodel}")
        else:
            from_id=text_data["reply"]["from_id"]
            
            replied_model=Message.objects.get(pk=from_id)
            
            messagemodel=Message.objects.create(author=usermodel ,content=message,related_chat=chat_model,timestamp=now,replied_to=replied_model)
        print(f"author: {messagemodel.author}")
        result=self.message_serializer(messagemodel)
        print("result : "+str(result))
        answer=eval(result)
        #answer["author"]=messagemodel.author
        answer["id"]=messagemodel.pk
        answer["timestamp"]+=f" {day}"
        if status:
            answer["Isreply"]=True
            answer["replied_content"]=replied_model.content
            answer["replied_id"]=replied_model.pk
        else:
            answer["Isreply"]=False
        #answer["reply"]["replied_content"]=replied_model.content
        print(f"answer : {answer}")
        
        self.send_to_chat_message(answer)
        

    def fetch_message(self,text_data):
        print(f'textData : {text_data} ')
        roomname=text_data["roomname"]
        
        instances=Message.message_order(self,roomname)
        replies=instances.filter(replied_to__isnull=False)
        repliesstatus=[]
        for instance in instances:
            if instance in replies:
                repliesstatus+=[[True,instance]]
            else:
                repliesstatus+=[[False,None]]
        #print(repliesstatus)
        

        json_message=self.message_serializer(instances)
        data_dict=eval(json_message) #to get rid of bitestring
        
        ids = instances.values_list('id', flat=True)
       
        for i in range(len(data_dict)):
            data_dict[i]["id"]=ids[i]
            if repliesstatus[i][0]:
                data_dict[i]["Isreply"]=repliesstatus[i][0]
                data_dict[i]["replied_content"]=repliesstatus[i][1].replied_to.content
                data_dict[i]["replied_id"]=repliesstatus[i][1].replied_to.pk
            else:
                data_dict[i]["Isreply"]=repliesstatus[i][0]
            

        #print(data_dict)
        answer={
            "message":data_dict, 
            "command":"fetch_message"
        }
        self.chat_message(answer)


    def message_serializer(self,instance):
        #lambda instance:True if instance.__class__.__name__=="QuesySet" else False
        if instance.__class__.__name__=="QuerySet":
            bool=True
        else:
            bool=False
        
        serialized=MessageSerializer(instance=instance,many=bool) #because of many instance(from message_order)
        #print(serialized.data)
        content=JSONRenderer().render(serialized.data) #render to json
        return content #bitestring 


    def connect(self):
        self.room_name=self.scope["url_route"]["kwargs"]["room_name"]
        print(f"scope : {self.scope['user']}")
        self.room_group_name=f'chat_{self.room_name}'

        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name,
        )
        self.accept()

    commands={
        "new_message":new_message,
        "fetch_message":fetch_message
    }
    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name,
        )

    def receive(self, text_data):
        text_data_dict = json.loads(text_data) #json to dict
        #message = text_data_dict.get("message",None)
        #username=text_data_dict.get("username",None)
        #print(username)
        print(f"text_data_dict: {text_data_dict}")
        command=text_data_dict["command"]
        self.commands[command](self,text_data_dict)


    def send_to_chat_message(self,text_data):
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type':'chat.message',
                'message':text_data,
                "command":"new_message"

            }
        )

        #self.send(text_data=json.dumps({"message": message}))


    def chat_message(self,event):
        self.send(text_data=json.dumps(event)) #to json