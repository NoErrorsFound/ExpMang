package com.example.ExpMang.repo;

import com.example.ExpMang.model.Budget;
import com.example.ExpMang.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface BudgetRepo extends JpaRepository<Budget, Long> {
    Budget findByUser(User user);
}
