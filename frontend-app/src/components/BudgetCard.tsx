import React, { useState } from 'react';
import { Budget } from '../services/apiService';
import './BudgetCard.css';

interface BudgetCardProps {
  budget: Budget;
  onUpdate: (data: Partial<Budget>) => void;
  onDelete: () => void;
}

const BudgetCard: React.FC<BudgetCardProps> = ({ budget, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    amount: budget.amount,
    startDate: budget.startDate,
    endDate: budget.endDate
  });

  const percentageUsed = budget.amount > 0 ? (budget.amountUsed / budget.amount) * 100 : 0;
  const remaining = budget.amount - budget.amountUsed;
  const isOverBudget = remaining < 0;

  const handleSave = () => {
    onUpdate(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      amount: budget.amount,
      startDate: budget.startDate,
      endDate: budget.endDate
    });
    setIsEditing(false);
  };

  return (
    <div className="budget-card">
      <div className="budget-card-header">
        <h3>📅 Your Budget</h3>
        <div className="budget-actions">
          {!isEditing ? (
            <>
              <button className="btn-icon" onClick={() => setIsEditing(true)} title="Edit budget">
                ✏️
              </button>
              <button className="btn-icon btn-danger" onClick={onDelete} title="Delete budget">
                🗑️
              </button>
            </>
          ) : (
            <>
              <button className="btn-small btn-primary" onClick={handleSave}>
                Save
              </button>
              <button className="btn-small" onClick={handleCancel}>
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      <div className="budget-card-body">
        {isEditing ? (
          <div className="budget-edit-form">
            <div className="form-row">
              <div className="form-group">
                <label>Budget Amount</label>
                <input
                  type="number"
                  value={editData.amount}
                  onChange={(e) => setEditData({ ...editData, amount: Number(e.target.value) })}
                  min="0"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  value={editData.startDate}
                  onChange={(e) => setEditData({ ...editData, startDate: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  value={editData.endDate}
                  onChange={(e) => setEditData({ ...editData, endDate: e.target.value })}
                />
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="budget-stats">
              <div className="stat">
                <span className="stat-label">Total Budget</span>
                <span className="stat-value">₹{budget.amount.toLocaleString()}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Spent</span>
                <span className={`stat-value ${isOverBudget ? 'over-budget' : ''}`}>
                  ₹{budget.amountUsed.toLocaleString()}
                </span>
              </div>
              <div className="stat">
                <span className="stat-label">Remaining</span>
                <span className={`stat-value ${isOverBudget ? 'over-budget' : 'remaining-positive'}`}>
                  ₹{remaining.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="budget-progress">
              <div className="progress-bar">
                <div 
                  className={`progress-fill ${isOverBudget ? 'over-budget' : ''}`}
                  style={{ width: `${Math.min(percentageUsed, 100)}%` }}
                ></div>
              </div>
              <span className="progress-text">
                {percentageUsed.toFixed(1)}% used
              </span>
            </div>

            <div className="budget-period">
              <span>📆 {new Date(budget.startDate).toLocaleDateString()} - {new Date(budget.endDate).toLocaleDateString()}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BudgetCard;
