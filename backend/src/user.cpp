#include "models/user.h"
#include <functional>
#include <cstring>
#include <sstream>
#include <iomanip>

User::User() : userId(""), username(""), email(""), riskPreference("Moderate") {}

User::User(const std::string& username, const std::string& email)
    : username(username), email(email), riskPreference("Moderate") {
    // Generate UUID for userId (simplified - will use actual UUID generation)
    userId = "user_" + std::to_string(std::hash<std::string>{}(username));
}

std::string User::getUserId() const { return userId; }
std::string User::getUsername() const { return username; }
std::string User::getEmail() const { return email; }
std::string User::getRiskPreference() const { return riskPreference; }

void User::setRiskPreference(const std::string& preference) {
    riskPreference = preference;
}

void User::setPassword(const std::string& password) {
    // TODO: Implement password hashing
    passwordHash = password;
}

bool User::validatePassword(const std::string& password) const {
    return password == passwordHash; // TODO: Implement proper validation
}

json User::toJson() const {
    json j;
    j["userId"] = userId;
    j["username"] = username;
    j["email"] = email;
    j["riskPreference"] = riskPreference;
    return j;
}

User User::fromJson(const json& j) {
    User user(j["username"], j["email"]);
    user.userId = j["userId"];
    user.riskPreference = j["riskPreference"];
    return user;
}
