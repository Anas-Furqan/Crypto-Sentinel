#include <crow.h>
#include <nlohmann/json.hpp>
#include <ctime>
#include <fstream>
#include <iostream>
#include <map>
#include <sstream>
#include <string>
#include <unordered_map>
#include <vector>

#include "api/api_manager.h"
#include "engine/alert_manager.h"
#include "engine/risk_analyzer.h"
#include "engine/sentiment_analyzer.h"
#include "engine/strategy_engine.h"
#include "models/portfolio.h"
#include "utils/file_handler.h"
#include "crow/middlewares/cors.h"

using json = nlohmann::json;

ApiManager* g_apiManager = nullptr;
RiskAnalyzer* g_riskAnalyzer = nullptr;
SentimentAnalyzer* g_sentimentAnalyzer = nullptr;
StrategyEngine* g_strategyEngine = nullptr;
AlertManager* g_alertManager = nullptr;
std::unordered_map<std::string, std::string> g_sessions;

namespace {
std::string getEnvVar(const std::string& key, const std::string& fallback = "") {
    const char* value = std::getenv(key.c_str());
    if (!value) return fallback;
    return value;
}

void loadEnvFile(const std::string& path) {
    std::ifstream file(path);
    if (!file.is_open()) return;

    std::string line;
    while (std::getline(file, line)) {
        if (line.empty() || line[0] == '#') continue;
        const auto eq = line.find('=');
        if (eq == std::string::npos) continue;
        const std::string key = line.substr(0, eq);
        const std::string value = line.substr(eq + 1);
#ifdef _WIN32
        _putenv_s(key.c_str(), value.c_str());
#else
        setenv(key.c_str(), value.c_str(), 1);
#endif
    }
}

std::string nowToken() {
    return "token_" + FileHandler::generateId();
}

std::string hashPassword(const std::string& plain) {
    return std::to_string(std::hash<std::string>{}(plain));
}

std::string resolveUserIdFromRequest(const crow::request& req) {
    std::string auth = req.get_header_value("Authorization");
    if (auth.rfind("Bearer ", 0) == 0) {
        const std::string token = auth.substr(7);
        auto it = g_sessions.find(token);
        if (it != g_sessions.end()) return it->second;
    }
    const char* queryUserId = req.url_params.get("userId");
    if (queryUserId) return queryUserId;
    return "user_demo";
}

json loadOrCreateUser(const std::string& userId) {
    json user = FileHandler::loadUser(userId);
    if (!user.empty()) return user;
    user["userId"] = userId;
    user["username"] = "Demo User";
    user["email"] = "demo@cryptosentinel.local";
    user["riskPreference"] = "Moderate";
    user["passwordHash"] = hashPassword("demo123");
    FileHandler::saveUser(userId, user);
    return user;
}

Portfolio loadOrCreatePortfolio(const std::string& userId) {
    const std::string portfolioId = "port_" + userId;
    const json saved = FileHandler::loadPortfolio(portfolioId);
    if (!saved.empty()) {
        return Portfolio::fromJson(saved);
    }

    Portfolio portfolio(userId);
    portfolio.buyCrypto("BTC", 0.2, 30000.0);
    portfolio.buyCrypto("ETH", 1.0, 1800.0);
    FileHandler::savePortfolio(portfolio.getPortfolioId(), portfolio.toJson());
    return portfolio;
}

crow::response jsonResponse(int code, const json& payload) {
    crow::response res(code, payload.dump());
    res.set_header("Content-Type", "application/json");
    res.set_header("Access-Control-Allow-Origin", "*");
    res.set_header("Access-Control-Allow-Headers", "Authorization, Content-Type");
    res.set_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    return res;
}
} // namespace

int main() {
    loadEnvFile(".env");
    loadEnvFile("../.env");

    g_apiManager = new ApiManager();
    g_riskAnalyzer = new RiskAnalyzer();
    g_sentimentAnalyzer = new SentimentAnalyzer();
    g_strategyEngine = new StrategyEngine();
    g_alertManager = new AlertManager();

    crow::App<crow::CORSHandler> app;
    auto& cors = app.get_middleware<crow::CORSHandler>();
    cors.global()
        .origin("*")
        .headers("Authorization", "Content-Type", "Accept")
        .methods("GET"_method, "POST"_method, "OPTIONS"_method);

    CROW_ROUTE(app, "/health").methods("GET"_method)
    ([]() {
        json response;
        response["status"] = "ok";
        response["message"] = "CryptoSentinel Backend is running";
        return jsonResponse(200, response);
    });

    CROW_ROUTE(app, "/auth/register").methods("POST"_method)
    ([](const crow::request& req) {
        const auto body = crow::json::load(req.body);
        if (!body) return jsonResponse(400, {{"error", "Invalid JSON body"}});
        const std::string username = body.has("username") ? std::string(body["username"].s()) : "";
        const std::string email = body.has("email") ? std::string(body["email"].s()) : "";
        const std::string password = body.has("password") ? std::string(body["password"].s()) : "";
        const std::string riskPreference = body.has("riskPreference") ? std::string(body["riskPreference"].s()) : "Moderate";

        if (username.empty() || email.empty() || password.empty()) {
            return jsonResponse(400, {{"error", "username, email, and password are required"}});
        }

        json user;
        user["userId"] = FileHandler::generateId();
        user["username"] = username;
        user["email"] = email;
        user["riskPreference"] = riskPreference;
        user["passwordHash"] = hashPassword(password);
        FileHandler::saveUser(user["userId"], user);

        Portfolio portfolio(user["userId"]);
        FileHandler::savePortfolio(portfolio.getPortfolioId(), portfolio.toJson());
        return jsonResponse(201, {{"status", "success"}, {"user", user}});
    });

    CROW_ROUTE(app, "/auth/login").methods("POST"_method)
    ([](const crow::request& req) {
        const auto body = crow::json::load(req.body);
        if (!body) return jsonResponse(400, {{"error", "Invalid JSON body"}});
        const std::string email = body.has("email") ? std::string(body["email"].s()) : "";
        const std::string password = body.has("password") ? std::string(body["password"].s()) : "";
        if (email.empty() || password.empty()) return jsonResponse(400, {{"error", "email and password are required"}});

        const auto users = FileHandler::getAllUsers();
        for (const auto& userId : users) {
            json user = FileHandler::loadUser(userId);
            if (!user.empty() && user.value("email", "") == email) {
                if (user.value("passwordHash", "") == hashPassword(password)) {
                    const std::string token = nowToken();
                    g_sessions[token] = userId;
                    return jsonResponse(200, {{"status", "success"}, {"token", token}, {"user", user}});
                }
                return jsonResponse(401, {{"error", "Invalid password"}});
            }
        }
        return jsonResponse(404, {{"error", "User not found"}});
    });

    CROW_ROUTE(app, "/auth/profile").methods("GET"_method)
    ([](const crow::request& req) {
        const std::string userId = resolveUserIdFromRequest(req);
        json user = loadOrCreateUser(userId);
        return jsonResponse(200, user);
    });

    CROW_ROUTE(app, "/prices").methods("GET"_method)
    ([]() {
        const std::vector<std::string> symbols = {"BTC", "ETH", "SOL"};
        json prices = g_apiManager->fetchCoinPrices(symbols);
        return jsonResponse(200, prices);
    });

    CROW_ROUTE(app, "/portfolio").methods("GET"_method)
    ([](const crow::request& req) {
        const std::string userId = resolveUserIdFromRequest(req);
        Portfolio portfolio = loadOrCreatePortfolio(userId);
        const std::vector<std::string> symbols = {"BTC", "ETH", "SOL"};
        json priceJson = g_apiManager->fetchCoinPrices(symbols);
        std::map<std::string, double> prices;
        for (const auto& symbol : symbols) {
            prices[symbol] = priceJson.value(symbol, 0.0);
        }
        portfolio.updatePortfolioValue(prices);
        FileHandler::savePortfolio(portfolio.getPortfolioId(), portfolio.toJson());

        json allocation = json::object();
        const double totalValue = portfolio.getCurrentPortfolioValue();
        if (totalValue > 0.0) {
            for (const auto& [symbol, quantity] : portfolio.getHoldings()) {
                const double assetValue = quantity * prices[symbol];
                allocation[symbol] = assetValue / totalValue;
            }
        }

        json response;
        response["totalValue"] = portfolio.getCurrentPortfolioValue();
        response["totalInvested"] = portfolio.getTotalInvested();
        response["profitLoss"] = portfolio.calculateProfitLossPercentage();
        response["holdings"] = portfolio.getHoldings();
        response["assetAllocation"] = allocation;
        response["holdingsCount"] = (int)portfolio.getHoldings().size();
        // Include persisted transaction history so frontend can show executed trades
        response["transactions"] = FileHandler::loadTransactionHistory(portfolio.getPortfolioId());
        response["portfolioId"] = portfolio.getPortfolioId();
        return jsonResponse(200, response);
    });

    CROW_ROUTE(app, "/risk").methods("GET"_method)
    ([](const crow::request& req) {
        const std::string userId = resolveUserIdFromRequest(req);
        Portfolio portfolio = loadOrCreatePortfolio(userId);
        const std::vector<std::string> symbols = {"BTC", "ETH", "SOL"};
        json priceJson = g_apiManager->fetchCoinPrices(symbols);

        std::map<std::string, double> prices;
        for (const auto& [symbol, qty] : portfolio.getHoldings()) {
            prices[symbol] = priceJson.value(symbol, 0.0);
        }

        std::map<std::string, double> volatilities = {
            {"BTC", 0.04}, {"ETH", 0.06}, {"SOL", 0.10}, {"USDC", 0.01}
        };
        json riskData = g_riskAnalyzer->performCompleteAnalysis(portfolio.getHoldings(), prices, volatilities);
        riskData["portfolioValue"] = portfolio.getCurrentPortfolioValue();
        riskData["holdingsCount"] = (int)portfolio.getHoldings().size();
        return jsonResponse(200, riskData);
    });

    CROW_ROUTE(app, "/sentiment").methods("GET"_method)
    ([]() {
        json sentiment = g_sentimentAnalyzer->performCompleteAnalysis();
        return jsonResponse(200, sentiment);
    });

    CROW_ROUTE(app, "/strategy").methods("GET"_method)
    ([](const crow::request& req) {
        const std::string userId = resolveUserIdFromRequest(req);
        loadOrCreateUser(userId);
        Portfolio portfolio = loadOrCreatePortfolio(userId);
        const char* mode = req.url_params.get("mode");
        if (mode) {
            const std::string strategy = mode;
            if (strategy == "conservative") g_strategyEngine->setStrategy(InvestmentStrategy::CONSERVATIVE);
            else if (strategy == "aggressive") g_strategyEngine->setStrategy(InvestmentStrategy::AGGRESSIVE);
            else g_strategyEngine->setStrategy(InvestmentStrategy::MODERATE);
        }
        json rec = g_strategyEngine->generateRecommendations(portfolio.getHoldings(), portfolio.getCurrentPortfolioValue());
        return jsonResponse(200, rec);
    });

    CROW_ROUTE(app, "/strategy/simulate").methods("POST"_method)
    ([](const crow::request& req) {
        const auto body = crow::json::load(req.body);
        if (!body) return jsonResponse(400, {{"error", "Invalid JSON body"}});

        const std::string userId = resolveUserIdFromRequest(req);
        Portfolio portfolio = loadOrCreatePortfolio(userId);

        const std::string targetAsset = body.has("asset") ? std::string(body["asset"].s()) : "BTC";
        const double investmentAmount = body.has("amount") ? body["amount"].d() : 0.0;

        if (investmentAmount <= 0.0) {
            return jsonResponse(400, {{"error", "amount must be greater than 0"}});
        }

        const std::vector<std::string> symbols = {"BTC", "ETH", "SOL", targetAsset};
        json priceJson = g_apiManager->fetchCoinPrices(symbols);
        std::map<std::string, double> prices;
        for (const auto& symbol : symbols) {
            prices[symbol] = priceJson.value(symbol, 0.0);
        }

        json simulation = g_strategyEngine->simulateInvestment(
            investmentAmount,
            targetAsset,
            prices,
            portfolio.getHoldings()
        );
        simulation["strategy"] = g_strategyEngine->generateRecommendations(portfolio.getHoldings(), portfolio.getCurrentPortfolioValue())["strategy"];
        simulation["portfolioId"] = portfolio.getPortfolioId();
        return jsonResponse(200, simulation);
    });

    CROW_ROUTE(app, "/alerts").methods("GET"_method)
    ([](const crow::request& req) {
        const std::string userId = resolveUserIdFromRequest(req);
        const std::vector<Alert> alerts = g_alertManager->getUserAlerts(userId);
        json payload = json::array();
        for (const auto& alert : alerts) payload.push_back(alert.toJson());
        return jsonResponse(200, {{"alerts", payload}, {"unreadCount", g_alertManager->getUnreadCount(userId)}});
    });

    CROW_ROUTE(app, "/buy").methods("POST"_method)
    ([](const crow::request& req) {
        const auto body = crow::json::load(req.body);
        if (!body || !body.has("coin") || !body.has("amount")) {
            return jsonResponse(400, {{"error", "coin and amount are required"}});
        }
        const std::string userId = resolveUserIdFromRequest(req);
        const std::string coin = body["coin"].s();
        const double amount = body["amount"].d();
        if (amount <= 0) return jsonResponse(400, {{"error", "amount must be > 0"}});

        Portfolio portfolio = loadOrCreatePortfolio(userId);
        const json prices = g_apiManager->fetchCoinPrices({coin});
        const double livePrice = prices.value(coin, 0.0);
        if (livePrice <= 0.0) return jsonResponse(503, {{"error", "Live price unavailable"}});

        portfolio.buyCrypto(coin, amount, livePrice);
        portfolio.updatePortfolioValue({{coin, livePrice}});
        FileHandler::savePortfolio(portfolio.getPortfolioId(), portfolio.toJson());
        FileHandler::appendTransaction(portfolio.getPortfolioId(), {
            {"type", "BUY"}, {"symbol", coin}, {"quantity", amount}, {"price", livePrice}, {"timestamp", (long long)std::time(nullptr)}
        });

        if (amount * livePrice > 10000) {
            g_alertManager->createRiskWarningAlert(userId, "Medium", "Large position size added");
        }

        return jsonResponse(200, {{"status", "success"}, {"message", "Buy order executed"}, {"price", livePrice}});
    });

    CROW_ROUTE(app, "/sell").methods("POST"_method)
    ([](const crow::request& req) {
        const auto body = crow::json::load(req.body);
        if (!body || !body.has("coin") || !body.has("amount")) {
            return jsonResponse(400, {{"error", "coin and amount are required"}});
        }
        const std::string userId = resolveUserIdFromRequest(req);
        const std::string coin = body["coin"].s();
        const double amount = body["amount"].d();
        if (amount <= 0) return jsonResponse(400, {{"error", "amount must be > 0"}});

        Portfolio portfolio = loadOrCreatePortfolio(userId);
        const json prices = g_apiManager->fetchCoinPrices({coin});
        const double livePrice = prices.value(coin, 0.0);
        if (livePrice <= 0.0) return jsonResponse(503, {{"error", "Live price unavailable"}});

        if (!portfolio.sellCrypto(coin, amount, livePrice)) {
            return jsonResponse(400, {{"error", "Insufficient holdings"}});
        }

        FileHandler::savePortfolio(portfolio.getPortfolioId(), portfolio.toJson());
        FileHandler::appendTransaction(portfolio.getPortfolioId(), {
            {"type", "SELL"}, {"symbol", coin}, {"quantity", amount}, {"price", livePrice}, {"timestamp", (long long)std::time(nullptr)}
        });
        return jsonResponse(200, {{"status", "success"}, {"message", "Sell order executed"}, {"price", livePrice}});
    });

    const int port = std::stoi(getEnvVar("BACKEND_PORT", "8080"));
    std::cout << "CryptoSentinel Backend starting on http://localhost:" << port << std::endl;
    app.port(port).multithreaded().run();

    delete g_apiManager;
    delete g_riskAnalyzer;
    delete g_sentimentAnalyzer;
    delete g_strategyEngine;
    delete g_alertManager;
    return 0;
}
