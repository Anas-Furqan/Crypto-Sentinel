#include "engine/strategy_engine.h"

StrategyEngine::StrategyEngine() : userStrategy(InvestmentStrategy::MODERATE) {
    // Conservative allocation
    conservativeAllocation["BTC"] = 0.50;
    conservativeAllocation["ETH"] = 0.30;
    conservativeAllocation["USDC"] = 0.20;
    
    // Moderate allocation
    moderateAllocation["BTC"] = 0.40;
    moderateAllocation["ETH"] = 0.30;
    moderateAllocation["SOL"] = 0.15;
    moderateAllocation["USDC"] = 0.15;
    
    // Aggressive allocation
    aggressiveAllocation["BTC"] = 0.30;
    aggressiveAllocation["ETH"] = 0.25;
    aggressiveAllocation["SOL"] = 0.20;
    aggressiveAllocation["DOGE"] = 0.15;
    aggressiveAllocation["AVAX"] = 0.10;
}

void StrategyEngine::setStrategy(InvestmentStrategy strategy) {
    userStrategy = strategy;
}

InvestmentStrategy StrategyEngine::getStrategy() const {
    return userStrategy;
}

json StrategyEngine::generateRecommendations(const std::map<std::string, double>& currentHoldings,
                                            double totalPortfolioValue) {
    json recommendations;
    recommendations["strategy"] = (userStrategy == InvestmentStrategy::CONSERVATIVE ? "Conservative" :
                                  (userStrategy == InvestmentStrategy::MODERATE ? "Moderate" : "Aggressive"));
    recommendations["currentAllocation"] = getRecommendedAllocation();
    return recommendations;
}

json StrategyEngine::suggestRebalancing(const std::map<std::string, double>& currentHoldings,
                                       const std::map<std::string, double>& prices) {
    json suggestion;
    suggestion["rebalanceNeeded"] = true;
    suggestion["recommendation"] = "Consider rebalancing to match target allocation";
    return suggestion;
}

json StrategyEngine::simulateInvestment(double investmentAmount,
                                       const std::string& targetAsset,
                                       const std::map<std::string, double>& currentPrices,
                                       const std::map<std::string, double>& holdings) {
    json simulation;
    simulation["investmentAmount"] = investmentAmount;
    simulation["targetAsset"] = targetAsset;
    simulation["projectedOutcome"] = "Positive";
    return simulation;
}

std::map<std::string, double> StrategyEngine::getRecommendedAllocation() const {
    switch(userStrategy) {
        case InvestmentStrategy::CONSERVATIVE:
            return conservativeAllocation;
        case InvestmentStrategy::MODERATE:
            return moderateAllocation;
        case InvestmentStrategy::AGGRESSIVE:
            return aggressiveAllocation;
        default:
            return moderateAllocation;
    }
}
