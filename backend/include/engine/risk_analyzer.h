#ifndef RISK_ANALYZER_H
#define RISK_ANALYZER_H

#include <string>
#include <map>
#include <nlohmann/json.hpp>

using json = nlohmann::json;

enum class RiskLevel {
    LOW,
    MEDIUM,
    HIGH
};

class RiskAnalyzer {
private:
    // Risk scoring parameters
    double concentrationThreshold;
    double volatilityThreshold;
    
public:
    RiskAnalyzer();
    
    // Analyze portfolio concentration risk
    double analyzeConcentrationRisk(const std::map<std::string, double>& holdings,
                                   const std::map<std::string, double>& prices);
    
    // Analyze portfolio volatility risk
    double analyzeVolatilityRisk(const std::map<std::string, double>& holdings,
                                const std::map<std::string, double>& volatilities);
    
    // Calculate diversification score (0-1)
    double calculateDiversificationScore(const std::map<std::string, double>& holdings);
    
    // Calculate overall portfolio risk
    RiskLevel calculateOverallRisk(double concentrationRisk, 
                                  double volatilityRisk, 
                                  double diversification);
    
    // Generate risk recommendations
    json generateRecommendations(RiskLevel riskLevel,
                               const std::map<std::string, double>& holdings,
                               const std::map<std::string, double>& prices);
    
    // Complete risk analysis
    json performCompleteAnalysis(const std::map<std::string, double>& holdings,
                               const std::map<std::string, double>& prices,
                               const std::map<std::string, double>& volatilities);
};

#endif // RISK_ANALYZER_H
