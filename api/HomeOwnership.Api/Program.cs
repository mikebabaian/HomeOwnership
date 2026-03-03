using HomeOwnership.Api.Data;
using HomeOwnership.Api.Endpoints;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ── Database + Identity ────────────────────────────────────────────────────
// Use InMemory in the "Testing" environment (set by IntegrationTestFactory).
// All other environments target Azure SQL.
if (builder.Environment.IsEnvironment("Testing"))
{
    var testDbName = $"TestDb_{Guid.NewGuid()}"; // stable per app-start, computed once
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseInMemoryDatabase(testDbName));
}
else
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddIdentityCore<IdentityUser>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 8;
    options.User.RequireUniqueEmail = true;
})
.AddEntityFrameworkStores<AppDbContext>()
.AddDefaultTokenProviders();

// ── JWT Authentication ─────────────────────────────────────────────────────
// Options are configured via IConfiguration injected at DI-resolution time
// (not captured eagerly) so test factories can override config correctly.
// If Jwt:Key is missing, auth endpoints won't work but the site still loads.
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer();

builder.Services.AddOptions<JwtBearerOptions>(JwtBearerDefaults.AuthenticationScheme)
    .Configure<IConfiguration>((options, config) =>
    {
        var key = config["Jwt:Key"];
        if (string.IsNullOrEmpty(key))
        {
            Console.WriteLine("WARNING: Jwt:Key is not configured. Auth endpoints will not work.");
            Console.WriteLine("Set the Jwt__Key environment variable (or App Setting in Azure) to enable authentication.");
            return; // Skip JWT config — site still serves, auth fails gracefully
        }

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = config["Jwt:Issuer"],
            ValidAudience = config["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
        };
    });

builder.Services.AddAuthorization();

// ── CORS ───────────────────────────────────────────────────────────────────
var allowedOrigins = builder.Configuration
    .GetSection("Cors:AllowedOrigins")
    .Get<string[]>() ?? [];

builder.Services.AddCors(options =>
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()));

// ── OpenAPI (dev only) ─────────────────────────────────────────────────────
builder.Services.AddOpenApi();

var app = builder.Build();

// ── Middleware pipeline ────────────────────────────────────────────────────
if (app.Environment.IsDevelopment())
    app.MapOpenApi("/openapi/v1.json");

app.UseCors();
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

// Serve React SPA static files from wwwroot
app.UseDefaultFiles();
app.UseStaticFiles();

// ── Endpoints ─────────────────────────────────────────────────────────────
app.MapHealthEndpoints();
app.MapVersionEndpoints();
app.MapAuthEndpoints();
app.MapProfileEndpoints();
app.MapBudgetEndpoints();
app.MapDashboardEndpoints();

// SPA fallback – send all unmatched routes to index.html
app.MapFallbackToFile("index.html");

app.Run();

// Expose Program to integration tests
public partial class Program { }
