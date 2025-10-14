package com.example.ExpMang.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;

import java.util.Date;
import java.util.List;

@Entity
public class Budget {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long budgetid;
    @JsonFormat(pattern="yyyy-MM-dd")
    private Date startDate;
    @JsonFormat(pattern="yyyy-MM-dd")
    private Date endDate;
    private int amount;
    private int amountUsed;

    public Long getBudgetId() {
        return budgetid;
    }

    public void setBudgetId(Long budgetid) {
        this.budgetid = budgetid;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public int getAmount() {
        return amount;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }

    public int getAmountUsed() {
        return amountUsed;
    }

    public void setAmountUsed(int amountUsed) {
        this.amountUsed = amountUsed;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<Expense> getExpenses() {
        return expenses;
    }

    public void setExpenses(List<Expense> expenses) {
        this.expenses = expenses;
    }

    public void addExpense(Expense expense){
        this.amountUsed += expense.getAmount();
    }

    @OneToOne
    private User user;

    @OneToMany(mappedBy = "budget", cascade = CascadeType.ALL)
    private List<Expense> expenses;
}
