using HomeOwnership.Api.Data;
using HomeOwnership.Api.Data.Entities;
using HomeOwnership.Api.Models;
using HomeOwnership.Api.Services;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace HomeOwnership.Api.Endpoints;

public static class BudgetEndpoints
{
    public static IEndpointRouteBuilder MapBudgetEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/budget/items")
            .WithTags("Budget")
            .RequireAuthorization();

        // GET /api/budget/items
        group.MapGet("", async (ClaimsPrincipal principal, AppDbContext db) =>
        {
            var userId = GetUserId(principal);
            var items = await db.BudgetItems
                .Where(b => b.UserId == userId)
                .OrderBy(b => b.SortOrder).ThenBy(b => b.Name)
                .Select(b => new BudgetItemDto(b.Id, b.Category, b.Name, b.Amount, b.Notes, b.SortOrder))
                .ToListAsync();

            return Results.Ok(items);
        })
        .WithName("GetBudgetItems");

        // POST /api/budget/items
        group.MapPost("", async (CreateBudgetItemRequest req, ClaimsPrincipal principal, AppDbContext db) =>
        {
            var userId = GetUserId(principal);

            if (string.IsNullOrWhiteSpace(req.Name))
                return Results.BadRequest(new { errors = new[] { "Name is required." } });
            if (string.IsNullOrWhiteSpace(req.Category))
                return Results.BadRequest(new { errors = new[] { "Category is required." } });
            if (req.Amount < 0)
                return Results.BadRequest(new { errors = new[] { "Amount must be >= 0." } });

            var item = new BudgetItem
            {
                UserId = userId,
                Category = req.Category.Trim(),
                Name = req.Name.Trim(),
                Amount = req.Amount,
                Notes = req.Notes?.Trim(),
                SortOrder = req.SortOrder,
                CreatedUtc = DateTime.UtcNow,
                UpdatedUtc = DateTime.UtcNow,
            };

            db.BudgetItems.Add(item);
            await db.SaveChangesAsync();

            var dto = new BudgetItemDto(item.Id, item.Category, item.Name, item.Amount, item.Notes, item.SortOrder);
            return Results.Created($"/api/budget/items/{item.Id}", dto);
        })
        .WithName("CreateBudgetItem");

        // PUT /api/budget/items/{id}
        group.MapPut("{id:int}", async (int id, UpdateBudgetItemRequest req, ClaimsPrincipal principal, AppDbContext db) =>
        {
            var userId = GetUserId(principal);
            var item = await db.BudgetItems.FirstOrDefaultAsync(b => b.Id == id && b.UserId == userId);

            if (item is null)
                return Results.NotFound();

            if (string.IsNullOrWhiteSpace(req.Name))
                return Results.BadRequest(new { errors = new[] { "Name is required." } });
            if (string.IsNullOrWhiteSpace(req.Category))
                return Results.BadRequest(new { errors = new[] { "Category is required." } });
            if (req.Amount < 0)
                return Results.BadRequest(new { errors = new[] { "Amount must be >= 0." } });

            item.Category = req.Category.Trim();
            item.Name = req.Name.Trim();
            item.Amount = req.Amount;
            item.Notes = req.Notes?.Trim();
            item.SortOrder = req.SortOrder;
            item.UpdatedUtc = DateTime.UtcNow;

            await db.SaveChangesAsync();

            var dto = new BudgetItemDto(item.Id, item.Category, item.Name, item.Amount, item.Notes, item.SortOrder);
            return Results.Ok(dto);
        })
        .WithName("UpdateBudgetItem");

        // DELETE /api/budget/items/{id}
        group.MapDelete("{id:int}", async (int id, ClaimsPrincipal principal, AppDbContext db) =>
        {
            var userId = GetUserId(principal);
            var item = await db.BudgetItems.FirstOrDefaultAsync(b => b.Id == id && b.UserId == userId);

            if (item is null)
                return Results.NotFound();

            db.BudgetItems.Remove(item);
            await db.SaveChangesAsync();

            return Results.NoContent();
        })
        .WithName("DeleteBudgetItem");

        // POST /api/budget/ai-analysis
        app.MapPost("/api/budget/ai-analysis", async (
            AppDbContext db,
            OpenAiChatService ai,
            ClaimsPrincipal principal) =>
        {
            var userId = GetUserId(principal);

            // Load user's budget items
            var items = await db.BudgetItems
                .Where(b => b.UserId == userId)
                .OrderBy(b => b.SortOrder).ThenBy(b => b.Name)
                .ToListAsync();

            if (items.Count == 0)
                return Results.BadRequest(new { message = "You need at least one budget item for AI analysis." });

            // Load profile for monthly take home
            var profile = await db.UserProfiles
                .Where(p => p.UserId == userId)
                .Select(p => new { p.MonthlyTakeHome })
                .FirstOrDefaultAsync();

            if (profile?.MonthlyTakeHome is null)
                return Results.BadRequest(new { message = "Please set your Monthly Take Home in your Profile first." });

            var totalExpenses = items.Sum(i => i.Amount);
            var remaining = profile.MonthlyTakeHome.Value - totalExpenses;

            // Build the budget summary for the prompt
            var itemLines = string.Join("\n", items.Select(i =>
                $"  - {i.Category}: {i.Name} = ${i.Amount:N2}" + (string.IsNullOrEmpty(i.Notes) ? "" : $" ({i.Notes})")));

            var userPrompt = $"""
                Please analyze this monthly budget and provide actionable financial advice.

                Monthly Take Home Income: ${profile.MonthlyTakeHome.Value:N2}
                Total Monthly Expenses: ${totalExpenses:N2}
                Remaining After Expenses: ${remaining:N2}

                Budget Line Items:
                {itemLines}

                Provide:
                1. An overall assessment of the budget health
                2. Specific areas where spending could be optimized
                3. Suggestions for savings or debt reduction if applicable
                4. Any red flags or concerns
                5. A brief actionable next step

                Keep the response concise and practical (under 500 words).
                """;

            var history = new List<(string Role, string Content)>
            {
                ("user", userPrompt)
            };

            string analysis;
            try
            {
                analysis = await ai.GetCompletionAsync(history);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"OpenAI error (budget analysis): {ex.Message}");
                return Results.StatusCode(502);
            }

            return Results.Ok(new BudgetAiAnalysisResponse(analysis));
        })
        .WithTags("Budget")
        .RequireAuthorization()
        .WithName("BudgetAiAnalysis");

        return app;
    }

    private static string GetUserId(ClaimsPrincipal principal) =>
        principal.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? principal.FindFirstValue(JwtRegisteredClaimNames.Sub)
        ?? throw new InvalidOperationException("User ID claim not found.");
}
