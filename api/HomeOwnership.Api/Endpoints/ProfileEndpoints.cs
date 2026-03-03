using HomeOwnership.Api.Data;
using HomeOwnership.Api.Data.Entities;
using HomeOwnership.Api.Models;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace HomeOwnership.Api.Endpoints;

public static class ProfileEndpoints
{
    public static IEndpointRouteBuilder MapProfileEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/profile")
            .WithTags("Profile")
            .RequireAuthorization();

        // GET /api/profile
        group.MapGet("", async (ClaimsPrincipal principal, AppDbContext db) =>
        {
            var userId = GetUserId(principal);
            var profile = await db.UserProfiles.FirstOrDefaultAsync(p => p.UserId == userId);

            if (profile is null)
                return Results.Ok(new ProfileResponse(null, null, null, null, null));

            return Results.Ok(new ProfileResponse(
                profile.MessageBoardUserName,
                profile.CurrentMortgageRate,
                profile.HomeOwnersInsuranceMonthly,
                profile.MonthlyTakeHome,
                profile.CurrentMortgageBalance));
        })
        .WithName("GetProfile");

        // PUT /api/profile  (upsert)
        group.MapPut("", async (UpsertProfileRequest req, ClaimsPrincipal principal, AppDbContext db) =>
        {
            var userId = GetUserId(principal);
            var profile = await db.UserProfiles.FirstOrDefaultAsync(p => p.UserId == userId);

            if (profile is null)
            {
                // Create new profile
                profile = new UserProfile
                {
                    UserId = userId,
                    MessageBoardUserName = req.MessageBoardUserName?.Trim(),
                    CurrentMortgageRate = req.CurrentMortgageRate,
                    HomeOwnersInsuranceMonthly = req.HomeOwnersInsuranceMonthly,
                    MonthlyTakeHome = req.MonthlyTakeHome,
                    CurrentMortgageBalance = req.CurrentMortgageBalance,
                    CreatedUtc = DateTime.UtcNow,
                    UpdatedUtc = DateTime.UtcNow,
                };
                db.UserProfiles.Add(profile);
            }
            else
            {
                // Enforce MessageBoardUserName immutability: once set, cannot be changed
                if (!string.IsNullOrWhiteSpace(profile.MessageBoardUserName))
                {
                    // Already set — reject any attempt to change it
                    if (req.MessageBoardUserName?.Trim() != profile.MessageBoardUserName)
                    {
                        return Results.BadRequest(new
                        {
                            errors = new[] { "Message Board User Name cannot be changed once set." }
                        });
                    }
                }
                else
                {
                    profile.MessageBoardUserName = req.MessageBoardUserName?.Trim();
                }

                profile.CurrentMortgageRate = req.CurrentMortgageRate;
                profile.HomeOwnersInsuranceMonthly = req.HomeOwnersInsuranceMonthly;
                profile.MonthlyTakeHome = req.MonthlyTakeHome;
                profile.CurrentMortgageBalance = req.CurrentMortgageBalance;
                profile.UpdatedUtc = DateTime.UtcNow;
            }

            await db.SaveChangesAsync();

            return Results.Ok(new ProfileResponse(
                profile.MessageBoardUserName,
                profile.CurrentMortgageRate,
                profile.HomeOwnersInsuranceMonthly,
                profile.MonthlyTakeHome,
                profile.CurrentMortgageBalance));
        })
        .WithName("UpsertProfile");

        return app;
    }

    private static string GetUserId(ClaimsPrincipal principal) =>
        principal.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? principal.FindFirstValue(JwtRegisteredClaimNames.Sub)
        ?? throw new InvalidOperationException("User ID claim not found.");
}
