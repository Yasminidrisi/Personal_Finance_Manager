import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import axios from "axios";

const Dashboard = () => {
  const [transactions, setTransactions] = useState([
    { id: 1, date: "2024-02-01", category: "Groceries", amount: 50, type: "expense" },
    { id: 2, date: "2024-02-03", category: "Salary", amount: 500, type: "income" },
  ]);

  //changes i made
  
    useEffect(() => {
      axios.get("http://localhost:5000/api/transactions")
        .then((res) => setTransactions(res.data))
        .catch((err) => console.error("Error fetching transactions:", err));
    }, []);


  
  const [formData, setFormData] = useState({ date: "", category: "", amount: "", type: "expense" });
  const [filter, setFilter] = useState({ type: "all", dateRange: "all" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTransactions([...transactions, { id: Date.now(), ...formData, amount: Number(formData.amount) }]);
    setFormData({ date: "", category: "", amount: "", type: "expense" });
  };

  const handleDelete = (id) => {
    setTransactions(transactions.filter((transaction) => transaction.id !== id));
  };

  const handleEdit = (id) => {
    const transactionToEdit = transactions.find((tx) => tx.id === id);
    setFormData(transactionToEdit);
    setTransactions(transactions.filter((tx) => tx.id !== id));
  };

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const resetFilters = () => {
    setFilter({ type: "all", dateRange: "all" });
  };

  const filteredTransactions = transactions.filter((tx) => {
    const matchesType = filter.type === "all" || tx.type === filter.type;
    const now = new Date();
    const transactionDate = new Date(tx.date);

    let matchesDate = true;
    if (filter.dateRange === "week") {
      const lastWeek = new Date();
      lastWeek.setDate(now.getDate() - 7);
      matchesDate = transactionDate >= lastWeek;
    } else if (filter.dateRange === "month") {
      const lastMonth = new Date();
      lastMonth.setMonth(now.getMonth() - 1);
      matchesDate = transactionDate >= lastMonth;
    } else if (filter.dateRange === "year") {
      const lastYear = new Date();
      lastYear.setFullYear(now.getFullYear() - 1);
      matchesDate = transactionDate >= lastYear;
    }
    return matchesType && matchesDate;
  });

  return (
    <div className="p-6 min-h-screen w-full bg-gradient-to-r from-blue-100 to-gray-200">
      <h1 className="text-4xl font-bold text-center mb-6 text-blue-500">Dashboard</h1>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="bg-gray-100 p-6 shadow-lg rounded-lg mb-6 max-w-2xl mx-auto">
        <div className="grid grid-cols-2 gap-4">
          <input type="date" name="date" value={formData.date} onChange={handleChange} className="border p-2 rounded w-full" required />
          <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} className="border p-2 rounded w-full" required />
          <input type="number" name="amount" placeholder="Amount" value={formData.amount} onChange={handleChange} className="border p-2 rounded w-full" required />
          <select name="type" value={formData.type} onChange={handleChange} className="border p-2 rounded w-full">
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        <button type="submit" className="bg-blue-400 text-white px-4 py-2 rounded mt-4 w-full">Add Transaction</button>
      </form>

      {/* Filter Section */}
      <div className="bg-gray-100 p-4 shadow-md rounded-lg mb-6 max-w-2xl mx-auto">
        <div className="grid grid-cols-3 gap-4">
          <select name="type" value={filter.type} onChange={handleFilterChange} className="border p-2 rounded w-full">
            <option value="all">All Types</option>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <select name="dateRange" value={filter.dateRange} onChange={handleFilterChange} className="border p-2 rounded w-full">
            <option value="all">Select Frequency</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </select>
          <button onClick={resetFilters} className="bg-gray-600 text-white px-4 py-2 rounded">Reset</button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-gray-100 p-4 shadow-lg rounded-lg mb-6 max-w-4xl mx-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-200">
              <th className="border p-2">Date</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((tx) => (
              <tr key={tx.id} className="text-center border">
                <td className="border p-2">{tx.date}</td>
                <td className="border p-2">{tx.category}</td>
                <td className="border p-2 text-blue-500">${tx.amount}</td>
                <td className={`border p-2 ${tx.type === "income" ? "text-green-500" : "text-red-500"}`}>{tx.type}</td>
                <td className="border p-2">
                  <button onClick={() => handleEdit(tx.id)} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">Edit</button>
                  <button onClick={() => handleDelete(tx.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
