#ifndef PORTFOLIO_H
#define PORTFOLIO_H

#include <string>
#include <map>
#include <vector>
#include <nlohmann/json.hpp>
#include "crypto_asset.h"
#include "transaction.h"

using json = nlohmann::json;

class Portfolio {
private:
    std::string portfolioId;
    std::string userId;
    std::map<std::string, double> holdings;           // symbol -> quantity
    std::vector<Transaction> transactionHistory;
    double totalInvested;
    double currentPortfolioValue;
    
public:
    Portfolio();
    Portfolio(const std::string& userId);
    
    // Getters
    std::string getPortfolioId() const;
    std::string getUserId() const;
    double getHoldingQuantity(const std::string& symbol) const;
    const std::map<std::string, double>& getHoldings() const;
    double getTotalInvested() const;
    double getCurrentPortfolioValue() const;
    const std::vector<Transaction>& getTransactionHistory() const;
    
    // Buy crypto
    bool buyCrypto(const std::string& symbol, double quantity, double pricePerUnit);
    
    // Sell crypto
    bool sellCrypto(const std::string& symbol, double quantity, double pricePerUnit);
    
    // Update portfolio valuation
    void updatePortfolioValue(const std::map<std::string, double>& currentPrices);
    
    // Calculate profit/loss
    double calculateProfitLoss() const;
    double calculateProfitLossPercentage() const;
    
    // Get asset allocation (percentage of each holding)
    json getAssetAllocation() const;
    
    // Get concentration in top assets
    double getConcentration(int topN = 3) const;
    
    // Serialization
    json toJson() const;
    static Portfolio fromJson(const json& j);
};

#endif // PORTFOLIO_H
