import os
import logging
from celery import Celery
from celery.signals import task_failure, task_success

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("celery_worker")

# Broker and backend URLs
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

celery_app = Celery(
    "brand_monitor",
    broker=REDIS_URL,
    backend=REDIS_URL,
    include=["app.tasks.social_fetch"]
)

# Advanced Celery Configuration
celery_app.conf.update(
    task_serializer='json',
    result_serializer='json',
    accept_content=['json'],
    timezone='UTC',
    enable_utc=True,
    
    # Queue Management & Reliability
    task_acks_late=True,  # Task is acknowledged after execution, not before
    worker_prefetch_multiplier=1,  # Prevent a single worker from hoarding tasks
    task_reject_on_worker_lost=True,  # Requeue if worker crashes mid-task
    
    # Task time limits (prevent hung requests)
    task_soft_time_limit=180,  # 3 minutes soft limit
    task_time_limit=240,       # 4 minutes hard limit
    
    # Result expiration
    result_expires=86400,  # 24 hours result expiry
)

# Monitoring Signals
@task_success.connect
def on_task_success(sender=None, headers=None, body=None, **kwargs):
    logger.info(f"Task {sender.name} executed successfully!")

@task_failure.connect
def on_task_failure(sender=None, task_id=None, exception=None, traceback=None, **kwargs):
    logger.error(
        f"Task {sender.name} failed! ID: {task_id}. "
        f"Exception: {exception}. Traceback: {traceback}"
    )

if __name__ == "__main__":
    celery_app.start()
