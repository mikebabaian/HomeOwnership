using HomeOwnership.Api.Models;
using HomeOwnership.Api.Services;

namespace HomeOwnership.Api.Endpoints;

public static class MarketEndpoints
{
    public static IEndpointRouteBuilder MapMarketEndpoints(this IEndpointRouteBuilder app)
    {
        // GET /api/market/mortgage-rates/top?termYears=30&rateType=fixed&count=3
        app.MapGet("/api/market/mortgage-rates/top", async (
            IMortgageRateProvider provider,
            int? termYears,
            string? rateType,
            int? count,
            CancellationToken ct) =>
        {
            var term = termYears ?? 30;
            var type = rateType ?? "fixed";
            var take = Math.Clamp(count ?? 3, 1, 10);

            var result = await provider.GetTopRatesAsync(term, type, take, ct);
            return Results.Ok(result);
        })
        .WithName("GetTopMortgageRates")
        .WithTags("Market")
        .RequireAuthorization();

        return app;
    }
}
