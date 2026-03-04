using System.ComponentModel.DataAnnotations;

namespace HomeOwnership.Api.Data.Entities;

public class ConciergeMessage
{
    public int Id { get; set; }

    [Required]
    [MaxLength(450)]
    public string UserId { get; set; } = default!;

    /// <summary>"system" | "user" | "assistant"</summary>
    [Required]
    [MaxLength(20)]
    public string Role { get; set; } = default!;

    [Required]
    public string Content { get; set; } = default!;

    public DateTime CreatedUtc { get; set; } = DateTime.UtcNow;
}
