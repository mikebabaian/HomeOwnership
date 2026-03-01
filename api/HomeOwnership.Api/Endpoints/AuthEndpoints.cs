using HomeOwnership.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace HomeOwnership.Api.Endpoints;

public static class AuthEndpoints
{
    public static IEndpointRouteBuilder MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        // POST /api/auth/register
        app.MapPost("/api/auth/register", async (
            RegisterRequest req,
            UserManager<IdentityUser> userManager) =>
        {
            var user = new IdentityUser { UserName = req.Email, Email = req.Email };
            var result = await userManager.CreateAsync(user, req.Password);

            if (!result.Succeeded)
                return Results.BadRequest(new { errors = result.Errors.Select(e => e.Description) });

            return Results.Created($"/api/auth/users/{user.Id}", new { userId = user.Id });
        })
        .WithName("Register")
        .WithTags("Auth")
        .AllowAnonymous();

        // POST /api/auth/login
        app.MapPost("/api/auth/login", async (
            LoginRequest req,
            UserManager<IdentityUser> userManager,
            IConfiguration config) =>
        {
            var user = await userManager.FindByEmailAsync(req.Email);
            if (user is null || !await userManager.CheckPasswordAsync(user, req.Password))
                return Results.Unauthorized();

            var token = GenerateJwt(user, config);
            return Results.Ok(new { token, userId = user.Id });
        })
        .WithName("Login")
        .WithTags("Auth")
        .AllowAnonymous();

        // GET /api/auth/me  (protected)
        app.MapGet("/api/auth/me", (ClaimsPrincipal principal) =>
        {
            var userId = principal.FindFirstValue(ClaimTypes.NameIdentifier)
                      ?? principal.FindFirstValue(JwtRegisteredClaimNames.Sub);
            var email  = principal.FindFirstValue(ClaimTypes.Email)
                      ?? principal.FindFirstValue(JwtRegisteredClaimNames.Email);
            return Results.Ok(new { userId, email });
        })
        .WithName("GetMe")
        .WithTags("Auth")
        .RequireAuthorization();

        return app;
    }

    private static string GenerateJwt(IdentityUser user, IConfiguration config)
    {
        var key    = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]!));
        var creds  = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expiry = DateTime.UtcNow.AddHours(config.GetValue<int>("Jwt:ExpiryHours", 24));

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id),
            new Claim(JwtRegisteredClaimNames.Email, user.Email!),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        };

        var token = new JwtSecurityToken(
            issuer:            config["Jwt:Issuer"],
            audience:          config["Jwt:Audience"],
            claims:            claims,
            expires:           expiry,
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
