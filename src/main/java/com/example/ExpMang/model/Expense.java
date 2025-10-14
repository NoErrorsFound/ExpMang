package com.example.ExpMang.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

import java.util.Date;

@Entity
public class Expense {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("expenseid")
    private Long expenseid;
    private int amount;
    private Date date;
    private String description;
    private String type;
    private String payment_Method;
//    private boolean status;


    public Long getExpenseId() {
        return expenseid;
    }

    public void setExpenseId(Long expenseid) {
        this.expenseid = expenseid;
    }

    public int getAmount() {
        return amount;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getPayment_Method() {
        return payment_Method;
    }

    public void setPayment_Method(String payment_Method) {
        this.payment_Method = payment_Method;
    }

    public Budget getBudget() {
        return budget;
    }

    public void setBudget(Budget budget) {
        this.budget = budget;
    }

//    public boolean isStatus() {
//        return status;
//    }
//
//    public void setStatus(boolean status) {
//        this.status = status;
//    }

    @Override
    public String toString() {
        return "Expense{" +
                "expenseId='" + expenseid + '\'' +
                ", amount=" + amount +
                ", date=" + date +
                ", description='" + description + '\'' +
                ", type='" + type + '\'' +
                ", payment_Method='" + payment_Method + '\'' +
//                ", status=" + status +
                '}';
    }

    @JsonIgnore
    @ManyToOne
    private Budget budget;
}
