#ifndef API_MANAGER_H
#define API_MANAGER_H

#include <string>
#include <map>
#include <vector>
#include <nlohmann/json.hpp>

using json = nlohmann::json;

class ApiManager {
private:
    std::string coinGeckoBaseUrl;
    std::string binanceBaseUrl;
    std::map<std::string, double> cachedPrices;
    std::map<std::string, double> cached24hChange;
    
public:
    ApiManager();
    
    // Fetch current prices from CoinGecko
    json fetchCoinPrices(const std::vector<std::string>& symbols);
    
    // Fetch market data for specific coin
    json fetchCoinMarketData(const std::string& symbol);
    
    // Fetch trending coins
    json fetchTrendingCoins();
    
    // Fetch top gainers/losers
    json fetchTopMovers();
    
    // Get cached prices
    double getCachedPrice(const std::string& symbol) const;
    
    // Update cache (call periodically)
    void updatePriceCache(const std::vector<std::string>& symbols);
    
    // Calculate price changes
    double calculate24hChange(const std::string& symbol);
    
    // Get market cap data
    json getMarketCapData(const std::string& symbol);
};

#endif // API_MANAGER_H
