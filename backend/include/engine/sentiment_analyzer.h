#ifndef SENTIMENT_ANALYZER_H
#define SENTIMENT_ANALYZER_H

#include <string>
#include <ctime>
#include <nlohmann/json.hpp>

using json = nlohmann::json;

enum class SentimentStatus {
    EXTREME_FEAR,
    FEAR,
    NEUTRAL,
    GREED,
    EXTREME_GREED
};

class SentimentAnalyzer {
private:
    std::string fearGreedApiUrl;
    int lastFearGreedIndex;
    time_t lastUpdateTime;
    
public:
    SentimentAnalyzer();
    
    // Fetch Fear & Greed Index from API
    json fetchFearGreedIndex();
    
    // Get current sentiment status
    SentimentStatus getSentimentStatus() const;
    
    // Get sentiment classification
    std::string getSentimentDescription(int index) const;
    
    // Get cached sentiment (without API call)
    json getCachedSentiment() const;
    
    // Check if cache needs refresh (older than 1 hour)
    bool isCacheExpired() const;
    
    // Get investment recommendation based on sentiment
    std::string getInvestmentRecommendation(SentimentStatus status);
    
    // Get complete sentiment analysis
    json performCompleteAnalysis();
};

#endif // SENTIMENT_ANALYZER_H
