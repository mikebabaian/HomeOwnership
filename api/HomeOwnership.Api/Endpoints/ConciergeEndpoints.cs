using HomeOwnership.Api.Data;
using HomeOwnership.Api.Data.Entities;
using HomeOwnership.Api.Models;
using HomeOwnership.Api.Services;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace HomeOwnership.Api.Endpoints;

public static class ConciergeEndpoints
{
    public static IEndpointRouteBuilder MapConciergeEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/concierge")
            .WithTags("Concierge")
            .RequireAuthorization();

        // ── GET /api/concierge/history ──────────────────────────────────────
        group.MapGet("/history", async (
            AppDbContext db,
            ClaimsPrincipal user,
            int? limit) =>
        {
            var userId = user.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var take = Math.Clamp(limit ?? 30, 1, 100);

            var messages = await db.ConciergeMessages
                .Where(m => m.UserId == userId)
                .OrderByDescending(m => m.CreatedUtc)
                .Take(take)
                .Select(m => new ConciergeMessageDto(m.Role, m.Content, m.CreatedUtc))
                .ToListAsync();

            messages.Reverse(); // chronological order

            return Results.Ok(new ConciergeHistoryResponse(messages));
        });

        // ── POST /api/concierge/send ────────────────────────────────────────
        group.MapPost("/send", async (
            AppDbContext db,
            OpenAiChatService ai,
            ClaimsPrincipal user,
            ConciergeSendRequest req) =>
        {
            var userId = user.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var message = req.Message?.Trim();

            if (string.IsNullOrEmpty(message) || message.Length > 4000)
                return Results.BadRequest(new { message = "Message must be 1-4000 characters." });

            // Save user message
            var userMsg = new ConciergeMessage
            {
                UserId = userId,
                Role = "user",
                Content = message,
                CreatedUtc = DateTime.UtcNow,
            };
            db.ConciergeMessages.Add(userMsg);
            await db.SaveChangesAsync();

            // Build conversation history (last 20 messages for context window)
            var recent = await db.ConciergeMessages
                .Where(m => m.UserId == userId)
                .OrderByDescending(m => m.CreatedUtc)
                .Take(20)
                .Select(m => new { m.Role, m.Content, m.CreatedUtc })
                .ToListAsync();

            var history = recent
                .OrderBy(m => m.CreatedUtc)
                .Select(m => (m.Role, m.Content))
                .ToList();

            // Call OpenAI
            string reply;
            try
            {
                reply = await ai.GetCompletionAsync(history);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"OpenAI error: {ex.Message}");
                reply = "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.";
            }

            // Save assistant reply
            var assistantMsg = new ConciergeMessage
            {
                UserId = userId,
                Role = "assistant",
                Content = reply,
                CreatedUtc = DateTime.UtcNow,
            };
            db.ConciergeMessages.Add(assistantMsg);
            await db.SaveChangesAsync();

            return Results.Ok(new ConciergeSendResponse(reply, assistantMsg.CreatedUtc));
        });

        // ── DELETE /api/concierge/history ────────────────────────────────────
        group.MapDelete("/history", async (
            AppDbContext db,
            ClaimsPrincipal user) =>
        {
            var userId = user.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var count = await db.ConciergeMessages
                .Where(m => m.UserId == userId)
                .ExecuteDeleteAsync();

            return Results.Ok(new { deleted = count });
        });

        return app;
    }
}
