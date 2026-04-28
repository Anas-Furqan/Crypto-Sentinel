# CryptoSentinel - Complete Setup & Run Guide

## Project Overview
CryptoSentinel is a premium cryptocurrency portfolio management system with real-time insights, risk analysis, and market sentiment tracking.

### Features
✅ Real-time portfolio tracking  
✅ AI-powered risk analysis  
✅ Market sentiment gauge  
✅ Price tracking and history  
✅ Professional dashboard UI  
✅ Backend API integration  

---

## Installation & Setup

### Prerequisites
- Node.js 18+ (for frontend)
- C++ 17 compiler (for backend)
- CMake 3.10+ (for backend)
- npm or yarn

### Backend Setup (C++ with Crow Framework)

#### 1. Navigate to backend directory
```bash
cd backend
```

#### 2. Create and configure build (if not already done)
```bash
mkdir -p build
cd build
cmake ..
```

#### 3. Build the backend
```bash
cmake --build . --config Release
```

#### 4. Run the backend server
```bash
./Release/crypto_sentinel.exe
```
**OR on Linux/Mac:**
```bash
./crypto_sentinel
```

**Backend will start on:** `http://localhost:8080`

---

### Frontend Setup (Next.js with TypeScript)

#### 1. Navigate to frontend directory
```bash
cd frontend
```

#### 2. Install dependencies
```bash
npm install
```

#### 3. Configure environment
- Copy `frontend/.env.local.example` to `frontend/.env.local`:
```bash
cp .env.local.example .env.local
```
- Required frontend variable:
```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

#### 4. Run the frontend development server
```bash
npm run dev
```

**Frontend will start on:** `http://localhost:3000`

---

## Quick Start Commands

### Terminal 1 - Start Backend
```bash
cd backend/build
cmake --build . --config Release
./Release/crypto_sentinel.exe
```

### Terminal 2 - Start Frontend
```bash
cd frontend
npm install  # First time only
npm run dev
```

### Access the Application
- **Dashboard:** http://localhost:3000
- **API Health:** http://localhost:8080/health

---

## API Key & Environment Files

Create local env files from templates:

```bash
# from repository root
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local
```

Windows PowerShell equivalent:

```powershell
Copy-Item .env.example .env
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.local.example frontend/.env.local
```

Key fields:

```
COINGECKO_API_KEY=
FEAR_GREED_API_KEY=
BINANCE_API_KEY=
```

Where to get keys:
- CoinGecko API key: [https://www.coingecko.com/en/api](https://www.coingecko.com/en/api)
- Fear & Greed API: [https://alternative.me/crypto/fear-and-greed-index/](https://alternative.me/crypto/fear-and-greed-index/) (usually no key required, keep blank unless your provider issues one)
- Binance API key (optional): [https://www.binance.com/en/my/settings/api-management](https://www.binance.com/en/my/settings/api-management)

Backend integration points for these keys:
- `backend/src/api_manager.cpp` (CoinGecko/Binance requests)
- `backend/src/sentiment_analyzer.cpp` (Fear & Greed requests)

Note: frontend must only use `NEXT_PUBLIC_*` variables and should never store secret API keys.

---

## Available API Endpoints

All endpoints are accessible from the frontend automatically:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Server health check |
| `/auth/register` | POST | Register user |
| `/auth/login` | POST | Login user |
| `/auth/profile` | GET | Fetch profile |
| `/prices` | GET | Current crypto prices |
| `/portfolio` | GET | User portfolio data |
| `/risk` | GET | Risk analysis |
| `/sentiment` | GET | Market sentiment |
| `/strategy` | GET | Strategy recommendations |
| `/alerts` | GET | User alert stream |
| `/buy` | POST | Buy crypto (live-price simulation) |
| `/sell` | POST | Sell crypto (live-price simulation) |

---

## Frontend Pages

- **Dashboard** (`/`) - Main overview with all widgets
- **Portfolio** (`/portfolio`) - Manage holdings and trades
- **Market** (`/prices`) - Real-time price tracking
- **Risk Analysis** (`/risk`) - Portfolio risk assessment
- **Settings** (`/settings`) - User preferences

---

## Tech Stack

### Backend
- **Language:** C++17
- **Framework:** Crow (HTTP web framework)
- **Libraries:** 
  - Asio (networking)
  - nlohmann/json (JSON parsing)

### Frontend
- **Framework:** Next.js 16
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Charts:** Recharts
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **Animations:** Framer Motion

---

## Development Workflow

### Making Changes to Backend
1. Edit C++ files in `backend/src/` or `backend/include/`
2. Rebuild: `cd backend/build && cmake --build . --config Release`
3. Restart backend server

### Making Changes to Frontend
1. Edit TypeScript/React files in `frontend/app/`
2. Changes auto-reload with hot module replacement (HMR)
3. No rebuild needed

---

## Troubleshooting

### Backend won't start
- Check port 8080 is not in use
- Run `cmake --build . --config Release` in `backend/build/`
- Verify all dependencies are compiled

### Frontend won't connect to backend
- Verify backend is running on port 8080
- Check `.env.local` has correct `NEXT_PUBLIC_API_URL`
- Clear browser cache and hard refresh (Ctrl+Shift+R)

### Build issues on Windows
- Use Visual Studio 2022 or higher
- Install C++ build tools
- Run CMake from Visual Studio Developer Command Prompt

---

## Production Deployment

### Backend
```bash
cd backend/build
cmake --build . --config Release
./Release/crypto_sentinel.exe
```

### Frontend
```bash
cd frontend
npm run build
npm start
```

---

## Performance Notes
- Backend auto-updates data every 30 seconds
- Frontend caches data to reduce API calls
- Charts use efficient Recharts library
- Dashboard optimized for 1920x1080 resolution

---

## Support & Documentation
For issues or questions, check the implementation in:
- Backend: `backend/src/main.cpp`
- Frontend: `frontend/app/page.tsx`

---

## Version
**CryptoSentinel v1.0.0 Premium Edition**

---
