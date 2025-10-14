package com.example.ExpMang.controller;

import com.example.ExpMang.model.Budget;
import com.example.ExpMang.model.User;
import com.example.ExpMang.service.BudgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    @Autowired
    private BudgetService budgetService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public Budget createBudget(@RequestBody Budget budget, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return budgetService.createBudget(budget, user);
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public Budget getBudget(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return budgetService.getBudget(user);
    }

    @PutMapping
    @PreAuthorize("isAuthenticated()")
    public Budget updateBudget(@RequestBody Budget budget, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return budgetService.updateBudget(budget, user);
    }

    @DeleteMapping
    @PreAuthorize("isAuthenticated()")
    public void deleteBudget(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        budgetService.deleteBudget(user);
    }
}
