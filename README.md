# AlgoArena

AlgoArena is a high-performance benchmarking platform designed for algorithmic trading competitions. It simulates a fleet of trading bots that challenge a contestant's WebSocket-based trading application, measures round-trip latency with microsecond precision, and streams this performance data into a robust time-series database for analysis.

## Architecture

The system is composed of several key components that work in concert:

*   **Bot Fleet (`bot_fleet.cpp`):** A multi-threaded C++ application that acts as the load generator. Each bot connects to the contestant's server, sends dynamic trade orders (BUY/SELL), and upon receiving a response, calculates the round-trip latency.
*   **Contestant Sandbox (`deployer.py`):** A Python utility that uses Docker to run a contestant's code in a secure, resource-limited container, exposing it on a local port.
*   **Data Pipeline (Redpanda & TimescaleDB):** A high-throughput data pipeline built for speed.
    *   **Redpanda (Kafka):** The Bot Fleet publishes its latency telemetry to a Redpanda (Kafka-compatible) topic called `telemetry_stream`.
    *   **TimescaleDB:** A PostgreSQL database optimized for time-series data, used to store the benchmark results for analysis.
*   **Telemetry Ingestion (`kafka_consumer.py`):** A Python consumer that reads latency metrics from the Redpanda topic and inserts them into the TimescaleDB database.

### System Flow
```
                  +--------------------------+         +------------------------------+
                  |  Contestant Application  |         |      AlgoArena Bot Fleet     |
                  |  (e.g., dummy_target.py) |         |        (bot_fleet.cpp)       |
                  +-------------^------------+         +-----.------------------.-----+
                                |                          |                      |
            (2) Sends "FILLED"  |                          | (1) Sends JSON Order |
                  Response      |                          | (BUY/SELL)           |
                                |                          v                      |
                  +-------------+--------------------------+----------------------+
                  |                        WebSocket (ws://127.0.0.1:8080)        |
                  +---------------------------------------------------------------+
                                                                                  |
(3) Calculates latency & publishes to Kafka                                     |
                                                                                  |
+---------------------+      +----------------+      +--------------------------+ v +-----------------+
|   TimescaleDB       |<-----| Kafka Consumer |<-----|   Redpanda (Kafka)       |   | Bot Telemetry   |
| (stores metrics)    |      | (consumer.py)  |      |   (telemetry_stream)     |   | (latency_us)    |
+---------------------+      +----------------+      +--------------------------+   +-----------------+
```

## Getting Started

### Prerequisites

*   Docker & Docker Compose
*   A C++20 compatible compiler and CMake (v3.14+)
*   Python 3.x
*   Python libraries: `confluent-kafka`, `psycopg2-binary`, `websockets`, `docker`
    ```bash
    pip install confluent-kafka psycopg2-binary websockets docker
    ```

### 1. Launch Backend Infrastructure

Start the Redpanda message broker and TimescaleDB database using Docker Compose.

```bash
docker-compose up -d
```
This will run the services in the background.

### 2. Start the Telemetry Consumer

In a separate terminal, run the Kafka consumer. This script listens for telemetry data from the bot fleet and saves it to the database.

```bash
python kafka_consumer.py
```
You should see confirmation that it has connected to TimescaleDB and is subscribed to the topic.

### 3. Run a Target Application

You need a WebSocket server for the bots to connect to. A simple example is provided. In another terminal, run the dummy target:

```bash
python dummy_target.py
```
This will start a server listening on `ws://127.0.0.1:8080`, which is the default target for the bot fleet.

### 4. Build and Run the Bot Fleet

Finally, compile and run the C++ client that generates the load.

```bash
# Create a build directory
mkdir -p build && cd build

# Configure the project with CMake
cmake ..

# Build the executable
cmake --build .

# Run the bot fleet
./bot_fleet
```

Your terminal will fill with logs from the 10 bots as they connect, send orders, and receive confirmations. The `kafka_consumer.py` terminal will simultaneously show the latency data being saved to TimescaleDB.

## Component Breakdown

*   **`CMakeLists.txt`**: The build configuration for the `bot_fleet` executable. It uses `FetchContent` to download and link dependencies like Asio, WebSocket++, and librdkafka, ensuring the project is self-contained.
*   **`bot_fleet.cpp`**: The core load generation engine. It spawns a pool of bot threads, each managing a WebSocket connection. Bots send dynamically generated order payloads and measure the round-trip time, reporting the results to a Kafka topic.
*   **`deployer.py`**: A script for running contestant code. It leverages the Docker SDK to create a sandboxed container with CPU and memory limits, mounts the solution code as a read-only volume, and exposes the necessary port.
*   **`docker-compose.yml`**: Defines the backend services. It sets up `redpanda` as a lightweight Kafka-compatible broker and `timescaledb` for efficient storage of performance metrics.
*   **`dummy_target.py`**: A minimal Python WebSocket server using `asyncio` and `websockets`. It serves as a simple, functional target for testing the bot fleet. It receives a JSON message and immediately sends a "FILLED" response.
*   **`kafka_consumer.py`**: A Python script that connects to the Redpanda service, subscribes to the `telemetry_stream` topic, and inserts the received JSON data into the `latency_metrics` table in TimescaleDB.
*   **`kafka_producer.py`**: A utility script for testing the data pipeline. It generates and sends sample latency messages to the Redpanda topic, which can be useful for verifying that the consumer and database are working correctly without running the full C++ fleet.
