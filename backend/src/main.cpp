#include <crow.h>
#include <nlohmann/json.hpp>
#include <iostream>
#include <fstream>
#include <vector>
#include <map>

#include "api/api_manager.h"
#include "engine/risk_analyzer.h"
#include "engine/sentiment_analyzer.h"
#include "models/portfolio.h"

using json = nlohmann::json;

// Global instances
ApiManager* g_apiManager = nullptr;
RiskAnalyzer* g_riskAnalyzer = nullptr;
SentimentAnalyzer* g_sentimentAnalyzer = nullptr;

int main() {
    // Initialize managers
    g_apiManager = new ApiManager();
    g_riskAnalyzer = new RiskAnalyzer();
    g_sentimentAnalyzer = new SentimentAnalyzer();
    
    crow::SimpleApp app;
    
    // ==================== API ENDPOINTS ====================
    
    // Health check endpoint
    CROW_ROUTE(app, "/health").methods("GET"_method)
    ([]() {
        json response;
        response["status"] = "ok";
        response["message"] = "CryptoSentinel Backend is running";
        return crow::response(200, response.dump());
    });
    
    // Get live prices
    CROW_ROUTE(app, "/prices").methods("GET"_method)
    ([]() {
        std::vector<std::string> symbols = {"BTC", "ETH", "SOL"};
        json prices = g_apiManager->fetchCoinPrices(symbols);
        return crow::response(200, prices.dump());
    });
    
    // Get portfolio
    CROW_ROUTE(app, "/portfolio").methods("GET"_method)
    ([](const crow::request& req) {
        json portfolio;
        portfolio["totalValue"] = 12000;
        portfolio["profitLoss"] = 8.4;
        portfolio["holdings"] = {
            {"BTC", 0.4},
            {"ETH", 2.0},
            {"SOL", 15.0}
        };
        return crow::response(200, portfolio.dump());
    });
    
    // Get risk analysis
    CROW_ROUTE(app, "/risk").methods("GET"_method)
    ([]() {
        std::map<std::string, double> holdings = {
            {"BTC", 0.4},
            {"ETH", 2.0},
            {"SOL", 15.0}
        };
        std::map<std::string, double> prices = {
            {"BTC", 45000},
            {"ETH", 2500},
            {"SOL", 180}
        };
        std::map<std::string, double> volatilities = {
            {"BTC", 0.05},
            {"ETH", 0.08},
            {"SOL", 0.12}
        };
        json riskData = g_riskAnalyzer->performCompleteAnalysis(holdings, prices, volatilities);
        return crow::response(200, riskData.dump());
    });
    
    // Get market sentiment
    CROW_ROUTE(app, "/sentiment").methods("GET"_method)
    ([]() {
        json sentiment = g_sentimentAnalyzer->performCompleteAnalysis();
        return crow::response(200, sentiment.dump());
    });
    
    // Buy crypto (simulation)
    CROW_ROUTE(app, "/buy").methods("POST"_method)
    ([](const crow::request& req) {
        auto body = crow::json::load(req.body);
        json response;
        response["status"] = "success";
        response["message"] = "Buy order simulated";
        response["coin"] = body["coin"];
        response["amount"] = body["amount"];
        return crow::response(200, response.dump());
    });
    
    // Sell crypto (simulation)
    CROW_ROUTE(app, "/sell").methods("POST"_method)
    ([](const crow::request& req) {
        auto body = crow::json::load(req.body);
        json response;
        response["status"] = "success";
        response["message"] = "Sell order simulated";
        response["coin"] = body["coin"];
        response["amount"] = body["amount"];
        return crow::response(200, response.dump());
    });
    
    std::cout << "CryptoSentinel Backend starting on http://localhost:8080" << std::endl;
    app.port(8080).multithreaded().run();
    
    // Cleanup
    delete g_apiManager;
    delete g_riskAnalyzer;
    delete g_sentimentAnalyzer;
    
    return 0;
}
