using System.Reflection;

namespace HomeOwnership.Api.Endpoints;

public static class VersionEndpoints
{
    public static IEndpointRouteBuilder MapVersionEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/version", () => Results.Ok(new
        {
            version = Assembly.GetExecutingAssembly().GetName().Version?.ToString() ?? "1.0.0",
            environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production",
        }))
        .WithName("GetVersion")
        .WithTags("System")
        .AllowAnonymous();

        return app;
    }
}
