# Smart Expense Tracker REST API

A backend expense management application built using **Spring Boot**, **Spring Data JPA**, **Hibernate**, and **MySQL**. The project follows a layered architecture and exposes RESTful APIs for performing CRUD operations and expense analysis.



## Features:

- Add a new expense or income entry
- View all transactions, with optional filters (type, category, keyword, date range) and sorting
- View a transaction by ID
- Update existing transactions
- Delete transactions
- Search transactions by category, type, or keyword
- Category-wise expense summary
- Full dashboard summary: total income, total expense, balance, net savings, total transactions, average expense, category breakdown, monthly income/expense breakdown
- Sort transactions by amount or date
- Automatic persistence using MySQL



## Tech Stack

- Java 17
- Spring Boot
- Spring Data JPA
- Hibernate
- MySQL
- Maven
- REST APIs
- Postman



## Project Structure

```
src/main/java
│
├── controller
├── model
├── repository
├── service
└── ExpensetrackerApplication
```



## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/expenses` | Add a new expense (type is always forced to EXPENSE) |
| POST | `/api/expenses/income` | Add a new income entry (type is always forced to INCOME) |
| GET | `/api/expenses` | Get all transactions. Optional query params: `type`, `category`, `keyword`, `startDate`, `endDate`, `sortBy`, `order` |
| GET | `/api/expenses/{id}` | Retrieve a transaction by ID |
| PUT | `/api/expenses/{id}` | Update a transaction |
| DELETE | `/api/expenses/{id}` | Delete a transaction |
| GET | `/api/expenses/search?category=&type=&keyword=` | Search transactions (all params optional) |
| GET | `/api/expenses/summary` | Category-wise EXPENSE totals |
| GET | `/api/expenses/dashboard` | Full dashboard summary for cards + charts |
| GET | `/api/expenses/sorted?by=amount\|date&order=asc\|desc` | Transactions sorted by amount or date |



## Architecture

```
Postman
    │
HTTP Request
    │
@RestController
    │
Service Layer
    │
Repository (Spring Data JPA)
    │
Hibernate
    │
MySQL
```



## Skills Demonstrated

- Object-Oriented Programming (OOP)
- Layered Architecture
- REST API Development
- CRUD Operations
- Spring Boot
- Spring Data JPA
- Hibernate ORM
- MySQL Integration
- Repository Pattern
- Dependency Injection
- Exception Handling
- Maven Project Management


## Future Improvements

- Bean Validation (`@Valid`)
- Global Exception Handling
- DTO Layer
- Swagger/OpenAPI Documentation
- Pagination & Sorting
- Budget Alerts
- Authentication & Authorization

---

## Author

**Harshit Kumar Singh**

Backend Developer | Java | Spring Boot | MySQL | REST APIs | DSA
