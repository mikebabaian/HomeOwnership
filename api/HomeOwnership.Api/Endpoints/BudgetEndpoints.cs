using HomeOwnership.Api.Data;
using HomeOwnership.Api.Data.Entities;
using HomeOwnership.Api.Models;
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

        return app;
    }

    private static string GetUserId(ClaimsPrincipal principal) =>
        principal.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? principal.FindFirstValue(JwtRegisteredClaimNames.Sub)
        ?? throw new InvalidOperationException("User ID claim not found.");
}
