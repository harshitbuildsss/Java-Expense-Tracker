package com.harshit.expensetracker.service;

import com.harshit.expensetracker.dto.DashboardSummaryDto;
import com.harshit.expensetracker.model.Expense;
import com.harshit.expensetracker.model.TransactionType;
import com.harshit.expensetracker.repository.ExpenseRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.NoSuchElementException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

/**
 * Pure service-layer tests using Mockito to stand in for the repository -
 * these run without a real MySQL connection.
 */
@ExtendWith(MockitoExtension.class)
class ExpenseServiceTest {

    @Mock
    private ExpenseRepository expenseRepository;

    @InjectMocks
    private ExpenseService expenseService;

    @Test
    void addExpense_forcesTypeToExpense() {
        Expense input = new Expense("Food", 250.0, LocalDate.now());
        when(expenseRepository.save(any(Expense.class))).thenAnswer(inv -> inv.getArgument(0));

        Expense saved = expenseService.addExpense(input);

        assertEquals(TransactionType.EXPENSE, saved.getType());
    }

    @Test
    void addIncome_forcesTypeToIncome() {
        Expense input = new Expense("Salary", 50000.0, LocalDate.now());
        when(expenseRepository.save(any(Expense.class))).thenAnswer(inv -> inv.getArgument(0));

        Expense saved = expenseService.addIncome(input);

        assertEquals(TransactionType.INCOME, saved.getType());
    }

    @Test
    void addExpense_rejectsNonPositiveAmount() {
        Expense input = new Expense("Food", 0, LocalDate.now());
        assertThrows(IllegalArgumentException.class, () -> expenseService.addExpense(input));
    }

    @Test
    void deleteExpense_throwsWhenMissing() {
        when(expenseRepository.existsById(99)).thenReturn(false);
        assertThrows(NoSuchElementException.class, () -> expenseService.deleteExpense(99));
    }

    @Test
    void dashboardSummary_computesIncomeExpenseBalance() {
        Expense income = new Expense("Salary", 50000.0, LocalDate.of(2026, 9, 1), null, TransactionType.INCOME);
        Expense expense1 = new Expense("Food", 1000.0, LocalDate.of(2026, 9, 2), null, TransactionType.EXPENSE);
        Expense expense2 = new Expense("Transport", 500.0, LocalDate.of(2026, 9, 3), null, TransactionType.EXPENSE);

        when(expenseRepository.findAll()).thenReturn(Arrays.asList(income, expense1, expense2));

        DashboardSummaryDto dto = expenseService.getDashboardSummary();

        assertEquals(50000.0, dto.getTotalIncome());
        assertEquals(1500.0, dto.getTotalExpense());
        assertEquals(48500.0, dto.getBalance());
        assertEquals(3, dto.getTotalTransactions());
        assertEquals(750.0, dto.getAverageExpense());
    }

    // ---------- Regression tests for the null-date crash ----------

    @Test
    void getTransactions_sortByDate_doesNotThrowWhenARowHasNoDate() {
        Expense noDate = new Expense("Other", 100.0, null, null, TransactionType.EXPENSE);
        Expense withDate = new Expense("Food", 200.0, LocalDate.of(2026, 9, 1), null, TransactionType.EXPENSE);

        when(expenseRepository.findAll()).thenReturn(Arrays.asList(noDate, withDate));

        // Used to throw NullPointerException - this is the exact bug from the crash log.
        List<Expense> result = expenseService.getTransactions(null, null, null, null, null, "date", "desc");

        assertEquals(2, result.size());
    }

    @Test
    void dashboardSummary_skipsRowWithNoDateInMonthlyBreakdownButStillCountsItsTotal() {
        Expense noDate = new Expense("Other", 100.0, null, null, TransactionType.EXPENSE);
        Expense withDate = new Expense("Food", 200.0, LocalDate.of(2026, 9, 1), null, TransactionType.EXPENSE);

        when(expenseRepository.findAll()).thenReturn(Arrays.asList(noDate, withDate));

        // Used to throw NullPointerException on e.getDate().format(...).
        DashboardSummaryDto dto = expenseService.getDashboardSummary();

        assertEquals(300.0, dto.getTotalExpense()); // both rows still counted in totals
        assertEquals(1, dto.getMonthlyBreakdown().size()); // only the dated row appears on the chart
    }

    @Test
    void updateExpense_defaultsToTodayWhenDateOmittedInsteadOfNullingIt() {
        Expense existing = new Expense("Food", 100.0, LocalDate.of(2026, 1, 1));
        existing.setId(1);
        when(expenseRepository.findById(1)).thenReturn(java.util.Optional.of(existing));
        when(expenseRepository.save(any(Expense.class))).thenAnswer(inv -> inv.getArgument(0));

        // Simulates a PUT body that omits "date" entirely.
        Expense updateRequest = new Expense();
        updateRequest.setCategory("Food");
        updateRequest.setAmount(150.0);

        Expense result = expenseService.updateExpense(1, updateRequest);

        assertEquals(LocalDate.now(), result.getDate());
    }
}
