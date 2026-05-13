import os
import socketio
import redis
from fastapi import APIRouter

# Redis URL – standard from env
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

# Setup Socket.IO Server with AsyncRedisManager for multi-process scalability (Celery task broadcasting)
use_redis = False
try:
    r = redis.Redis.from_url(REDIS_URL, socket_timeout=1)
    r.ping()
    use_redis = True
except Exception:
    print("Warning: Redis broker is offline. Socket.IO falling back to local memory manager.")

if use_redis:
    try:
        mgr = socketio.AsyncRedisManager(REDIS_URL)
        sio = socketio.AsyncServer(async_mode='asgi', client_manager=mgr, cors_allowed_origins="*")
    except Exception as e:
        print(f"Warning: Failed to init AsyncRedisManager, falling back to local memory manager: {e}")
        sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins="*")
else:
    sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins="*")

router = APIRouter()

# Expose the ASGI app for FastAPI mounting
socket_app = socketio.ASGIApp(sio, socketio_path="socket.io")

# Connection handlers
@sio.event
async def connect(sid, environ, auth=None):
    print(f"Socket connected: {sid}")
    await sio.emit('connection_status', {'status': 'connected', 'sid': sid}, to=sid)

@sio.event
async def disconnect(sid):
    print(f"Socket disconnected: {sid}")

# Room management & subscriptions
@sio.event
async def subscribe_brand(sid, data):
    """
    Client subscribes to a specific brand stream.
    Expected data payload: {"brand_id": 123}
    """
    brand_id = data.get("brand_id")
    if brand_id:
        room_name = f"brand_{brand_id}"
        await sio.enter_room(sid, room_name)
        print(f"Socket {sid} subscribed to room: {room_name}")
        await sio.emit('subscription_success', {'brand_id': brand_id, 'room': room_name}, to=sid)

@sio.event
async def unsubscribe_brand(sid, data):
    """
    Client unsubscribes from a brand stream.
    """
    brand_id = data.get("brand_id")
    if brand_id:
        room_name = f"brand_{brand_id}"
        await sio.leave_room(sid, room_name)
        print(f"Socket {sid} unsubscribed from room: {room_name}")
