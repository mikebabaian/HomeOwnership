using HomeOwnership.Api.Models;

namespace HomeOwnership.Api.Services;

/// <summary>
/// Fallback stub that returns realistic-looking mock mortgage rates
/// when no external provider is configured. Replace with a real
/// implementation (e.g., Bankrate, Zillow, MortgageNewsDaily) later.
/// </summary>
public sealed class StubMortgageRateProvider : IMortgageRateProvider
{
    // Pre-seeded mock data — updated manually or via config when needed
    private static readonly List<MortgageRateItem> _thirtyYearFixed = new()
    {
        new("National Average CU",   6.25m, 6.125m, 0.0m,  "Estimated. See lender for final pricing.", "StubProvider", null),
        new("Greenfield Bank",       6.35m, 6.250m, 0.25m, "Estimated. See lender for final pricing.", "StubProvider", null),
        new("Hometown Savings",      6.45m, 6.375m, 0.0m,  "Estimated. See lender for final pricing.", "StubProvider", null),
        new("Metro Federal CU",      6.50m, 6.375m, 0.5m,  "Estimated. See lender for final pricing.", "StubProvider", null),
        new("First National Mtg",    6.55m, 6.500m, 0.0m,  "Estimated. See lender for final pricing.", "StubProvider", null),
    };

    private static readonly List<MortgageRateItem> _fifteenYearFixed = new()
    {
        new("National Average CU",  5.65m, 5.500m, 0.0m,  "Estimated. See lender for final pricing.", "StubProvider", null),
        new("Greenfield Bank",      5.75m, 5.625m, 0.25m, "Estimated. See lender for final pricing.", "StubProvider", null),
        new("Hometown Savings",     5.85m, 5.750m, 0.0m,  "Estimated. See lender for final pricing.", "StubProvider", null),
    };

    public Task<MortgageRatesResponse> GetTopRatesAsync(
        int termYears = 30,
        string rateType = "fixed",
        int count = 3,
        CancellationToken ct = default)
    {
        var source = termYears switch
        {
            15 => _fifteenYearFixed,
            _  => _thirtyYearFixed,
        };

        var items = source
            .OrderBy(r => r.Apr)
            .Take(count)
            .ToList();

        var response = new MortgageRatesResponse(
            AsOfUtc: DateTime.UtcNow.Date,
            TermYears: termYears,
            RateType: rateType,
            Items: items);

        return Task.FromResult(response);
    }
}
