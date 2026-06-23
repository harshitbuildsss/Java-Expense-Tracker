-- Create and select the database
CREATE DATABASE IF NOT EXISTS expense_db;
USE expense_db;

-- Main expenses table
CREATE TABLE IF NOT EXISTS expenses (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    category     VARCHAR(100)   NOT NULL,
    amount       DOUBLE         NOT NULL,
    expense_date DATE           NOT NULL
);

-- Budget config table 
CREATE TABLE IF NOT EXISTS budget_config (
    monthly_budget DOUBLE NOT NULL DEFAULT 0
);

-- Seed one row into budget_config so loadBudget() always finds a row

INSERT INTO budget_config (monthly_budget) VALUES (0);


SHOW TABLES;
SELECT * FROM expenses;
SELECT * FROM budget_config;