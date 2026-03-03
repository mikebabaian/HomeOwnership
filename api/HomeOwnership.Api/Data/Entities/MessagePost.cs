using System.ComponentModel.DataAnnotations;

namespace HomeOwnership.Api.Data.Entities;

public class MessagePost
{
    public int Id { get; set; }

    public int ThreadId { get; set; }

    [Required]
    [MaxLength(4000)]
    public string Body { get; set; } = default!;

    public DateTime CreatedUtc { get; set; } = DateTime.UtcNow;

    [Required]
    [MaxLength(450)]
    public string CreatedByUserId { get; set; } = default!;

    /// <summary>Snapshot of UserProfile.MessageBoardUserName at post time.</summary>
    [Required]
    [MaxLength(50)]
    public string CreatedByDisplayName { get; set; } = default!;

    public MessageThread Thread { get; set; } = default!;
}
