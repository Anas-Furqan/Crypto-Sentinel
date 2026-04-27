#include "engine/risk_analyzer.h"
#include <cmath>
#include <numeric>
#include <algorithm>

RiskAnalyzer::RiskAnalyzer() 
    : concentrationThreshold(0.60), volatilityThreshold(0.15) {}

double RiskAnalyzer::analyzeConcentrationRisk(const std::map<std::string, double>& holdings,
                                             const std::map<std::string, double>& prices) {
    if (holdings.empty()) return 0.0;
    
    // Calculate total portfolio value
    double totalValue = 0.0;
    for (const auto& holding : holdings) {
        auto priceIt = prices.find(holding.first);
        if (priceIt != prices.end()) {
            totalValue += holding.second * priceIt->second;
        }
    }
    
    if (totalValue == 0.0) return 0.0;
    
    // Calculate Herfindahl index (concentration)
    double herfindahl = 0.0;
    for (const auto& holding : holdings) {
        auto priceIt = prices.find(holding.first);
        if (priceIt != prices.end()) {
            double weight = (holding.second * priceIt->second) / totalValue;
            herfindahl += weight * weight;
        }
    }
    
    // Normalize to 0-1 scale
    return std::min(1.0, herfindahl / (1.0 / holdings.size()));
}

double RiskAnalyzer::analyzeVolatilityRisk(const std::map<std::string, double>& holdings,
                                          const std::map<std::string, double>& volatilities) {
    if (holdings.empty()) return 0.0;
    
    double portfolioVolatility = 0.0;
    for (const auto& holding : holdings) {
        auto volIt = volatilities.find(holding.first);
        if (volIt != volatilities.end()) {
            portfolioVolatility += volIt->second;
        }
    }
    
    double avgVolatility = portfolioVolatility / holdings.size();
    return std::min(1.0, avgVolatility / 0.5); // Normalize to 0-1
}

double RiskAnalyzer::calculateDiversificationScore(const std::map<std::string, double>& holdings) {
    if (holdings.empty()) return 0.0;
    
    // Simple diversification: more assets = higher score
    // Max score at 10+ different assets
    return std::min(1.0, (double)holdings.size() / 10.0);
}

RiskLevel RiskAnalyzer::calculateOverallRisk(double concentrationRisk,
                                            double volatilityRisk,
                                            double diversification) {
    // Calculate weighted risk score
    double riskScore = (concentrationRisk * 0.4) + (volatilityRisk * 0.4) - (diversification * 0.2);
    
    if (riskScore < 0.33) return RiskLevel::LOW;
    if (riskScore < 0.66) return RiskLevel::MEDIUM;
    return RiskLevel::HIGH;
}

json RiskAnalyzer::generateRecommendations(RiskLevel riskLevel,
                                         const std::map<std::string, double>& holdings,
                                         const std::map<std::string, double>& prices) {
    json recommendations = json::array();
    
    if (riskLevel == RiskLevel::HIGH) {
        recommendations.push_back("Consider reducing concentration in volatile assets");
        recommendations.push_back("Increase portfolio diversification");
    } else if (riskLevel == RiskLevel::MEDIUM) {
        recommendations.push_back("Monitor your portfolio regularly");
    }
    
    return recommendations;
}

json RiskAnalyzer::performCompleteAnalysis(const std::map<std::string, double>& holdings,
                                          const std::map<std::string, double>& prices,
                                          const std::map<std::string, double>& volatilities) {
    double concRisk = analyzeConcentrationRisk(holdings, prices);
    double volRisk = analyzeVolatilityRisk(holdings, volatilities);
    double diversification = calculateDiversificationScore(holdings);
    RiskLevel overallRisk = calculateOverallRisk(concRisk, volRisk, diversification);
    
    json analysis;
    analysis["concentrationRisk"] = concRisk;
    analysis["volatilityRisk"] = volRisk;
    analysis["diversificationScore"] = diversification;
    analysis["overallRiskLevel"] = (overallRisk == RiskLevel::LOW ? "Low" :
                                   (overallRisk == RiskLevel::MEDIUM ? "Medium" : "High"));
    analysis["recommendations"] = generateRecommendations(overallRisk, holdings, prices);
    
    return analysis;
}
