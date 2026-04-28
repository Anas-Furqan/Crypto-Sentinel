# CryptoSentinel

AI-powered crypto portfolio and risk intelligence system.

## Project Overview

CryptoSentinel is a full-stack dashboard for monitoring a crypto portfolio, executing buy/sell orders, analyzing risk, reviewing market sentiment, and simulating strategy decisions. It combines a C++ backend with a Next.js frontend and stores user, portfolio, and transaction data in JSON files.

## Tech Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS, Axios, Recharts, Framer Motion
- Backend: C++17, Crow, ASIO, nlohmann::json
- Persistence: File-based JSON storage under `data/`
- Runtime data: portfolio snapshots, transactions, users, alerts

## Core Features

- Authentication and session-based access
- Live dashboard with portfolio value, holdings, alerts, risk, sentiment, and strategy summary
- Buy and sell orders for supported crypto assets
- Portfolio tracking with transaction history
- Risk analysis for concentration, volatility, and diversification
- Sentiment insights and strategy simulation
- Responsive UI with charts and cards for quick portfolio review

## Backend Modules

- `backend/src/main.cpp` exposes the REST API routes
- `backend/src/portfolio.cpp` manages holdings, valuation, and transaction history
- `backend/src/file_handler.cpp` saves and loads users, portfolios, and transactions
- `backend/src/risk_analyzer.cpp` calculates portfolio risk metrics
- `backend/src/sentiment_analyzer.cpp` generates market sentiment summaries
- `backend/src/strategy_engine.cpp` provides strategy recommendations and simulations
- `backend/src/alert_manager.cpp` tracks alert counts and notifications

## Frontend Modules

- `frontend/app/page.tsx` renders the main dashboard
- `frontend/app/portfolio/page.tsx` handles portfolio and trade execution
- `frontend/app/strategy/page.tsx` drives strategy simulation
- `frontend/app/risk/page.tsx` shows risk analysis
- `frontend/app/settings/page.tsx` manages user settings
- `frontend/app/lib/api.ts` centralizes API calls and auth headers

## Functional Requirements

- User can register, log in, and access protected dashboard views
- User can view live crypto prices and portfolio allocation
- User can place buy and sell orders
- User can inspect transaction history after each trade
- User can view risk, sentiment, and strategy guidance
- User can see alert counts and portfolio health indicators

## Non-Functional Requirements

- Fast UI updates with periodic dashboard refresh
- CORS-enabled backend communication between frontend and API
- Persistent data across runs using local JSON files
- Modular design with clear separation between API, analysis, and UI layers

## Architecture & Flowchart

### User Journey Flowchart

```
                            START
                              │
                              ▼
                  ┌─────────────────────┐
                  │  User Visits App    │
                  │ (localhost:3000)    │
                  └────────┬────────────┘
                           │
                           ▼
                      ┌────────────┐
                      │ Logged in? │
                      └─┬──────┬───┘
                        │ No   │ Yes
                        │      │
                   ┌────▼──┐   │
                   │ Auth  │   │
                   │ Page  │   │
                   └────┬──┘   │
                        │      │
          ┌─────────────┼──────┼─────────────┐
          │             │      │             │
          ▼             ▼      ▼             ▼
      [Register]  [Login] [Dashboard]   [Routes]
          │             │      │             │
          │             ▼      ▼             │
          │          ┌──────────────────┐   │
          │          │ Dashboard (/)    │   │
          └─────────►│ ├─ Portfolio     │   │
                     │ ├─ Strategy Rec. │   │
                     │ ├─ Risk Level    │   │
                     │ └─ Sentiment     │   │
                     └──────────────────┘   │
                            │               │
            ┌───────────────┼───────────────┼─────────┐
            │               │               │         │
            ▼               ▼               ▼         ▼
        Portfolio      Strategy         Risk      Settings
         Page          Page            Page       Page
            │               │               │         │
            ▼               ▼               ▼         ▼
        [Buy/Sell]    [Simulate]      [Analyze]  [Profile]
            │               │               │         │
            └───────────────┴───────────────┴─────────┘
                            │
                            ▼
                   ┌─────────────────┐
                   │ Backend API     │
                   │ (Port 8080)     │
                   └────────┬────────┘
                            │
            ┌───────────────┼───────────────┐
            │               │               │
            ▼               ▼               ▼
        Portfolio        Risk          Strategy
        Engine         Analyzer         Engine
            │               │               │
            └───────────────┴───────────────┘
                            │
                            ▼
                   ┌─────────────────┐
                   │   Data Layer    │
                   │  (JSON Files)   │
                   └─────────────────┘
```

## System Architecture

Frontend requests data from the backend REST API. The backend loads portfolio data from disk, fetches live prices, calculates valuations and risk metrics, and returns JSON responses to the UI. Buy/sell actions update the portfolio and append transaction records.

## Testing and Validation

- Verified backend health and API routes
- Verified buy/sell persistence through JSON transaction files
- Verified portfolio responses include holdings, allocation, and transaction history
- Verified frontend API integration and auth header handling

## Results

The project now behaves as a functional crypto intelligence dashboard rather than a static UI gallery. Users can log in, review their portfolio, execute trades, and observe updated risk and sentiment outputs from the backend.

## Conclusion

CryptoSentinel demonstrates a practical full-stack crypto management workflow with a C++ API layer, a modern web frontend, and local persistence for portfolio operations. It is suitable as a university project or an extendable base for a more advanced trading assistant.

## Team

- Muhammad Anas Furqan - 25K-0577

## Supervisor

Miss Fareeha Jabeen
