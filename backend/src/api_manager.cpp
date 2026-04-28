#include "api/api_manager.h"
#include <algorithm>
#include <array>
#include <cctype>
#include <cstdio>
#include <cstdlib>
#include <sstream>

namespace {
std::string trim(const std::string& input) {
    const auto start = input.find_first_not_of(" \t\r\n");
    if (start == std::string::npos) return "";
    const auto end = input.find_last_not_of(" \t\r\n");
    return input.substr(start, end - start + 1);
}

std::string getEnvVar(const std::string& key, const std::string& fallback = "") {
    const char* value = std::getenv(key.c_str());
    if (!value) return fallback;
    return value;
}

std::string shellEscape(const std::string& raw) {
    std::string escaped;
    escaped.reserve(raw.size() * 2);
    for (char ch : raw) {
        if (ch == '\"') {
            escaped += "\\\"";
        } else {
            escaped += ch;
        }
    }
    return escaped;
}

std::string runCurlGet(const std::string& url, const std::string& apiKeyHeader = "") {
    std::string command = "curl -s -L";
    if (!apiKeyHeader.empty()) {
        command += " -H \"" + shellEscape(apiKeyHeader) + "\"";
    }
    command += " \"" + shellEscape(url) + "\"";

#ifdef _WIN32
    FILE* pipe = _popen(command.c_str(), "r");
#else
    FILE* pipe = popen(command.c_str(), "r");
#endif
    if (!pipe) return "";

    std::array<char, 4096> buffer{};
    std::string result;
    while (std::fgets(buffer.data(), static_cast<int>(buffer.size()), pipe) != nullptr) {
        result += buffer.data();
    }

#ifdef _WIN32
    _pclose(pipe);
#else
    pclose(pipe);
#endif
    return result;
}

std::string toLower(const std::string& value) {
    std::string output = value;
    std::transform(output.begin(), output.end(), output.begin(),
                   [](unsigned char c) { return static_cast<char>(std::tolower(c)); });
    return output;
}

std::string coingeckoIdFromSymbol(const std::string& symbol) {
    const std::string lowered = toLower(symbol);
    if (lowered == "btc") return "bitcoin";
    if (lowered == "eth") return "ethereum";
    if (lowered == "sol") return "solana";
    if (lowered == "avax") return "avalanche-2";
    if (lowered == "doge") return "dogecoin";
    if (lowered == "usdc") return "usd-coin";
    return lowered;
}

double demoPriceForSymbol(const std::string& symbol) {
    const std::string lowered = toLower(symbol);
    if (lowered == "btc") return 68450.0;
    if (lowered == "eth") return 3450.0;
    if (lowered == "sol") return 165.0;
    if (lowered == "usdc") return 1.0;
    if (lowered == "avax") return 42.0;
    if (lowered == "doge") return 0.18;
    return 0.0;
}

double demoChangeForSymbol(const std::string& symbol) {
    const std::string lowered = toLower(symbol);
    if (lowered == "btc") return 2.4;
    if (lowered == "eth") return 3.1;
    if (lowered == "sol") return 5.2;
    if (lowered == "usdc") return 0.0;
    if (lowered == "avax") return 4.8;
    if (lowered == "doge") return 7.5;
    return 0.0;
}
} // namespace

ApiManager::ApiManager() 
    : coinGeckoBaseUrl(getEnvVar("COINGECKO_BASE_URL", "https://api.coingecko.com/api/v3")),
      binanceBaseUrl(getEnvVar("BINANCE_BASE_URL", "https://api.binance.com/api/v3")) {}

json ApiManager::fetchCoinPrices(const std::vector<std::string>& symbols) {
    json prices = json::object();
    if (symbols.empty()) return prices;

    std::ostringstream ids;
    bool first = true;
    for (const auto& symbol : symbols) {
        if (!first) ids << ",";
        ids << coingeckoIdFromSymbol(symbol);
        first = false;
    }

    const std::string url = coinGeckoBaseUrl +
        "/simple/price?ids=" + ids.str() +
        "&vs_currencies=usd&include_24hr_change=true";
    const std::string apiKey = trim(getEnvVar("COINGECKO_API_KEY"));
    const std::string header = apiKey.empty() ? "" : "x-cg-demo-api-key: " + apiKey;
    const std::string raw = runCurlGet(url, header);

    try {
        const json parsed = json::parse(raw);
        for (const auto& symbol : symbols) {
            const std::string id = coingeckoIdFromSymbol(symbol);
            const std::string upper = symbol;
            double usd = 0.0;
            double change = 0.0;
            if (parsed.contains(id)) {
                usd = parsed[id].value("usd", 0.0);
                change = parsed[id].value("usd_24h_change", 0.0);
            }
            if (usd <= 0.0) {
                usd = demoPriceForSymbol(symbol);
            }
            if (change == 0.0) {
                change = demoChangeForSymbol(symbol);
            }
            prices[upper] = usd;
            cachedPrices[upper] = usd;
            cached24hChange[upper] = change;
        }
    } catch (...) {
        for (const auto& symbol : symbols) {
            const double cached = getCachedPrice(symbol);
            prices[symbol] = cached > 0.0 ? cached : demoPriceForSymbol(symbol);
        }
    }

    return prices;
}

json ApiManager::fetchCoinMarketData(const std::string& symbol) {
    json marketData = json::object();
    const std::string id = coingeckoIdFromSymbol(symbol);
    const std::string url = coinGeckoBaseUrl + "/coins/markets?vs_currency=usd&ids=" + id;
    const std::string apiKey = trim(getEnvVar("COINGECKO_API_KEY"));
    const std::string header = apiKey.empty() ? "" : "x-cg-demo-api-key: " + apiKey;
    const std::string raw = runCurlGet(url, header);

    marketData["symbol"] = symbol;
    try {
        const json parsed = json::parse(raw);
        if (parsed.is_array() && !parsed.empty()) {
            const auto& row = parsed[0];
            marketData["price"] = row.value("current_price", 0.0);
            marketData["marketCap"] = row.value("market_cap", 0.0);
            marketData["volume24h"] = row.value("total_volume", 0.0);
            marketData["change24h"] = row.value("price_change_percentage_24h", 0.0);
            return marketData;
        }
    } catch (...) {
    }

    marketData["price"] = getCachedPrice(symbol) > 0.0 ? getCachedPrice(symbol) : demoPriceForSymbol(symbol);
    marketData["marketCap"] = 0.0;
    marketData["volume24h"] = 0.0;
    marketData["change24h"] = calculate24hChange(symbol);
    if (marketData["change24h"].is_number() && marketData["change24h"].get<double>() == 0.0) {
        marketData["change24h"] = demoChangeForSymbol(symbol);
    }
    return marketData;
}

json ApiManager::fetchTrendingCoins() {
    json trending = json::array();
    const std::string url = coinGeckoBaseUrl + "/search/trending";
    const std::string raw = runCurlGet(url);
    try {
        const json parsed = json::parse(raw);
        if (parsed.contains("coins") && parsed["coins"].is_array()) {
            for (const auto& coinWrap : parsed["coins"]) {
                if (!coinWrap.contains("item")) continue;
                const auto& item = coinWrap["item"];
                json row;
                row["symbol"] = item.value("symbol", "");
                row["name"] = item.value("name", "");
                row["marketCapRank"] = item.value("market_cap_rank", 0);
                trending.push_back(row);
            }
        }
    } catch (...) {
    }
    return trending;
}

json ApiManager::fetchTopMovers() {
    json movers;
    movers["gainers"] = json::array();
    movers["losers"] = json::array();
    const std::string url = coinGeckoBaseUrl +
        "/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false";
    const std::string raw = runCurlGet(url);
    try {
        const json parsed = json::parse(raw);
        if (!parsed.is_array()) return movers;

        std::vector<json> rows;
        for (const auto& row : parsed) {
            if (!row.contains("price_change_percentage_24h")) continue;
            rows.push_back(row);
        }

        std::sort(rows.begin(), rows.end(), [](const json& a, const json& b) {
            return a.value("price_change_percentage_24h", 0.0) >
                   b.value("price_change_percentage_24h", 0.0);
        });

        for (int i = 0; i < 5 && i < static_cast<int>(rows.size()); ++i) {
            json item;
            item["symbol"] = rows[i].value("symbol", "");
            item["name"] = rows[i].value("name", "");
            item["change24h"] = rows[i].value("price_change_percentage_24h", 0.0);
            movers["gainers"].push_back(item);
        }
        for (int i = 0; i < 5 && i < static_cast<int>(rows.size()); ++i) {
            const auto& row = rows[rows.size() - 1 - i];
            json item;
            item["symbol"] = row.value("symbol", "");
            item["name"] = row.value("name", "");
            item["change24h"] = row.value("price_change_percentage_24h", 0.0);
            movers["losers"].push_back(item);
        }
    } catch (...) {
    }
    return movers;
}

double ApiManager::getCachedPrice(const std::string& symbol) const {
    auto it = cachedPrices.find(symbol);
    return (it != cachedPrices.end()) ? it->second : 0.0;
}

void ApiManager::updatePriceCache(const std::vector<std::string>& symbols) {
    fetchCoinPrices(symbols);
}

double ApiManager::calculate24hChange(const std::string& symbol) {
    auto it = cached24hChange.find(symbol);
    return (it != cached24hChange.end()) ? it->second : 0.0;
}

json ApiManager::getMarketCapData(const std::string& symbol) {
    json marketCap = json::object();
    const std::string id = coingeckoIdFromSymbol(symbol);
    const std::string url = coinGeckoBaseUrl + "/coins/markets?vs_currency=usd&ids=" + id;
    const std::string raw = runCurlGet(url);
    marketCap["symbol"] = symbol;
    try {
        const json parsed = json::parse(raw);
        if (parsed.is_array() && !parsed.empty()) {
            marketCap["marketCap"] = parsed[0].value("market_cap", 0.0);
            marketCap["marketCapRank"] = parsed[0].value("market_cap_rank", 0);
            return marketCap;
        }
    } catch (...) {
    }
    marketCap["marketCap"] = 0.0;
    marketCap["marketCapRank"] = 0;
    return marketCap;
}
