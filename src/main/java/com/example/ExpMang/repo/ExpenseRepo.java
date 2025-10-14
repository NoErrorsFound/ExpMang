package com.example.ExpMang.repo;

import com.example.ExpMang.model.Expense;
import com.example.ExpMang.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseRepo extends JpaRepository<Expense, Long> {
    List<Expense> findByBudgetUser(User user);
}
