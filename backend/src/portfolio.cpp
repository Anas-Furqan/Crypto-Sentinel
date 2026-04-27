#include "models/portfolio.h"
#include <algorithm>
#include <numeric>
#include <cmath>

Portfolio::Portfolio() : portfolioId(""), userId(""), totalInvested(0.0),
                        currentPortfolioValue(0.0) {}

Portfolio::Portfolio(const std::string& userId)
    : userId(userId), totalInvested(0.0), currentPortfolioValue(0.0) {
    portfolioId = "port_" + userId;
}

std::string Portfolio::getPortfolioId() const { return portfolioId; }
std::string Portfolio::getUserId() const { return userId; }

double Portfolio::getHoldingQuantity(const std::string& symbol) const {
    auto it = holdings.find(symbol);
    return (it != holdings.end()) ? it->second : 0.0;
}

const std::map<std::string, double>& Portfolio::getHoldings() const {
    return holdings;
}

double Portfolio::getTotalInvested() const { return totalInvested; }
double Portfolio::getCurrentPortfolioValue() const { return currentPortfolioValue; }
const std::vector<Transaction>& Portfolio::getTransactionHistory() const {
    return transactionHistory;
}

bool Portfolio::buyCrypto(const std::string& symbol, double quantity, double pricePerUnit) {
    Transaction txn(userId, symbol, TransactionType::BUY, quantity, pricePerUnit);
    holdings[symbol] += quantity;
    totalInvested += txn.getTotalValue();
    transactionHistory.push_back(txn);
    return true;
}

bool Portfolio::sellCrypto(const std::string& symbol, double quantity, double pricePerUnit) {
    if (getHoldingQuantity(symbol) < quantity) {
        return false; // Not enough holdings
    }
    Transaction txn(userId, symbol, TransactionType::SELL, quantity, pricePerUnit);
    holdings[symbol] -= quantity;
    if (holdings[symbol] < 0.0001) {
        holdings.erase(symbol); // Remove if dust amount
    }
    transactionHistory.push_back(txn);
    return true;
}

void Portfolio::updatePortfolioValue(const std::map<std::string, double>& currentPrices) {
    currentPortfolioValue = 0.0;
    for (const auto& holding : holdings) {
        auto priceIt = currentPrices.find(holding.first);
        if (priceIt != currentPrices.end()) {
            currentPortfolioValue += holding.second * priceIt->second;
        }
    }
}

double Portfolio::calculateProfitLoss() const {
    return currentPortfolioValue - totalInvested;
}

double Portfolio::calculateProfitLossPercentage() const {
    if (totalInvested == 0.0) return 0.0;
    return (calculateProfitLoss() / totalInvested) * 100.0;
}

json Portfolio::getAssetAllocation() const {
    json allocation;
    if (currentPortfolioValue == 0.0) return allocation;
    
    for (const auto& holding : holdings) {
        // Calculate percentage for each holding
        double percentage = 0.0;
        // TODO: Need current prices to calculate
        allocation[holding.first] = percentage;
    }
    return allocation;
}

double Portfolio::getConcentration(int topN) const {
    if (holdings.empty()) return 0.0;
    
    // Create vector of holdings by amount
    std::vector<std::pair<std::string, double>> sortedHoldings(holdings.begin(), holdings.end());
    std::sort(sortedHoldings.begin(), sortedHoldings.end(),
              [](const auto& a, const auto& b) { return a.second > b.second; });
    
    double topConcentration = 0.0;
    for (int i = 0; i < std::min((int)sortedHoldings.size(), topN); ++i) {
        topConcentration += sortedHoldings[i].second;
    }
    
    double totalQuantity = std::accumulate(holdings.begin(), holdings.end(), 0.0,
                                          [](double sum, const auto& p) { return sum + p.second; });
    
    return (totalQuantity > 0.0) ? (topConcentration / totalQuantity) : 0.0;
}

json Portfolio::toJson() const {
    json j;
    j["portfolioId"] = portfolioId;
    j["userId"] = userId;
    j["holdings"] = holdings;
    j["totalInvested"] = totalInvested;
    j["currentPortfolioValue"] = currentPortfolioValue;
    j["profitLoss"] = calculateProfitLoss();
    j["profitLossPercentage"] = calculateProfitLossPercentage();
    
    json txnArray = json::array();
    for (const auto& txn : transactionHistory) {
        txnArray.push_back(txn.toJson());
    }
    j["transactions"] = txnArray;
    
    return j;
}

Portfolio Portfolio::fromJson(const json& j) {
    Portfolio port(j["userId"]);
    port.portfolioId = j["portfolioId"];
    port.holdings = j["holdings"].get<std::map<std::string, double>>();
    port.totalInvested = j["totalInvested"];
    port.currentPortfolioValue = j["currentPortfolioValue"];
    return port;
}
