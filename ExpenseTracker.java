import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.time.LocalDate;
import java.time.Month;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Scanner;

public class ExpenseTracker {

    static class Expense {
        String category;
        double amount;
        LocalDate date;

        Expense(String category, double amount, LocalDate date) {
            this.category = category;
            this.amount = amount;
            this.date = date;
        }
    }

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);
        ArrayList<Expense> expenses = new ArrayList<>();
        double monthlyBudget = loadBudget();
        loadFromFile(expenses);
        while (true) {

            System.out.println("\n===== Expense Tracker =====");
            System.out.println("1. Add Expense");
            System.out.println("2. View Expenses");
            System.out.println("3. Delete");
            System.out.println("4. Exit");
            System.out.println("5. Category Summary");
            System.out.println("6. View expenses by month");
            System.out.println("7. Edit expense");
            System.out.println("8. Search by category");
            System.out.println("9. Sort Expenses by Amount");
            System.out.println("10. Monthly Expense Report");
            System.out.println("11. Set Monthly Budget");
            System.out.print("Choose an option: ");

            int choice = sc.nextInt();
            sc.nextLine(); // consume newline

            if (choice == 1) {
                addExpense(expenses, sc);
                saveToFile(expenses);
            } 
            else if (choice == 2) {
                viewExpenses(expenses);
            } 
            else if (choice == 3) {
                deleteExpense(expenses, sc);
                saveToFile(expenses);
            } 
            else if (choice == 4) {
                System.out.println("Exiting Expense Tracker. Goodbye!");
                break;
            } 
            else if (choice == 5) {
                categorySummary(expenses);
            } 
            else if (choice == 6) {
                viewByMonth(expenses, sc);
            }
            else if (choice == 7) {
                editExpense(expenses, sc);
                saveToFile(expenses);
            }
            else if (choice == 8) {
                searchByCategory(expenses, sc);
            }
            else if (choice == 9) {
                sortByAmount(expenses);
            }
            else if (choice == 10) {
                monthlyReport(expenses, sc, monthlyBudget);
            } 
            else if ( choice == 11) {
                System.out.println("Enter monthly budget.");
                monthlyBudget = sc.nextDouble();
                sc.nextLine();
                saveBudget(monthlyBudget);
            }
            else {
                System.out.println("Invalid option. Please try again.");
            }
        }

        sc.close();
    }

    static void addExpense(ArrayList<Expense> expenses, Scanner sc) {

        System.out.print("Enter category: ");
        String category = sc.nextLine();

        System.out.print("Enter Amount: ");
        double amount = sc.nextDouble();
        sc.nextLine();

        if(amount <= 0) {
            System.out.println("Invalid amount.");
            return;
        }

        System.out.println("Enter date (YYYY-MM-DD) or press Enter for today: ");
        String dateInput = sc.nextLine();

        LocalDate date;

        if(dateInput.isEmpty()) {
            date = LocalDate.now();
        } else {
            try {
                date = LocalDate.parse(dateInput);
            } catch (Exception e) {
                System.out.println("Invalid date format. Using today. ");
                date = LocalDate.now();
            }
        }

        expenses.add(new Expense(category, amount, date));

        System.out.println("Expense added successfully.");
    }

    static void viewExpenses(ArrayList<Expense> expenses) {

        if (expenses.isEmpty()) {
            System.out.println("No expenses recorded yet.");
            return;
        }

        System.out.println("\n--- Expense List ---");

        double total = 0;

        for (int i = 0; i < expenses.size(); i++) {
            Expense e = expenses.get(i);
            System.out.println(
                (i + 1) + ". " + e.date + " | " + e.category + " - Rs. " + e.amount
            );
            total += e.amount;
        }

        System.out.println("-------------------");
        System.out.println("Total Spent: Rs. " + total);
    }

    static void deleteExpense(ArrayList<Expense> expenses, Scanner sc) {

        if (expenses.isEmpty()) {
            System.out.println("No expenses recorded yet.");
            return;
        }

        System.out.println("\n--- Expense List ---");

        for (int i = 0; i < expenses.size(); i++) {
            Expense e = expenses.get(i);
            System.out.println(
                (i + 1) + ". " + e.date + " | " + e.category + " - Rs. " + e.amount
            );
        }

        System.out.print("Enter expense number to delete: ");
        int deleteChoice = sc.nextInt();
        sc.nextLine();

        int index = deleteChoice - 1;

        if (index < 0 || index >= expenses.size()) {
            System.out.println("Invalid expense number.");
        } 
        else {
            Expense removed = expenses.remove(index);
            System.out.println(
                "Removed: " + removed.date + " | " +
                removed.category + " - Rs. " +
                removed.amount
            );
        }
    }

    static void categorySummary(ArrayList<Expense> expenses) {

        if (expenses.isEmpty()) {
            System.out.println("No expenses recorded yet.");
            return;
        }

        HashMap<String, Double> summary = new HashMap<>();

        for (Expense e : expenses) {
            summary.put(
                e.category,
                summary.getOrDefault(e.category, 0.0) + e.amount 
            );
        }

        System.out.println("\n--- Category Summary ---");

        for (String category : summary.keySet()) {
            System.out.println(category + " : Rs. " + summary.get(category));
        }
    }

    static void viewByMonth(ArrayList<Expense> expenses, Scanner sc) {
        if(expenses.isEmpty()) {
            System.out.println("No expenses recorded yet.");
            return;
        }

        System.out.println("Enter month(1-12): ");
        int month = sc.nextInt();
        sc.nextLine();
        
        if(month < 1 || month > 12) {
            System.out.println("Invalid Month. ");
            return;
        }

        double total = 0;
        boolean found = false;

        System.out.println("\n--- Expenses for Month" + month + "---");

        for(Expense e : expenses) {
            if(e.date.getMonthValue() == month) {
                System.out.println(
                    e.date + " | " + e.category + " - Rs. " + e.amount
                );
                total += e.amount;
                found = true;
            }
        }

        if(!found) {
            System.out.println("No expenses found for this month.");
        } else {
            System.out.println("------------------");
            System.out.println("Total for month " + month + " :Rs. " + total);
        }
    }

    static void saveToFile(ArrayList<Expense> expenses) {
        try (FileWriter writer = new FileWriter("expenses.txt", false)) {
            for (Expense e : expenses) {
                writer.write(e.date + "," + e.category + "," + e.amount + "\n");
            }
        } catch (IOException e) {
            System.out.println("Error saving file.");
        }
    }

    static void loadFromFile(ArrayList<Expense> expenses) {
    try {
        File file = new File("expenses.txt");
        Scanner fileScanner = new Scanner(file);

        while (fileScanner.hasNextLine()) {
            String line = fileScanner.nextLine();
            String[] parts = line.split(",");

            if (parts.length < 3) {
                continue; 
            }

            try {
                LocalDate date = LocalDate.parse(parts[0]);
                String category = parts[1];
                double amount = Double.parseDouble(parts[2]);
                expenses.add(new Expense(category, amount, date));

            } catch (Exception e) {
                System.out.println("Skipping invalid data line.");
            }
        }

        fileScanner.close();
        } catch (Exception e) {
            System.out.println("No previous data found.");
        }
    }

    static void editExpense(ArrayList<Expense> expenses, Scanner sc) {
        if(expenses.isEmpty()) {
            System.out.println("No expenses recorded yet.");
            return;
        }

        System.out.println("\n-------Expenses List-------");

        for(int i=0; i<expenses.size(); i++) {
            Expense e = expenses.get(i);
            System.out.println(
                (i + 1) + ". " + e.date + " | " + e.category + " - Rs. " + e.amount
            );
        }

        System.out.println("Enter expense number to edit: ");
        int choice = sc.nextInt();
        sc.nextLine();
        
        int index = choice - 1;

        if(index < 0 || index >= expenses.size()) {
            System.out.println("Invalid expense number.");
            return;
        }

        Expense e = expenses.get(index);

        System.out.println("Enter new category. ");
        String newCategory = sc.nextLine();
        System.out.println("Enter new amount. ");
        double newAmount = sc.nextDouble();
        sc.nextLine();
        e.category = newCategory;
        e.amount = newAmount;

        System.out.println("Expenses edited successfully.");
    }

    static void searchByCategory(ArrayList<Expense> expenses, Scanner sc) {
        if(expenses.isEmpty()) {
            System.out.println("No expenses recorded yet.");
            return;
        }

        System.out.println("Enter category to search: ");
        String category = sc.nextLine();

        boolean found = false;

        System.out.println("\n -----Matching Expenses-----");

        for(Expense e : expenses) {
            if(e.category.equalsIgnoreCase(category)) {
                System.out.println(
                    e.date + " | " + e.category + " | " + "-Rs. " + e.amount
                );
                found = true;
            }
        }

        if(!found) {
            System.out.println("No expenses found for this category.");
        }
    }

    static void sortByAmount(ArrayList<Expense> expenses) {
        Collections.sort(expenses , (e1,e2) ->
            Double.compare(e1.amount, e2.amount)
        );

        System.out.println("\n-------Expenses Sorted by Amount");

        for(Expense e : expenses) {
            System.out.println(
                e.date + " | " + e.category + " | " + e.amount
            );
        }
    }

    static void monthlyReport(ArrayList<Expense> expenses, Scanner sc, double budget) {
        System.out.println("Enter month (1-12): ");
        int month = sc.nextInt();
        sc.nextLine();

        if(month < 1 || month > 12) {
            System.out.println("Invalid month.");
            return;
        }

        String monthName = Month.of(month).name().toLowerCase();
        monthName = monthName.substring(0,1).toUpperCase() + monthName.substring(1);

        HashMap <String, Double> summary = new HashMap<>();
        double total = 0;

        for(Expense e : expenses) {
            if(e.date.getMonthValue() == month) {
                summary.put(
                    e.category, 
                    summary.getOrDefault(e.category, 0.0) + e.amount
                );
                total += e.amount;
            }
        }

        if(summary.isEmpty()) {
            System.out.println("No data for this month.");
            return;
        }


        System.out.println("\n------" + monthName +" Expense Report------");
        
        for(String category : summary.keySet()) {
            System.out.println(category + " :Rs. " + summary.get(category));
        }

        System.out.println("\n Total Spent: Rs. " + total);

        String maxCategory  = "";
        double max = 0;

        for(String category  : summary.keySet()) {
            if(summary.get(category) > max) {
                max = summary.get(category);
                maxCategory = category;
            }
        }
        
        if(!maxCategory.isEmpty()) {
                System.out.println("Top spending category: " + maxCategory);
        }
            
        if(budget > 0) {
            if(total > budget) {
                System.out.println("⚠ Budget exceeded!");
            } else {
                System.out.println("Remaining budget: Rs. " + (budget - total));
            }
        }
    }

    static void saveBudget(double budget) {
        try {
            FileWriter writer = new FileWriter("budget.txt");
            writer.write(String.valueOf(budget));
            writer.close();
        } catch (IOException e ) {
            System.out.println("Error saving budget.");
        }
    }

    static double loadBudget() {
        try {
            File file = new File("budget.txt");
            Scanner sc = new Scanner(file);

            if(sc.hasNextLine()) {
                double budget = Double.parseDouble(sc.nextLine());
                sc.close();
                return budget;
            }

            sc.close();
        } catch (Exception e) {
            System.out.println("No saved budget found.");
        }

        return 0;
    }
}