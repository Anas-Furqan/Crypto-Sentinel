#include "models/crypto_asset.h"
#include <cmath>

CryptoAsset::CryptoAsset() : symbol(""), name(""), currentPrice(0.0), change24h(0.0),
                            marketCap(0.0), volume24h(0.0) {}

CryptoAsset::CryptoAsset(const std::string& symbol, const std::string& name, double price)
    : symbol(symbol), name(name), currentPrice(price), change24h(0.0),
      marketCap(0.0), volume24h(0.0) {}

std::string CryptoAsset::getSymbol() const { return symbol; }
std::string CryptoAsset::getName() const { return name; }
double CryptoAsset::getCurrentPrice() const { return currentPrice; }
double CryptoAsset::getChange24h() const { return change24h; }
double CryptoAsset::getMarketCap() const { return marketCap; }
double CryptoAsset::getVolume24h() const { return volume24h; }

void CryptoAsset::setCurrentPrice(double price) { currentPrice = price; }
void CryptoAsset::setChange24h(double change) { change24h = change; }
void CryptoAsset::setMarketCap(double cap) { marketCap = cap; }
void CryptoAsset::setVolume24h(double volume) { volume24h = volume; }

double CryptoAsset::calculateVolatility() const {
    // Simple volatility calculation based on 24h change
    // TODO: Implement more sophisticated volatility calculation
    return std::abs(change24h) / 100.0;
}

json CryptoAsset::toJson() const {
    json j;
    j["symbol"] = symbol;
    j["name"] = name;
    j["currentPrice"] = currentPrice;
    j["change24h"] = change24h;
    j["marketCap"] = marketCap;
    j["volume24h"] = volume24h;
    return j;
}

CryptoAsset CryptoAsset::fromJson(const json& j) {
    CryptoAsset asset(j["symbol"], j["name"], j["currentPrice"]);
    asset.change24h = j["change24h"];
    asset.marketCap = j["marketCap"];
    asset.volume24h = j["volume24h"];
    return asset;
}
