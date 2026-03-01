namespace HomeOwnership.Api.Endpoints;

public static class HealthEndpoints
{
    public static IEndpointRouteBuilder MapHealthEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/health", () => Results.Ok(new
        {
            status = "healthy",
            timestamp = DateTime.UtcNow,
        }))
        .WithName("GetHealth")
        .WithTags("System")
        .AllowAnonymous();

        return app;
    }
}
