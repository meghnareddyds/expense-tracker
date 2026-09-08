const BASE = "http://127.0.0.1:8000";

export async function fetchTransactions(filters = {}) {
  const params = new URLSearchParams();
  if (filters.category) params.set("category", filters.category);
  if (filters.type && filters.type !== "all") params.set("type", filters.type);
  if (filters.start_date) params.set("start_date", filters.start_date);
  if (filters.end_date) params.set("end_date", filters.end_date);
  const res = await fetch(`${BASE}/transactions?${params.toString()}`);
  return res.json();
}

export async function addTransaction(tx) {
  const res = await fetch(`${BASE}/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tx),
  });
  return res.json();
}

export async function fetchSummary() {
  const res = await fetch(`${BASE}/summary`);
  return res.json();
}
