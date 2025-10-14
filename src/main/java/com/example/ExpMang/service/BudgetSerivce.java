package com.example.ExpMang.service;

import com.example.ExpMang.model.Budget;
import com.example.ExpMang.model.Expense;
import com.example.ExpMang.repo.BudgetRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class BudgetSerivce {

    @Autowired
    private BudgetRepo repo;

    @Autowired
    private IdGenerator generate;

    public Budget setUserBudget(Budget budget) {

        budget.setBudgetId(Long.parseLong(generate.generateCustomNanoId()));
        budget.setUser(budget.getUser());
        budget.setAmount(budget.getAmount());
        budget.setStartDate(budget.getStartDate());
        budget.setEndDate(budget.getEndDate());
        budget.setAmountUsed(budget.getAmountUsed());

        return repo.save(budget);
    }

//    public Budget expenseAdded(Expense expense){
//        Budget budget = repo.findByName();
//        budget.addExpense(expense);
//
//        return budget;
//    }
}
