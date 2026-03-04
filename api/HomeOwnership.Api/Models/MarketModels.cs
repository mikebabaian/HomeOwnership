namespace HomeOwnership.Api.Models;

public record MortgageRateItem(
    string Lender,
    decimal Apr,
    decimal Rate,
    decimal Points,
    string? Notes,
    string Source,
    string? Url);

public record MortgageRatesResponse(
    DateTime AsOfUtc,
    int TermYears,
    string RateType,
    List<MortgageRateItem> Items);
