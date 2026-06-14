import json
import time
import random
from confluent_kafka import Producer

# Connect to Redpanda (our post office)
producer = Producer({
    'bootstrap.servers': 'localhost:9092'
})

def delivery_report(err, msg):
    if err:
        print(f'[!] Message failed: {err}')
    else:
        print(f'[+] Message sent to Redpanda: {msg.value().decode()}')

def send_fake_latency():
    for i in range(10):  # Send 10 fake messages
        
        # Create fake speed data
        fake_data = {
            "bot_id": f"thread_00{i}",
            "order_id": f"HFT_{random.randint(100, 999)}",
            "latency_us": random.randint(100, 1000),
            "timestamp": int(time.time() * 1000)
        }
        
        # Send to Redpanda
        producer.produce(
            topic='telemetry_stream',
            value=json.dumps(fake_data),
            callback=delivery_report
        )
        
        producer.poll(0)
        time.sleep(0.5)  # Wait half a second between messages
    
    producer.flush()
    print("\n[✓] All 10 fake messages sent to Redpanda!")

# Run it
send_fake_latency()