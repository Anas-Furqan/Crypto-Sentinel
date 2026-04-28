#include "engine/strategy_engine.h"
#include <algorithm>
#include <numeric>

namespace {
double calculatePortfolioValue(const std::map<std::string, double>& holdings,
                              const std::map<std::string, double>& prices) {
    double value = 0.0;
    for (const auto& holding : holdings) {
        const auto priceIt = prices.find(holding.first);
        if (priceIt != prices.end()) {
            value += holding.second * priceIt->second;
        }
    }
    return value;
}

json buildAllocation(const std::map<std::string, double>& holdings,
                     const std::map<std::string, double>& prices) {
    json allocation = json::object();
    const double totalValue = calculatePortfolioValue(holdings, prices);
    if (totalValue <= 0.0) {
        return allocation;
    }

    for (const auto& holding : holdings) {
        const auto priceIt = prices.find(holding.first);
        if (priceIt != prices.end()) {
            allocation[holding.first] = (holding.second * priceIt->second) / totalValue;
        }
    }
    return allocation;
}

std::string strategyLabel(InvestmentStrategy strategy) {
    switch (strategy) {
        case InvestmentStrategy::CONSERVATIVE: return "Conservative";
        case InvestmentStrategy::MODERATE: return "Moderate";
        case InvestmentStrategy::AGGRESSIVE: return "Aggressive";
        default: return "Moderate";
    }
}
} // namespace

StrategyEngine::StrategyEngine() : userStrategy(InvestmentStrategy::MODERATE) {
    conservativeAllocation["BTC"] = 0.50;
    conservativeAllocation["ETH"] = 0.30;
    conservativeAllocation["USDC"] = 0.20;

    moderateAllocation["BTC"] = 0.40;
    moderateAllocation["ETH"] = 0.30;
    moderateAllocation["SOL"] = 0.15;
    moderateAllocation["USDC"] = 0.15;

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
    const auto targetAllocation = getRecommendedAllocation();
    recommendations["strategy"] = strategyLabel(userStrategy);
    recommendations["portfolioValue"] = totalPortfolioValue;
    recommendations["targetAllocation"] = targetAllocation;

    json allocation = json::object();
    const double totalQuantity = std::accumulate(
        currentHoldings.begin(), currentHoldings.end(), 0.0,
        [](double sum, const auto& item) { return sum + item.second; }
    );

    for (const auto& holding : currentHoldings) {
        allocation[holding.first] = totalQuantity > 0.0 ? holding.second / totalQuantity : 0.0;
    }
    recommendations["currentAllocation"] = allocation;

    json suggestions = json::array();
    if (currentHoldings.empty()) {
        suggestions.push_back("Start with a BTC and ETH core position.");
        suggestions.push_back("Keep at least 10-15% flexible capital for rebalancing.");
    } else {
        const auto dominant = std::max_element(
            currentHoldings.begin(), currentHoldings.end(),
            [](const auto& left, const auto& right) { return left.second < right.second; }
        );
        const double dominantShare = totalQuantity > 0.0 ? dominant->second / totalQuantity : 0.0;
        if (dominantShare > 0.6) {
            suggestions.push_back("Reduce concentration in " + dominant->first + ".");
        } else {
            suggestions.push_back("Current allocation looks balanced for a moderate profile.");
        }
    }

    if (userStrategy == InvestmentStrategy::CONSERVATIVE) {
        suggestions.push_back("Favor BTC, ETH, and stablecoin buffers.");
    } else if (userStrategy == InvestmentStrategy::AGGRESSIVE) {
        suggestions.push_back("Allow a higher growth bucket, but monitor volatility weekly.");
    }

    recommendations["recommendations"] = suggestions;
    recommendations["summary"] = "Strategy insights generated from the live portfolio and target allocation model.";
    return recommendations;
}

json StrategyEngine::suggestRebalancing(const std::map<std::string, double>& currentHoldings,
                                       const std::map<std::string, double>& prices) {
    json suggestion;
    const auto targetAllocation = getRecommendedAllocation();
    const auto currentAllocation = buildAllocation(currentHoldings, prices);
    suggestion["rebalanceNeeded"] = true;
    suggestion["targetAllocation"] = targetAllocation;
    suggestion["currentAllocation"] = currentAllocation;
    suggestion["recommendation"] = "Compare current allocation against the target allocation and trim the largest overweight position.";
    return suggestion;
}

json StrategyEngine::simulateInvestment(double investmentAmount,
                                       const std::string& targetAsset,
                                       const std::map<std::string, double>& currentPrices,
                                       const std::map<std::string, double>& holdings) {
    json simulation;
    const double beforeValue = calculatePortfolioValue(holdings, currentPrices);
    const auto priceIt = currentPrices.find(targetAsset);
    const double assetPrice = priceIt != currentPrices.end() ? priceIt->second : 0.0;
    const double estimatedUnits = assetPrice > 0.0 ? investmentAmount / assetPrice : 0.0;
    const double afterValue = beforeValue + investmentAmount;

    json projected = json::object();
    for (const auto& holding : holdings) {
        const auto currentPriceIt = currentPrices.find(holding.first);
        if (currentPriceIt != currentPrices.end()) {
            projected[holding.first] = (holding.second * currentPriceIt->second) / afterValue;
        }
    }
    const double currentTargetValue = [&]() {
        const auto holdingIt = holdings.find(targetAsset);
        const auto priceIt = currentPrices.find(targetAsset);
        if (holdingIt == holdings.end() || priceIt == currentPrices.end()) {
            return 0.0;
        }
        return holdingIt->second * priceIt->second;
    }();
    projected[targetAsset] = (currentTargetValue + investmentAmount) / afterValue;

    simulation["investmentAmount"] = investmentAmount;
    simulation["targetAsset"] = targetAsset;
    simulation["assumedPrice"] = assetPrice;
    simulation["estimatedUnits"] = estimatedUnits;
    simulation["portfolioValueBefore"] = beforeValue;
    simulation["portfolioValueAfter"] = afterValue;
    simulation["projectedAllocation"] = projected;
    simulation["summary"] = assetPrice > 0.0
        ? "Buying now would add more exposure to " + targetAsset + " and grow the live portfolio value."
        : "Live price for the selected asset is unavailable, so the simulation uses an indicative zero-price fallback.";
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
