#include "models/transaction.h"

Transaction::Transaction() : transactionId(""), userId(""), symbol(""), 
                            type(TransactionType::BUY), quantity(0.0),
                            pricePerUnit(0.0), totalValue(0.0), notes("") {
    timestamp = std::time(nullptr);
}

Transaction::Transaction(const std::string& userId, const std::string& symbol,
                        TransactionType type, double quantity, double pricePerUnit)
    : userId(userId), symbol(symbol), type(type), quantity(quantity),
      pricePerUnit(pricePerUnit) {
    timestamp = std::time(nullptr);
    totalValue = quantity * pricePerUnit;
    transactionId = "txn_" + std::to_string(timestamp) + "_" + symbol;
}

std::string Transaction::getTransactionId() const { return transactionId; }
std::string Transaction::getUserId() const { return userId; }
std::string Transaction::getSymbol() const { return symbol; }
TransactionType Transaction::getType() const { return type; }
double Transaction::getQuantity() const { return quantity; }
double Transaction::getPricePerUnit() const { return pricePerUnit; }
double Transaction::getTotalValue() const { return totalValue; }
time_t Transaction::getTimestamp() const { return timestamp; }

void Transaction::setNotes(const std::string& n) { notes = n; }

double Transaction::calculateProfitLoss(double currentPrice) const {
    double currentValue = quantity * currentPrice;
    return currentValue - totalValue;
}

json Transaction::toJson() const {
    json j;
    j["transactionId"] = transactionId;
    j["userId"] = userId;
    j["symbol"] = symbol;
    j["type"] = (type == TransactionType::BUY) ? "BUY" : "SELL";
    j["quantity"] = quantity;
    j["pricePerUnit"] = pricePerUnit;
    j["totalValue"] = totalValue;
    j["timestamp"] = (long long)timestamp;
    j["notes"] = notes;
    return j;
}

Transaction Transaction::fromJson(const json& j) {
    TransactionType txnType = (j["type"] == "BUY") ? TransactionType::BUY : TransactionType::SELL;
    Transaction txn(j["userId"], j["symbol"], txnType, j["quantity"], j["pricePerUnit"]);
    txn.transactionId = j["transactionId"];
    txn.notes = j["notes"];
    return txn;
}
