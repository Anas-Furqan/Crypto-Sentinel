#ifndef CRYPTO_ASSET_H
#define CRYPTO_ASSET_H

#include <string>
#include <nlohmann/json.hpp>

using json = nlohmann::json;

class CryptoAsset {
private:
    std::string symbol;      // BTC, ETH, SOL, etc.
    std::string name;        // Bitcoin, Ethereum, Solana
    double currentPrice;
    double change24h;        // Percentage change in 24h
    double marketCap;
    double volume24h;
    
public:
    CryptoAsset();
    CryptoAsset(const std::string& symbol, const std::string& name, double price);
    
    // Getters
    std::string getSymbol() const;
    std::string getName() const;
    double getCurrentPrice() const;
    double getChange24h() const;
    double getMarketCap() const;
    double getVolume24h() const;
    
    // Setters
    void setCurrentPrice(double price);
    void setChange24h(double change);
    void setMarketCap(double cap);
    void setVolume24h(double volume);
    
    // Volatility calculation
    double calculateVolatility() const;
    
    // Serialization
    json toJson() const;
    static CryptoAsset fromJson(const json& j);
};

#endif // CRYPTO_ASSET_H
