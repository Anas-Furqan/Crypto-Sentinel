#ifndef USER_H
#define USER_H

#include <string>
#include <nlohmann/json.hpp>

using json = nlohmann::json;

class User {
private:
    std::string userId;
    std::string username;
    std::string email;
    std::string passwordHash;
    std::string riskPreference; // Conservative, Moderate, Aggressive
    
public:
    User();
    User(const std::string& username, const std::string& email);
    
    // Getters
    std::string getUserId() const;
    std::string getUsername() const;
    std::string getEmail() const;
    std::string getRiskPreference() const;
    
    // Setters
    void setRiskPreference(const std::string& preference);
    void setPassword(const std::string& password);
    
    // Validation
    bool validatePassword(const std::string& password) const;
    
    // Serialization
    json toJson() const;
    static User fromJson(const json& j);
};

#endif // USER_H
