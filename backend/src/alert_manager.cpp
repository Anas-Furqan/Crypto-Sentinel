#include "engine/alert_manager.h"
#include <ctime>
#include <algorithm>

json Alert::toJson() const {
    json j;
    j["alertId"] = alertId;
    j["userId"] = userId;
    j["type"] = (int)type;
    j["severity"] = (int)severity;
    j["title"] = title;
    j["message"] = message;
    j["assetSymbol"] = assetSymbol;
    j["timestamp"] = (long long)timestamp;
    j["isRead"] = isRead;
    return j;
}

AlertManager::AlertManager() {}

Alert AlertManager::createPriceCrashAlert(const std::string& userId,
                                        const std::string& symbol,
                                        double currentPrice,
                                        double previousPrice,
                                        double crashPercentage) {
    Alert alert;
    alert.alertId = "alert_" + std::to_string(std::time(nullptr));
    alert.userId = userId;
    alert.type = AlertType::PRICE_CRASH;
    alert.severity = (crashPercentage > 20) ? AlertSeverity::HIGH : AlertSeverity::MEDIUM;
    alert.title = symbol + " Price Crash";
    alert.message = symbol + " dropped " + std::to_string(crashPercentage) + "%";
    alert.assetSymbol = symbol;
    alert.timestamp = std::time(nullptr);
    alert.isRead = false;
    
    activeAlerts.push_back(alert);
    return alert;
}

Alert AlertManager::createPriceTargetAlert(const std::string& userId,
                                         const std::string& symbol,
                                         double targetPrice,
                                         double currentPrice) {
    Alert alert;
    alert.alertId = "alert_" + std::to_string(std::time(nullptr));
    alert.userId = userId;
    alert.type = AlertType::PRICE_TARGET_REACHED;
    alert.severity = AlertSeverity::MEDIUM;
    alert.title = symbol + " Target Reached";
    alert.message = symbol + " reached target price of $" + std::to_string(targetPrice);
    alert.assetSymbol = symbol;
    alert.timestamp = std::time(nullptr);
    alert.isRead = false;
    
    activeAlerts.push_back(alert);
    return alert;
}

Alert AlertManager::createRiskWarningAlert(const std::string& userId,
                                         const std::string& riskLevel,
                                         const std::string& reason) {
    Alert alert;
    alert.alertId = "alert_" + std::to_string(std::time(nullptr));
    alert.userId = userId;
    alert.type = AlertType::HIGH_RISK_WARNING;
    alert.severity = AlertSeverity::HIGH;
    alert.title = "High Risk Warning";
    alert.message = "Your portfolio risk level is " + riskLevel + ": " + reason;
    alert.timestamp = std::time(nullptr);
    alert.isRead = false;
    
    activeAlerts.push_back(alert);
    return alert;
}

Alert AlertManager::createSentimentAlert(const std::string& userId,
                                       int fearGreedIndex,
                                       const std::string& sentiment) {
    Alert alert;
    alert.alertId = "alert_" + std::to_string(std::time(nullptr));
    alert.userId = userId;
    alert.type = AlertType::SENTIMENT_WARNING;
    alert.severity = AlertSeverity::MEDIUM;
    alert.title = "Market Sentiment Alert";
    alert.message = "Market sentiment is " + sentiment + " (Index: " + std::to_string(fearGreedIndex) + ")";
    alert.timestamp = std::time(nullptr);
    alert.isRead = false;
    
    activeAlerts.push_back(alert);
    return alert;
}

std::vector<Alert> AlertManager::getUserAlerts(const std::string& userId) const {
    std::vector<Alert> userAlerts;
    for (const auto& alert : activeAlerts) {
        if (alert.userId == userId) {
            userAlerts.push_back(alert);
        }
    }
    return userAlerts;
}

void AlertManager::markAlertAsRead(const std::string& alertId) {
    for (auto& alert : activeAlerts) {
        if (alert.alertId == alertId) {
            alert.isRead = true;
            return;
        }
    }
}

void AlertManager::clearOldAlerts(int daysOld) {
    time_t cutoffTime = std::time(nullptr) - (daysOld * 86400);
    activeAlerts.erase(
        std::remove_if(activeAlerts.begin(), activeAlerts.end(),
                      [cutoffTime](const Alert& a) { return a.timestamp < cutoffTime; }),
        activeAlerts.end()
    );
}

int AlertManager::getUnreadCount(const std::string& userId) const {
    int count = 0;
    for (const auto& alert : activeAlerts) {
        if (alert.userId == userId && !alert.isRead) {
            count++;
        }
    }
    return count;
}
