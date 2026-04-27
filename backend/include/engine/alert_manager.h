#ifndef ALERT_MANAGER_H
#define ALERT_MANAGER_H

#include <string>
#include <vector>
#include <ctime>
#include <nlohmann/json.hpp>

using json = nlohmann::json;

enum class AlertType {
    PRICE_CRASH,
    PRICE_TARGET_REACHED,
    HIGH_RISK_WARNING,
    SENTIMENT_WARNING,
    PORTFOLIO_REBALANCE_SUGGESTION
};

enum class AlertSeverity {
    LOW,
    MEDIUM,
    HIGH,
    CRITICAL
};

struct Alert {
    std::string alertId;
    std::string userId;
    AlertType type;
    AlertSeverity severity;
    std::string title;
    std::string message;
    std::string assetSymbol;  // Optional: specific to an asset
    time_t timestamp;
    bool isRead;
    
    json toJson() const;
};

class AlertManager {
private:
    std::vector<Alert> activeAlerts;
    
public:
    AlertManager();
    
    // Create price crash alert
    Alert createPriceCrashAlert(const std::string& userId,
                              const std::string& symbol,
                              double currentPrice,
                              double previousPrice,
                              double crashPercentage);
    
    // Create price target alert
    Alert createPriceTargetAlert(const std::string& userId,
                               const std::string& symbol,
                               double targetPrice,
                               double currentPrice);
    
    // Create risk warning alert
    Alert createRiskWarningAlert(const std::string& userId,
                               const std::string& riskLevel,
                               const std::string& reason);
    
    // Create sentiment alert
    Alert createSentimentAlert(const std::string& userId,
                             int fearGreedIndex,
                             const std::string& sentiment);
    
    // Get all active alerts for a user
    std::vector<Alert> getUserAlerts(const std::string& userId) const;
    
    // Mark alert as read
    void markAlertAsRead(const std::string& alertId);
    
    // Clear old alerts (older than specified days)
    void clearOldAlerts(int daysOld = 30);
    
    // Get unread alert count
    int getUnreadCount(const std::string& userId) const;
};

#endif // ALERT_MANAGER_H
