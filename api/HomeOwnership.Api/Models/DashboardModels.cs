namespace HomeOwnership.Api.Models;

public record DashboardSummaryResponse(
    string DisplayName,
    DateTime? ProfileUpdatedUtc,
    decimal? CurrentMortgageRate,
    decimal? HomeOwnersInsuranceMonthly,
    decimal? MonthlyTakeHome,
    decimal TotalMonthlyExpenses,
    decimal? RemainingThisMonth,
    bool IsInTheRed,
    List<CategoryTotal> ExpenseByCategory);

public record CategoryTotal(string Category, decimal Total);
