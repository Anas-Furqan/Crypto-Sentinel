#ifndef STRATEGY_ENGINE_H
#define STRATEGY_ENGINE_H

#include <string>
#include <map>
#include <vector>
#include <nlohmann/json.hpp>

using json = nlohmann::json;

enum class InvestmentStrategy {
    CONSERVATIVE,
    MODERATE,
    AGGRESSIVE
};

struct AllocationRecommendation {
    std::string assetSymbol;
    double targetPercentage;
    std::string rationale;
};

class StrategyEngine {
private:
    InvestmentStrategy userStrategy;
    
    // Asset allocation templates for each strategy
    std::map<std::string, double> conservativeAllocation;
    std::map<std::string, double> moderateAllocation;
    std::map<std::string, double> aggressiveAllocation;
    
public:
    StrategyEngine();
    
    // Set user investment strategy
    void setStrategy(InvestmentStrategy strategy);
    InvestmentStrategy getStrategy() const;
    
    // Generate portfolio recommendations
    json generateRecommendations(const std::map<std::string, double>& currentHoldings,
                               double totalPortfolioValue);
    
    // Suggest rebalancing
    json suggestRebalancing(const std::map<std::string, double>& currentHoldings,
                          const std::map<std::string, double>& prices);
    
    // Simulate strategy with new investment
    json simulateInvestment(double investmentAmount,
                           const std::string& targetAsset,
                           const std::map<std::string, double>& currentPrices,
                           const std::map<std::string, double>& holdings);
    
    // Get recommended asset allocation percentages
    std::map<std::string, double> getRecommendedAllocation() const;
};

#endif // STRATEGY_ENGINE_H
