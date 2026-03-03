using HomeOwnership.Api.Data;
using HomeOwnership.Api.Data.Entities;
using HomeOwnership.Api.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace HomeOwnership.Api.Endpoints;

public static class CommunityEndpoints
{
    public static IEndpointRouteBuilder MapCommunityEndpoints(this IEndpointRouteBuilder app)
    {
        var read = app.MapGroup("/api/community")
            .WithTags("Community");

        var write = app.MapGroup("/api/community")
            .WithTags("Community")
            .RequireAuthorization();

        // ── GET /api/community/threads ──────────────────────────────────────
        read.MapGet("/threads", async (AppDbContext db, int? page, int? pageSize) =>
        {
            var size = Math.Clamp(pageSize ?? 20, 1, 100);
            var skip = ((page ?? 1) - 1) * size;

            var threads = await db.MessageThreads
                .OrderByDescending(t => t.UpdatedUtc)
                .Skip(skip)
                .Take(size)
                .Select(t => new ThreadSummaryDto(
                    t.Id,
                    t.Title,
                    t.CreatedUtc,
                    t.UpdatedUtc,
                    t.CreatedByDisplayName,
                    t.Posts.Count,
                    t.Posts.OrderByDescending(p => p.CreatedUtc).Select(p => (DateTime?)p.CreatedUtc).FirstOrDefault()))
                .ToListAsync();

            return Results.Ok(threads);
        })
        .WithName("GetThreads");

        // ── GET /api/community/threads/{threadId} ───────────────────────────
        read.MapGet("/threads/{threadId:int}", async (int threadId, AppDbContext db) =>
        {
            var thread = await db.MessageThreads
                .Where(t => t.Id == threadId)
                .Select(t => new ThreadDetailDto(
                    t.Id,
                    t.Title,
                    t.CreatedUtc,
                    t.CreatedByDisplayName,
                    t.Posts.OrderBy(p => p.CreatedUtc)
                           .Select(p => new PostDto(p.Id, p.Body, p.CreatedUtc, p.CreatedByDisplayName))
                           .ToList()))
                .FirstOrDefaultAsync();

            return thread is null ? Results.NotFound() : Results.Ok(thread);
        })
        .WithName("GetThread");

        // ── POST /api/community/threads ─────────────────────────────────────
        write.MapPost("/threads", async (CreateThreadRequest req, ClaimsPrincipal principal, AppDbContext db) =>
        {
            var (userId, displayName, error) = await ResolveAuthor(principal, db);
            if (error is not null) return error;

            if (string.IsNullOrWhiteSpace(req.Title))
                return Results.BadRequest(new { errors = new[] { "Title is required." } });
            if (string.IsNullOrWhiteSpace(req.Body))
                return Results.BadRequest(new { errors = new[] { "Body is required." } });
            if (req.Title.Length > 200)
                return Results.BadRequest(new { errors = new[] { "Title must be 200 characters or fewer." } });
            if (req.Body.Length > 4000)
                return Results.BadRequest(new { errors = new[] { "Body must be 4000 characters or fewer." } });

            var now = DateTime.UtcNow;
            var thread = new MessageThread
            {
                Title = req.Title.Trim(),
                CreatedUtc = now,
                UpdatedUtc = now,
                CreatedByUserId = userId!,
                CreatedByDisplayName = displayName!,
            };
            db.MessageThreads.Add(thread);
            await db.SaveChangesAsync();

            // Create the first post in the thread
            var post = new MessagePost
            {
                ThreadId = thread.Id,
                Body = req.Body.Trim(),
                CreatedUtc = now,
                CreatedByUserId = userId!,
                CreatedByDisplayName = displayName!,
            };
            db.MessagePosts.Add(post);
            await db.SaveChangesAsync();

            return Results.Created($"/api/community/threads/{thread.Id}",
                new ThreadSummaryDto(thread.Id, thread.Title, thread.CreatedUtc, thread.UpdatedUtc, thread.CreatedByDisplayName, 1, now));
        })
        .WithName("CreateThread");

        // ── POST /api/community/threads/{threadId}/posts ────────────────────
        write.MapPost("/threads/{threadId:int}/posts", async (int threadId, CreatePostRequest req, ClaimsPrincipal principal, AppDbContext db) =>
        {
            var (userId, displayName, error) = await ResolveAuthor(principal, db);
            if (error is not null) return error;

            if (string.IsNullOrWhiteSpace(req.Body))
                return Results.BadRequest(new { errors = new[] { "Body is required." } });
            if (req.Body.Length > 4000)
                return Results.BadRequest(new { errors = new[] { "Body must be 4000 characters or fewer." } });

            var thread = await db.MessageThreads.FindAsync(threadId);
            if (thread is null)
                return Results.NotFound();

            var now = DateTime.UtcNow;
            var post = new MessagePost
            {
                ThreadId = threadId,
                Body = req.Body.Trim(),
                CreatedUtc = now,
                CreatedByUserId = userId!,
                CreatedByDisplayName = displayName!,
            };
            db.MessagePosts.Add(post);

            thread.UpdatedUtc = now;
            await db.SaveChangesAsync();

            return Results.Created($"/api/community/threads/{threadId}",
                new PostDto(post.Id, post.Body, post.CreatedUtc, post.CreatedByDisplayName));
        })
        .WithName("CreatePost");

        return app;
    }

    // ── Helpers ─────────────────────────────────────────────────────────────

    private static string GetUserId(ClaimsPrincipal principal) =>
        principal.FindFirstValue("sub")
        ?? principal.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? throw new UnauthorizedAccessException();

    /// <summary>
    /// Resolves the authenticated user's ID and display name.
    /// Returns an error IResult if username is not configured.
    /// </summary>
    private static async Task<(string? UserId, string? DisplayName, IResult? Error)> ResolveAuthor(
        ClaimsPrincipal principal, AppDbContext db)
    {
        var userId = GetUserId(principal);
        var profile = await db.UserProfiles
            .Where(p => p.UserId == userId)
            .Select(p => p.MessageBoardUserName)
            .FirstOrDefaultAsync();

        if (string.IsNullOrWhiteSpace(profile))
        {
            return (null, null, Results.BadRequest(new
            {
                errors = new[] { "Set your Message Board username in Profile to post." }
            }));
        }

        return (userId, profile, null);
    }
}
