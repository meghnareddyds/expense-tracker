import React, { useEffect, useState } from "react";
import { fetchTransactions, addTransaction, fetchSummary } from "./api";

function Summary({ data }) {
  return (
    <div className="summary">
      <div className="pill">Income: <span className="income">${data.total_income?.toFixed?.(2) ?? Number(data.total_income || 0).toFixed(2)}</span></div>
      <div className="pill">Expense: <span className="expense">${Math.abs(data.total_expense || 0).toFixed(2)}</span></div>
      <div className="pill">Balance: <strong>${data.net_balance?.toFixed?.(2) ?? Number(data.net_balance || 0).toFixed(2)}</strong></div>
      <div className="pill">Transactions: {data.count ?? 0}</div>
    </div>
  );
}

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ total_income: 0, total_expense: 0, net_balance: 0, count: 0 });
  const [form, setForm] = useState({ title: "", amount: "", category: "", date: "" });
  const [filters, setFilters] = useState({ category: "", type: "all", start_date: "", end_date: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    try {
      const [txs, sum] = await Promise.all([fetchTransactions(filters), fetchSummary()]);
      setTransactions(txs);
      setSummary(sum);
      setError("");
    } catch (e) {
      setError("Could not talk to the backend. Is it running on port 8000?");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [filters]);

  function onChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    const amt = parseFloat(form.amount);
    if (!form.title || isNaN(amt) || !form.category || !form.date) {
      alert("Please fill all fields. Amount must be a number.");
      return;
    }
    await addTransaction({ title: form.title, amount: amt, category: form.category, date: form.date });
    setForm({ title: "", amount: "", category: "", date: "" });
    load();
  }

  function onFilterChange(e) {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  }

  return (
    <div className="container">
      <div className="title">💸 Mini Personal Finance Tracker</div>

      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ marginTop: 0 }}>Summary</h3>
        <Summary data={summary} />
      </div>

      <div className="row">
        <div className="col">
          <div className="card">
            <h3 style={{ marginTop: 0 }}>Add Transaction</h3>
            <form onSubmit={onSubmit}>
              <div style={{ display: "grid", gap: 10 }}>
                <input name="title" placeholder="Title (e.g., Grocery)" value={form.title} onChange={onChange} />
                <input name="amount" placeholder="Amount (income + / expense - )" value={form.amount} onChange={onChange} />
                <input name="category" placeholder="Category (e.g., Food, Rent)" value={form.category} onChange={onChange} />
                <input name="date" type="date" value={form.date} onChange={onChange} />
                <button type="submit">Save</button>
              </div>
            </form>
          </div>
        </div>

        <div className="col">
          <div className="card">
            <h3 style={{ marginTop: 0 }}>Filters</h3>
            <div style={{ display: "grid", gap: 10 }}>
              <input name="category" placeholder="Category (exact match)" value={filters.category} onChange={onFilterChange} />
              <select name="type" value={filters.type} onChange={onFilterChange}>
                <option value="all">All</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <label>Start Date</label>
              <input name="start_date" type="date" value={filters.start_date} onChange={onFilterChange} />
              <label>End Date</label>
              <input name="end_date" type="date" value={filters.end_date} onChange={onFilterChange} />
              <button onClick={load}>Apply</button>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h3 style={{ marginTop: 0 }}>Transactions</h3>
        {loading ? <p>Loading...</p> : error ? <p style={{ color: "#ff7c7c" }}>{error}</p> : (
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Title</th><th>Amount</th><th>Category</th><th>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(t => (
                <tr key={t.id}>
                  <td>{t.id}</td>
                  <td>{t.title}</td>
                  <td className={t.amount >= 0 ? "income" : "expense"}>${Number(t.amount).toFixed(2)}</td>
                  <td>{t.category}</td>
                  <td>{t.date}</td>
                </tr>
              ))}
              {transactions.length === 0 && <tr><td colSpan="5">No data yet. Add something above! 🙂</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
