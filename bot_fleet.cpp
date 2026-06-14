#ifndef ASIO_STANDALONE
#define ASIO_STANDALONE
#endif

// The definitive "Kill Boost" switches
#define _WEBSOCKETPP_CPP11_STRICT_
#define _WEBSOCKETPP_CPP11_THREAD_
#define _WEBSOCKETPP_CPP11_FUNCTIONAL_
#define _WEBSOCKETPP_CPP11_SYSTEM_ERROR_
#define _WEBSOCKETPP_CPP11_RANDOM_
#define _WEBSOCKETPP_CPP11_MEMORY_
#define _WIN32_WINNT 0x0A00

#include <websocketpp/config/asio_no_tls_client.hpp>
#include <websocketpp/client.hpp>
#include <rdkafkacpp.h> // The Data Cannon
#include <iostream>
#include <chrono>
#include <string>
#include <thread>
#include <vector>
#include <random> // <-- NEW: For dynamic payloads

typedef websocketpp::client<websocketpp::config::asio_client> ws_client;

class BotNode {
public:
    BotNode(int id, RdKafka::Producer* producer) 
        : bot_id(id), 
          kafka_producer(producer),
          rng(std::random_device{}() ^ id), // Seed the randomizer uniquely per bot
          side_dist(0, 1),
          qty_dist(10, 1000)
    {
        m_endpoint.clear_access_channels(websocketpp::log::alevel::all);
        m_endpoint.clear_error_channels(websocketpp::log::elevel::all);
        m_endpoint.init_asio();
        m_endpoint.set_open_handler(std::bind(&BotNode::on_open, this, std::placeholders::_1));
        m_endpoint.set_message_handler(std::bind(&BotNode::on_message, this, std::placeholders::_1, std::placeholders::_2));
    }

    void run(const std::string& uri) {
        websocketpp::lib::error_code ec;
        ws_client::connection_ptr con = m_endpoint.get_connection(uri, ec);
        if (ec) {
            std::cout << "[BOT " << bot_id << "] Connect error: " << ec.message() << std::endl;
            return;
        }
        m_endpoint.connect(con);
        m_endpoint.run(); 
    }

private:
    void on_open(websocketpp::connection_hdl hdl) {
        std::cout << "[BOT " << bot_id << "] Engaged." << std::endl;
        send_order(hdl);
    }

    void on_message(websocketpp::connection_hdl hdl, ws_client::message_ptr msg) {
        auto end_time = std::chrono::high_resolution_clock::now();
        auto duration = std::chrono::duration_cast<std::chrono::microseconds>(end_time - m_start_time).count();
        
        std::string telemetry = "{\"bot_id\": " + std::to_string(bot_id) + ", \"latency_us\": " + std::to_string(duration) + "}";
        
        if (kafka_producer) {
            RdKafka::ErrorCode err = kafka_producer->produce(
                "telemetry_stream",             
                RdKafka::Topic::PARTITION_UA,   
                RdKafka::Producer::RK_MSG_COPY, 
                const_cast<char*>(telemetry.c_str()), telemetry.size(),
                NULL, 0, 0, NULL, NULL
            );

            if (err != RdKafka::ERR_NO_ERROR) {
                std::cerr << "[BOT " << bot_id << "] Failed to fire into Kafka: " << RdKafka::err2str(err) << std::endl;
            }
        }
        
        std::this_thread::sleep_for(std::chrono::milliseconds(500)); 
        send_order(hdl);
    }

    void send_order(websocketpp::connection_hdl hdl) {
        // --- NEW: Dynamic Payload Generation ---
        std::string side = (side_dist(rng) == 0) ? "BUY" : "SELL";
        int qty = qty_dist(rng);
        
        std::string payload = "{\"bot_id\": " + std::to_string(bot_id) + 
                              ", \"side\": \"" + side + 
                              "\", \"qty\": " + std::to_string(qty) + "}";
        
        // Print to terminal so we can see the chaos working
        std::cout << "[BOT " << bot_id << "] Attacking with: " << payload << std::endl;
        
        m_start_time = std::chrono::high_resolution_clock::now(); 
        
        websocketpp::lib::error_code ec;
        m_endpoint.send(hdl, payload, websocketpp::frame::opcode::text, ec);
    }

    ws_client m_endpoint;
    std::chrono::time_point<std::chrono::high_resolution_clock> m_start_time;
    int bot_id;
    RdKafka::Producer* kafka_producer;
    
    // Random Number Generators
    std::mt19937 rng;
    std::uniform_int_distribution<int> side_dist;
    std::uniform_int_distribution<int> qty_dist;
};

void launch_bot(int id, std::string uri, RdKafka::Producer* producer) {
    BotNode bot(id, producer);
    bot.run(uri);
}

int main() {
    std::string errstr;
    RdKafka::Conf *conf = RdKafka::Conf::create(RdKafka::Conf::CONF_GLOBAL);
    conf->set("bootstrap.servers", "127.0.0.1:9092", errstr);
    
    RdKafka::Producer *producer = RdKafka::Producer::create(conf, errstr);
    if (!producer) {
        std::cerr << "Failed to start Kafka Cannon: " << errstr << std::endl;
        return 1;
    }
    std::cout << "Kafka Cannon armed and ready." << std::endl;

    const int NUM_BOTS = 10;
    const std::string target_uri = "ws://127.0.0.1:8080";
    std::vector<std::thread> thread_pool;

    for (int i = 0; i < NUM_BOTS; ++i) {
        thread_pool.push_back(std::thread(launch_bot, i, target_uri, producer));
        std::this_thread::sleep_for(std::chrono::milliseconds(50));
    }

    for (auto& t : thread_pool) {
        if (t.joinable()) {
            t.join();
        }
    }

    delete producer;
    delete conf;
    return 0;
}