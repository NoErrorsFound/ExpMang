package com.example.ExpMang.controller;

import com.example.ExpMang.model.Expense;
import com.example.ExpMang.model.User;
import com.example.ExpMang.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public Expense addExpense(@RequestBody Expense expense, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return expenseService.addExpense(expense, user);
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public List<Expense> getAllExpenses(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return expenseService.getAllExpenses(user);
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public Expense getExpenseById(@PathVariable Long id) {
        return expenseService.getExpenseById(id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public Expense updateExpense(@PathVariable Long id, @RequestBody Expense expense) {
        return expenseService.updateExpense(id, expense);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public void deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
    }
}
