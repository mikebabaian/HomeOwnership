using HomeOwnership.Api.Data;
using HomeOwnership.Api.Models;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace HomeOwnership.Api.Endpoints;

public static class DashboardEndpoints
{
    public static IEndpointRouteBuilder MapDashboardEndpoints(this IEndpointRouteBuilder app)
    {
        // GET /api/dashboard/summary
        app.MapGet("/api/dashboard/summary", async (ClaimsPrincipal principal, AppDbContext db) =>
        {
            var userId = GetUserId(principal);

            var profile = await db.UserProfiles
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.UserId == userId);

            var expenseByCategory = await db.BudgetItems
                .Where(b => b.UserId == userId)
                .GroupBy(b => b.Category)
                .Select(g => new CategoryTotal(g.Key, g.Sum(b => b.Amount)))
                .ToListAsync();

            var totalExpenses = expenseByCategory.Sum(c => c.Total);
            var monthlyTakeHome = profile?.MonthlyTakeHome;
            decimal? remaining = monthlyTakeHome.HasValue
                ? monthlyTakeHome.Value - totalExpenses
                : null;
            var isInTheRed = remaining.HasValue && remaining.Value < 0;

            return Results.Ok(new DashboardSummaryResponse(
                ProfileUpdatedUtc: profile?.UpdatedUtc,
                CurrentMortgageRate: profile?.CurrentMortgageRate,
                HomeOwnersInsuranceMonthly: profile?.HomeOwnersInsuranceMonthly,
                MonthlyTakeHome: monthlyTakeHome,
                TotalMonthlyExpenses: totalExpenses,
                RemainingThisMonth: remaining,
                IsInTheRed: isInTheRed,
                ExpenseByCategory: expenseByCategory));
        })
        .WithName("GetDashboardSummary")
        .WithTags("Dashboard")
        .RequireAuthorization();

        return app;
    }

    private static string GetUserId(ClaimsPrincipal principal) =>
        principal.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? principal.FindFirstValue(JwtRegisteredClaimNames.Sub)
        ?? throw new InvalidOperationException("User ID claim not found.");
}
