#include "engine/sentiment_analyzer.h"
#include <ctime>

SentimentAnalyzer::SentimentAnalyzer() 
    : fearGreedApiUrl("https://api.alternative.me/fng/"),
      lastFearGreedIndex(50), lastUpdateTime(0) {}

json SentimentAnalyzer::fetchFearGreedIndex() {
    json sentiment;
    
    // TODO: Implement Fear & Greed API integration using cURL
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

std::string SentimentAnalyzer::getSentimentDescription(int index) {
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
