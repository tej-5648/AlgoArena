import asyncio
import websockets
import json
import time

async def handle(websocket):
    print(f"[+] Vivek's bot connected from: {websocket.remote_address}")
    async for message in websocket:
        try:
            data = json.loads(message)
            # Simulate processing
            await asyncio.sleep(0.0001)
            # Send back confirmation
            response = {
                "status": "FILLED",
                "order_id": data.get("order_id", "unknown"),
                "timestamp": int(time.time() * 1000)
            }
            await websocket.send(json.dumps(response))
            print(f"[+] Order filled: {data.get('order_id')}")
        except Exception as e:
            print(f"[!] Error: {e}")

async def main():
    print("[*] WebSocket Arena running on ws://0.0.0.0:8080")
    print("[*] Waiting for Vivek's bots...")
    async with websockets.serve(handle, "0.0.0.0", 8080):
        await asyncio.Future()

asyncio.run(main())