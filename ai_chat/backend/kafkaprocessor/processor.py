import asyncio
import requests
import json
from asgiref.sync import sync_to_async
from kafka import KafkaConsumer 
from channels.layers import get_channel_layer
from mlservices.ai_models.utils import live_prediction
from messagesmanager.models import updateTag

def start_kafka_processor():
    consumer = KafkaConsumer(
        'messages',
        bootstrap_servers='localhost:9092',
        auto_offset_reset='earliest',
        enable_auto_commit=True,
        value_deserializer=lambda x: x.decode('utf-8'),
    )

    for message in consumer:
        print(message.value)
        message_review = live_prediction(message.value)
        print(f"the result of prediction used with kafka {message_review}")
        data = json.loads(message.value)['message']
        print("json deserialized message from kafka")
        print(data)
        
        # send api request to message manager to update messagses
        #updated_message = {}
        print(f"message uuid {data['message_uuid']}")
        updated_message = updateTag(data['message_uuid'],message_review)
        asyncio.run(send_to_socket(updated_message))


async def send_to_socket(message):
    channel_layer = get_channel_layer() 
    await channel_layer.group_send('kafka_websocket_group',{
        'type':'live_data',
        'message': message
    })