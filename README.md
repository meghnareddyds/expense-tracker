# Expense Tracker

A simple app to track income and expenses. Built with React, FastAPI, and Python.

## Scope

This project is for basic personal finance tracking. You can record transactions and see your total income, expenses, and remaining balance.

Data is stored in memory, so entries are cleared when the backend restarts. There is no database or login system yet.

## Features

- Add transactions with a title, amount, category, and date.
- Record income using positive amounts and expenses using negative amounts.
- View transactions and filter by category, type, or date range.
- See total income, total expenses, and net balance.

## Run Locally

You’ll need Python and Node.js installed. These commands are for Windows PowerShell.

### Backend

Open a terminal in the project folder:

```powershell
cd C:\expensetracker
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r backend\requirements.txt
.\.venv\Scripts\python.exe -m uvicorn main:app --app-dir backend --reload --port 8000
```

Skip creating `.venv` if it already exists. Run these commands from the project root, not the `backend` folder.

API docs: http://127.0.0.1:8000/docs

### Frontend

Open a second terminal:

```powershell
cd C:\expensetracker\frontend
npm install
npm run dev -- --port 5173 --strictPort
```

Open http://localhost:5173 to use the app.

## Example Entries

| Title | Amount | Category | Date |
| --- | ---: | --- | --- |
| Salary | 3000 | Salary | 2026-07-01 |
| Grocery | -100 | Food | 2026-07-02 |
| Rent | -500 | Rent | 2026-07-05 |

Use negative amounts for money spent. For example, enter `-500` for rent, not `500`.
