import json
import requests
from asgiref.sync import sync_to_async
from channels.consumer import AsyncConsumer
from channels.generic.websocket import AsyncWebsocketConsumer
from messagesmanager.serializers import MessageSerializer
from messagesmanager.models import createFromObject

class WebSocketConsumer(AsyncWebsocketConsumer):
    # join the group
    # self.channel_name is auto assigned by django
    async def connect(self):
        self.group_name = 'kafka_websocket_group'
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()


    async def disconnect(self, close_code):
        await self.channel_layer.groupd_discard(self.group_name, self.channel_name)

    
    # method used to receive data coming from chat rooms / insert in db and send an okay msg
    # send api request to save message
    async def receive(self, text_data=None, bytes_data=None):
       print("the new data been received")
       data = json.loads(text_data)['message']
       print(data)
       #message_saved = createFromObject(data)
       message_saved = await sync_to_async(createFromObject)(data)
       print('passed the saving step')
       #message_saved = {}
       serializer = MessageSerializer(message_saved)
       await self.send(text_data=json.dumps({'message':serializer.data, 'type':'message-dispatch'}))
        
        
    # method used to receive data coming from kafka consumer
    async def live_data(self, event):
        print("processed message received from kafka consumer")
        message = json.loads(event['message'])
        print("message received from kafka processor")
        print(message)
        serializer = MessageSerializer(message)
        await self.send(text_data=json.dumps({'message': serializer.data, 'type':'message-update'}))