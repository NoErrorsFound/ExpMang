package com.example.ExpMang.service;

import com.example.ExpMang.model.Budget;
import com.example.ExpMang.model.User;
import com.example.ExpMang.repo.BudgetRepo;
import com.example.ExpMang.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BudgetService {

    @Autowired
    private BudgetRepo budgetRepo;

    @Autowired
    private UserRepo userRepo;

    public Budget createBudget(Budget budget, User user) {
        budget.setUser(user);
        return budgetRepo.save(budget);
    }

    public Budget getBudget(User user) {
        return budgetRepo.findByUser(user);
    }

    public Budget updateBudget(Budget budget, User user) {
        Budget existingBudget = budgetRepo.findByUser(user);
        if (existingBudget != null) {
            existingBudget.setAmount(budget.getAmount());
            existingBudget.setStartDate(budget.getStartDate());
            existingBudget.setEndDate(budget.getEndDate());
            return budgetRepo.save(existingBudget);
        }
        return null;
    }

    public void deleteBudget(User user) {
        Budget budget = budgetRepo.findByUser(user);
        if (budget != null) {
            user.setBudget(null);
            userRepo.save(user);
            budgetRepo.delete(budget);
        }
    }
}
