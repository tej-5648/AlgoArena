import json
import psycopg2
from confluent_kafka import Consumer

db = psycopg2.connect(
    "postgresql://postgres:IHrMJueUuTnAsIrXVBkYmdequKOAvQoU@kodama.proxy.rlwy.net:20736/railway"
)
db.autocommit = True
cursor = db.cursor()
print("[+] Connected to TimescaleDB!")

consumer = Consumer({
    'bootstrap.servers': 'localhost:9092',
    'group.id': 'platform_consumer_v4',
    'auto.offset.reset': 'earliest'
})

consumer.subscribe(['telemetry_stream'])
print("[*] Consumer started!")
print("[*] Press Ctrl+C to stop\n")

try:
    while True:
        msg = consumer.poll(1.0)
        if msg is None:
            continue
        if msg.error():
            print(f"[!] Error: {msg.error()}")
            continue
        data = json.loads(msg.value().decode('utf-8'))
        cursor.execute(
            "INSERT INTO latency_metrics (time, bot_id, order_id, latency_us) VALUES (%s, %s, %s, %s)",
            (data['timestamp'], data['bot_id'], data['order_id'], data['latency_us'])
        )
        print(f"[+] Saved: {data['bot_id']} | {data['order_id']} | {data['latency_us']} us")
except KeyboardInterrupt:
    print("\n[*] Stopping...")
finally:
    consumer.close()
    cursor.close()
    db.close()
    print("[+] Done!")