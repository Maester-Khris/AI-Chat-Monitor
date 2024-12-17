"""
ASGI config for backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os
import threading
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator, OriginValidator
from django.urls import path
from django.core.asgi import get_asgi_application

from kafkaprocessor.processor import start_kafka_processor
from socketprocessor.processor import WebSocketConsumer

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django_asgi_app = get_asgi_application()

# run a async webserver for the websocket communication
application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            URLRouter([
                path("ws/chat-room/", WebSocketConsumer.as_asgi())
            ])
        )
    )
})

# run a separate thread along the previous web server for kafka consumer and processor
threading.Thread(target=start_kafka_processor, daemon=True).start()
