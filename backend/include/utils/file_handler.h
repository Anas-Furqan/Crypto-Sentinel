#ifndef FILE_HANDLER_H
#define FILE_HANDLER_H

#include <string>
#include <vector>
#include <nlohmann/json.hpp>

using json = nlohmann::json;

class FileHandler {
private:
    static const std::string DATA_DIR;
    
public:
    FileHandler();
    
    // User file operations
    static json loadUser(const std::string& userId);
    static bool saveUser(const std::string& userId, const json& userData);
    static bool userExists(const std::string& userId);
    static std::vector<std::string> getAllUsers();
    
    // Portfolio file operations
    static json loadPortfolio(const std::string& portfolioId);
    static bool savePortfolio(const std::string& portfolioId, const json& portfolioData);
    static bool portfolioExists(const std::string& portfolioId);
    
    // Transaction history operations
    static json loadTransactionHistory(const std::string& portfolioId);
    static bool appendTransaction(const std::string& portfolioId, const json& transaction);
    
    // Configuration operations
    static json loadConfig();
    static bool saveConfig(const json& config);
    
    // Utility functions
    static bool createDirectoryIfNotExists(const std::string& path);
    static bool deleteFile(const std::string& filePath);
    static std::string generateId();
};

#endif // FILE_HANDLER_H
