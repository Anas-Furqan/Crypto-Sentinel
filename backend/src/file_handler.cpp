#include "utils/file_handler.h"
#include <fstream>
#include <filesystem>
#include <chrono>
#include <random>

const std::string FileHandler::DATA_DIR = "./data";

FileHandler::FileHandler() {}

json FileHandler::loadUser(const std::string& userId) {
    std::string filePath = DATA_DIR + "/users/" + userId + ".json";
    
    std::ifstream file(filePath);
    if (!file.is_open()) {
        return json::object();
    }
    
    json userData;
    try {
        file >> userData;
    } catch (...) {
        return json::object();
    }
    
    return userData;
}

bool FileHandler::saveUser(const std::string& userId, const json& userData) {
    createDirectoryIfNotExists(DATA_DIR + "/users");
    std::string filePath = DATA_DIR + "/users/" + userId + ".json";
    
    std::ofstream file(filePath);
    if (!file.is_open()) return false;
    
    try {
        file << userData.dump(2);
        return true;
    } catch (...) {
        return false;
    }
}

bool FileHandler::userExists(const std::string& userId) {
    std::string filePath = DATA_DIR + "/users/" + userId + ".json";
    return std::filesystem::exists(filePath);
}

std::vector<std::string> FileHandler::getAllUsers() {
    std::vector<std::string> users;
    std::string userDir = DATA_DIR + "/users";
    
    if (!std::filesystem::exists(userDir)) {
        return users;
    }
    
    for (const auto& entry : std::filesystem::directory_iterator(userDir)) {
        if (entry.is_regular_file() && entry.path().extension() == ".json") {
            users.push_back(entry.path().stem().string());
        }
    }
    
    return users;
}

json FileHandler::loadPortfolio(const std::string& portfolioId) {
    std::string filePath = DATA_DIR + "/portfolios/" + portfolioId + ".json";
    
    std::ifstream file(filePath);
    if (!file.is_open()) {
        return json::object();
    }
    
    json portfolioData;
    try {
        file >> portfolioData;
    } catch (...) {
        return json::object();
    }
    
    return portfolioData;
}

bool FileHandler::savePortfolio(const std::string& portfolioId, const json& portfolioData) {
    createDirectoryIfNotExists(DATA_DIR + "/portfolios");
    std::string filePath = DATA_DIR + "/portfolios/" + portfolioId + ".json";
    
    std::ofstream file(filePath);
    if (!file.is_open()) return false;
    
    try {
        file << portfolioData.dump(2);
        return true;
    } catch (...) {
        return false;
    }
}

bool FileHandler::portfolioExists(const std::string& portfolioId) {
    std::string filePath = DATA_DIR + "/portfolios/" + portfolioId + ".json";
    return std::filesystem::exists(filePath);
}

json FileHandler::loadTransactionHistory(const std::string& portfolioId) {
    std::string filePath = DATA_DIR + "/transactions/" + portfolioId + "_history.json";
    
    std::ifstream file(filePath);
    if (!file.is_open()) {
        return json::array();
    }
    
    json transactions;
    try {
        file >> transactions;
    } catch (...) {
        return json::array();
    }
    
    return transactions;
}

bool FileHandler::appendTransaction(const std::string& portfolioId, const json& transaction) {
    createDirectoryIfNotExists(DATA_DIR + "/transactions");
    std::string filePath = DATA_DIR + "/transactions/" + portfolioId + "_history.json";
    
    json transactions = loadTransactionHistory(portfolioId);
    if (!transactions.is_array()) {
        transactions = json::array();
    }
    
    transactions.push_back(transaction);
    
    std::ofstream file(filePath);
    if (!file.is_open()) return false;
    
    try {
        file << transactions.dump(2);
        return true;
    } catch (...) {
        return false;
    }
}

json FileHandler::loadConfig() {
    std::string filePath = DATA_DIR + "/config.json";
    
    std::ifstream file(filePath);
    if (!file.is_open()) {
        return json::object();
    }
    
    json config;
    try {
        file >> config;
    } catch (...) {
        return json::object();
    }
    
    return config;
}

bool FileHandler::saveConfig(const json& config) {
    createDirectoryIfNotExists(DATA_DIR);
    std::string filePath = DATA_DIR + "/config.json";
    
    std::ofstream file(filePath);
    if (!file.is_open()) return false;
    
    try {
        file << config.dump(2);
        return true;
    } catch (...) {
        return false;
    }
}

bool FileHandler::createDirectoryIfNotExists(const std::string& path) {
    try {
        std::filesystem::create_directories(path);
        return true;
    } catch (...) {
        return false;
    }
}

bool FileHandler::deleteFile(const std::string& filePath) {
    try {
        std::filesystem::remove(filePath);
        return true;
    } catch (...) {
        return false;
    }
}

std::string FileHandler::generateId() {
    auto now = std::chrono::system_clock::now();
    auto timestamp = std::chrono::duration_cast<std::chrono::milliseconds>(
        now.time_since_epoch()).count();
    
    static std::mt19937 gen(std::random_device{}());
    std::uniform_int_distribution<> dis(100000, 999999);
    
    return "id_" + std::to_string(timestamp) + "_" + std::to_string(dis(gen));
}
