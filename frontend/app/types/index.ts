import type React from "react"

export interface PortfolioData {
  totalValue: number
  profitLoss: number
  holdings: Record<string, number>
}

export interface RiskData {
  riskLevel: string
  concentration: number
  diversification: number
  recommendations?: string[]
}

export interface SentimentData {
  fearGreedIndex: number
  status: string
  recommendation?: string
}

export interface PriceData {
  [key: string]: number
}

export interface Alert {
  id: string
  type: 'price' | 'risk' | 'sentiment'
  title: string
  message: string
  timestamp: number
}
