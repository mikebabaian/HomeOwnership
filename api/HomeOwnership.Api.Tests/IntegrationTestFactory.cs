using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;

namespace HomeOwnership.Api.Tests;

/// <summary>
/// Spins up the full ASP.NET Core pipeline with an in-memory database
/// and test JWT/CORS configuration. Shared across all test classes via IClassFixture.
/// </summary>
public class IntegrationTestFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        // Switch to the Testing environment so Program.cs uses InMemory DB instead of Azure SQL
        builder.UseEnvironment("Testing");

        // Inject test-safe configuration values that override appsettings.*
        builder.ConfigureAppConfiguration(config =>
        {
            config.AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt:Key"]              = "test-secret-key-that-is-at-least-32-chars!",
                ["Jwt:Issuer"]           = "TestIssuer",
                ["Jwt:Audience"]         = "TestAudience",
                ["Cors:AllowedOrigins:0"] = "http://localhost:5173",
            });
        });
    }
}
