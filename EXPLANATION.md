# CryptoSentinel Cheat Sheet

## Big Picture

- Think of the **frontend** as the **shop counter** and the **backend** as the **kitchen**.
- When you click a button in the app, the frontend sends a request to the backend.
- The backend does the heavy work: it checks prices, updates the portfolio, saves data, and sends back fresh results.
- The frontend then shows the updated data in a nice dashboard.

### Easy analogy

- **Frontend** = the screen you use.
- **Backend** = the brain that calculates everything.
- **FileHandler** = the notebook where the app remembers users, portfolios, and trades.
- **API Manager** = the internet helper that fetches live crypto prices.

---

## File-wise Breakdown

## C++ Source Files

### `backend/src/main.cpp`
- **What it does:** This is the main traffic controller. It creates all API routes like `/buy`, `/sell`, `/portfolio`, `/risk`, `/strategy`, and `/sentiment`.
- **Why it is important:** This file connects the frontend buttons to the backend logic.
- **Frontend trigger:** **Buy** button, **Sell** button, dashboard refresh, **Run Risk Analysis**, strategy page, and sentiment/risk widgets.

### `backend/src/api_manager.cpp`
- **What it does:** Gets live coin prices and market data from CoinGecko, with demo fallback if the API fails.
- **Why it is important:** This is what keeps prices real-time instead of hardcoded.
- **Frontend trigger:** Dashboard price cards, portfolio value refresh, buy/sell execution, risk and strategy pages.

### `backend/src/portfolio.cpp`
- **What it does:** Stores holdings, buy/sell updates, portfolio value, profit/loss, and transaction history.
- **Why it is important:** This is the core of the portfolio manager.
- **Frontend trigger:** **Buy Bitcoin**, **Sell**, portfolio page holdings table, transaction history, dashboard balance.

### `backend/src/risk_analyzer.cpp`
- **What it does:** Calculates concentration risk, volatility risk, diversification, overall risk, and recommendations.
- **Why it is important:** This powers the risk analysis page and the risk widget.
- **Frontend trigger:** **Run Risk Analysis** button, risk page auto-refresh, risk widget on dashboard.

### `backend/src/strategy_engine.cpp`
- **What it does:** Generates conservative/moderate/aggressive allocation suggestions and simulates future investments.
- **Why it is important:** This gives the app its strategy brain.
- **Frontend trigger:** Strategy page buttons, **Run Strategy Simulator** button, dashboard strategy summary.

### `backend/src/sentiment_analyzer.cpp`
- **What it does:** Fetches Fear & Greed sentiment and turns it into a simple recommendation.
- **Why it is important:** This gives the app a market mood indicator.
- **Frontend trigger:** Sentiment widget on dashboard and sentiment page.

### `backend/src/alert_manager.cpp`
- **What it does:** Creates and stores alerts like high risk warnings, price crashes, and sentiment alerts.
- **Why it is important:** This tells the user when something important happens.
- **Frontend trigger:** Alerts counter on dashboard and alert-related UI blocks.

### `backend/src/file_handler.cpp`
- **What it does:** Saves and loads users, portfolios, transactions, and config from JSON files.
- **Why it is important:** This is how the app remembers data after restart.
- **Frontend trigger:** Indirectly triggered by login, buy/sell, portfolio load, and dashboard refresh.

### `backend/src/user.cpp`
- **What it does:** Represents a user and handles user details like username, email, password, and risk preference.
- **Why it is important:** This is the user identity part of the app.
- **Frontend trigger:** Register page and login/auth flow.

### `backend/src/transaction.cpp`
- **What it does:** Represents one trade, like a buy or sell, with time, amount, price, and total value.
- **Why it is important:** This is the trade receipt.
- **Frontend trigger:** **Buy** and **Sell** actions on the portfolio page.

### `backend/src/crypto_asset.cpp`
- **What it does:** Represents a crypto coin with symbol, name, price, market cap, and 24h change.
- **Why it is important:** It makes coin data easy to store and pass around.
- **Frontend trigger:** Price cards, charts, and any place that shows individual coin info.

---

## C++ Header Files

### `backend/include/api/api_manager.h`
- **What it does:** Declares the API helper class that fetches prices and market data.
- **Why it is important:** It tells the rest of the backend what the API manager can do.
- **Frontend trigger:** Any screen that needs live prices or market data.

### `backend/include/models/portfolio.h`
- **What it does:** Declares the Portfolio class with private holdings, transaction history, and value data.
- **Why it is important:** This is the main portfolio structure.
- **Frontend trigger:** Portfolio page, dashboard balance, buy/sell actions.

### `backend/include/models/user.h`
- **What it does:** Declares the User class with private user fields and password handling.
- **Why it is important:** This keeps user data organized.
- **Frontend trigger:** Register and login screens.

### `backend/include/models/transaction.h`
- **What it does:** Declares the Transaction class for buy/sell records.
- **Why it is important:** This is the object used to store each trade cleanly.
- **Frontend trigger:** Portfolio trade history and transaction files.

### `backend/include/models/crypto_asset.h`
- **What it does:** Declares the CryptoAsset class for coin price and metadata.
- **Why it is important:** It helps package asset information in one place.
- **Frontend trigger:** Price widgets, charts, and market data sections.

### `backend/include/engine/risk_analyzer.h`
- **What it does:** Declares the RiskAnalyzer class and all risk-related methods.
- **Why it is important:** It keeps risk logic separate from UI and other features.
- **Frontend trigger:** Risk page and dashboard risk widget.

### `backend/include/engine/strategy_engine.h`
- **What it does:** Declares the StrategyEngine class, strategy modes, and recommendation methods.
- **Why it is important:** It defines the strategy/simulation engine in one place.
- **Frontend trigger:** Strategy simulator page and strategy summary cards.

### `backend/include/engine/sentiment_analyzer.h`
- **What it does:** Declares the SentimentAnalyzer class for Fear & Greed data and recommendation generation.
- **Why it is important:** It separates sentiment logic from the dashboard UI.
- **Frontend trigger:** Sentiment widget and sentiment page.

### `backend/include/engine/alert_manager.h`
- **What it does:** Declares alert types, alert structure, and alert management functions.
- **Why it is important:** It keeps notifications structured.
- **Frontend trigger:** Alerts count and warnings in the dashboard.

### `backend/include/utils/file_handler.h`
- **What it does:** Declares file save/load methods for users, portfolios, transactions, and config.
- **Why it is important:** It is the persistence layer of the app.
- **Frontend trigger:** Login, buy/sell, portfolio refresh, and data reloads.

---

## The OOP Secret Sauce

### 1) **Encapsulation**
- **Where to point your mouse:** `backend/include/models/portfolio.h`, `backend/include/models/user.h`, `backend/include/models/crypto_asset.h`, `backend/include/engine/risk_analyzer.h`.
- **What to say:** "The important data is kept private inside the class, and the app can only touch it through public functions."
- **Good function names to mention:** `Portfolio::buyCrypto`, `Portfolio::sellCrypto`, `User::setPassword`, `CryptoAsset::setCurrentPrice`.

### 2) **Abstraction**
- **Where to point your mouse:** `backend/src/api_manager.cpp`, `backend/src/file_handler.cpp`, `backend/src/risk_analyzer.cpp`, `backend/src/strategy_engine.cpp`, `backend/src/sentiment_analyzer.cpp`.
- **What to say:** "The code hides the complicated steps and gives simple functions like 'get price', 'save file', or 'analyze risk'."
- **Good function names to mention:** `ApiManager::fetchCoinPrices`, `FileHandler::savePortfolio`, `RiskAnalyzer::performCompleteAnalysis`, `StrategyEngine::generateRecommendations`, `SentimentAnalyzer::performCompleteAnalysis`.

### 3) **Modularity**
- **Where to point your mouse:** `backend/src/main.cpp` plus each separate `.cpp` file.
- **What to say:** "Each file has one job: one for routing, one for prices, one for risk, one for strategy, one for files."
- **Good function names to mention:** `main()`, `Portfolio::toJson`, `AlertManager::createRiskWarningAlert`, `FileHandler::appendTransaction`.

---

## OOP Concepts at a Glance

### **Encapsulation**
- **Used in:** `Portfolio`, `User`, `Transaction`, `CryptoAsset`, `RiskAnalyzer`, `StrategyEngine`, `SentimentAnalyzer`, `AlertManager`, `FileHandler`.
- **How to explain:** "Private data is hidden inside classes, and only public methods can change it."
- **Point to:** private members in [portfolio.h](backend/include/models/portfolio.h), [user.h](backend/include/models/user.h), [transaction.h](backend/include/models/transaction.h), and [crypto_asset.h](backend/include/models/crypto_asset.h).

### **Abstraction**
- **Used in:** helper classes like `ApiManager`, `FileHandler`, `RiskAnalyzer`, `StrategyEngine`, and `SentimentAnalyzer`.
- **How to explain:** "The code gives simple functions like buy, sell, analyze risk, and save file, while hiding the hard work inside."
- **Point to:** `ApiManager::fetchCoinPrices`, `RiskAnalyzer::performCompleteAnalysis`, `StrategyEngine::simulateInvestment`, `FileHandler::savePortfolio`.

### **Modularity**
- **Used in:** separate files for routes, price fetching, portfolio logic, risk logic, strategy logic, sentiment logic, alerts, and file storage.
- **How to explain:** "Each file has one responsibility, so the project is easier to maintain and test."
- **Point to:** [main.cpp](backend/src/main.cpp), [portfolio.cpp](backend/src/portfolio.cpp), [risk_analyzer.cpp](backend/src/risk_analyzer.cpp), [strategy_engine.cpp](backend/src/strategy_engine.cpp), [file_handler.cpp](backend/src/file_handler.cpp).

### **Composition**
- **Used in:** `Portfolio` contains a list of `Transaction` objects, and the app combines `ApiManager`, `RiskAnalyzer`, `StrategyEngine`, and `AlertManager` inside `main.cpp`.
- **How to explain:** "One object is built using other objects instead of forcing everything into one giant class."
- **Point to:** `Portfolio::transactionHistory` in [portfolio.h](backend/include/models/portfolio.h) and `g_apiManager`, `g_riskAnalyzer`, `g_strategyEngine`, `g_alertManager` in [main.cpp](backend/src/main.cpp).

### **Inheritance**
- **Used in:** **Not really used in this project.**
- **How to explain if asked:** "This project does not rely on class inheritance or base/derived class hierarchies. It mainly uses separate classes and composition instead."
- **Smart follow-up:** "If the teacher insists on inheritance, I can honestly say we intentionally kept the design simple instead of making a deep inheritance tree."

### **Polymorphism**
- **Used in:** **Not in classic C++ inheritance form.**
- **Closest example:** behavior changes using `enum class` + `switch`, such as `InvestmentStrategy`, `RiskLevel`, `SentimentStatus`, and `TransactionType`.
- **How to explain if asked:** "We do not have virtual functions or derived classes here, but we do have one function behaving differently based on different strategy/risk types."

---

## Backend Logic and Technicalities (Algorithm Behind It)

### 1) How **Risk Analyzer** calculates risk

- File: `backend/src/risk_analyzer.cpp`
- Core method: `RiskAnalyzer::performCompleteAnalysis(...)`

It combines 3 scores:

1. **Concentration Risk**
	 - Uses portfolio weights and a Herfindahl-style score.
	 - Idea: if one coin dominates, risk is high.
	 - Formula idea: $H = \sum w_i^2$, then normalized to 0-1.

2. **Volatility Risk**
	 - Takes per-asset volatility values and averages them.
	 - Formula idea: $\text{avgVol} = \frac{\sum vol_i}{N}$, then scaled to 0-1.

3. **Diversification Score**
	 - More different assets means better diversification.
	 - Current rule: `min(1.0, holdings_count / 10.0)`.

Then overall risk score:

- In `calculateOverallRisk(...)`:
	- $riskScore = 0.4 \times concentration + 0.4 \times volatility - 0.2 \times diversification$
	- Low/Medium/High bucket is assigned from this score.

### 2) Where volatility numbers come from (real-time part)

- File: `backend/src/main.cpp` inside `/risk` route.
- It reads live 24h market change and creates volatility proxy:
	- `changePct = abs(calculate24hChange(symbol))`
	- `volProxy = clamp(changePct / 100, 0.01, 0.35)`
- This removes hardcoded static volatility and ties risk to live market movement.

### 3) Multi-horizon prediction algorithm (1d / 7d / 30d)

- File: `backend/src/main.cpp` in `/risk` route.
- For each asset and horizon days in `{1,7,30}`:
	- scale by time using square-root rule: $scale = \sqrt{days}$
	- one-sigma move: $m_1 = vol \times scale$
	- two-sigma move: $m_2 = 1.96 \times m_1$
- Then build confidence bands:
	- **68% band (oneSigma)**: price/value low-high using $1 \pm m_1$
	- **95% band (twoSigma)**: price/value low-high using $1 \pm m_2$

### 4) Buy/Sell backend logic (technical)

- File: `backend/src/main.cpp`, routes `/buy` and `/sell`.

When Buy happens:

1. Validate payload (`coin`, `amount`).
2. Fetch live price from `ApiManager`.
3. Update holdings through `Portfolio::buyCrypto(...)`.
4. Save portfolio JSON using `FileHandler::savePortfolio(...)`.
5. Append transaction history using `FileHandler::appendTransaction(...)`.
6. Return success response to frontend.

### 5) Strategy simulation logic

- File: `backend/src/strategy_engine.cpp`, function `simulateInvestment(...)`.
- It computes:
	- estimated units = investment / current price
	- portfolio value before and after
	- projected allocation after adding the new investment
- This gives "what-if" analysis before actual buying.

### 6) Price API safety/fallback logic

- File: `backend/src/api_manager.cpp`
- Technical handling:
	- Uses curl with max timeout.
	- Tries to parse CoinGecko response.
	- If API fails, uses cached price or demo fallback price.
- This is why frontend still works even if external API is slow.

---

## Trap Questions and Smart Simple Answers

### 1) "Why is the portfolio value not hardcoded?"
- **Answer:** "Because the backend recalculates it using live prices from the API and the current holdings. That keeps the dashboard accurate in real time."

### 2) "Why do you need both `Portfolio` and `Transaction` classes?"
- **Answer:** "`Portfolio` stores the overall account, while `Transaction` stores each buy or sell separately. That separation keeps the design clean and easier to manage."

### 3) "What happens if the price API fails?"
- **Answer:** "The app uses fallback demo prices and cached values, so the system still works even if the external API is slow or unavailable."

### 4) "Why is the risk page not just one static score?"
- **Answer:** "Because the backend now calculates risk from real holdings, live market prices, and live volatility proxies, so the score changes with the market."

### 5) "Why did you split code into many files?"
- **Answer:** "To follow modular design. Each file has one responsibility, so the project is easier to read, test, and extend."

---

## Execution Flow: When I Click **Buy Bitcoin**

1. I click the **Buy** button on the portfolio page.
2. The frontend sends a `POST /buy` request with the coin name and amount.
3. The backend fetches the live BTC price.
4. The backend updates the portfolio holdings and creates a transaction record.
5. The backend saves the updated portfolio and transaction history into JSON files.
6. The frontend reloads the portfolio data and shows the new balance, holdings, and trade history.

---

## Quick Presenter Notes

- If the teacher says **"Show me OOP"**, point to the headers first.
- If the teacher says **"How does buy work?"**, start from `frontend/app/portfolio/page.tsx` and then go to `backend/src/main.cpp`.
- If the teacher says **"Where is the real logic?"**, point to `portfolio.cpp`, `risk_analyzer.cpp`, `strategy_engine.cpp`, and `file_handler.cpp`.
- If the teacher says **"Where is data stored?"**, point to `backend/src/file_handler.cpp`.
- If the teacher says **"What makes it real-time?"**, point to `api_manager.cpp` and `main.cpp`.
