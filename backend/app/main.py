# backend/app/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
import yfinance as yf
import numpy as np
from scipy.optimize import minimize

app = FastAPI(title="AI Wealth Co-Pilot API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class StockAllocation(BaseModel):
    ticker: str
    shares: float

class RebalanceRequest(BaseModel):
    holdings: List[StockAllocation]
    risk_profile: str  # Conservative, Moderate, Aggressive

@app.get("/")
def read_root():
    return {"status": "healthy", "service": "AI Wealth Co-Pilot Engine"}

@app.post("/api/optimize")
def optimize_portfolio(request: RebalanceRequest):
    if not request.holdings:
        raise HTTPException(status_code=400, detail="Holdings list cannot be empty")
        
    tickers = [h.ticker.upper() for h in request.holdings]
    num_assets = len(tickers)
    
    if num_assets == 1:
        return {"status": "success", "recommended_weights": {tickers[0]: 1.0}}
        
    try:
        # 1. Download historical data
        data = yf.download(tickers, period="3y")['Close']
        
        # Calculate annualized returns and covariance matrix
        returns = data.pct_change().dropna()
        mean_returns = returns.mean() * 252
        cov_matrix = returns.cov() * 252
        
        # 2. Define optimization functions for Scipy
        def portfolio_performance(weights):
            p_return = np.sum(mean_returns * weights)
            p_volatility = np.sqrt(np.dot(weights.T, np.dot(cov_matrix, weights)))
            return p_return, p_volatility

        # Objective function to MINIMIZE
        if request.risk_profile == "Conservative":
            # Minimize volatility directly
            def objective(weights):
                return portfolio_performance(weights)[1]
        else:
            # Maximize Sharpe Ratio (minimize negative Sharpe) assuming risk-free rate = 0
            def objective(weights):
                p_return, p_vol = portfolio_performance(weights)
                return -p_return / (p_vol + 1e-6)

        # 3. Setup constraints (Weights must sum to 1.0)
        constraints = ({'type': 'eq', 'fun': lambda x: np.sum(x) - 1.0})
        # Bounds: Long-only portfolio (weights between 0% and 100%)
        bounds = tuple((0.0, 1.0) for _ in range(num_assets))
        # Initial guess (equal distribution)
        initial_guess = num_assets * [1.0 / num_assets]

        # 4. Run optimization
        result = minimize(objective, initial_guess, method='SLSQP', bounds=bounds, constraints=constraints)
        
        if not result.success:
            raise Exception("Mathematical optimization convergence failed.")

        optimized_weights = result.x
        
        return {
            "status": "success",
            "risk_profile_applied": request.risk_profile,
            "recommended_weights": {tickers[i]: round(float(optimized_weights[i]), 4) for i in range(num_assets)}
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Optimization failed: {str(e)}")