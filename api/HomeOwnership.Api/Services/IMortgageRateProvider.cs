using HomeOwnership.Api.Models;

namespace HomeOwnership.Api.Services;

/// <summary>
/// Abstraction for fetching mortgage rates from any provider.
/// Swap implementations via DI to use a real vendor API later.
/// </summary>
public interface IMortgageRateProvider
{
    /// <summary>
    /// Returns the top <paramref name="count"/> lowest mortgage rates
    /// for the given term and rate type.
    /// </summary>
    Task<MortgageRatesResponse> GetTopRatesAsync(
        int termYears = 30,
        string rateType = "fixed",
        int count = 3,
        CancellationToken ct = default);
}
