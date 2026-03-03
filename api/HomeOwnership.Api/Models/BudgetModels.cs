namespace HomeOwnership.Api.Models;

public record BudgetItemDto(
    int Id,
    string Category,
    string Name,
    decimal Amount,
    string? Notes,
    int SortOrder);

public record CreateBudgetItemRequest(
    string Category,
    string Name,
    decimal Amount,
    string? Notes,
    int SortOrder = 0);

public record UpdateBudgetItemRequest(
    string Category,
    string Name,
    decimal Amount,
    string? Notes,
    int SortOrder = 0);
