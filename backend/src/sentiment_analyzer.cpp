#include "engine/sentiment_analyzer.h"
#include <array>
#include <cstdio>
#include <cstdlib>
#include <ctime>

namespace {
std::string getEnvVar(const std::string& key, const std::string& fallback = "") {
    const char* value = std::getenv(key.c_str());
    if (!value) return fallback;
    return value;
}

std::string shellEscape(const std::string& raw) {
    std::string escaped;
    for (char ch : raw) {
        if (ch == '\"') escaped += "\\\"";
        else escaped += ch;
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
} // namespace

SentimentAnalyzer::SentimentAnalyzer() 
    : fearGreedApiUrl(getEnvVar("FEAR_GREED_API_URL", "https://api.alternative.me/fng/")),
      lastFearGreedIndex(50), lastUpdateTime(0) {}

json SentimentAnalyzer::fetchFearGreedIndex() {
    json sentiment;
    const std::string apiKey = getEnvVar("FEAR_GREED_API_KEY");
    const std::string header = apiKey.empty() ? "" : "x-api-key: " + apiKey;
    const std::string raw = runCurlGet(fearGreedApiUrl + "?limit=1", header);

    try {
        const json parsed = json::parse(raw);
        if (parsed.contains("data") && parsed["data"].is_array() && !parsed["data"].empty()) {
            const auto& point = parsed["data"][0];
            if (point.contains("value")) {
                lastFearGreedIndex = std::stoi(point.value("value", "50"));
            }
        }
    } catch (...) {
    }

    sentiment["fearGreedIndex"] = lastFearGreedIndex;
    sentiment["status"] = getSentimentDescription(lastFearGreedIndex);
    sentiment["timestamp"] = (long long)std::time(nullptr);
    
    lastUpdateTime = std::time(nullptr);
    
    return sentiment;
}

SentimentStatus SentimentAnalyzer::getSentimentStatus() const {
    if (lastFearGreedIndex < 25) return SentimentStatus::EXTREME_FEAR;
    if (lastFearGreedIndex < 45) return SentimentStatus::FEAR;
    if (lastFearGreedIndex < 55) return SentimentStatus::NEUTRAL;
    if (lastFearGreedIndex < 75) return SentimentStatus::GREED;
    return SentimentStatus::EXTREME_GREED;
}

std::string SentimentAnalyzer::getSentimentDescription(int index) const {
    if (index < 25) return "Extreme Fear";
    if (index < 45) return "Fear";
    if (index < 55) return "Neutral";
    if (index < 75) return "Greed";
    return "Extreme Greed";
}

json SentimentAnalyzer::getCachedSentiment() const {
    json sentiment;
    sentiment["fearGreedIndex"] = lastFearGreedIndex;
    sentiment["status"] = getSentimentDescription(lastFearGreedIndex);
    sentiment["timestamp"] = (long long)lastUpdateTime;
    sentiment["isCached"] = true;
    return sentiment;
}

bool SentimentAnalyzer::isCacheExpired() const {
    time_t now = std::time(nullptr);
    return (now - lastUpdateTime) > 3600; // 1 hour
}

std::string SentimentAnalyzer::getInvestmentRecommendation(SentimentStatus status) {
    switch(status) {
        case SentimentStatus::EXTREME_FEAR:
            return "Consider buying - potential buying opportunity";
        case SentimentStatus::FEAR:
            return "Market is cautious - proceed with caution";
        case SentimentStatus::NEUTRAL:
            return "Market is neutral - balanced approach recommended";
        case SentimentStatus::GREED:
            return "Market is greedy - consider taking profits";
        case SentimentStatus::EXTREME_GREED:
            return "Extreme greed - high risk of correction";
        default:
            return "Monitor market sentiment";
    }
}

json SentimentAnalyzer::performCompleteAnalysis() {
    json analysis;
    
    if (isCacheExpired()) {
        analysis = fetchFearGreedIndex();
    } else {
        analysis = getCachedSentiment();
    }
    
    SentimentStatus status = getSentimentStatus();
    analysis["recommendation"] = getInvestmentRecommendation(status);
    
    return analysis;
}
