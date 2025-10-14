import React, { useState } from 'react';
import { Expense } from '../services/apiService';
import './ExpenseList.css';

interface ExpenseListProps {
  expenses: Expense[];
  onUpdate: (id: number, data: Partial<Expense>) => void;
  onDelete: (id: number) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onUpdate, onDelete }) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Expense>>({});

  const startEdit = (expense: Expense) => {
    setEditingId(expense.expenseid!);
    setEditData({
      amount: expense.amount,
      date: expense.date.split('T')[0], // Extract date part
      description: expense.description,
      type: expense.type,
      payment_Method: expense.payment_Method
    });
  };

  const handleSave = (id: number) => {
    onUpdate(id, editData);
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const getTypeIcon = (type: string) => {
    if (!type) return '💰';
    const icons: { [key: string]: string } = {
      food: '🍔',
      transport: '🚗',
      entertainment: '🎬',
      shopping: '🛍️',
      utilities: '💡',
      health: '💊',
      education: '📚',
      other: '📝'
    };
    return icons[type.toLowerCase()] || '💰';
  };

  const getPaymentIcon = (method: string) => {
    if (!method) return '💰';
    const icons: { [key: string]: string } = {
      cash: '💵',
      card: '💳',
      upi: '📱',
      netbanking: '🏦',
      other: '💰'
    };
    return icons[method.toLowerCase()] || '💰';
  };

  if (expenses.length === 0) {
    return (
      <div className="no-expenses">
        <span className="no-expenses-icon">📭</span>
        <h3>No expenses yet</h3>
        <p>Start tracking by adding your first expense</p>
      </div>
    );
  }

  // Sort expenses by date, newest first
  const sortedExpenses = [...expenses].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="expense-list">
      {sortedExpenses.map((expense) => (
        <div key={expense.expenseid} className="expense-item">
          {editingId === expense.expenseid ? (
            <div className="expense-edit-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Amount (₹)</label>
                  <input
                    type="number"
                    value={editData.amount || 0}
                    onChange={(e) => setEditData({ ...editData, amount: Number(e.target.value) })}
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={editData.date || ''}
                    onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Description</label>
                  <input
                    type="text"
                    value={editData.description || ''}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    placeholder="What was this for?"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Type</label>
                  <select
                    value={editData.type || ''}
                    onChange={(e) => setEditData({ ...editData, type: e.target.value })}
                  >
                    <option value="Food">Food</option>
                    <option value="Transport">Transport</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Health">Health</option>
                    <option value="Education">Education</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Payment Method</label>
                  <select
                    value={editData.payment_Method || ''}
                    onChange={(e) => setEditData({ ...editData, payment_Method: e.target.value })}
                  >
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                    <option value="UPI">UPI</option>
                    <option value="NetBanking">Net Banking</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="form-actions">
                <button className="btn-small btn-primary" onClick={() => handleSave(expense.expenseid!)}>
                  Save
                </button>
                <button className="btn-small" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="expense-icon">
                {getTypeIcon(expense.type)}
              </div>
              <div className="expense-details">
                <h4>{expense.description}</h4>
                <div className="expense-meta">
                  <span className="expense-type">{expense.type}</span>
                  <span className="expense-payment">{getPaymentIcon(expense.payment_Method)} {expense.payment_Method}</span>
                  <span className="expense-date">
                    {new Date(expense.date).toLocaleDateString('en-IN', { 
                      day: 'numeric', 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
              <div className="expense-amount">
                ₹{expense.amount.toLocaleString()}
              </div>
              <div className="expense-actions">
                <button className="btn-icon" onClick={() => startEdit(expense)} title="Edit">
                  ✏️
                </button>
                <button className="btn-icon btn-danger" onClick={() => onDelete(expense.expenseid!)} title="Delete">
                  🗑️
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default ExpenseList;
