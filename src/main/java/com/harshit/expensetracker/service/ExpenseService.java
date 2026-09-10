package com.harshit.expensetracker.service;

import com.harshit.expensetracker.dto.DashboardSummaryDto;
import com.harshit.expensetracker.dto.MonthlySummaryDto;
import com.harshit.expensetracker.model.Expense;
import com.harshit.expensetracker.model.TransactionType;
import com.harshit.expensetracker.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    private static final DateTimeFormatter MONTH_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM");

    // ---------- Create ----------

    /** Creates a new expense. Type is always forced to EXPENSE regardless of request body. */
    public Expense addExpense(Expense expense) {
        expense.setType(TransactionType.EXPENSE);
        return saveTransaction(expense);
    }

    /** Creates a new income entry. Type is always forced to INCOME regardless of request body. */
    public Expense addIncome(Expense income) {
        income.setType(TransactionType.INCOME);
        return saveTransaction(income);
    }

    private Expense saveTransaction(Expense txn) {
        if (txn.getAmount() <= 0) {
            throw new IllegalArgumentException("Invalid amount.");
        }
        if (txn.getDate() == null) {
            txn.setDate(LocalDate.now());
        }
        return expenseRepository.save(txn);
    }

    // ---------- Read ----------

    public List<Expense> getAllExpenses() {
        return expenseRepository.findAllByOrderByExpenseDateDesc();
    }

    public Expense getExpenseById(int id) {
        return expenseRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Expense not found."));
    }

    // ---------- Update ----------

    public Expense updateExpense(int id, Expense updatedDetails) {
        Expense existing = expenseRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Expense record not found."));

        if (updatedDetails.getAmount() <= 0) {
            throw new IllegalArgumentException("Invalid amount. Edit cancelled.");
        }

        existing.setCategory(updatedDetails.getCategory());
        existing.setAmount(updatedDetails.getAmount());
        // Same rule as create: a client that omits date doesn't get to null it
        // out - default to today rather than corrupting the row.
        existing.setDate(updatedDetails.getDate() != null ? updatedDetails.getDate() : LocalDate.now());
        existing.setDescription(updatedDetails.getDescription());
        // Only change the type if the client actually sent one, so a PUT that
        // just fixes the amount doesn't silently flip an income back to expense.
        if (updatedDetails.getType() != null) {
            existing.setType(updatedDetails.getType());
        }
        return expenseRepository.save(existing);
    }

    // ---------- Delete ----------

    public void deleteExpense(int id) {
        if (!expenseRepository.existsById(id)) {
            throw new NoSuchElementException("Expense record not found.");
        }
        expenseRepository.deleteById(id);
    }

    // ---------- Search / Filter / Sort (backward-compatible originals) ----------

    public List<Expense> searchByCategory(String category) {
        return expenseRepository.findByCategoryIgnoreCase(category);
    }

    public List<Expense> getExpensesSortedByAmount() {
        List<Expense> list = expenseRepository.findAll();
        list.sort(Comparator.comparingDouble(Expense::getAmount));
        return list;
    }

    // ---------- Search / Filter / Sort (new, flexible) ----------

    /** Powers the extended /search endpoint: any combination of category, type, keyword. */
    public List<Expense> searchTransactions(String category, TransactionType type, String keyword) {
        return filterTransactions(expenseRepository.findAll(), type, category, keyword, null, null);
    }

    /** Powers the extended /sorted endpoint: sort by "amount" or "date", asc or desc. */
    public List<Expense> getSortedTransactions(String by, String order) {
        List<Expense> list = expenseRepository.findAll();
        sortInPlace(list, by, order);
        return list;
    }

    /** Powers the main GET /api/expenses endpoint with all filters optional. */
    public List<Expense> getTransactions(TransactionType type, String category, String keyword,
                                          LocalDate startDate, LocalDate endDate,
                                          String sortBy, String order) {
        List<Expense> list = filterTransactions(expenseRepository.findAll(), type, category, keyword, startDate, endDate);
        if (sortBy != null) {
            sortInPlace(list, sortBy, order);
        }
        return list;
    }

    private List<Expense> filterTransactions(List<Expense> source, TransactionType type, String category,
                                               String keyword, LocalDate startDate, LocalDate endDate) {
        return source.stream()
                .filter(e -> type == null || e.getType() == type)
                .filter(e -> category == null || e.getCategory().equalsIgnoreCase(category))
                .filter(e -> keyword == null
                        || e.getCategory().toLowerCase().contains(keyword.toLowerCase())
                        || (e.getDescription() != null && e.getDescription().toLowerCase().contains(keyword.toLowerCase())))
                .filter(e -> startDate == null || (e.getDate() != null && !e.getDate().isBefore(startDate)))
                .filter(e -> endDate == null || (e.getDate() != null && !e.getDate().isAfter(endDate)))
                .collect(Collectors.toList());
    }

    private void sortInPlace(List<Expense> list, String by, String order) {
        boolean desc = "desc".equalsIgnoreCase(order);
        Comparator<Expense> comparator;

        if ("date".equalsIgnoreCase(by)) {
            // A row with no date (shouldn't happen, but the old data bug that
            // caused it is fixed in updateExpense below) always sorts last,
            // in both directions - reversing a plain nullsLast comparator
            // would otherwise flip it to the front on "desc".
            Comparator<LocalDate> direction = desc ? Comparator.reverseOrder() : Comparator.naturalOrder();
            comparator = Comparator.comparing(Expense::getDate, Comparator.nullsLast(direction));
        } else {
            comparator = Comparator.comparingDouble(Expense::getAmount);
            if (desc) {
                comparator = comparator.reversed();
            }
        }
        list.sort(comparator);
    }

    // ---------- Summaries ----------

    /** Category-wise EXPENSE totals only (unchanged behavior from before income support existed). */
    public Map<String, Double> getCategorySummary() {
        return expenseRepository.findAll().stream()
                .filter(e -> e.getType() == TransactionType.EXPENSE)
                .collect(Collectors.groupingBy(
                        Expense::getCategory,
                        Collectors.summingDouble(Expense::getAmount)
                ));
    }

    /** Full dashboard summary: totals, balance, savings, averages, category and monthly breakdowns. */
    public DashboardSummaryDto getDashboardSummary() {
        List<Expense> all = expenseRepository.findAll();

        double totalIncome = all.stream()
                .filter(e -> e.getType() == TransactionType.INCOME)
                .mapToDouble(Expense::getAmount).sum();

        double totalExpense = all.stream()
                .filter(e -> e.getType() == TransactionType.EXPENSE)
                .mapToDouble(Expense::getAmount).sum();

        long expenseCount = all.stream().filter(e -> e.getType() == TransactionType.EXPENSE).count();
        double averageExpense = expenseCount == 0 ? 0 : totalExpense / expenseCount;

        double balance = totalIncome - totalExpense;

        Map<String, Double> categoryWiseExpense = all.stream()
                .filter(e -> e.getType() == TransactionType.EXPENSE)
                .collect(Collectors.groupingBy(Expense::getCategory, Collectors.summingDouble(Expense::getAmount)));

        // Group by calendar month for the income-vs-expense trend chart.
        // A row with no date can't be placed on the chart, so it's skipped here
        // rather than crashing the whole dashboard - it's still counted in
        // every total above, just not in the monthly breakdown.
        Map<String, double[]> monthlyTotals = new TreeMap<>();
        for (Expense e : all) {
            if (e.getDate() == null) continue;
            String key = e.getDate().format(MONTH_FORMAT);
            double[] bucket = monthlyTotals.computeIfAbsent(key, k -> new double[2]);
            if (e.getType() == TransactionType.INCOME) {
                bucket[0] += e.getAmount();
            } else {
                bucket[1] += e.getAmount();
            }
        }
        List<MonthlySummaryDto> monthlyBreakdown = monthlyTotals.entrySet().stream()
                .map(entry -> new MonthlySummaryDto(entry.getKey(), entry.getValue()[0], entry.getValue()[1]))
                .collect(Collectors.toList());

        DashboardSummaryDto dto = new DashboardSummaryDto();
        dto.setTotalIncome(totalIncome);
        dto.setTotalExpense(totalExpense);
        dto.setBalance(balance);
        dto.setNetSavings(balance);
        dto.setTotalTransactions(all.size());
        dto.setAverageExpense(averageExpense);
        dto.setCategoryWiseExpense(categoryWiseExpense);
        dto.setMonthlyBreakdown(monthlyBreakdown);
        return dto;
    }
}
