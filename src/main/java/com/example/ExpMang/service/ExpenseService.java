package com.example.ExpMang.service;

import com.example.ExpMang.model.Budget;
import com.example.ExpMang.model.Expense;
import com.example.ExpMang.model.User;
import com.example.ExpMang.repo.BudgetRepo;
import com.example.ExpMang.repo.ExpenseRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepo expenseRepo;

    @Autowired
    private BudgetRepo budgetRepo;

    public Expense addExpense(Expense expense, User user) {
        Budget budget = budgetRepo.findByUser(user);
        if (budget != null) {
            expense.setBudget(budget);
            budget.setAmountUsed(budget.getAmountUsed() + expense.getAmount());
            budgetRepo.save(budget);
            return expenseRepo.save(expense);
        }
        return null;
    }

    public List<Expense> getAllExpenses(User user) {
        return expenseRepo.findByBudgetUser(user);
    }

    public Expense getExpenseById(Long id) {
        return expenseRepo.findById(id).orElse(null);
    }

    public Expense updateExpense(Long id, Expense expense) {
        Expense existingExpense = expenseRepo.findById(id).orElse(null);
        if (existingExpense != null) {
            Budget budget = existingExpense.getBudget();
            budget.setAmountUsed(budget.getAmountUsed() - existingExpense.getAmount() + expense.getAmount());
            budgetRepo.save(budget);

            existingExpense.setAmount(expense.getAmount());
            existingExpense.setDate(expense.getDate());
            existingExpense.setDescription(expense.getDescription());
            existingExpense.setType(expense.getType());
            existingExpense.setPayment_Method(expense.getPayment_Method());
            return expenseRepo.save(existingExpense);
        }
        return null;
    }

    public void deleteExpense(Long id) {
        Expense expense = expenseRepo.findById(id).orElse(null);
        if (expense != null) {
            Budget budget = expense.getBudget();
            budget.setAmountUsed(budget.getAmountUsed() - expense.getAmount());
            budgetRepo.save(budget);
            expenseRepo.deleteById(id);
        }
    }
}
