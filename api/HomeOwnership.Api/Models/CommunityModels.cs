namespace HomeOwnership.Api.Models;

// ── Read DTOs ──────────────────────────────────────────────────────────────

public record ThreadSummaryDto(
    int Id,
    string Title,
    DateTime CreatedUtc,
    DateTime UpdatedUtc,
    string CreatedByDisplayName,
    int ReplyCount,
    DateTime? LastPostUtc);

public record PostDto(
    int Id,
    string Body,
    DateTime CreatedUtc,
    string CreatedByDisplayName);

public record ThreadDetailDto(
    int Id,
    string Title,
    DateTime CreatedUtc,
    string CreatedByDisplayName,
    List<PostDto> Posts);

// ── Write requests ─────────────────────────────────────────────────────────

public record CreateThreadRequest(string Title, string Body);

public record CreatePostRequest(string Body);
