using System.Net;
using System.Net.Http.Json;
using System.Text.Json;

namespace HomeOwnership.Api.Tests;

public class AuthEndpointTests(IntegrationTestFactory factory)
    : IClassFixture<IntegrationTestFactory>
{
    private readonly HttpClient _client = factory.CreateClient();

    [Fact]
    public async Task Register_WithValidCredentials_Returns201()
    {
        var response = await _client.PostAsJsonAsync("/api/auth/register", new
        {
            email    = $"test_{Guid.NewGuid()}@example.com",
            password = "Password1!",
        });
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
    }

    [Fact]
    public async Task Register_WithWeakPassword_Returns400()
    {
        var response = await _client.PostAsJsonAsync("/api/auth/register", new
        {
            email    = $"test_{Guid.NewGuid()}@example.com",
            password = "abc",  // too short
        });
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Login_WithValidCredentials_ReturnsToken()
    {
        var email    = $"login_{Guid.NewGuid()}@example.com";
        var password = "Password1!";

        await _client.PostAsJsonAsync("/api/auth/register", new { email, password });

        var response = await _client.PostAsJsonAsync("/api/auth/login", new { email, password });
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var json = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(json);
        Assert.True(doc.RootElement.TryGetProperty("token", out var token));
        Assert.False(string.IsNullOrWhiteSpace(token.GetString()));
    }

    [Fact]
    public async Task Login_WithWrongPassword_Returns401()
    {
        var email = $"bad_{Guid.NewGuid()}@example.com";
        await _client.PostAsJsonAsync("/api/auth/register", new { email, password = "Password1!" });

        var response = await _client.PostAsJsonAsync("/api/auth/login", new
        {
            email,
            password = "WrongPassword99!",
        });
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetMe_WithoutToken_Returns401()
    {
        var response = await _client.GetAsync("/api/auth/me");
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }
}
