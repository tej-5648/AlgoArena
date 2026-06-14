cmake_minimum_required(VERSION 3.14)
project(iicpc_bot_fleet)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

# Force the compiler to block Boost
add_compile_definitions(
    ASIO_STANDALONE 
    _WEBSOCKETPP_CPP11_STL_ 
    _WIN32_WINNT=0x0A00
)

include(FetchContent)

# Download ASIO
FetchContent_Declare(
    asio
    URL https://github.com/chriskohlhoff/asio/archive/refs/tags/asio-1-28-0.tar.gz
)
FetchContent_MakeAvailable(asio)

# Download WebSocket++
FetchContent_Declare(
    websocketpp
    URL https://github.com/zaphoyd/websocketpp/archive/refs/tags/0.8.2.tar.gz
)
FetchContent_MakeAvailable(websocketpp)

# --- NEW: The Kafka Data Cannon ---
# Strip out all enterprise security/compression so Windows can compile it easily
set(RDKAFKA_BUILD_STATIC ON CACHE BOOL "" FORCE)
set(RDKAFKA_BUILD_EXAMPLES OFF CACHE BOOL "" FORCE)
set(RDKAFKA_BUILD_TESTS OFF CACHE BOOL "" FORCE)
set(WITH_SSL OFF CACHE BOOL "" FORCE)
set(WITH_ZLIB OFF CACHE BOOL "" FORCE)
set(WITH_ZSTD OFF CACHE BOOL "" FORCE)
set(WITH_CURL OFF CACHE BOOL "" FORCE)
set(WITH_SASL OFF CACHE BOOL "" FORCE)

FetchContent_Declare(
    librdkafka
    URL https://github.com/confluentinc/librdkafka/archive/refs/tags/v2.3.0.tar.gz
)
FetchContent_MakeAvailable(librdkafka)
# ----------------------------------

add_executable(bot_fleet bot_fleet.cpp)

target_include_directories(bot_fleet PRIVATE
    ${asio_SOURCE_DIR}/asio/include
    ${websocketpp_SOURCE_DIR}
    ${librdkafka_SOURCE_DIR}/src-cpp
    ${librdkafka_SOURCE_DIR}/src
)

if(WIN32)
    # Link Windows networking (Ws2_32) and the Kafka C++ library (rdkafka++)
    target_link_libraries(bot_fleet PRIVATE Ws2_32 rdkafka++)
else()
    find_package(Threads REQUIRED)
    target_link_libraries(bot_fleet PRIVATE Threads::Threads rdkafka++)
endif()