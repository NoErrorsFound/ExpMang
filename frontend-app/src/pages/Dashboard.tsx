import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiService, Budget, Expense } from '../services/apiService';
import BudgetCard from '../components/BudgetCard';
import ExpenseList from '../components/ExpenseList';
import AddExpenseModal from '../components/AddExpenseModal';
import AddBudgetModal from '../components/AddBudgetModal';
import logo from '../assets/images/image-removebg-preview (1) (1).png';
import './Dashboard.css';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [budget, setBudget] = useState<Budget | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const userName = apiService.getStoredUserName();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [budgetData, expensesData] = await Promise.all([
        apiService.getBudget(),
        apiService.getAllExpenses()
      ]);
      setBudget(budgetData);
      setExpenses(expensesData);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBudget = async (budgetData: Omit<Budget, 'budgetid' | 'user' | 'amountUsed'>) => {
    try {
      const newBudget = await apiService.createBudget(budgetData);
      setBudget(newBudget);
      setShowAddBudget(false);
    } catch (err: any) {
      alert(err.message || 'Failed to create budget');
    }
  };

  const handleUpdateBudget = async (budgetData: Partial<Budget>) => {
    try {
      const updated = await apiService.updateBudget(budgetData);
      setBudget(updated);
    } catch (err: any) {
      alert(err.message || 'Failed to update budget');
    }
  };

  const handleDeleteBudget = async () => {
    if (!window.confirm('Are you sure you want to delete your budget? This will also delete all associated expenses.')) {
      return;
    }
    try {
      await apiService.deleteBudget();
      setBudget(null);
      setExpenses([]);
    } catch (err: any) {
      alert(err.message || 'Failed to delete budget');
    }
  };

  const handleAddExpense = async (expenseData: Omit<Expense, 'expenseid' | 'budget'>) => {
    try {
      const newExpense = await apiService.addExpense(expenseData);
      setExpenses([...expenses, newExpense]);
      setShowAddExpense(false);
      // Reload budget to get updated amountUsed
      const updatedBudget = await apiService.getBudget();
      if (updatedBudget) setBudget(updatedBudget);
    } catch (err: any) {
      alert(err.message || 'Failed to add expense. Make sure you have a budget first.');
    }
  };

  const handleUpdateExpense = async (id: number, expenseData: Partial<Expense>) => {
    try {
      const updated = await apiService.updateExpense(id, expenseData);
      setExpenses(expenses.map(e => e.expenseid === id ? updated : e));
      // Reload budget to get updated amountUsed
      const updatedBudget = await apiService.getBudget();
      if (updatedBudget) setBudget(updatedBudget);
    } catch (err: any) {
      alert(err.message || 'Failed to update expense');
    }
  };

  const handleDeleteExpense = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }
    try {
      await apiService.deleteExpense(id);
      setExpenses(expenses.filter(e => e.expenseid !== id));
      // Reload budget to get updated amountUsed
      const updatedBudget = await apiService.getBudget();
      if (updatedBudget) setBudget(updatedBudget);
    } catch (err: any) {
      alert(err.message || 'Failed to delete expense');
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading your expenses...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="logo-title">
              <img src={logo} alt="Extraa Logo" className="app-logo" />
              <h1>Extraa</h1>
            </div>
            <p className="welcome-text">Welcome back, <strong>{userName}</strong>!</p>
          </div>
          <button className="logout-btn" onClick={onLogout}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        {error && (
          <div className="error-banner">
            <span>⚠️</span> {error}
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}

        <div className="budget-section">
          {budget ? (
            <BudgetCard 
              budget={budget} 
              onUpdate={handleUpdateBudget}
              onDelete={handleDeleteBudget}
            />
          ) : (
            <motion.div 
              className="no-budget-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="no-budget-icon-wrapper">
                <svg className="no-budget-icon" width="80" height="80" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="url(#budgetGradient)" strokeWidth="2"/>
                  <path d="M12 8v4m0 4h.01" stroke="url(#budgetGradient)" strokeWidth="2" strokeLinecap="round"/>
                  <defs>
                    <linearGradient id="budgetGradient" x1="2" y1="2" x2="22" y2="22">
                      <stop offset="0%" stopColor="#f97316"/>
                      <stop offset="100%" stopColor="#fb923c"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <h2 className="no-budget-title">No Budget Set</h2>
              <p className="no-budget-description">
                Create your first budget to start tracking expenses and managing your finances effectively.
              </p>
              <div className="no-budget-features">
                <div className="feature-item">
                  <span className="feature-icon">📊</span>
                  <span>Track spending</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">💰</span>
                  <span>Set limits</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">📈</span>
                  <span>Monitor progress</span>
                </div>
              </div>
              <button className="btn-primary btn-large" onClick={() => setShowAddBudget(true)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Create Your First Budget
              </button>
            </motion.div>
          )}
        </div>

        <div className="expenses-section">
          <div className="section-header">
            <h2>Recent Expenses</h2>
            {budget && (
              <button className="btn-primary" onClick={() => setShowAddExpense(true)}>
                <span>+</span> Add Expense
              </button>
            )}
          </div>

          <ExpenseList 
            expenses={expenses}
            onUpdate={handleUpdateExpense}
            onDelete={handleDeleteExpense}
          />
        </div>
      </main>

      {showAddExpense && (
        <AddExpenseModal
          onClose={() => setShowAddExpense(false)}
          onAdd={handleAddExpense}
        />
      )}

      {showAddBudget && (
        <AddBudgetModal
          onClose={() => setShowAddBudget(false)}
          onAdd={handleAddBudget}
        />
      )}
    </div>
  );
};

export default Dashboard;
