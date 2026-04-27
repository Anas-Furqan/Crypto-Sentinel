cmake_minimum_required(VERSION 3.10)
project(CryptoSentinelBackend)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Include directories
include_directories(${CMAKE_CURRENT_SOURCE_DIR}/include)
include_directories(${CMAKE_CURRENT_SOURCE_DIR}/lib/crow/include)
include_directories(${CMAKE_CURRENT_SOURCE_DIR}/lib/nlohmann_json/include)
include_directories(${CMAKE_CURRENT_SOURCE_DIR}/lib/asio/include)

# Source files
set(SOURCES
    src/main.cpp
    src/user.cpp
    src/portfolio.cpp
    src/crypto_asset.cpp
    src/transaction.cpp
    src/api_manager.cpp
    src/risk_analyzer.cpp
    src/strategy_engine.cpp
    src/alert_manager.cpp
    src/sentiment_analyzer.cpp
    src/file_handler.cpp
)

# Create executable
add_executable(crypto_sentinel ${SOURCES})

# Link libraries (platform-specific)
if(WIN32)
    target_link_libraries(crypto_sentinel ws2_32 wsock32)
    target_compile_options(crypto_sentinel PRIVATE -D_WIN32_WINNT=0x0601)
elseif(UNIX)
    target_link_libraries(crypto_sentinel pthread)
endif()

# Output directory
set_target_properties(crypto_sentinel PROPERTIES
    RUNTIME_OUTPUT_DIRECTORY "${CMAKE_CURRENT_SOURCE_DIR}/build"
)
