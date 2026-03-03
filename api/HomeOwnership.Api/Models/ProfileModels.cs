namespace HomeOwnership.Api.Models;

public record ProfileResponse(
    string? MessageBoardUserName,
    decimal? CurrentMortgageRate,
    decimal? HomeOwnersInsuranceMonthly,
    decimal? MonthlyTakeHome,
    decimal? CurrentMortgageBalance);

public record UpsertProfileRequest(
    string? MessageBoardUserName,
    decimal? CurrentMortgageRate,
    decimal? HomeOwnersInsuranceMonthly,
    decimal? MonthlyTakeHome,
    decimal? CurrentMortgageBalance);
