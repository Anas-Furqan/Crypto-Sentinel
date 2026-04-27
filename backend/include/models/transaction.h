#ifndef TRANSACTION_H
#define TRANSACTION_H

#include <string>
#include <ctime>
#include <nlohmann/json.hpp>

using json = nlohmann::json;

enum class TransactionType {
    BUY,
    SELL
};

class Transaction {
private:
    std::string transactionId;
    std::string userId;
    std::string symbol;           // BTC, ETH, etc.
    TransactionType type;         // BUY or SELL
    double quantity;              // Amount of crypto
    double pricePerUnit;          // Price per unit at time of transaction
    double totalValue;            // quantity * pricePerUnit
    time_t timestamp;
    std::string notes;            // Optional notes
    
public:
    Transaction();
    Transaction(const std::string& userId, const std::string& symbol, 
                TransactionType type, double quantity, double pricePerUnit);
    
    // Getters
    std::string getTransactionId() const;
    std::string getUserId() const;
    std::string getSymbol() const;
    TransactionType getType() const;
    double getQuantity() const;
    double getPricePerUnit() const;
    double getTotalValue() const;
    time_t getTimestamp() const;
    
    // Setters
    void setNotes(const std::string& n);
    
    // Calculate profit/loss for this transaction
    double calculateProfitLoss(double currentPrice) const;
    
    // Serialization
    json toJson() const;
    static Transaction fromJson(const json& j);
};

#endif // TRANSACTION_H
