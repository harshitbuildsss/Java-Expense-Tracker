# Smart Expense Tracker

A full-stack expense management application built with **Spring Boot REST API** and a **React + TypeScript frontend**. The application supports income and expense tracking, transaction filtering/search/sorting, and a dashboard with financial summaries and charts.

## Features

### Transaction Management

* Add expense transactions
* Add income transactions
* View transactions
* View a transaction by ID
* Update transactions
* Delete transactions
* Automatically default a missing transaction date to the current date

### Search, Filter & Sort

* Filter by transaction type
* Filter by category
* Search by category or description keyword
* Filter by date range
* Sort by amount or date in ascending/descending order

### Dashboard & Reports

* Total income
* Total expenses
* Current balance
* Net savings
* Total transaction count
* Average expense
* Category-wise expense breakdown
* Monthly income/expense breakdown
* Category and trend charts in the React frontend

### Validation & Error Handling

* Rejects non-positive transaction amounts
* Validates incoming request data
* Handles missing transaction records
* Global exception handling for API errors
* Frontend error boundary and user-facing error/toast states

### Testing

* Service-layer unit tests using **JUnit 5 and Mockito**
* Tests cover transaction type handling, amount validation, missing records, dashboard calculations, and update behavior
* Tests run without requiring a real MySQL connection by mocking the repository layer

## Tech Stack

### Backend

* **Java 17**
* **Spring Boot**
* **Spring Web MVC**
* **Spring Data JPA**
* **Hibernate**
* **MySQL**
* **Maven**
* **Jakarta Validation**

### Frontend

* **React 18**
* **TypeScript**
* **Vite**
* **Tailwind CSS**
* **Axios**
* **React Router**
* **Recharts**
* **Lucide React**

### Testing

* **JUnit 5**
* **Mockito**
* **Spring Boot Test**

## Architecture

The application follows a layered backend architecture:

```text
React + TypeScript Frontend
          │
          │ HTTP / REST
          ▼
     REST Controller
          │
          ▼
      Service Layer
          │
          ▼
 Spring Data JPA Repository
          │
          ▼
       Hibernate
          │
          ▼
        MySQL
```

### Backend Structure

```text
src/main/java/com/harshit/expensetracker/
│
├── config/
│   └── CorsConfig.java
│
├── controller/
│   └── ExpenseController.java
│
├── dto/
│   ├── DashboardSummaryDto.java
│   └── MonthlySummaryDto.java
│
├── Exceptions/
│   └── GlobalExceptionHandler.java
│
├── model/
│   ├── Expense.java
│   └── TransactionType.java
│
├── repository/
│   └── ExpenseRepository.java
│
├── service/
│   └── ExpenseService.java
│
└── ExpensetrackerApplication.java
```

### Frontend Structure

```text
frontend/src/
│
├── api/
│   ├── client.ts
│   └── expenseApi.ts
│
├── components/
│   ├── CategoryChart.tsx
│   ├── ConfirmDialog.tsx
│   ├── ErrorBoundary.tsx
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   ├── StatCard.tsx
│   ├── TransactionForm.tsx
│   ├── TransactionTable.tsx
│   └── TrendChart.tsx
│
├── hooks/
│   ├── useDashboard.ts
│   └── useTransactions.ts
│
├── pages/
│   ├── Dashboard.tsx
│   ├── Transactions.tsx
│   ├── AddTransaction.tsx
│   ├── Categories.tsx
│   ├── Search.tsx
│   ├── Reports.tsx
│   └── Settings.tsx
│
├── types/
├── utils/
├── App.tsx
└── main.tsx
```

## API Endpoints

**Base URL:**

```text
http://localhost:8080
```

| Method   | Endpoint                  | Description                                          |
| -------- | ------------------------- | ---------------------------------------------------- |
| `POST`   | `/api/expenses`           | Create an expense                                    |
| `POST`   | `/api/expenses/income`    | Create an income entry                               |
| `GET`    | `/api/expenses`           | Get transactions with optional filters/sorting       |
| `GET`    | `/api/expenses/{id}`      | Get a transaction by ID                              |
| `PUT`    | `/api/expenses/{id}`      | Update a transaction                                 |
| `DELETE` | `/api/expenses/{id}`      | Delete a transaction                                 |
| `GET`    | `/api/expenses/search`    | Search/filter by category, type, or keyword          |
| `GET`    | `/api/expenses/sorted`    | Sort transactions by amount or date                  |
| `GET`    | `/api/expenses/summary`   | Get category-wise expense totals                     |
| `GET`    | `/api/expenses/dashboard` | Get dashboard totals and monthly/category breakdowns |

### Main Transaction Query Parameters

```text
type
category
keyword
startDate
endDate
sortBy
order
```

Example:

```text
/api/expenses?type=EXPENSE&category=Food&sortBy=amount&order=desc
```

## Database Setup

Create a MySQL database:

```sql
CREATE DATABASE expense_db;
```

Update:

```text
src/main/resources/application.properties
```

with your local MySQL credentials.

The project uses:

```properties
spring.jpa.hibernate.ddl-auto=update
```

so Hibernate can update the database schema from the entity model during development.

> **Do not commit real database passwords or other secrets to the repository.**

## Running the Backend

### 1. Start MySQL

Make sure MySQL is running and the `expense_db` database exists.

### 2. Configure Database Credentials

Update:

```text
src/main/resources/application.properties
```

with your local MySQL username and password.

### 3. Run the Spring Boot Application

On Windows:

```bash
mvnw.cmd spring-boot:run
```

Or, if Maven is installed:

```bash
mvn spring-boot:run
```

The backend runs on:

```text
http://localhost:8080
```

## Running the Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The Vite development server runs on:

```text
http://localhost:5173
```

The frontend communicates with the Spring Boot backend through the REST API.

## Running Tests

From the project root:

```bash
mvnw.cmd test
```

The service tests use Mockito to mock `ExpenseRepository`, allowing business logic to be tested without connecting to MySQL.

## Skills Demonstrated

* **Java & Object-Oriented Programming**
* **Spring Boot REST API Development**
* **Layered Architecture**
* **Dependency Injection**
* **Spring Data JPA & Hibernate**
* **MySQL Persistence**
* **REST API Integration with React**
* **TypeScript & React**
* **Client-Side Routing & API Calls**
* **Data Filtering, Searching, Sorting & Aggregation**
* **Dashboard Data Processing & Visualization**
* **Input Validation & Exception Handling**
* **Unit Testing with JUnit & Mockito**
* **Maven Project Management**
* **Git/GitHub Workflow**


## Author

**Harshit Kumar Singh**

Java | Spring Boot | React | MySQL | REST APIs | DSA
