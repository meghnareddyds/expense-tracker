from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from datetime import date

app = FastAPI(title="Mini Personal Finance Tracker API")

# Allow calls from the Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TransactionIn(BaseModel):
    title: str = Field(..., example="Grocery Shopping")
    amount: float = Field(..., example=-45.50, description="Use positive for income and negative for expense")
    category: str = Field(..., example="Food")
    date: date = Field(..., example="2025-08-07")

class Transaction(TransactionIn):
    id: int

# In-memory "database"
_db: List[Transaction] = []
_next_id = 1

def _gen_id() -> int:
    global _next_id
    i = _next_id
    _next_id += 1
    return i

@app.get("/", tags=["meta"])
def read_root():
    return {"message": "Mini Finance Tracker API running", "endpoints": ["/transactions", "/summary"]}

@app.post("/transactions", response_model=Transaction, tags=["transactions"])
def add_transaction(tx: TransactionIn):
    """Add a new income/expense entry. Positive amount = income; negative = expense."""
    new_tx = Transaction(id=_gen_id(), **tx.dict())
    _db.append(new_tx)
    return new_tx

@app.get("/transactions", response_model=List[Transaction], tags=["transactions"])
def get_transactions(
    category: Optional[str] = Query(default=None, description="Filter by exact category"),
    type: Optional[Literal["income", "expense"]] = Query(default=None, description="Filter by type"),
    start_date: Optional[date] = Query(default=None, description="YYYY-MM-DD"),
    end_date: Optional[date] = Query(default=None, description="YYYY-MM-DD"),
):
    """Return all transactions, with optional filters."""
    result = _db
    if category:
        result = [t for t in result if t.category.lower() == category.lower()]
    if type == "income":
        result = [t for t in result if t.amount > 0]
    elif type == "expense":
        result = [t for t in result if t.amount < 0]
    if start_date:
        result = [t for t in result if t.date >= start_date]
    if end_date:
        result = [t for t in result if t.date <= end_date]
    return result

@app.get("/summary", tags=["summary"])
def get_summary():
    total_income = sum(t.amount for t in _db if t.amount > 0)
    total_expense = sum(t.amount for t in _db if t.amount < 0)
    net_balance = total_income + total_expense
    return {
        "total_income": round(total_income, 2),
        "total_expense": round(total_expense, 2),
        "net_balance": round(net_balance, 2),
        "count": len(_db),
    }
